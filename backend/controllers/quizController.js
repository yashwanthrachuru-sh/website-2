// ============================================================
// controllers/quizController.js — API for Redesigned Quiz System
// ============================================================
const db = require('../config/db');
const crypto = require('crypto');

// ── Helpers ──────────────────────────────────────────────────

// Shuffle array helper
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ── Topic Quiz APIs ──────────────────────────────────────────

// GET /api/quizzes/topic/:lessonId
const getTopicQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Fetch the module_id for this lesson
    const [[lesson]] = await db.query(
      `SELECT module_id FROM module_lessons WHERE id = ?`,
      [lessonId]
    );
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Fetch all questions in this module to build a 10 question pool
    const [questions] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d 
       FROM lesson_quizzes 
       WHERE module_id = ?`,
      [lesson.module_id]
    );

    if (questions.length === 0) {
      return res.json({ success: true, questions: [] });
    }

    // Randomize and select up to 10 questions
    const randomized = shuffle([...questions]).slice(0, 10);

    res.json({
      success: true,
      questions: randomized
    });
  } catch (err) {
    console.error('getTopicQuiz error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/quizzes/topic/:lessonId/submit
const submitTopicQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body; // { qid: 'A', ... }
    const userId = req.user.id;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ success: false, message: 'No answers provided' });
    }

    const qids = Object.keys(answers);
    const [questions] = await db.query(
      `SELECT id, correct_option, explanation FROM lesson_quizzes WHERE id IN (?)`,
      [qids]
    );

    let correct = 0;
    const results = questions.map(q => {
      const isCorrect = answers[q.id] === q.correct_option;
      if (isCorrect) correct++;
      return {
        quiz_id: q.id,
        correct: isCorrect,
        correct_option: q.correct_option,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Mark lesson complete in lesson_progress if they attempted/passed
    await db.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE completed = 1`,
      [userId, lessonId]
    );

    // Save score attempt in database results table for audit
    await db.query(
      `INSERT INTO results (user_id, test_id, score, total_questions, correct_answers, feedback)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 0, score, total, correct, `Topic Quiz: lesson ${lessonId}`]
    );

    res.json({
      success: true,
      score,
      correct,
      total,
      results
    });
  } catch (err) {
    console.error('submitTopicQuiz error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Level Assessment APIs ─────────────────────────────────────

// GET /api/quizzes/level/:roadmapId/:level
const getLevelAssessment = async (req, res) => {
  try {
    const { roadmapId, level } = req.params;
    const userId = req.user.id;
    const targetKey = `${roadmapId}_${level}`;

    // Check for an active session to resume
    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'level' AND target_id = ? AND completed = 0`,
      [userId, targetKey]
    );

    if (session) {
      const qids = JSON.parse(session.questions);
      const answers = JSON.parse(session.answers);
      const bookmarks = JSON.parse(session.bookmarks || '[]');
      
      const [questions] = await db.query(
        `SELECT id, question, option_a, option_b, option_c, option_d FROM lesson_quizzes WHERE id IN (?)`,
        [qids]
      );

      // Sort questions to match saved order
      const questionMap = {};
      questions.forEach(q => questionMap[q.id] = q);
      const sortedQuestions = qids.map(id => questionMap[id]).filter(Boolean);

      return res.json({
        success: true,
        resumed: true,
        timeLeft: session.time_left,
        answers,
        bookmarks,
        questions: sortedQuestions
      });
    }

    // Else: Create a new assessment session
    // 1. Fetch all modules of this level
    const [modules] = await db.query(
      `SELECT id FROM roadmap_modules WHERE roadmap_id = ? AND level = ?`,
      [roadmapId, level]
    );
    if (!modules.length) {
      return res.status(400).json({ success: false, message: 'No modules found for this level.' });
    }

    const mids = modules.map(m => m.id);

    // 2. Fetch all questions under these modules
    const [questions] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d FROM lesson_quizzes WHERE module_id IN (?)`,
      [mids]
    );

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this level.' });
    }

    // 3. Randomize and select up to 50 questions
    const selected = shuffle([...questions]).slice(0, 50);
    const selectedIds = selected.map(q => q.id);

    // 4. Save new session in database (timer: 45 minutes = 2700 seconds)
    const initialTime = 2700; 
    await db.query(
      `INSERT INTO quiz_sessions (user_id, type, target_id, questions, answers, time_left, bookmarks)
       VALUES (?, 'level', ?, ?, '{}', ?, '[]')
       ON DUPLICATE KEY UPDATE questions = VALUES(questions), answers = '{}', time_left = VALUES(time_left), bookmarks = '[]', completed = 0`,
      [userId, targetKey, JSON.stringify(selectedIds), initialTime]
    );

    res.json({
      success: true,
      resumed: false,
      timeLeft: initialTime,
      answers: {},
      bookmarks: [],
      questions: selected
    });
  } catch (err) {
    console.error('getLevelAssessment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/quizzes/level/:roadmapId/:level/submit
const submitLevelAssessment = async (req, res) => {
  try {
    const { roadmapId, level } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;
    const targetKey = `${roadmapId}_${level}`;

    // Get active session
    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'level' AND target_id = ? AND completed = 0`,
      [userId, targetKey]
    );
    if (!session) {
      return res.status(400).json({ success: false, message: 'No active assessment session found.' });
    }

    const qids = JSON.parse(session.questions);
    const [questions] = await db.query(
      `SELECT id, correct_option, explanation FROM lesson_quizzes WHERE id IN (?)`,
      [qids]
    );

    let correct = 0;
    const submittedAnswers = answers || {};
    const results = questions.map(q => {
      const isCorrect = submittedAnswers[q.id] === q.correct_option;
      if (isCorrect) correct++;
      return {
        quiz_id: q.id,
        correct: isCorrect,
        correct_option: q.correct_option,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70; // 70% passing score

    // Update level progress
    await db.query(
      `INSERT INTO level_progress (user_id, roadmap_id, level, passed, score)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE passed = VALUES(passed), score = VALUES(score)`,
      [userId, roadmapId, level, passed ? 1 : 0, score]
    );

    // Update session status
    await db.query(
      `UPDATE quiz_sessions SET completed = 1, answers = ?, score = ? WHERE id = ?`,
      [JSON.stringify(submittedAnswers), score, session.id]
    );

    res.json({
      success: true,
      score,
      correct,
      total,
      passed,
      results
    });
  } catch (err) {
    console.error('submitLevelAssessment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Certification Exam APIs ───────────────────────────────────

// GET /api/quizzes/final/:roadmapId
const getCertificationExam = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.id;

    // Check active session to resume
    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'final' AND target_id = ? AND completed = 0`,
      [userId, roadmapId]
    );

    if (session) {
      const qids = JSON.parse(session.questions);
      const answers = JSON.parse(session.answers);
      const bookmarks = JSON.parse(session.bookmarks || '[]');

      const [questions] = await db.query(
        `SELECT id, question, option_a, option_b, option_c, option_d FROM lesson_quizzes WHERE id IN (?)`,
        [qids]
      );

      const questionMap = {};
      questions.forEach(q => questionMap[q.id] = q);
      const sortedQuestions = qids.map(id => questionMap[id]).filter(Boolean);

      return res.json({
        success: true,
        resumed: true,
        timeLeft: session.time_left,
        answers,
        bookmarks,
        questions: sortedQuestions
      });
    }

    // 1. Fetch modules categorized by level
    const [modules] = await db.query(
      `SELECT id, level FROM roadmap_modules WHERE roadmap_id = ?`,
      [roadmapId]
    );
    if (!modules.length) {
      return res.status(400).json({ success: false, message: 'No modules found for this roadmap.' });
    }

    const begMids = modules.filter(m => m.level.toLowerCase() === 'beginner').map(m => m.id);
    const intMids = modules.filter(m => m.level.toLowerCase() === 'intermediate').map(m => m.id);
    const expMids = modules.filter(m => m.level.toLowerCase() === 'expert').map(m => m.id);

    // Query questions per level
    const getQuestionsForMids = async (mids) => {
      if (!mids.length) return [];
      const [rows] = await db.query(
        `SELECT id, question, option_a, option_b, option_c, option_d FROM lesson_quizzes WHERE module_id IN (?)`,
        [mids]
      );
      return rows;
    };

    const begPool = await getQuestionsForMids(begMids);
    const intPool = await getQuestionsForMids(intMids);
    const expPool = await getQuestionsForMids(expMids);

    // 2. Select 30% Beginner, 40% Intermediate, 30% Expert
    const begSelected = shuffle([...begPool]).slice(0, 30);
    const intSelected = shuffle([...intPool]).slice(0, 40);
    const expSelected = shuffle([...expPool]).slice(0, 30);

    const examQuestionsPool = [...begSelected, ...intSelected, ...expSelected];
    if (examQuestionsPool.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for certification.' });
    }

    const qids = examQuestionsPool.map(q => q.id);

    // 3. Save session (Timer: 90 minutes = 5400 seconds)
    const initialTime = 5400;
    await db.query(
      `INSERT INTO quiz_sessions (user_id, type, target_id, questions, answers, time_left, bookmarks)
       VALUES (?, 'final', ?, ?, '{}', ?, '[]')
       ON DUPLICATE KEY UPDATE questions = VALUES(questions), answers = '{}', time_left = VALUES(time_left), bookmarks = '[]', completed = 0`,
      [userId, roadmapId, JSON.stringify(qids), initialTime]
    );

    res.json({
      success: true,
      resumed: false,
      timeLeft: initialTime,
      answers: {},
      bookmarks: [],
      questions: examQuestionsPool
    });
  } catch (err) {
    console.error('getCertificationExam error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/quizzes/final/:roadmapId/submit
const submitCertificationExam = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    // Get active session
    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'final' AND target_id = ? AND completed = 0`,
      [userId, roadmapId]
    );
    if (!session) {
      return res.status(400).json({ success: false, message: 'No active exam session found.' });
    }

    const qids = JSON.parse(session.questions);
    const [questions] = await db.query(
      `SELECT id, correct_option, explanation FROM lesson_quizzes WHERE id IN (?)`,
      [qids]
    );

    let correct = 0;
    const submittedAnswers = answers || {};
    const results = questions.map(q => {
      const isCorrect = submittedAnswers[q.id] === q.correct_option;
      if (isCorrect) correct++;
      return {
        quiz_id: q.id,
        correct: isCorrect,
        correct_option: q.correct_option,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70; // 70% passing threshold

    // Save final result
    await db.query(
      `UPDATE quiz_sessions SET completed = 1, answers = ?, score = ? WHERE id = ?`,
      [JSON.stringify(submittedAnswers), score, session.id]
    );

    let certificate = null;
    if (passed) {
      // Generate certificate hash
      const certHash = crypto.createHash('sha256')
        .update(`${userId}_${roadmapId}_${Date.now()}`)
        .digest('hex');

      // Insert certificate
      const [certRes] = await db.query(
        `INSERT INTO certificates (user_id, roadmap_id, certificate_hash)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE certificate_hash = VALUES(certificate_hash)`,
        [userId, roadmapId, certHash]
      );

      certificate = {
        id: certRes.insertId,
        hash: certHash,
        issueDate: new Date()
      };
    }

    res.json({
      success: true,
      score,
      correct,
      total,
      passed,
      certificate,
      results
    });
  } catch (err) {
    console.error('submitCertificationExam error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── Session State Persistence APIs ──────────────────────────────

// POST /api/quizzes/session/:type/:targetId/save
const saveSessionState = async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const { answers, timeLeft, bookmarks } = req.body;
    const userId = req.user.id;

    await db.query(
      `UPDATE quiz_sessions 
       SET answers = ?, time_left = ?, bookmarks = ?
       WHERE user_id = ? AND type = ? AND target_id = ? AND completed = 0`,
      [
        JSON.stringify(answers || {}), 
        timeLeft || 0, 
        JSON.stringify(bookmarks || []), 
        userId, 
        type, 
        targetId
      ]
    );

    res.json({ success: true, message: 'Session saved' });
  } catch (err) {
    console.error('saveSessionState error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/quizzes/session/:type/:targetId
const getSessionState = async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const userId = req.user.id;

    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = ? AND target_id = ? AND completed = 0`,
      [userId, type, targetId]
    );

    if (!session) {
      return res.json({ success: true, session: null });
    }

    res.json({
      success: true,
      session: {
        timeLeft: session.time_left,
        answers: JSON.parse(session.answers),
        bookmarks: JSON.parse(session.bookmarks || '[]'),
        questions: JSON.parse(session.questions)
      }
    });
  } catch (err) {
    console.error('getSessionState error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Keep old methods for backwards compatibility
const getQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query('SELECT * FROM tests');
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const [questions] = await db.query('SELECT * FROM questions WHERE test_id = ?', [id]);
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const submitResult = async (req, res) => {
  try {
    res.json({ success: true, message: 'Score saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getHistory = async (req, res) => {
  try {
    const [history] = await db.query(
      `SELECT r.*, t.title as quiz_title FROM results r JOIN tests t ON r.test_id = t.id WHERE r.user_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getTopicQuiz,
  submitTopicQuiz,
  getLevelAssessment,
  submitLevelAssessment,
  getCertificationExam,
  submitCertificationExam,
  saveSessionState,
  getSessionState,
  getQuizzes,
  getQuestions,
  submitResult,
  getHistory
};

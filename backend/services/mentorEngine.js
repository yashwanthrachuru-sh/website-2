// ============================================================
// backend/services/mentorEngine.js
// EduNet Human Teaching Engine — AI Mentor Tutoring Service
// ============================================================
'use strict';

const db = require('../config/db');
const conceptDNA = require('./conceptDNA');
const executionVisualizer = require('./executionVisualizer');

/**
 * Generates an educational guiding response based on the conversation turn count.
 * @param {string} mode - AI Mentor mode ('explain', 'debug', etc.)
 * @param {Object} ctx - Conversation context (lesson, user_code, username, etc.)
 * @returns {Promise<Object>} Promise resolving to { reply: string }
 */
async function generateTutorResponse(mode, ctx) {
  const topic = ctx.lesson?.title || ctx.module?.title || ctx.roadmap?.title || 'Programming';
  const lang  = ctx.lesson?.language || ctx.module?.language || 'javascript';
  const cleanTopic = topic.replace(/Lesson\s*\d+:?/gi, '').trim().split('—')[0].trim();

  const dna = conceptDNA.getDNA(cleanTopic);
  const visualization = executionVisualizer.getVisualization(cleanTopic, lang);

  // Default response parts
  let reply = '';

  // Attempt to check database turn history to determine tutoring state
  let turnCount = 0;
  if (ctx.lesson?.id && ctx.userId) {
    try {
      const [rows] = await db.query(
        `SELECT COUNT(*) AS count FROM ai_chat_logs WHERE user_id = ? AND lesson_id = ? AND role = 'assistant'`,
        [ctx.userId, ctx.lesson.id]
      );
      turnCount = rows[0]?.count || 0;
    } catch (e) {
      // Fallback to random or contextual turn if table missing
      turnCount = Math.floor(Math.random() * 3);
    }
  } else {
    // If no context, pick a guiding turn
    turnCount = 1;
  }

  // Conversational Tutor Flow:
  // Turn 0: Guiding Question
  // Turn 1: Hint
  // Turn 2: Another Hint
  // Turn 3: Visualization
  // Turn 4: Small Example
  // Turn 5: Final Explanation + Challenge Question
  // Turn 6+: Next Concept Recommendation

  if (turnCount === 0) {
    reply = `Hello ${ctx.username || 'Student'}! Let's explore **${cleanTopic}** together. 

Before we look at code, let's think: 
*How would you solve the problem of ${dna.purpose.toLowerCase()}?*

Write down your initial thoughts and we will build the syntax step-by-step.`;
  } 
  else if (turnCount === 1) {
    reply = `Good start! Here is a **guiding clue**: 
Think about the real-world analogy: **${dna.realLifeAnalogy}**. How would you use this to solve our problem?

Give it a try and type a quick code line!`;
  }
  else if (turnCount === 2) {
    reply = `Excellent attempt. Let me offer a **second hint**:
In ${lang === 'python' ? 'Python' : 'JavaScript'}, we declare this concept using specific language keywords.

*Hint:* What does the computer do when it encounters this instruction? Try writing a simple line checking your variable values.`;
  }
  else if (turnCount === 3) {
    reply = `Let's visualize how the computer processes this internally. Here is the **execution flow**:
\`\`\`text
${visualization}
\`\`\`

Based on this diagram, what values would be written in the slots? Write your code attempt below.`;
  }
  else if (turnCount === 4) {
    reply = `You are very close! Here is a **small example** to guide you:
\`\`\`${lang}
// Level 1: Beginner example
${lang === 'python' ? 'student_score = 75\nprint(student_score)' : 'let student_score = 75;\nconsole.log(student_score);'}
\`\`\`

Notice the variable names and operations. Try modifying this to solve your task!`;
  }
  else if (turnCount === 5) {
    reply = `Superb! Let's wrap up with the **final explanation**:
**${cleanTopic}** is used to ${dna.purpose.toLowerCase()} because it solves the problem: *${dna.problemSolved}*

Here is an **extra challenge question** to test your understanding:
*How would you scale this logic if you had 10,000 data elements?*`;
  }
  else {
    reply = `You have mastered **${cleanTopic}**! 🎉 

I recommend moving to the next concept in the track: 
**${dna.interviewTopics[0] || 'Advanced Scope Logic'}**.

Open the sidebar to proceed, or ask me any question!`;
  }

  return {
    reply
  };
}

module.exports = {
  generateTutorResponse
};

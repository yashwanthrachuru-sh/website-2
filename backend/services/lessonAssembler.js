// ============================================================
// backend/services/lessonAssembler.js
// EduNet Human Teaching Engine — Modular Lesson Assembler Service
// ============================================================
'use strict';

const https = require('https');
const path = require('path');
const validator = require('./validator');

const STRUCTURED_OPEN  = '<!--EDUNET_STRUCTURED_V1-->';
const STRUCTURED_CLOSE = '<!--/EDUNET_STRUCTURED_V1-->';
const SECTION_OPEN  = (name) => `<!--SECTION:${name}-->`;
const SECTION_CLOSE = (name) => `<!--/SECTION:${name}-->`;

const LESSON_SECTIONS = [
  'definition', 'why_exists', 'importance', 'learning_objectives',
  'beginner_explanation', 'detailed_concept', 'internal_working',
  'syntax_breakdown', 'visual_flow', 'real_world_analogies',
  'beginner_example', 'intermediate_example', 'advanced_example',
  'production_example', 'line_by_line', 'common_mistakes',
  'best_practices', 'performance', 'interview_questions',
  'faqs', 'mcqs', 'coding_practice', 'debugging_exercises',
  'project_ideas', 'summary', 'key_takeaways', 'related_topics',
  'next_learning_path',
  // v6.1 Structured Visual Elements
  'memoryDiagram', 'executionStepper', 'checkpointQuestions', 'gradualCode'
];

// Load modular handcrafted builders
const assemblePythonIntroduction = require('./lessonAssembler/python/pythonIntroduction');
const assembleVariables = require('./lessonAssembler/python/variables');
const assembleConstants = require('./lessonAssembler/python/constants');
const assembleIfStatements = require('./lessonAssembler/python/ifStatement');
const assembleLoops = require('./lessonAssembler/python/loops');
const assembleFunctions = require('./lessonAssembler/python/functions');
const assembleArrays = require('./lessonAssembler/python/arrays');
const assembleClasses = require('./lessonAssembler/python/classes');
const assembleObjects = require('./lessonAssembler/python/objects');
const assembleSQLJoin = require('./lessonAssembler/sql/join');
const assembleRESTAPI = require('./lessonAssembler/web/restApi');
const assembleJSON = require('./lessonAssembler/web/json');
const assembleHTTP = require('./lessonAssembler/web/http');

/**
 * Calls OpenAI API securely using native HTTPS.
 */
function callOpenAI(apiKey, systemPrompt, userMessage) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      },
      timeout: 15000 // 15s timeout limit for large content
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(data);
    req.end();
  });
}

function assembleLocalLesson(cleanTopic, conceptName, lang, metadata = null) {
  const lk = (lang || 'javascript').toLowerCase();

  // Extract Titles
  const modTitle = String(metadata?.module || cleanTopic).toLowerCase();
  const lesTitle = String(metadata?.lessonTitle || cleanTopic).toLowerCase();
  
  // Combine names for matching
  const target = `${modTitle} : ${lesTitle}`;

  // Route topic/concept to specialized builders based on both module and lesson titles
  if (target.includes('python introduction') || target.includes('setup') || target.includes('introduction')) {
    if (modTitle.includes('python introduction')) {
      return assemblePythonIntroduction();
    }
  }
  
  if (target.includes('rest api') || target.includes('api') || target.includes('express api')) {
    if (lesTitle.includes('setup') || lesTitle.includes('introduction') || lesTitle.includes('rest api')) {
      if (modTitle.includes('rest api') || modTitle.includes('express api') || modTitle.includes('api')) {
        return assembleRESTAPI();
      }
    }
  }
  
  if (target.includes('json')) {
    return assembleJSON();
  }
  
  if (target.includes('http')) {
    return assembleHTTP();
  }
  
  if (target.includes('sql join') || target.includes('join')) {
    return assembleSQLJoin();
  }

  if (target.includes('constant')) {
    return assembleConstants(lk);
  }
  
  if (target.includes('variable') || lesTitle.includes('variables')) {
    return assembleVariables(lk);
  }
  
  if (lesTitle.includes('if statement') || lesTitle.includes('conditional') || lesTitle.includes('if') || lesTitle.includes('control flow') || lesTitle.includes('logic')) {
    return assembleIfStatements(lk);
  }
  
  if (lesTitle.includes('loop') || lesTitle.includes('iteration') || lesTitle.includes('repeat')) {
    return assembleLoops(lk);
  }
  
  if (lesTitle.includes('function') || lesTitle.includes('func') || lesTitle.includes('method')) {
    return assembleFunctions(lk);
  }
  
  if (lesTitle.includes('array') || lesTitle.includes('list')) {
    return assembleArrays(lk);
  }
  
  if (lesTitle.includes('class') || lesTitle.includes('inheritance') || lesTitle.includes('polymorphism')) {
    return assembleClasses(lk);
  }
  
  if (lesTitle.includes('object') || lesTitle.includes('oop') || lesTitle.includes('abstraction') || lesTitle.includes('encapsulation')) {
    return assembleObjects(lk);
  }

  // ── Step 3: Remove the generic variables fallback ──────────────────
  // Call metadata-driven generator instead of defaulting to variables
  const meta = metadata || {
    language: lk,
    module: cleanTopic,
    lessonTitle: cleanTopic,
    lessonDescription: '',
    roadmap: 'general'
  };

  const topicGenerator = require('./topicGenerator');
  return topicGenerator.generateLessonFromTopic(meta);
}

/**
 * Assembles lesson using OpenAI if API key available, or falls back to local.
 */
async function assembleLesson(topicOrMetadata, lang = 'javascript') {
  let topic = '';
  let metadata = null;

  if (topicOrMetadata && typeof topicOrMetadata === 'object') {
    metadata = topicOrMetadata;
    topic = metadata.lessonTitle || metadata.title || '';
    lang = metadata.language || lang;
  } else {
    topic = topicOrMetadata || '';
  }

  const cleanTopic = topic.replace(/Lesson\s*\d+:?/gi, '').trim().split('—')[0].trim();
  const lk = (lang || 'javascript').toLowerCase();

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.startsWith('sk-') && apiKey !== 'sk-placeholder_key_here') {
    console.log(`[lessonAssembler] 🌐 Connecting to OpenAI for lesson: "${topic}" (${lk})`);

    const systemPrompt = `You are a world-class Computer Science Professor teaching beginners.
Your goal is to write a textbook-grade lesson on the topic.
Do NOT start with a definition. 
Use the Cognitive Learning Flow: Real-Life Story, then The Problem, then Human thinking, then Programming solution, then Beginner explanation, then Formal Definition.
Strictly enforce:
- Only code block examples in ${lk} language.
- Meaningful variable names (student_marks, bank_balance, shopping_cart). Never use x, y, z, test, hello.
- Concept-specific analogies (Variables->Boxes, Loops->Exercise, Functions->Coffee machine, SQL Join->Excel Sheets, REST API->Waiter).
- Include ASCII visualizations of RAM memory, Stack/Heap, or execution loops.
- Avoid banned AI phrases: "At its heart...", "basically", "understanding this concept", "in simple words", "super cool", "it is important to note".

You MUST return the content using this exact XML section format:
${STRUCTURED_OPEN}
${SECTION_OPEN('definition')}
[Content for definition: Real-life situation, Problem, Formal Definition]
${SECTION_CLOSE('definition')}
${SECTION_OPEN('why_exists')}
[Content for why_exists]
${SECTION_CLOSE('why_exists')}
... (Include all 32 section tags)
${STRUCTURED_CLOSE}

The 32 required section names are:
${LESSON_SECTIONS.join(', ')}`;

    const userMessage = `Write a comprehensive, premium lesson notes about: "${topic}" in ${lk}.`;
    const response = await callOpenAI(apiKey, systemPrompt, userMessage);

    if (response && response.includes(STRUCTURED_OPEN)) {
      // Parse structured sections
      const result = {};
      const sectionPattern = /<!--SECTION:(\w+)-->([\s\S]*?)<!--\/SECTION:\1-->/g;
      let match;
      while ((match = sectionPattern.exec(response)) !== null) {
        result[match[1]] = match[2].trim();
      }

      // Validate using our validator
      const validation = validator.validateLesson(result);
      if (validation.passed) {
        console.log('[lessonAssembler] ✅ OpenAI lesson generated and validated successfully.');
        return result;
      } else {
        console.warn('[lessonAssembler] ⚠️ OpenAI lesson failed quality validation. Errors:', validation.errors);
      }
    }
  }

  // Fallback to local assembler
  console.log(`[lessonAssembler] 💾 Using local concept assembler for: "${topic}" (${lk})`);
  return assembleLocalLesson(cleanTopic, cleanTopic, lk, metadata);
}

module.exports = {
  assembleLesson,
  assembleLocalLesson,
  LESSON_SECTIONS
};

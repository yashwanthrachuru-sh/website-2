// ============================================================
// backend/services/aiProvider.js
// EduNet — Provider-Agnostic AI Abstraction Layer
// ============================================================
// Offline-first: works without any API key using the built-in
// content engine and offline generators.
//
// To enable GPT/OpenRouter/Gemini, add to .env:
//   AI_PROVIDER=openai        (or "openrouter" or "gemini")
//   AI_API_KEY=sk-...
//   AI_MODEL=gpt-4o-mini      (optional, provider-specific)
//   AI_BASE_URL=...           (optional, for OpenRouter or custom proxy)
//
// The abstraction is provider-agnostic: downstream code calls
//   aiProvider.complete(systemPrompt, userMessage, options)
// and receives a string response regardless of provider.
// ============================================================
'use strict';

const https = require('https');
const http  = require('http');

// ── Resolve provider config from environment ────────────────────
function getProviderConfig() {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  const apiKey   = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '';
  const model    = process.env.AI_MODEL || 'gpt-4o-mini';
  const baseUrl  = process.env.AI_BASE_URL || 'https://api.openai.com';

  return { provider, apiKey, model, baseUrl };
}

// ── Determine if an external AI provider is configured ─────────
function hasExternalProvider() {
  const { apiKey } = getProviderConfig();
  return apiKey && apiKey.startsWith('sk-') && apiKey !== 'sk-placeholder_key_here';
}

// ── Generic HTTPS/HTTP POST request ────────────────────────────
function httpsPost(url, headers, body, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib    = parsed.protocol === 'https:' ? https : http;

    const data = JSON.stringify(body);
    const opts = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...headers
      },
      timeout: timeoutMs
    };

    const req = lib.request(opts, (res) => {
      let buf = '';
      res.on('data', (chunk) => buf += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(buf)); }
        catch (e) { resolve({ error: 'invalid_json', raw: buf }); }
      });
    });

    req.on('error',   (e) => reject(e));
    req.on('timeout', ()  => { req.destroy(); reject(new Error('AI provider request timed out')); });
    req.write(data);
    req.end();
  });
}

// ── OpenAI-compatible completion (works with OpenRouter too) ───
async function callOpenAICompatible(config, systemPrompt, userMessage, temperature = 0.7) {
  const url = `${config.baseUrl}/v1/chat/completions`;

  const headers = {
    'Authorization': `Bearer ${config.apiKey}`
  };

  // OpenRouter requires a Referer + X-Title header
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = process.env.FRONTEND_ORIGIN || 'https://edunet.app';
    headers['X-Title']      = 'EduNet AI Mentor';
  }

  const body = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  }
    ],
    temperature,
    max_tokens: 2000
  };

  const json = await httpsPost(url, headers, body, 10000);

  if (json.error) throw new Error(`AI provider error: ${json.error.message || json.error}`);
  if (json.choices && json.choices[0] && json.choices[0].message) {
    return json.choices[0].message.content;
  }
  throw new Error('AI provider returned unexpected response format');
}

// ── Gemini completion ───────────────────────────────────────────
async function callGemini(config, systemPrompt, userMessage) {
  const model = config.model || 'gemini-pro';
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const body = {
    contents: [{
      parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
    }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
  };

  const json = await httpsPost(url, {}, body, 10000);

  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) return text;
  throw new Error('Gemini returned unexpected response format');
}

// ── Main completion function ────────────────────────────────────
/**
 * Call the configured AI provider, or return null to use offline engine.
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @param {object} [opts]  { temperature, timeoutMs }
 * @returns {Promise<string|null>}  null means offline fallback should be used
 */
async function complete(systemPrompt, userMessage, opts = {}) {
  if (!hasExternalProvider()) return null; // Use offline engine

  const config = getProviderConfig();

  try {
    if (config.provider === 'gemini') {
      return await callGemini(config, systemPrompt, userMessage);
    }
    // Default: OpenAI-compatible (openai, openrouter, custom)
    return await callOpenAICompatible(config, systemPrompt, userMessage, opts.temperature || 0.7);
  } catch (err) {
    console.warn(`[aiProvider] External AI call failed (${config.provider || 'openai'}): ${err.message}. Falling back to offline engine.`);
    return null; // Signal offline fallback
  }
}

// ── Build structured EduNet system prompt ──────────────────────
/**
 * Build a rich system prompt with full user learning context.
 * Used by all AI tool endpoints to make every response personalized.
 */
function buildSystemPrompt(ctx) {
  const { username, roadmap, module: mod, lesson, userContext, mode } = ctx;
  const lang = lesson?.language || mod?.language || 'javascript';

  const completedList = (userContext?.completedLessons || []).slice(-10).join(', ') || 'None yet';
  const weakTopics    = (userContext?.weakTopics || []).join(', ') || 'Not identified yet';
  const strongTopics  = (userContext?.strongTopics || []).join(', ') || 'Not identified yet';
  const quizHistory   = userContext?.quizAvgScore != null
    ? `Quiz average: ${userContext.quizAvgScore}%`
    : 'No quizzes taken yet';

  return `You are an expert AI Coding Mentor on EduNet, a professional coding education platform.

## Student Profile
- **Username**: ${username || 'Student'}
- **XP**: ${userContext?.xp || 0} | **Rank**: ${userContext?.rank || 'Beginner'}
- **Current Roadmap**: ${roadmap?.title || 'General Programming'}
- **Current Module**: ${mod?.title || 'General'}
- **Current Lesson**: ${lesson?.title || 'General'}
- **Programming Language**: ${lang}
- **Recently Completed**: ${completedList}
- **Weak Topics**: ${weakTopics}
- **Strong Topics**: ${strongTopics}
- **${quizHistory}**

## Mode: ${mode || 'chat'}

## Response Rules
1. Respond in rich Markdown format with emojis, code blocks, tables, and bullet points.
2. Always include at least one code example in ${lang}.
3. Tailor complexity to the student's XP level (XP ${userContext?.xp || 0}).
4. Reference the student's current lesson and roadmap context in your response.
5. Never return placeholder text or "coming soon" responses.
6. End with a motivational tip or clear next step.
7. For coding questions: show Approach → Code → Time/Space Complexity.
8. For interview questions: use structured Q&A format with ideal answers.
9. Quality standard: Match or exceed GeeksforGeeks/MDN documentation quality.`;
}

module.exports = {
  complete,
  buildSystemPrompt,
  hasExternalProvider,
  getProviderConfig
};

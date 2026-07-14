// ============================================================
// backend/services/lessonAssembler/web/restApi.js
// Handcrafted Conversational REST API Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleRESTAPI() {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever wondered how your Uber app shows real-time cars on your screen, despite not containing the driver database inside your phone?

Imagine visiting a restaurant. You don't walk into the kitchen, search the fridge, and heat up the pans yourself. You sit at a table and look at the menu. You order from the waiter. The waiter carries your order to the kitchen, the chef prepares the meal, and the waiter brings the plate back to you.

### ❓ The Problem
If a phone app connected directly to a MySQL database, changing the database login password would require updating the code in millions of user phones. Furthermore, malicious users could extract the credentials and execute delete queries, creating massive security hazards.

### 🚫 Why Old Ways Fail
Client-side database links compromise security, block software updates, and drain server ports.

### 💡 The Solution
We put a gatekeeper (a web server) in front of the database. The client talks to the gatekeeper over HTTP using a standard menu of endpoints (like GET, POST). The server processes checks, runs queries, and returns raw text.

### 📖 Formal Definition
A REST API (Representational State Transfer Application Programming Interface) is an architectural layout that uses HTTP requests to fetch, write, modify, or delete data between distinct systems.
`;

  lesson.why_exists = `
REST APIs decouple user interface clients (iOS, Android, web) from database engines, securing and modularizing data exchanges.
`;

  lesson.importance = `
They allow multiple clients to share the same database logic using standard web transfer rules.
`;

  lesson.learning_objectives = `
- Master HTTP verbs (GET, POST, PUT, DELETE).
- Parse JSON request payloads and URL parameters.
- Handle standard HTTP status codes (200, 400, 404, 500).
`;

  lesson.beginner_explanation = `
Think of an API like a waiter, carrying request payloads to the database server and returning data pages back to your browser.
`;

  lesson.detailed_concept = `
The client formats request headers (specifying content type) and payload text, transmitting them over TCP sockets to server ports.
`;

  lesson.internal_working = `
The server router evaluates endpoints paths, triggers middleware checkpoints (authorization), retrieves database rows, and streams JSON response packets.
`;

  lesson.syntax_breakdown = `
An API request requires:
- **Endpoint Route**: The URL path (e.g., \`/api/users\`).
- **HTTP Verb**: Action commands (e.g., \`GET\` to read, \`POST\` to create).
- **Status Code**: Returns outcome status (e.g., \`200 OK\` or \`404 Not Found\`).
`;

  lesson.visual_flow = `
\`\`\`text
Client (Browser) ─── HTTP GET /api/users ───► Express Server ───► MySQL Database
Client (Browser) ◄─── JSON: {"users": []} ◄─── Express Server ◄─── MySQL Database
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Restaurant Waiter service.
- **Why it fits**: The waiter (API) takes your request, delivers it to the chef (database), and brings back food (data). You never touch the kitchen stove (database) directly.
`;

  lesson.beginner_example = `
\`\`\`javascript
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`javascript
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Alice' })
})
.then(res => res.json())
.then(data => console.log('Saved:', data));
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`javascript
async function fetchUserProfile(userId) {
  try {
    const res = await fetch(\`https://api.github.com/users/\${userId}\`);
    if (res.status === 404) return "User Not Found";
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
  }
}
\`\`\`
`;

  lesson.production_example = `
Used in Instagram feeds to request images from server databases through REST API endpoints: \`GET /api/feed\`.
`;

  lesson.line_by_line = `
1. Client issues HTTP request to \`/api/users\`.
2. Router parses endpoint, queries database.
3. Server serializes rows into JSON.
4. Streams response bytes back with code \`200 OK\`.
`;

  lesson.common_mistakes = `
### Body inside GET Requests
\`\`\`javascript
fetch('/api/users', {
  method: 'GET',
  body: JSON.stringify({ id: 5 }) // Invalid HTTP structure!
})
\`\`\`
*Why it fails*: Standard HTTP guidelines state that GET requests should not contain request bodies. Use URL parameters instead.
`;

  lesson.best_practices = `
- Secure endpoints with HTTPS encryption.
- Map verbs accurately (GET to read, POST to create, DELETE to remove).
- Always return standard HTTP status codes (like 400 for bad parameters).
`;

  lesson.performance = `
Latency depends on database queries and network hops. Use HTTP caching (like ETag) to speed up repeat requests.
`;

  lesson.interview_questions = `
- **Q: What does Idempotency mean in REST?**
- **A**: An operation is idempotent if executing it multiple times yields the same result (e.g., GET or PUT). POST is not idempotent because repeating it creates duplicates.
`;

  lesson.faqs = `
- **Q: What is JSON?**
- **A**: JavaScript Object Notation, the standard text format used to transfer data in API requests.
`;

  lesson.mcqs = `
### Question 1: Which HTTP code represents a resource that could not be found?
- A) 200
- B) 400
- C) 404
- D) 500
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: C</strong>
404 is the standard HTTP status code for Not Found.
</details>
`;

  lesson.coding_practice = `
Write a fetch request loading resource details from \`/api/status\`.
`;

  lesson.debugging_exercises = `
Fix the incorrect fetch configuration:
\`\`\`javascript
fetch('/api/save', {
  method: 'POST',
  body: { name: 'Alice' } // Fix: must stringify!
})
\`\`\`
`;

  lesson.project_ideas = `
- **Weather Fetcher**: Build a dashboard that fetches weather updates from a public API endpoint.
`;

  lesson.summary = `
REST APIs route HTTP requests, acting as secure gates between database servers and user client interfaces.
`;

  lesson.key_takeaways = `
- Secure database connections from direct client access.
- Map requests using standard HTTP verbs.
`;

  lesson.related_topics = `
- HTTP Header standards
- Web Security & CORS
`;

  lesson.next_learning_path = `
Now let's learn how computers organize text data maps using JSON!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "restApi",
    theme: "restApi",
    title: "HTTP Request Flow",
    nodes: [
      { name: "Browser Client", action: "GET /api/users" },
      { name: "REST Router", action: "Verify Token & Query DB" },
      { name: "Database", action: "Retrieve user rows" },
      { name: "Browser Client", action: "Receive JSON: {users: []}" }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "Client triggers fetch('/api/users')",
      explanation: "Browser formats HTTP GET request and opens a TCP socket to the server.",
      memory: { Browser: "Awaiting response" }
    },
    {
      line: 2,
      code: "Server parses GET route",
      explanation: "The Express router matches '/api/users', checks authorization, and queries the database.",
      memory: { Server: "Fetching from DB" }
    },
    {
      line: 3,
      code: "Database returns rows",
      explanation: "Database returns rows. Server stringifies them into a JSON payload.",
      memory: { Server: "Serializing JSON" }
    },
    {
      line: 4,
      code: "Client receives 200 OK JSON",
      explanation: "HTTP response arrives. Browser parses the JSON payload to update the screen.",
      memory: { Browser: "Rendered users" },
      output: '{"success": true, "users": []}'
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which HTTP verb should be used to create a new user profile?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correct: 1,
      explanation: "POST is the standard HTTP verb for submitting and creating new records."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "fetch('/api/users')",
      explanation: "Initialize request to endpoint."
    },
    {
      step: 2,
      code: "fetch('/api/users')\n  .then(res => res.json())",
      explanation: "Add parsing handler to decode response body."
    },
    {
      step: 3,
      code: "fetch('/api/users')\n  .then(res => res.json())\n  .then(data => console.log(data))",
      explanation: "Print decoded object payload data."
    }
  ]);

  return lesson;
}

module.exports = assembleRESTAPI;

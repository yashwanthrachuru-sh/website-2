// ============================================================
// backend/services/lessonAssembler/web/http.js
// Handcrafted Conversational HTTP Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleHTTP() {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever wondered what happens behind the scenes when you type a website URL like google.com and press Enter?

Imagine sending a letter via post. You write the recipient's address on the front, enclose your request message inside the envelope, and drop it in the mailbox. The post carrier transports it to the address, the recipient reads it, puts a response page in a new envelope, and ships it back to your mailbox.

### ❓ The Problem
When computers communicate over the internet, they need a standardized system of rules. If every computer transmitted data in its own custom format, web browsers would not know how to display pages from different servers, and networks would face total communication blockages.

### 🚫 Why Old Ways Fail
Relying on raw socket byte streams requires writing complex network routing logic for every single website, creating huge developer overhead.

### 💡 The Solution
Web systems use a single, universal network protocol called HTTP. Every web browser formats requests using the exact same standard rules, and every web server responds using those same rules.

### 📖 Formal Definition
HTTP (Hypertext Transfer Protocol) is the fundamental text-based communication protocol of the World Wide Web, defining how requests and responses are structured and transmitted.
`;

  lesson.why_exists = `
HTTP provides a universal language for web communication, allowing any browser to render pages from any server in the world.
`;

  lesson.importance = `
It forms the foundation of all web APIs, pages loading, and file transfers, enabling modern internet browsers and web services.
`;

  lesson.learning_objectives = `
- Understand HTTP Request-Response cycles.
- Identify common HTTP status codes (200, 301, 404, 500).
- Differentiate between HTTP headers, bodies, and methods.
`;

  lesson.beginner_explanation = `
Think of HTTP like a mail delivery service. The browser mails a request envelope, and the server mails back a response envelope containing the page code.
`;

  lesson.detailed_concept = `
The client initiates a TCP connection to server port 80 (or 443 for HTTPS) and transmits request text detailing paths, verbs, and headers.
`;

  lesson.internal_working = `
The web server parses headers, maps paths, reads local files, and writes response bytes (headers and HTML bodies) back into the socket.
`;

  lesson.syntax_breakdown = `
An HTTP request contains:
- **Request Line**: The verb, path, and version (e.g., \`GET /index.html HTTP/1.1\`).
- **Headers**: Metadata details (e.g., \`Host: google.com\`, \`User-Agent: Chrome\`).
- **Body**: Optional text payload data.
`;

  lesson.visual_flow = `
\`\`\`text
Browser Client ─── HTTP GET /index.html ───► Web Server
Browser Client ◄─── HTTP 200 OK (HTML Code) ◄─── Web Server
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Sending letters through postal envelopes.
- **Why it fits**: The envelope has metadata (headers like address) and contents (body like letter details). The mail carrier (TCP/IP) delivers it to the mailbox.
`;

  lesson.beginner_example = `
\`\`\`javascript
// Browser sends HTTP GET request
fetch('https://api.github.com')
  .then(res => console.log("Status:", res.status));
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`javascript
// Sending headers with a request
fetch('https://api.github.com', {
  headers: { 'Accept': 'application/json' }
})
.then(res => res.json())
.then(data => console.log(data));
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`javascript
// Custom HTTP request wrapper
async function checkServerStatus(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok ? "Online" : "Offline";
  } catch (err) {
    return "Network Failure";
  }
}

checkServerStatus('https://www.google.com').then(console.log);
\`\`\`
`;

  lesson.production_example = `
Used by every single website and browser in the world to download pages, styles, images, and API data.
`;

  lesson.line_by_line = `
1. Browser opens TCP socket to IP address.
2. Transmits request line: \`GET / HTTP/1.1\`.
3. Server returns header: \`HTTP/1.1 200 OK\`.
4. Browser reads HTML body, parses code, and renders the page.
`;

  lesson.common_mistakes = `
### Insecure Communication
Using plain HTTP (\`http://\`) instead of HTTPS (\`https://\`).
*Why it is bad*: Plain HTTP transmits data in clear text. Anyone on the network can read your passwords. HTTPS encrypts data to protect user privacy.
`;

  lesson.best_practices = `
- Always enforce HTTPS for all web applications to secure data in transit.
- Use appropriate HTTP headers (like cache control) to speed up loading times.
- Correctly handle status codes (like returning 401 for unauthorized access).
`;

  lesson.performance = `
TCP handshakes and SSL negotiation introduce latency. Use HTTP/2 multiplexing or HTTP/3 (QUIC) to accelerate speeds.
`;

  lesson.interview_questions = `
- **Q: What is the difference between GET and POST?**
- **A**: GET retrieves data and should not contain a request body; POST submits data to create a new resource on the server.
`;

  lesson.faqs = `
- **Q: What is a cookie?**
- **A**: A small piece of data sent in HTTP headers by the server, which the browser stores and sends back on subsequent requests to keep you logged in.
`;

  lesson.mcqs = `
### Question 1: Which HTTP method is used to download web pages?
- A) POST
- B) GET
- C) PUT
- D) DELETE
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
GET is the standard HTTP method used to read and retrieve web resources.
</details>
`;

  lesson.coding_practice = `
Write a fetch request to load details from \`https://api.github.com\`.
`;

  lesson.debugging_exercises = `
Fix the incorrect protocol reference:
\`\`\`javascript
fetch('htpp://api.github.com') // Typo in protocol!
\`\`\`
`;

  lesson.project_ideas = `
- **Web Status Checker**: Build a tool that pings a list of URLs to verify their HTTP response codes.
`;

  lesson.summary = `
HTTP defines the standardized rules browser clients and web servers follow to transfer web pages and API data.
`;

  lesson.key_takeaways = `
- Baseline protocol of the web.
- HTTPS provides secure encryption.
`;

  lesson.related_topics = `
- TCP/IP Protocol Stack
- Domain Name System (DNS)
`;

  lesson.next_learning_path = `
Let's learn how servers parse these requests using REST APIs!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "http",
    theme: "http",
    title: "Request-Response Envelope",
    client: { request: "GET /index.html HTTP/1.1\nHost: site.com\n\n(Empty Body)" },
    server: { response: "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<h1>Hello!</h1>" }
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "GET /index.html HTTP/1.1",
      explanation: "Client initiates request envelope, writing the method and target file path.",
      memory: {}
    },
    {
      line: 2,
      code: "HTTP/1.1 200 OK",
      explanation: "Server receives envelope, finds index.html, and stamps successful 200 code.",
      memory: {},
      output: "HTML Code"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which port does secure HTTPS communication use by default?",
      options: ["80", "8080", "443", "22"],
      correct: 2,
      explanation: "Standard secure web traffic (HTTPS) routes through port 443; plain HTTP uses port 80."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "fetch('https://api.github.com')",
      explanation: "Issue web fetch request."
    },
    {
      step: 2,
      code: "fetch('https://api.github.com')\n  .then(res => console.log(res.ok))",
      explanation: "Output check showing if server responded successfully."
    }
  ]);

  return lesson;
}

module.exports = assembleHTTP;

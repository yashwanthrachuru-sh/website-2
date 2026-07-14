// ============================================================
// backend/services/lessonAssembler/web/json.js
// Handcrafted Conversational JSON Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleJSON() {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever tried transferring your contact details to a friend's phone, only to find their system uses a completely different file format?

Imagine filling out a paper application form. It has structured boxes: "First Name", "Age", and "Email". No matter who reads the form, they can instantly map the labels (keys) to your answers (values). JSON does exactly this: it translates programming variables into structured text forms that any computer program can read.

### ❓ The Problem
A Python server stores variables using "dictionaries" (hashes) in its own binary format inside memory. A JavaScript client (browser) stores variables as "objects" using a completely different binary layout. A Python server cannot send its raw memory bytes to JavaScript — the browser would not understand how to read them.

### 🚫 Why Old Ways Fail
Using simple text lists (like CSV values: \`Alice, 25, NY\`) breaks as soon as a user writes a comma in their name (e.g., \`Alice, Jr.\`), or if you need to store nested lists of items.

### 💡 The Solution
We convert programming objects into a single, standardized text string using a format that looks like JavaScript variables. Both Python and JavaScript contain built-in parsers to translate this text format back into local memory objects.

### 📖 Formal Definition
JSON (JavaScript Object Notation) is a lightweight, text-based data format representing structured key-value maps and lists, widely used to exchange data over networks.
`;

  lesson.why_exists = `
JSON acts as a universal data exchange contract, allowing systems built on different languages (like Java, Python, or Go) to talk to each other cleanly.
`;

  lesson.importance = `
It replaced XML because it is much lighter, contains less text overhead, and parses directly into native objects in modern programming languages.
`;

  lesson.learning_objectives = `
- Master JSON syntax rules (brackets, double quotes).
- Convert objects to JSON strings (Serialization / Stringify).
- Convert JSON strings to objects (Deserialization / Parsing).
`;

  lesson.beginner_explanation = `
Think of JSON as a standardized form letter. It doesn't matter what language you speak; if you write your details in the form, anyone can read them.
`;

  lesson.detailed_concept = `
JSON parsers read string buffers character-by-character, identifying token boundaries (like \`{\` or \`:\`) to build object keys in memory.
`;

  lesson.internal_working = `
During serialization, the compiler traverses the object tree on the Heap, appending string characters to format a standard text payload.
`;

  lesson.syntax_breakdown = `
JSON syntax has strict formatting constraints:
- **Double Quotes**: All keys and text values MUST use double quotes (\`"\`). Single quotes (\`'\`) are invalid.
- **Curly Braces**: Enclose key-value maps (e.g., \`{"name": "Alice"}\`).
- **Square Brackets**: Enclose lists (e.g., \`["Eggs", "Milk"]\`).
`;

  lesson.visual_flow = `
\`\`\`text
JavaScript Object ──► JSON.stringify() ──► JSON String: '{"name": "Alice"}'
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: A printed shipping label.
- **Why it fits**: The package contains real physical items (objects), but to ship it across carriers, you print a standardized label detailing contents, sender, and recipient.
`;

  lesson.beginner_example = `
\`\`\`javascript
const user_json = '{"name": "Alice", "age": 25}';
console.log(JSON.parse(user_json));
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`javascript
const user = { name: "Alice", age: 25 };
const serialized = JSON.stringify(user);
console.log("JSON String:", serialized);
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`javascript
function parseAPIResponse(raw_json) {
  try {
    const payload = JSON.parse(raw_json);
    if (!payload.success) return "Request Failed";
    return payload.data;
  } catch (err) {
    return "Malformed JSON payload: " + err.message;
  }
}

const response = '{"success": true, "data": {"total": 1499}}';
console.log(parseAPIResponse(response));
\`\`\`
`;

  lesson.production_example = `
Used in REST APIs to transmit profiles, weather reports, and payment details from server backend databases to phone applications.
`;

  lesson.line_by_line = `
1. Define a text string containing keys \`name\` and \`age\`.
2. Call \`JSON.parse\` on the string.
3. The parser creates a local JavaScript object instance in memory.
`;

  lesson.common_mistakes = `
### Single Quote Error
\`\`\`javascript
const bad_json = "{ 'name': 'Alice' }"; // Invalid JSON!
JSON.parse(bad_json); // Raises SyntaxError!
\`\`\`
*Why it fails*: JSON standards strictly demand double quotes (\`"\`) for keys and string values. Single quotes (\`'\`) are rejected.
`;

  lesson.best_practices = `
- Always wrap \`JSON.parse\` calls inside a try-catch block to handle malformed payloads safely.
- Keep JSON layouts as flat as possible to avoid parsing overhead.
- Ensure values match simple data types: numbers, strings, booleans, arrays, or objects.
`;

  lesson.performance = `
Parsing speed scales linearly with payload size: O(N) characters. Large JSON payloads can cause short garbage collector delays.
`;

  lesson.interview_questions = `
- **Q: JSON vs XML?**
- **A**: JSON is less verbose, faster to parse, and maps directly to native programming object structures; XML has high tag overhead.
`;

  lesson.faqs = `
- **Q: Can JSON store functions?**
- **A**: No, JSON only stores raw static data (variables). Any functions inside objects are stripped out during serialization.
`;

  lesson.mcqs = `
### Question 1: Which of the following is valid JSON?
- A) { name: 'Alice' }
- B) { "name": "Alice" }
- C) { 'name': 'Alice' }
- D) { "name": 'Alice' }
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
JSON requires double quotes for all keys and string values.
</details>
`;

  lesson.coding_practice = `
Write a JSON string representing a student with keys \`name\` and \`score\`.
`;

  lesson.debugging_exercises = `
Fix the parsing SyntaxError:
\`\`\`javascript
const raw = "{ 'port': 8080 }";
console.log(JSON.parse(raw));
\`\`\`
`;

  lesson.project_ideas = `
- **Config Loader**: Build a tool that reads configurations from a local JSON file and launches settings.
`;

  lesson.summary = `
JSON is the standard text-based layout used to serialize and transfer structured variables between different programming stacks.
`;

  lesson.key_takeaways = `
- Universal exchange contract for backend and frontend.
- Strict double quote rules.
`;

  lesson.related_topics = `
- Data Serialization Formats
- Web Request Payload limits
`;

  lesson.next_learning_path = `
Now let's learn how servers securely receive these payloads using REST APIs!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "json",
    theme: "json",
    title: "Object Serialization Mapping",
    mapping: [
      { text: '"name": "Alice"', type: "Key-Value", destination: "name = 'Alice'" },
      { text: '"age": 25', type: "Key-Value", destination: "age = 25" }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "const user = { name: 'Alice', age: 25 };",
      explanation: "Create JS object in memory heap.",
      memory: { user: { name: "Alice", age: 25 } }
    },
    {
      line: 2,
      code: "const raw = JSON.stringify(user);",
      explanation: "Serializer scans heap object, formatting keys into double-quoted text string.",
      memory: { user: { name: "Alice", age: 25 }, raw: '{"name":"Alice","age":25}' }
    },
    {
      line: 3,
      code: "const parsed = JSON.parse(raw);",
      explanation: "Parser reads text, generating a new object block back in the heap.",
      memory: { user: { name: "Alice", age: 25 }, raw: '{"name":"Alice","age":25}', parsed: { name: "Alice", age: 25 } }
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which function converts a JavaScript object into a JSON string?",
      options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.toText()"],
      correct: 1,
      explanation: "JSON.stringify() serializes objects into text strings; JSON.parse() parses strings back to objects."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "const raw = '{\"name\": \"Alice\"}';",
      explanation: "Start with a valid double-quoted raw JSON string."
    },
    {
      step: 2,
      code: "const raw = '{\"name\": \"Alice\"}';\nconst user = JSON.parse(raw);",
      explanation: "Call the parser to build a JS memory object."
    },
    {
      step: 3,
      code: "const raw = '{\"name\": \"Alice\"}';\nconst user = JSON.parse(raw);\nconsole.log(user.name);",
      explanation: "Read the values from the newly parsed object container."
    }
  ]);

  return lesson;
}

module.exports = assembleJSON;

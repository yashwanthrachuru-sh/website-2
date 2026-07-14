// ============================================================
// backend/services/lessonAssembler/python/constants.js
// Handcrafted Conversational Constants Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleConstants(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever built something that requires measurements, like the value of Pi (\`3.14159\`), only to have another developer accidentally overwrite it later in the code?

Imagine a company rules handbook. Certain guidelines are permanent, like "Maximum Work Hours per Week = 40". If any employee could write over that rule, the company would face legal chaos. In programming, some values must remain completely frozen throughout the life of the application.

### ❓ The Problem
When using normal variables, it is incredibly easy to make a typing mistake or write code that overrides critical system configurations (like database connection ports or tax rates). If a program accidentally changes the \`SALES_TAX_RATE\` from 5% to 50% midway, it will bill customers incorrectly and cause business disaster.

### 🚫 Why Old Ways Fail
Relying on comments (like \`# DO NOT CHANGE THIS VARIABLE\`) is a weak solution. Other developers or automated scripts can still overwrite the value, and the computer will not raise any flags.

### 💡 The Solution
We need a special kind of variable that is marked as "read-only". Once set, the computer locks the container, preventing anyone from changing its value.

### 📖 Formal Definition
A constant is a named value in computer memory that, once initialized, cannot be reassigned or modified by the program during its execution.
`;

  lesson.why_exists = `
Constants prevent accidental overrides of configuration values and improve code readability by replacing "magic numbers" with descriptive permanent labels.
`;

  lesson.importance = `
They allow the compiler or interpreter to enforce safety rules, and sometimes optimize performance by pre-loading values directly into instructions.
`;

  lesson.learning_objectives = `
- Differentiate between normal variables and constants.
- Declare constants using naming conventions.
- Implement read-only parameters in calculations.
`;

  lesson.beginner_explanation = `
Think of a constant as a locked display case. You put a value inside and lock the glass door. Anyone can look at it, but nobody can replace it.
`;

  lesson.detailed_concept = `
In languages like C++ or JavaScript, constants are enforced at compile time. In Python, constants are a programmer convention (capitalized names) since the Python Virtual Machine doesn't have a native compile-time read-only lock.
`;

  lesson.internal_working = `
When JavaScript or Python parses a constant declaration, it flags the symbol in the scope registry. Any assignment operator (\`=\`) targeting that symbol later throws a \`TypeError\` immediately.
`;

  lesson.syntax_breakdown = `
In JavaScript, we use \`const\`:
- **Keyword**: \`const\` locks the label.
- **Capitalization**: By convention, we write constants in ALL_CAPS.
- **Value**: Must be assigned immediately at declaration.
`;

  lesson.visual_flow = `
\`\`\`text
Name: MAX_LIMIT (const)  ──►  [ Locked Memory Slot ]  ──►  Holds: 100 (Unchangeable)
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: A printed contract signature.
- **Why it fits**: Once signed (initialized), you cannot go back and erase the numbers on the paper without voiding the entire transaction.
`;

  lesson.beginner_example = `
\`\`\`python
# Python Convention
TAX_RATE = 0.05
print(TAX_RATE)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
PI = 3.14159
radius = 10
area = PI * (radius ** 2)
print("Circle Area:", area)
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
DB_PORT = 5432
DB_HOST = "localhost"

def connect_db():
    print(f"Connecting to database at {DB_HOST}:{DB_PORT}...")
    # Read-only configuration lookup
    return "Connected"

connect_db()
\`\`\`
`;

  lesson.production_example = `
Used in web applications to lock configuration parameters like API keys, payment keys, or system ports.
`;

  lesson.line_by_line = `
1. The computer declares the constant label \`PI\` and initializes it to \`3.14159\`.
2. The user calculates area using the read-only \`PI\` container.
3. Attempting to update \`PI\` will trigger developer review warnings.
`;

  lesson.common_mistakes = `
### Accidental Reassignment
\`\`\`javascript
const MAX_USERS = 50;
MAX_USERS = 100; // TypeError: Assignment to constant variable!
\`\`\`
*Why it fails*: The computer blocks any attempts to write new values to constant containers.
`;

  lesson.best_practices = `
- Use ALL_CAPS with underscores for constant names (e.g., \`MAX_LOGIN_ATTEMPTS\`).
- Always use constant declarations for values that do not change while the program runs.
- Keep configuration values gathered together at the top of your files.
`;

  lesson.performance = `
Since constants do not change, compilers can inline their values directly into operations, eliminating lookup overhead.
`;

  lesson.interview_questions = `
- **Q: Can you update elements inside an array declared with const?**
- **A**: Yes, the reference to the array is constant, but the contents of the array itself can be modified.
`;

  lesson.faqs = `
- **Q: Does Python have a const keyword?**
- **A**: No, Python relies on uppercase naming conventions to tell programmers to treat the value as constant.
`;

  lesson.mcqs = `
### Question 1: What error is raised when trying to assign a new value to a JS const?
- A) SyntaxError
- B) TypeError
- C) ReferenceError
- D) RangeError
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
Assigning to a constant raises a TypeError because it violates the type rule of read-only access.
</details>
`;

  lesson.coding_practice = `
Declare a constant named \`GRAVITY\` and set its value to \`9.8\`.
`;

  lesson.debugging_exercises = `
Fix this code trying to reassign a constant:
\`\`\`javascript
const TAX_RATE = 0.05;
TAX_RATE = 0.06;
console.log(TAX_RATE);
\`\`\`
`;

  lesson.project_ideas = `
- **Physics Calculator**: Build a dashboard that calculates object velocities using physical constants.
`;

  lesson.summary = `
Constants are locked variables that cannot be changed once declared. They protect code safety and state.
`;

  lesson.key_takeaways = `
- Use constants for values that should never change.
- Enforced at language levels or naming conventions.
`;

  lesson.related_topics = `
- Immutable Data Structures
- Compiler Optimizations
`;

  lesson.next_learning_path = `
Now let's learn how computers make choices using If Statements!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "constants",
    theme: "constants",
    title: "Locked Read-Only Memory Blocks",
    memory: [
      { address: "0x0080", label: "GRAVITY", value: "9.8", locked: true },
      { address: "0x0084", label: "speed_limit", value: "60", locked: false }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "const GRAVITY = 9.8",
      explanation: "Declares constant GRAVITY and locks it in memory.",
      memory: { GRAVITY: 9.8 }
    },
    {
      line: 2,
      code: "GRAVITY = 10",
      explanation: "ERROR! The engine blocks the write instruction and throws a TypeError.",
      memory: { GRAVITY: 9.8 },
      error: "TypeError: Assignment to constant variable"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Why do programmers use UPPERCASE for constants?",
      options: ["To make code load faster", "As a visual rule telling programmers not to change the value", "To make it look louder", "Because the compiler demands it"],
      correct: 1,
      explanation: "ALL_CAPS is a standard naming convention that tells human programmers a variable is read-only."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "TAX_RATE = 0.05",
      explanation: "We define our tax constant at the top of the file."
    },
    {
      step: 2,
      code: "TAX_RATE = 0.05\nsubtotal = 100",
      explanation: "We set up our subtotal variable."
    },
    {
      step: 3,
      code: "TAX_RATE = 0.05\nsubtotal = 100\ntax_amount = subtotal * TAX_RATE",
      explanation: "We calculate the tax utilizing the read-only TAX_RATE."
    }
  ]);

  return lesson;
}

module.exports = assembleConstants;

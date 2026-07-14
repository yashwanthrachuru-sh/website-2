// ============================================================
// backend/services/lessonAssembler/python/pythonIntroduction.js
// Handcrafted Conversational Python Introduction Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assemblePythonIntroduction() {
  const lesson = createBaseLesson();

  lesson.definition = `
Imagine visiting the United Nations general assembly. There are representatives speaking French, Swahili, Japanese, and Hindi. If you only speak English, communication is impossible unless you hire a **translator** who stands by your side, listens to the foreign words, and translates them back to you in real-time.

Python acts exactly like this translator between your human thoughts and your computer.

### ❓ The Problem
Computers do not understand English. They are physical processors built of silicon transistors that only understand binary electrical switches (1s and 0s). Writing raw binary commands (like \`01001011\`) is incredibly tedious and prone to error for humans.

### 🚫 Why Old Ways Fail
Earlier languages like C and Assembly required programmers to write dozens of lines of code just to print text, manually manage computer memory registers, and compile files for hours. For beginners, this structural complexity hides the logic of programming.

### 💡 The Solution
Guido van Rossum wanted a language that reads like simple English, hides mechanical details like memory registers, and executes instructions instantly. This need gave rise to Python in 1991.

### 📖 Formal Definition
Python is a high-level, general-purpose, interpreted programming language designed with an emphasis on code readability. Its design philosophy allows programmers to write clear, logical code for projects of all sizes.
`;

  lesson.why_exists = `
Python was created to solve software design speed friction. By removing compiler delays and punctuation noise (like semicolons), it allows developers to test ideas instantly.
`;

  lesson.importance = `
Guido wanted a language that can be read like a book. Python uses indentation to group statements, eliminating structural punctuation and curly braces.
`;

  lesson.learning_objectives = `
- Learn what Python is and why it was created.
- Set up the Python execution environment.
- Run your first script and understand the Python Virtual Machine (PVM).
`;

  lesson.beginner_explanation = `
Think of Python as an assistant. You type clear instructions in English-like syntax (e.g. \`print("Hello, World!")\`), and Python translates them for your computer's CPU behind the scenes.
`;

  lesson.detailed_concept = `
When you execute a Python file, the runtime engine does not run the code directly. First, a compiler parses the code and translates it to an intermediate, compact format called **Bytecode** (\`.pyc\` files). Then, the **Python Virtual Machine (PVM)** interpreter runs this bytecode.
`;

  lesson.internal_working = `
1. Reads source file instructions.
2. Compiles statement checks into bytecode values.
3. Feeds bytecode into the PVM loop to write stdout logs.
`;

  lesson.syntax_breakdown = `
Python syntax is clean:
- **print()**: Built-in function to display outputs.
- **No Semicolons**: Lines end naturally.
- **Double/Single Quotes**: Define text strings.
`;

  lesson.visual_flow = `
\`\`\`text
[ hello.py ] ──→ [ Python Compiler ] ──→ [ hello.pyc (Bytecode) ] ──→ [ PVM Interpreter ] ──→ Screen Output
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy:** Universal Language Translator
- **Explanation:** Python acts as a real-time translator between you and the CPU.
`;

  lesson.beginner_example = `
The smallest working Python program:
\`\`\`python
print("Hello, World!")
\`\`\`
`;

  lesson.intermediate_example = `
Using variables in a script:
\`\`\`python
student_name = "Alice"
print("Welcome to EduNet,", student_name)
\`\`\`
`;

  lesson.advanced_example = `
Fetching weather data using requests:
\`\`\`python
import requests

def get_temperature(city):
    response = requests.get(f"https://api.weather.com/{city}")
    return response.json()["temp"]

print(get_temperature("New York"))
\`\`\`
`;

  lesson.production_example = `
This concept is widely used in:
- **Instagram**: Python serves its primary web APIs.
- **YouTube**: Automates video processing.
`;

  lesson.line_by_line = `
1. Python checks syntax of \`print("Hello, World!")\`.
2. Compiles to \`PRINT_ITEM\` bytecode.
3. PVM executes bytecode, printing \`Hello, World!\` to stdout.
`;

  lesson.common_mistakes = `
### The Mistake
\`\`\`python
print "Hello"
\`\`\`
*Why this is bad:* Python 3 requires parentheses. Running this throws a \`SyntaxError\`.
`;

  lesson.best_practices = `
- Always write code in Python 3.
- Indent using 4 spaces, never tabs.
`;

  lesson.performance = `
- Startup Overhead: Bytecode caching speedups load.
`;

  lesson.interview_questions = `
- **Q: What is PEP 8?**
- **A:** The official style guide for writing Python code cleanly.
`;

  lesson.faqs = `
- **Q:** What is the REPL?
- **A:** Read-Eval-Print Loop, an interactive shell to run commands instantly.
`;

  lesson.mcqs = `
### Question 1: Who created Python in 1991?
- A) James Gosling
- B) Bjarne Stroustrup
- C) Guido van Rossum
- D) Dennis Ritchie
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: C</strong><br>
Guido van Rossum designed and released Python in 1991.
</details>
`;

  lesson.coding_practice = `
Write a script that prints your favorite movie title.
`;

  lesson.debugging_exercises = `
Fix the syntax error: \`print("Hello"\`
`;

  lesson.project_ideas = `
- Build a Python script that greets users based on their input.
`;

  lesson.summary = `
- Python is high-level and interpreted.
- Code is compiled to bytecode first, then run by the PVM.
`;

  lesson.key_takeaways = `
- Readability is a first-class citizen in Python.
`;

  lesson.related_topics = `
- Bytecode Compilation.
`;

  lesson.next_learning_path = `
Proceed to Variables and Data Types!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "pythonIntroduction",
    theme: "pythonIntroduction",
    title: "Python Virtual Machine",
    diagram: [
      { step: "Source (.py)", action: "Writes code" },
      { step: "Bytecode (.pyc)", action: "Compiles code" },
      { step: "PVM Interpreter", action: "Executes code" }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: 'print("Hello, World!")',
      explanation: "Compiler translates print to bytecode PRINT_ITEM instruction.",
      memory: {}
    },
    {
      line: 2,
      code: "PVM runs bytecode",
      explanation: "The Python Virtual Machine reads bytecode, prints message, and returns output.",
      memory: {},
      output: "Hello, World!"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which component executes compiled Python bytecode?",
      options: ["Compiler", "Python Virtual Machine (PVM)", "RAM stack", "Operating System"],
      correct: 1,
      explanation: "The PVM acts as the interpreter that runs the intermediate bytecode files."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "print()",
      explanation: "Start with the output command."
    },
    {
      step: 2,
      code: 'print("Hello, World!")',
      explanation: "Add the message string to display."
    }
  ]);

  return lesson;
}

module.exports = assemblePythonIntroduction;

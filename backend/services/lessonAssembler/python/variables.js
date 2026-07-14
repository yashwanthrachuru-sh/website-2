// ============================================================
// backend/services/lessonAssembler/python/variables.js
// Handcrafted Conversational Variables Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleVariables(lang) {
  const lesson = createBaseLesson();
  const isPy = lang === 'python';

  // 1. Curiosity, Real-life situation, Problem, Why old methods fail, Big idea, Formal definition
  lesson.definition = `
Have you ever wondered how a computer remembers your shopping cart total when you shop online?

Imagine you are packing items into cardboard boxes during a house move. To avoid opening every single box to see what is inside, you take a marker and write a clear label on the outside: "Kitchen Utensils" or "Action Thriller Books". The label stays exactly the same on the box, but the items inside can change at any time.

### ❓ The Problem
Inside the computer's processor chips, there are millions of tiny physical electrical switches called transistors. Without labels, a programmer would have to remember that your shopping cart total is stored at memory address coordinate **0x7ffd53**. Writing software by reading and writing raw hexadecimal memory registers is impossible for humans to track.

### 🚫 Why Old Ways Fail
If we hardcode a total score directly in our calculations (like writing \`1499\` everywhere), the program becomes completely static. If a customer adds a discount coupon, you would have to search the entire codebase and change every single reference manually.

### 💡 The Solution
Programmers invented a way to label memory boxes. We name a memory box, assign a value to it, and tell the computer to update the contents whenever needed.

### 📖 Formal Definition
A variable is a labeled container in the computer's memory (RAM) that holds a value. The value inside the container can be read, used, or changed while the program is running.
`;

  lesson.why_exists = `
Variables exist because programs must handle dynamic data. Without them, an app could never remember your username, track a game score, or compute checkout totals.
`;

  lesson.importance = `
By mapping custom human-readable labels to physical RAM address offsets, variables act as the bridge between human logic and binary computer hardware.
`;

  lesson.learning_objectives = `
- Declare and initialize variables with meaningful names.
- Trace how values are overwritten in memory.
- Avoid variable name typos that crash applications.
`;

  lesson.beginner_explanation = `
Think of a variable as a labeled storage bin. You write a name on the sticky note, place a value inside, and look it up by its name whenever you need it.
`;

  lesson.detailed_concept = `
When you declare a variable, the computer reserves a small block of memory space (typically 4 or 8 bytes in Stack memory for numbers) and binds your variable name to that memory address in the compiler's Symbol Table.
`;

  lesson.internal_working = `
During execution, when Python reads a variable's label, it looks up the address in the symbol table, reads the binary data at that address, and pushes it to CPU registers for calculation.
`;

  lesson.syntax_breakdown = `
In Python, you declare a variable by writing the name, followed by an equals sign (\`=\`), and the value:
- **Variable Name**: Must start with a letter or underscore (e.g., \`student_marks\`).
- **Assignment Operator**: The single equals sign (\`=\`) tells the computer to store the value on the right into the box on the left.
- **Value**: The data you want to store (e.g., \`85\`).
`;

  lesson.visual_flow = `
\`\`\`text
Variable Name: student_marks  ──►  [ Memory Cell: 0x7ffd53 ]  ──►  Holds Value: 85
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Cardboard storage boxes with labels.
- **Why it fits**: You write "T-Shirts" on the box (the variable name) and put shirts inside (the value). You can replace the T-shirts with sweaters later, but the label "T-Shirts" remains.
`;

  lesson.beginner_example = `
\`\`\`python
student_marks = 85
print(student_marks)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
student_marks = 85
bonus_points = 5
total_score = student_marks + bonus_points
print(total_score)
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
def update_score(current_score, penalty):
    adjusted_score = current_score - penalty
    return adjusted_score

student_score = 95
final_result = update_score(student_score, 10)
print(final_result)
\`\`\`
`;

  lesson.production_example = `
Used in e-commerce websites like Amazon to keep track of the customer's shopping cart total in a variable named \`cart_total\`.
`;

  lesson.line_by_line = `
1. The computer allocates a memory cell named \`student_marks\`.
2. The integer value \`85\` is written into that memory cell.
3. The computer retrieves the value from \`student_marks\` and prints it.
`;

  lesson.common_mistakes = `
### The Typo Bug
\`\`\`python
student_marks = 85
print(student_maarks)  # Raises NameError!
\`\`\`
*Why it fails*: The computer searches the symbol table for \`student_maarks\` and cannot find it, causing a crash.
`;

  lesson.best_practices = `
- Use clear, descriptive snake_case names (e.g., \`user_age\`, not \`ua\`).
- Never name variables with generic letters like \`x\` or \`y\` unless writing math functions.
- Keep variable scope as narrow as possible.
`;

  lesson.performance = `
Reading from a variable is an O(1) operation because the computer maps the name directly to a memory address.
`;

  lesson.interview_questions = `
- **Q: What is the difference between a variable declaration and initialization?**
- **A**: Declaration reserves memory and binds the name; initialization writes the first value into that memory space.
`;

  lesson.faqs = `
- **Q: Can Python variables change type?**
- **A**: Yes, Python is dynamically typed, meaning a variable can hold an integer, then a string later.
`;

  lesson.mcqs = `
### Question 1: What does the assignment operator (=) do?
- A) Compares if two values are equal
- B) Copies the value on the right into the variable container on the left
- C) Deletes a variable from memory
- D) Multiplies two variables
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
The "=" operator copies the right-hand value into the left-hand variable slot.
</details>
`;

  lesson.coding_practice = `
Create a variable named \`bank_balance\` and set its value to \`500\`.
`;

  lesson.debugging_exercises = `
Fix the NameError in this code:
\`\`\`python
user_score = 100
print(user_scor)
\`\`\`
`;

  lesson.project_ideas = `
- **Score Keeper**: Build a script that keeps track of two teams' scores using variables and outputs the leader.
`;

  lesson.summary = `
Variables are labeled memory boxes used to store data that changes over time. They make programs dynamic.
`;

  lesson.key_takeaways = `
- A variable connects a human name to a physical memory address.
- Values inside variables can be read and overwritten.
`;

  lesson.related_topics = `
- CPU Memory Management
- Symbol Tables in Compilers
`;

  lesson.next_learning_path = `
Let's learn how to create variables that CANNOT change — Constants!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "variables",
    theme: "variables",
    title: "RAM Memory Allocations",
    memory: [
      { address: "0x7ffd50", label: "system_status", value: '"active"', bytes: 8 },
      { address: "0x7ffd58", label: "student_marks", value: "85", bytes: 4 },
      { address: "0x7ffd5c", label: "bonus_points", value: "5", bytes: 4 }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "student_marks = 85",
      explanation: "The computer reserves space in RAM, names the box 'student_marks', and writes the value 85 inside.",
      memory: { student_marks: 85 }
    },
    {
      line: 2,
      code: "bonus_points = 5",
      explanation: "Another box is created in RAM, labeled 'bonus_points', and holds the value 5.",
      memory: { student_marks: 85, bonus_points: 5 }
    },
    {
      line: 3,
      code: "total_score = student_marks + bonus_points",
      explanation: "The CPU looks up the values inside 'student_marks' (85) and 'bonus_points' (5), sums them (90), and writes the result to a new box 'total_score'.",
      memory: { student_marks: 85, bonus_points: 5, total_score: 90 }
    },
    {
      line: 4,
      code: "print(total_score)",
      explanation: "The computer retrieves the value 90 from 'total_score' and sends it to the screen console output.",
      memory: { student_marks: 85, bonus_points: 5, total_score: 90 },
      output: "90"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Predict the value of 'score' after this code runs:\nscore = 10\nscore = score + 5",
      options: ["10", "5", "15", "Error"],
      correct: 2,
      explanation: "First, 'score' holds 10. Then score + 5 yields 15, which overwrites the value in 'score'."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "student_marks = 85",
      explanation: "We start by saving the initial marks."
    },
    {
      step: 2,
      code: "student_marks = 85\nbonus_points = 5",
      explanation: "Next, we add the bonus points variable."
    },
    {
      step: 3,
      code: "student_marks = 85\nbonus_points = 5\ntotal_score = student_marks + bonus_points",
      explanation: "We sum both containers to calculate the total."
    },
    {
      step: 4,
      code: "student_marks = 85\nbonus_points = 5\ntotal_score = student_marks + bonus_points\nprint(total_score)",
      explanation: "Finally, we print the final score."
    }
  ]);

  return lesson;
}

module.exports = assembleVariables;

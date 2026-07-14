// ============================================================
// backend/services/lessonAssembler/python/ifStatement.js
// Handcrafted Conversational If Statements Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleIfStatements(lang) {
  const lesson = createBaseLesson();
  const isPy = lang === 'python';

  lesson.definition = `
Have you ever noticed how Netflix only lets you stream movies in 4K resolution if your account package is "Premium"?

Imagine driving a car and approaching a road intersection. You look at the traffic signal light. If the light is Green, you press the gas pedal and drive straight. If the light is Red, you press the brake pedal and stop. The light color acts as a condition that decides your immediate action path.

### ❓ The Problem
Without conditionals, programs execute linearly — running every single line of code from top to bottom. This means an application would run the checkout page payment even if the credit card was declined, or display private accounts without validating your login password first.

### 🚫 Why Old Ways Fail
If you cannot skip blocks of instructions, you cannot create interactive software. A program that does not branches paths is just a static recipe list.

### 💡 The Solution
We give the program a fork in the road. The CPU evaluates a boolean test (True or False), and skips the block of code if the test fails.

### 📖 Formal Definition
An If Statement is a control flow structure that directs code execution down different pathways depending on whether a comparison condition evaluations to True or False.
`;

  lesson.why_exists = `
If Statements enable logical decision-making pathways, allowing applications to behave differently depending on user actions or database inputs.
`;

  lesson.importance = `
They allow developers to handle error checks, validate form data, protect secure zones, and create responsive user experiences.
`;

  lesson.learning_objectives = `
- Master comparison check syntax (\`==\`, \`>\`, \`<\`, \`!=\`).
- Nest multiple alternative checks using else/elif branches.
- Avoid common mistakes like assigning values instead of comparing.
`;

  lesson.beginner_explanation = `
Think of an If Statement like a ticket gate at a cinema. If you have a ticket, the gate opens; otherwise, you stay outside.
`;

  lesson.detailed_concept = `
The CPU evaluates the comparison condition in the Arithmetic Logic Unit (ALU). If the subtraction results in zero, it updates the CPU Status Flag registers.
`;

  lesson.internal_working = `
When status flags update, the CPU executes a jump offset instruction (like \`JNE\` - Jump if Not Equal) to skip past the code block block.
`;

  lesson.syntax_breakdown = `
In Python, we check conditions using \`if\`:
- **Keyword**: \`if\` starts the check block.
- **Comparison Operator**: Uses double equals (\`==\`) to compare values.
- **Indentation**: Python groups the block code using spaces (indentation) instead of curly brackets.
`;

  lesson.visual_flow = `
\`\`\`text
         [ Check: account_status == "Premium" ]
                     │
             True ───┴─── False
              ▼            ▼
         [ Stream 4K ]   [ Stream 1080p ]
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: A path fork in the woods with direction signs.
- **Why it fits**: Depending on which sign matches your target destination, you turn left or right. You never walk down both paths simultaneously.
`;

  lesson.beginner_example = `
\`\`\`python
student_marks = 75
if student_marks >= 50:
    print("Passed")
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
student_marks = 75
if student_marks >= 80:
    print("Gold Medal")
elif student_marks >= 50:
    print("Silver Medal")
else:
    print("No Medal")
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
def process_checkout(cart_total, balance):
    if balance >= cart_total:
        print("Payment Approved!")
        return True
    else:
        print("Insufficient Funds")
        return False

process_checkout(120, 150)
\`\`\`
`;

  lesson.production_example = `
Used in login validation systems: \`if password_hash == input_hash: grant_access() else: deny_access()\`.
`;

  lesson.line_by_line = `
1. Check condition \`student_marks >= 50\` (75 >= 50 is True).
2. The program counter enters the indented block.
3. Prints "Passed" to the console.
`;

  lesson.common_mistakes = `
### The Assignment Typo
\`\`\`python
if score = 100:  # SyntaxError!
    print("Perfect score")
\`\`\`
*Why it fails*: A single \`=\` copies values. Comparison checks require double equals \`==\`.
`;

  lesson.best_practices = `
- Avoid nesting branches more than 2 levels deep (use guards instead).
- Place the most common comparison checks at the top of the block.
- Use explicit checks rather than relying on truthy/falsy implicit assumptions.
`;

  lesson.performance = `
Branch predictions inside modern CPU cores pre-fetch target branch codes to keep instruction pipelines executing fast.
`;

  lesson.interview_questions = `
- **Q: What is short-circuit evaluation in logical conditions?**
- **A**: When checking \`A and B\`, if \`A\` is False, the compiler skips checking \`B\` because the entire expression is already guaranteed to be False.
`;

  lesson.faqs = `
- **Q: What is the elif keyword?**
- **A**: It stands for "else if" and lets you check a new condition if the previous checks failed.
`;

  lesson.mcqs = `
### Question 1: Which symbol compares if two values are equal?
- A) =
- B) ==
- C) ===
- D) equal
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
The "==" comparison operator checks value equality, whereas "=" is the assignment operator.
</details>
`;

  lesson.coding_practice = `
Write a script checking if a \`temperature\` variable is greater than \`30\`.
`;

  lesson.debugging_exercises = `
Fix the syntax error in this branch:
\`\`\`python
user_score = 45
if user_score < 50
print("Failed")
\`\`\`
`;

  lesson.project_ideas = `
- **ATM Simulator**: Build a simulator that checks if balance is sufficient before withdrawing cash.
`;

  lesson.summary = `
If statements create logic branches inside code, directing execution paths based on comparison outcomes.
`;

  lesson.key_takeaways = `
- Conditions evaluate to boolean True or False.
- Skips block codes if the condition test fails.
`;

  lesson.related_topics = `
- CPU Branch Predictors
- Boolean Algebra
`;

  lesson.next_learning_path = `
Now let's learn how to repeat tasks automatically using Loops!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "ifStatement",
    theme: "ifStatement",
    title: "Logic Tree Branching",
    branches: [
      { name: "Condition check (marks >= 50)", trueBranch: "Execute indent print block", falseBranch: "Skip to line 4" }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "student_marks = 45",
      explanation: "Stores student marks in container.",
      memory: { student_marks: 45 }
    },
    {
      line: 2,
      code: "if student_marks >= 50:",
      explanation: "Evaluates check: 45 >= 50 is FALSE. The CPU prepares to skip the block.",
      memory: { student_marks: 45 }
    },
    {
      line: 3,
      code: "    print('Passed')",
      explanation: "Skipped! This instruction is not run.",
      memory: { student_marks: 45 }
    },
    {
      line: 4,
      code: "print('Done')",
      explanation: "Execution continues here naturally.",
      memory: { student_marks: 45 },
      output: "Done"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Predict the output:\nif 10 > 5:\n    print('A')\nelse:\n    print('B')",
      options: ["A", "B", "A and B", "Error"],
      correct: 0,
      explanation: "Since 10 > 5 is True, only the 'if' block is run, printing 'A'."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "student_marks = 75",
      explanation: "Define the score we want to validate."
    },
    {
      step: 2,
      code: "student_marks = 75\nif student_marks >= 50:",
      explanation: "Add the logical gate statement."
    },
    {
      step: 3,
      code: "student_marks = 75\nif student_marks >= 50:\n    print('Passed!')",
      explanation: "Add the code that runs only if the condition passes."
    }
  ]);

  return lesson;
}

module.exports = assembleIfStatements;

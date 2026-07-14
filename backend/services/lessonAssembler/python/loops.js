// ============================================================
// backend/services/lessonAssembler/python/loops.js
// Handcrafted Conversational Loops Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleLoops(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever tried copy-pasting a line of code 100 times, only to realize you needed to change a single letter in every single line?

Imagine doing jumping jacks during sports practice. The coach yells: "Do jumping jacks until you reach 10." You perform one, increment your internal counter to 1, check if you hit 10 (No), perform another, increment to 2, check again, and repeat the cycle until the counter reaches 10. Once you hit 10, you stop and rest.

### ❓ The Problem
If a computer needs to display 10,000 products on an e-commerce page, duplicating the visual rendering code 10,000 times would create a massive file size that crashes the server. Furthermore, if the inventory database changes dynamically, hardcoded code cannot adapt.

### 🚫 Why Old Ways Fail
Copy-pasting statements creates bloated, unmaintainable systems. If you find a bug in one copy, you must fix it in all 10,000 duplicates.

### 💡 The Solution
We write the instructions once, set up a loop counter variable, and tell the program instruction register to jump backward to the top of the block as long as the loop condition remains True.

### 📖 Formal Definition
A loop is a control flow structure that repeatedly executes a block of code while a specified boolean condition evaluates to True.
`;

  lesson.why_exists = `
Loops allow programs to process large, dynamic datasets (like database rows or lists) using only a few lines of code.
`;

  lesson.importance = `
They remove repetitive operations, making programs maintainable and responsive to variable quantities of input.
`;

  lesson.learning_objectives = `
- Differentiate between "for" loops and "while" loops.
- Master loop counter increments and exit bounds.
- Avoid the infinite loop trap that hangs CPU resources.
`;

  lesson.beginner_explanation = `
Think of a loop like running laps on a track. You run the loop, add 1 to your lap count, check if you are finished, and repeat if not.
`;

  lesson.detailed_concept = `
The compiler generates a conditional jump command pointing back to an earlier instruction offset. If the condition remains True, the code execution flow loops backward.
`;

  lesson.internal_working = `
The CPU uses registers to hold the loop counter value. After each cycle, it updates the register, compares it to the boundary check, and branches.
`;

  lesson.syntax_breakdown = `
In Python, we declare a loop using \`for\` and \`range()\`:
- **Keyword**: \`for\` initializes the loop mapping.
- **Iterator Variable**: Keeps track of the current step value (e.g., \`lap\`).
- **Range Function**: \`range(1, 4)\` generates the step boundary sequence [1, 2, 3].
`;

  lesson.visual_flow = `
\`\`\`text
      ┌──► [ Execute Loop Instructions ]
      │             │
      │       [ Increment Counter ]
      │             │
      └─ True ───┴─── Is Counter < 4? ─── False ───► [ Exit Loop ]
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Playlist tracks playback loop.
- **Why it fits**: Spotify plays song 1, checks if there is another song (Yes), plays song 2, and repeats until the queue is empty.
`;

  lesson.beginner_example = `
\`\`\`python
for lap in range(1, 4):
    print("Lap", lap)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
lap = 1
while lap <= 3:
    print("Running lap:", lap)
    lap += 1
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
def apply_discounts(prices_list):
    for idx in range(len(prices_list)):
        prices_list[idx] *= 0.9  # Deduct 10%
    return prices_list

prices = [100, 200, 300]
print(apply_discounts(prices))
\`\`\`
`;

  lesson.production_example = `
Used in web apps to parse files line-by-line, or render elements inside cards dynamically.
`;

  lesson.line_by_line = `
1. Initialize \`lap = 1\`. Condition \`lap < 4\` is True. Prints "Lap 1".
2. Increment \`lap\` to 2. Condition \`2 < 4\` is True. Prints "Lap 2".
3. Increment \`lap\` to 3. Condition \`3 < 4\` is True. Prints "Lap 3".
4. Increment \`lap\` to 4. Condition \`4 < 4\` is False. Exit loop.
`;

  lesson.common_mistakes = `
### The Infinite Loop
\`\`\`python
lap = 1
while lap <= 3:
    print("Lap", lap)
    # Missing: lap += 1!
\`\`\`
*Why it fails*: The value of \`lap\` stays at 1 forever, causing the loop to run indefinitely and locking up the system CPU.
`;

  lesson.best_practices = `
- Make sure loop boundary conditions are guaranteed to eventually become False.
- Avoid nesting loops inside loops where possible (leads to slow O(N^2) complexity).
- Use descriptive names for iterator variables instead of single letters like \`i\`.
`;

  lesson.performance = `
Time complexity scales linearly with the size of the collection: O(N).
`;

  lesson.interview_questions = `
- **Q: What is the difference between break and continue?**
- **A**: \`break\` exits the loop immediately; \`continue\` skips the rest of the current iteration and jumps to the next cycle check.
`;

  lesson.faqs = `
- **Q: When should I use a while loop vs a for loop?**
- **A**: Use \`for\` when you know the total steps beforehand; use \`while\` when you must repeat until a specific event occurs.
`;

  lesson.mcqs = `
### Question 1: What is the risk of forgetting to increment a while loop counter?
- A) The program runs faster
- B) It creates an infinite loop that crashes the system
- C) It deletes variables
- D) The loop is skipped completely
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
Without incrementing the counter, the loop condition remains True forever, creating an infinite loop.
</details>
`;

  lesson.coding_practice = `
Write a loop printing numbers from \`1\` to \`5\`.
`;

  lesson.debugging_exercises = `
Fix the infinite loop bug:
\`\`\`python
index = 5
while index > 0:
    print(index)
    # Fix needed here
\`\`\`
`;

  lesson.project_ideas = `
- **Countdown Alarm**: Build a script that counts down from 10 to 1, then triggers an alarm print statement.
`;

  lesson.summary = `
Loops repeat code blocks dynamically based on exit checks. They are crucial for handling lists and datasets.
`;

  lesson.key_takeaways = `
- Loops run instructions repeatedly using condition gates.
- Always guarantee that the exit boundary will be reached.
`;

  lesson.related_topics = `
- Recursion vs Iteration
- Algorithmic Complexity O(N)
`;

  lesson.next_learning_path = `
Now let's learn how to pack logic blocks into reusable boxes using Functions!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "loops",
    theme: "loops",
    title: "Loop Iterations Mapping",
    iterations: [
      { step: 1, counter: "lap = 1", check: "1 <= 3 (True)", output: '"Lap 1"' },
      { step: 2, counter: "lap = 2", check: "2 <= 3 (True)", output: '"Lap 2"' },
      { step: 3, counter: "lap = 3", check: "3 <= 3 (True)", output: '"Lap 3"' },
      { step: 4, counter: "lap = 4", check: "4 <= 3 (False)", output: "Exit Loop" }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "lap = 1",
      explanation: "Initialize loop counter 'lap' to 1.",
      memory: { lap: 1 }
    },
    {
      line: 2,
      code: "while lap <= 3:",
      explanation: "Check: Is 1 <= 3? Yes (True). Enter loop body.",
      memory: { lap: 1 }
    },
    {
      line: 3,
      code: "    print('Lap', lap)",
      explanation: "Sends 'Lap 1' to the console output.",
      memory: { lap: 1 },
      output: "Lap 1"
    },
    {
      line: 4,
      code: "    lap += 1",
      explanation: "Increments 'lap' by 1. The value changes from 1 to 2.",
      memory: { lap: 2 }
    },
    {
      line: 2,
      code: "while lap <= 3:",
      explanation: "Check again: Is 2 <= 3? Yes (True). Enter loop body.",
      memory: { lap: 2 }
    },
    {
      line: 3,
      code: "    print('Lap', lap)",
      explanation: "Sends 'Lap 2' to the console output.",
      memory: { lap: 2 },
      output: "Lap 2"
    },
    {
      line: 4,
      code: "    lap += 1",
      explanation: "Increments 'lap'. The value changes from 2 to 3.",
      memory: { lap: 3 }
    },
    {
      line: 2,
      code: "while lap <= 3:",
      explanation: "Check: Is 3 <= 3? Yes (True). Enter loop body.",
      memory: { lap: 3 }
    },
    {
      line: 3,
      code: "    print('Lap', lap)",
      explanation: "Sends 'Lap 3' to the console output.",
      memory: { lap: 3 },
      output: "Lap 3"
    },
    {
      line: 4,
      code: "    lap += 1",
      explanation: "Increments 'lap'. The value changes from 3 to 4.",
      memory: { lap: 4 }
    },
    {
      line: 2,
      code: "while lap <= 3:",
      explanation: "Check: Is 4 <= 3? No (False). Exit loop body.",
      memory: { lap: 4 }
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "What values does range(1, 4) produce in Python?",
      options: ["1, 2, 3, 4", "1, 2, 3", "2, 3, 4", "1, 4"],
      correct: 1,
      explanation: "Python's range(start, stop) excludes the stop value, producing 1, 2, and 3."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "lap = 1",
      explanation: "Initialize our iteration counter."
    },
    {
      step: 2,
      code: "lap = 1\nwhile lap <= 3:",
      explanation: "Setup the conditional loop boundary check."
    },
    {
      step: 3,
      code: "lap = 1\nwhile lap <= 3:\n    print('Lap:', lap)",
      explanation: "Add code inside the loop to report our lap status."
    },
    {
      step: 4,
      code: "lap = 1\nwhile lap <= 3:\n    print('Lap:', lap)\n    lap += 1",
      explanation: "Add the counter increment step to avoid getting stuck in an infinite loop."
    }
  ]);

  return lesson;
}

module.exports = assembleLoops;

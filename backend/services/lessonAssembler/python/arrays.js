// ============================================================
// backend/services/lessonAssembler/python/arrays.js
// Handcrafted Conversational Arrays/Lists Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleArrays(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever tried writing a program that stores your shopping list, only to realize you had to declare a separate variable for every single item?

Imagine a large egg carton. Instead of having separate boxes scattered all over your kitchen, you have one single cardboard structure containing 12 individual cups side-by-side. Each cup has a specific number index starting from 0, allowing you to quickly grab or replace any egg.

### ❓ The Problem
If a shopping site lists 100 items, writing:
\`\`\python
item1 = "Eggs"
item2 = "Milk"
item3 = "Bread"
\`\`\`
makes sorting, searching, or iterating through them impossible. You cannot loop over these individual variable names dynamically.

### 🚫 Why Old Ways Fail
Individual variables scatter references in different memory slots. Without an index system, you cannot tell the CPU to "go fetch the next item" automatically.

### 💡 The Solution
We bundle elements together in a contiguous memory block called an array (or list). The block has one name, and items inside are accessed via their numerical indexes.

### 📖 Formal Definition
An array (known as a list in Python) is a structured collection of elements stored sequentially in memory, where each item can be accessed using a numeric index starting from 0.
`;

  lesson.why_exists = `
Arrays let programs store, organize, and sort related items in a single structure, allowing loops to iterate through them.
`;

  lesson.importance = `
They provide instant index-based lookups and form the baseline for all complex data structures like stacks and queues.
`;

  lesson.learning_objectives = `
- Declare lists and add/remove elements.
- Retrieve elements using numeric indexes.
- Trace how lists are stored in memory.
`;

  lesson.beginner_explanation = `
Think of an array like a train. The train has a single name, but it has multiple passenger cars numbered starting from 0.
`;

  lesson.detailed_concept = `
The computer allocates a contiguous chunk of memory. The array variable points to the start address, and indexes determine offsets.
`;

  lesson.internal_working = `
To find the element at index 2, the computer calculates: \`Start Address + (Index * Item Size in Bytes)\` to jump directly to the target memory slot.
`;

  lesson.syntax_breakdown = `
In Python, we declare lists using square brackets \`[]\`:
- **Brackets**: Define the list container.
- **Comma Separation**: Splits individual elements (e.g., \`["Eggs", "Milk"]\`).
- **Index Lookup**: Accessed using brackets after name (e.g., \`shopping_list[0]\`).
`;

  lesson.visual_flow = `
\`\`\`text
List Name: shopping_list  ──►  [ Index 0: "Eggs" ] ──► [ Index 1: "Milk" ] ──► [ Index 2: "Bread" ]
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Labeled post office boxes.
- **Why it fits**: One wall of boxes (the list name) where each box has a number (the index) containing letters (the values).
`;

  lesson.beginner_example = `
\`\`\`python
shopping_list = ["Eggs", "Milk", "Bread"]
print(shopping_list[0])
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
shopping_list = ["Eggs", "Milk"]
shopping_list.append("Bread")
print(shopping_list)
print("Total items:", len(shopping_list))
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
def find_expensive_items(item_prices):
    expensive = []
    for price in item_prices:
        if price > 50:
            expensive.append(price)
    return expensive

prices = [10, 85, 20, 150]
print(find_expensive_items(prices))
\`\`\`
`;

  lesson.production_example = `
Used in database fetch listings to map row elements in rows grids on profiles.
`;

  lesson.line_by_line = `
1. Allocate list named \`shopping_list\` containing three items.
2. Index 0 references "Eggs".
3. Prints "Eggs" to console output.
`;

  lesson.common_mistakes = `
### Index Out of Range Error
\`\`\`python
shopping_list = ["Eggs", "Milk"]
print(shopping_list[2])  # IndexError!
\`\`\`
*Why it fails*: The list only has index 0 and 1. Requesting index 2 accesses memory outside boundaries.
`;

  lesson.best_practices = `
- Keep array items of the same data type for predictable performance.
- Never hardcode index offsets without validating the array's length first.
- Use built-in iterators instead of manual counter offsets.
`;

  lesson.performance = `
- Access: O(1) constant time lookup via offsets.
- Insert/Delete at start: O(N) because subsequent items must shift left or right.
`;

  lesson.interview_questions = `
- **Q: Why are arrays 0-indexed?**
- **A**: The index represents the offset (distance) from the start memory address. The first element is at distance 0.
`;

  lesson.faqs = `
- **Q: Python list vs Array?**
- **A**: Python lists can resize dynamically and hold different data types; traditional arrays are fixed-size and single-type.
`;

  lesson.mcqs = `
### Question 1: What is the offset distance of the first element in an array?
- A) 1
- B) 0
- C) -1
- D) Variable
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
The first element is located exactly at the start address (offset distance 0).
</details>
`;

  lesson.coding_practice = `
Create a list named \`marks\` containing \`80, 90, 75\`.
`;

  lesson.debugging_exercises = `
Fix the IndexError:
\`\`\`python
scores = [95, 80]
print(scores[2])
\`\`\`
`;

  lesson.project_ideas = `
- **Task List Planner**: Build a terminal planner that appends and removes items from a tasks array.
`;

  lesson.summary = `
Arrays organize collections of data in indexed memory blocks, enabling lookup speeds and simple iteration loops.
`;

  lesson.key_takeaways = `
- Indices represent memory address offsets.
- Fast O(1) lookups but costly insertions.
`;

  lesson.related_topics = `
- Dynamic Arrays
- Memory Offsets Calculations
`;

  lesson.next_learning_path = `
Now let's learn how to pack data and logic into blueprints using Classes!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "arrays",
    theme: "arrays",
    title: "Contiguous RAM Slots",
    memory: [
      { address: "0x00A0", label: "shopping_list[0]", value: '"Eggs"', bytes: 8 },
      { address: "0x00A8", label: "shopping_list[1]", value: '"Milk"', bytes: 8 },
      { address: "0x00B0", label: "shopping_list[2]", value: '"Bread"', bytes: 8 }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: 'shopping_list = ["Eggs", "Milk"]',
      explanation: "Reserves contiguous memory and writes two values.",
      memory: { shopping_list: ["Eggs", "Milk"] }
    },
    {
      line: 2,
      code: 'shopping_list.append("Bread")',
      explanation: "Appends 'Bread' to the end of the list at index 2.",
      memory: { shopping_list: ["Eggs", "Milk", "Bread"] }
    },
    {
      line: 3,
      code: "print(shopping_list[2])",
      explanation: "Looks up index 2 (offset 2) and prints 'Bread'.",
      memory: { shopping_list: ["Eggs", "Milk", "Bread"] },
      output: "Bread"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "If an array has 5 elements, what is the index of the last element?",
      options: ["5", "4", "0", "6"],
      correct: 1,
      explanation: "Since indices start at 0, a 5-element array has indices 0, 1, 2, 3, and 4."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: 'shopping_list = ["Eggs"]',
      explanation: "Start list with one item."
    },
    {
      step: 2,
      code: 'shopping_list = ["Eggs", "Milk"]',
      explanation: "Add another item."
    },
    {
      step: 3,
      code: 'shopping_list = ["Eggs", "Milk"]\nprint(shopping_list[0])',
      explanation: "Read the first item using index 0."
    }
  ]);

  return lesson;
}

module.exports = assembleArrays;

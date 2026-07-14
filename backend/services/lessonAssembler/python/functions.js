// ============================================================
// backend/services/lessonAssembler/python/functions.js
// Handcrafted Conversational Functions Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleFunctions(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever used a coffee machine? You do not rebuild the boiler, clean the filter, and assemble the heating elements every single time you want a warm cup of coffee.

Instead, you press a button and supply inputs (like water and coffee beans). The machine executes its internal recipe behind the scenes and pours out your hot cup of espresso. You interact with a simple button interface, while the complex mechanics are packaged away safely.

### ❓ The Problem
Imagine you are building a billing system. You write a 15-line mathematical calculation to estimate local tax rates and transaction fees. If your site processes checkouts in 20 different places, copy-pasting those 15 lines of code everywhere makes your program extremely long and messy. If the tax rate updates next year, you must manually edit all 20 locations, risking typos.

### 🚫 Why Old Ways Fail
Duplicate calculations violate dry principles (Don't Repeat Yourself). The more copy-pasted code you have, the more bugs you will introduce when requirements change.

### 💡 The Solution
We bundle the 15 lines of tax calculation logic into a named "logical machine" called a function. We can run (invoke) this machine from anywhere in our program by referencing its name, passing input data, and catching the result.

### 📖 Formal Definition
A function is a packaged, named block of reusable statements designed to carry out a specific operation when called, often taking parameters as inputs and returning a computed output.
`;

  lesson.why_exists = `
Functions eliminate duplicate statements, separate logical tasks into clean modules, and contain local scopes protecting variables.
`;

  lesson.importance = `
They allow developers to build complex applications by composing small, independent, testable building blocks.
`;

  lesson.learning_objectives = `
- Declare functions using custom parameters.
- Pass parameters and catch returned results.
- Understand Call Stack memory allocation during execution.
`;

  lesson.beginner_explanation = `
Think of a function as a reusable code machine. You feed it raw inputs, it executes its internal steps, and it returns a finished product.
`;

  lesson.detailed_concept = `
When a function is called, the program suspends the current routine and allocates a new Stack Frame memory space on top of the Call Stack.
`;

  lesson.internal_working = `
The Stack Frame contains parameter values and local variables. When the function returns a value, the frame is popped from the stack, and memory is reclaimed.
`;

  lesson.syntax_breakdown = `
In Python, we declare a function using \`def\`:
- **Keyword**: \`def\` tells Python we are defining a function.
- **Function Name**: Follows variables naming rules (e.g., \`calculate_tax\`).
- **Parameters**: Inputs listed inside parentheses (e.g., \`subtotal\`).
- **Return Keyword**: Sends the final calculated value back to the caller.
`;

  lesson.visual_flow = `
\`\`\`text
Inputs (Price)  ──►  [ calculate_tax() machine ]  ──►  Output (Tax value)
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Reusable juice blender.
- **Why it fits**: You put fruit inside (inputs), press the blend button (invoke), it blends them (executes instructions), and pours out juice (returns value). You don't buy a new blender for every cup.
`;

  lesson.beginner_example = `
\`\`\`python
def calculate_tax(price):
    return price * 0.05

tax = calculate_tax(100)
print(tax)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
def get_invoice(price, discount):
    subtotal = price - discount
    tax = subtotal * 0.05
    return subtotal + tax

final_bill = get_invoice(100, 10)
print("Invoice Total:", final_bill)
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
def process_checkout(cart_total, user_balance):
    def apply_tax(subtotal):
        return subtotal * 1.05

    final_total = apply_tax(cart_total)
    if user_balance >= final_total:
        return final_total
    return 0

checkout_bill = process_checkout(100, 120)
print("Checkout processed:", checkout_bill)
\`\`\`
`;

  lesson.production_example = `
Used in web applications for password checks: \`verify_credentials(username, password)\` hides hashing complexities from login pages.
`;

  lesson.line_by_line = `
1. Compiler registers function name \`calculate_tax\`.
2. Code triggers call passing \`100\` as \`price\` argument.
3. System allocates stack frame, calculates \`100 * 0.05 = 5\`.
4. Returns \`5\`, deletes stack frame, prints result.
`;

  lesson.common_mistakes = `
### Missing Return Statement
\`\`\`python
def add(a, b):
    result = a + b
    # Forgot return!

total = add(10, 5)
print(total)  # Prints None!
\`\`\`
*Why it fails*: If you do not write \`return\`, Python returns the placeholder \`None\` by default.
`;

  lesson.best_practices = `
- Follow the Single Responsibility Principle: each function should perform exactly one task.
- Keep parameter lists short (ideally 3 or fewer inputs).
- Name functions using active verbs (e.g., \`fetch_user_profile\`, not \`user_profile\`).
`;

  lesson.performance = `
Stack frame allocation is extremely fast, but deep nested recursions can consume memory and cause stack overflows.
`;

  lesson.interview_questions = `
- **Q: What is a Stack Overflow?**
- **A**: It occurs when a function calls itself infinitely, filling the Call Stack memory frames beyond limit.
`;

  lesson.faqs = `
- **Q: What is scope?**
- **A**: Scope is the boundary where a variable lives. Variables defined inside a function are local to it.
`;

  lesson.mcqs = `
### Question 1: What does a function return if the return statement is omitted in Python?
- A) 0
- B) True
- C) None
- D) An Error
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: C</strong>
Omitting return causes Python to return None.
</details>
`;

  lesson.coding_practice = `
Write a function named \`greet_user\` that returns the string \`"Welcome!"\`.
`;

  lesson.debugging_exercises = `
Fix the missing return bug:
\`\`\`python
def double_value(num):
    doubled = num * 2
    # missing line here

print(double_value(10))
\`\`\`
`;

  lesson.project_ideas = `
- **Calculator Utility**: Build a script with individual functions for addition, subtraction, and multiplication.
`;

  lesson.summary = `
Functions package code logic into reusable blocks, reducing code duplication and separating scopes.
`;

  lesson.key_takeaways = `
- Define once, call from anywhere.
- Scoping insulates local variables from global changes.
`;

  lesson.related_topics = `
- Memory Stack Frames
- Recursion & Call Stacks
`;

  lesson.next_learning_path = `
Now let's learn how to store collections of variables in a single list using Arrays!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "functions",
    theme: "functions",
    title: "Call Stack Frames",
    stack: [
      { level: 2, function: "calculate_tax(price=100)", locals: { price: 100 } },
      { level: 1, function: "main()", locals: { total_bill: "..." } }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "def calculate_tax(price):",
      explanation: "Compiler registers function definition. It is not executed yet.",
      memory: {}
    },
    {
      line: 4,
      code: "tax = calculate_tax(100)",
      explanation: "Main execution calls calculate_tax. A stack frame is created with price=100.",
      memory: { "Stack Frame (calculate_tax)": { price: 100 } }
    },
    {
      line: 2,
      code: "    return price * 0.05",
      explanation: "Calculates 100 * 0.05 = 5. Ready to send this value back.",
      memory: { "Stack Frame (calculate_tax)": { price: 100 } }
    },
    {
      line: 4,
      code: "tax = calculate_tax(100)",
      explanation: "Return value 5 is assigned to 'tax'. The stack frame is deleted.",
      memory: { tax: 5 }
    },
    {
      line: 5,
      code: "print(tax)",
      explanation: "Prints the value of tax (5) to the console.",
      memory: { tax: 5 },
      output: "5"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which keyword sends computed values back to where a function was called?",
      options: ["give", "send", "return", "output"],
      correct: 2,
      explanation: "The 'return' statement exits the function and passes the result back."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "def calculate_tax(price):",
      explanation: "Define the function statement and parameters."
    },
    {
      step: 2,
      code: "def calculate_tax(price):\n    return price * 0.05",
      explanation: "Write the body calculating and returning the value."
    },
    {
      step: 3,
      code: "def calculate_tax(price):\n    return price * 0.05\n\ntax = calculate_tax(100)",
      explanation: "Call the function passing the argument and storing the output."
    }
  ]);

  return lesson;
}

module.exports = assembleFunctions;

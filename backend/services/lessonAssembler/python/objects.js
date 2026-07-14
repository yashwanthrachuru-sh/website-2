// ============================================================
// backend/services/lessonAssembler/python/objects.js
// Handcrafted Conversational Objects Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleObjects(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever used a physical mold to shape clay? The plastic mold is just a shape template, but the clay figures you press out are real physical objects that you can hold.

You can press out a red clay star, a blue clay star, or a yellow clay star. Each star has the exact same dimensions defined by the mold, but each star has its own physical properties like color and weight.

### ❓ The Problem
In programming, templates are not enough. A class is just a design document. If your video game has a blueprint for a "Monster", the game cannot fight a blueprint. The game needs 50 real physical monsters running around the map, each with its own coordinates and remaining health.

### 🚫 Why Old Ways Fail
Relying on abstract plans does not store actual game state. Real game execution requires actual allocations of memory spaces to hold changing values.

### 💡 The Solution
We instantiate the class. By calling the class name, the compiler requests a unique chunk of memory in the Heap to hold the state of one individual monster object.

### 📖 Formal Definition
An object is a self-contained instance of a class that holds concrete values in memory and can execute behaviors defined by its blueprint template.
`;

  lesson.why_exists = `
Objects represent real entities (like users, buttons, or database records) in computer memory, bundling state variables and actions.
`;

  lesson.importance = `
They allow multiple distinct instances of the same structural template to exist in a program without interfering with each other's parameters.
`;

  lesson.learning_objectives = `
- Instantiate objects from class templates.
- Update object properties dynamically.
- Understand Heap memory allocation and pointer references.
`;

  lesson.beginner_explanation = `
Think of an object as a physical item built from blueprint plans. The plan is the class; the physical object is the item you use.
`;

  lesson.detailed_concept = `
Unlike variables stored directly on the Stack, objects are allocated in Heap memory because their sizes can grow dynamically.
`;

  lesson.internal_working = `
When you write \`obj = Class()\`, the variable \`obj\` on the Stack does not hold the actual data. It holds a memory pointer address pointing to the object's Heap coordinate.
`;

  lesson.syntax_breakdown = `
To instantiate and modify an object in Python:
- **Instantiation**: Call the class like a function (e.g., \`user = User()\`).
- **Dot Notation**: Access fields or methods using a period (e.g., \`user.name = "Alice"\`).
`;

  lesson.visual_flow = `
\`\`\`text
Stack Pointer Variable [ user_ref ] ──► Points to Address 0x0A00 in Heap ──► [ Name: "Alice" ]
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Baking cookies from a cutter.
- **Why it fits**: The cookie cutter is the class; each baked cookie is a real object instance. Some cookies have chocolate chips, others have sprinkles, but they all share the cookie form.
`;

  lesson.beginner_example = `
\`\`\`python
class User:
    pass

user_obj = User()
user_obj.name = "Alice"
print(user_obj.name)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
class User:
    def __init__(self, username):
        self.username = username
        self.points = 0

user1 = User("Alice")
user2 = User("Bob")
user1.points += 10
print(user1.username, "Points:", user1.points)
print(user2.username, "Points:", user2.points)
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def transfer(self, target_account, amount):
        if self.balance >= amount:
            self.balance -= amount
            target_account.deposit(amount)

alice_acc = BankAccount("Alice", 1000)
bob_acc = BankAccount("Bob", 500)
alice_acc.transfer(bob_acc, 200)
print(alice_acc.owner, "Balance:", alice_acc.balance)
print(bob_acc.owner, "Balance:", bob_acc.balance)
\`\`\`
`;

  lesson.production_example = `
Used in web servers to map incoming HTTP request details into a request object instance containing parameters.
`;

  lesson.line_by_line = `
1. Create a Stack reference named \`user1\`.
2. Allocate Heap space for \`User("Alice")\` at address \`0x0A00\`.
3. Set index \`user1\` value to \`0x0A00\`.
4. Read properties via \`0x0A00\` lookup and print values.
`;

  lesson.common_mistakes = `
### Sharing Instance State
\`\`\`python
class User:
    shared_data = [] # Class-level shared variable!

u1 = User()
u2 = User()
u1.shared_data.append("Alice's file")
print(u2.shared_data) # Prints ["Alice's file"]!
\`\`\`
*Why it fails*: Variables declared directly in the class are shared. Use constructors (\`__init__\`) to insulate individual object states.
`;

  lesson.best_practices = `
- Keep instance properties insulated inside constructors.
- Access object variables using accessor methods (getters/setters) rather than updating values directly.
- Clear references when objects are no longer needed to assist garbage collection.
`;

  lesson.performance = `
Dereferencing object pointers through Heap lookups is fast, but excessive objects creation can trigger garbage collection pauses.
`;

  lesson.interview_questions = `
- **Q: What is a pointer reference in object instantiations?**
- **A**: The variable on the Stack does not contain the object's data; it contains the memory address of the Heap coordinate where the object is stored.
`;

  lesson.faqs = `
- **Q: What is garbage collection?**
- **A**: The automated system that scans Heap memory, identifies objects that no longer have stack pointers referencing them, and deletes them.
`;

  lesson.mcqs = `
### Question 1: Where are object instances stored in memory?
- A) The Stack
- B) The Heap
- C) CPU Cache Registers
- D) The Hard Drive
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
Object instances reside in Heap memory to support dynamic sizing, while pointers live on the Stack.
</details>
`;

  lesson.coding_practice = `
Instantiate an object of a class named \`User\` and assign it to a variable named \`account\`.
`;

  lesson.debugging_exercises = `
Fix the object reference error:
\`\`\`python
class User:
    def __init__(self, username):
        self.username = username

user = User("Alice")
print(username) # Fix: print user.username
\`\`\`
`;

  lesson.project_ideas = `
- **Inventory Simulator**: Build an inventory program that models library books as objects with deposit/withdraw actions.
`;

  lesson.summary = `
Objects are active instances created from classes that house variables and actions inside Heap memory coordinates.
`;

  lesson.key_takeaways = `
- Objects hold distinct instance properties.
- Stack stores pointer addresses; Heap stores actual object values.
`;

  lesson.related_topics = `
- Heap Memory Allocation
- Garbage Collection Operations
`;

  lesson.next_learning_path = `
Let's learn how databases handle complex links between tables using SQL JOIN!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "objects",
    theme: "objects",
    title: "Stack Pointers & Heap Blocks",
    stack: [
      { label: "user1 (Stack)", value: "Points to Heap: 0x0A00" },
      { label: "user2 (Stack)", value: "Points to Heap: 0x0B00" }
    ],
    heap: [
      { address: "0x0A00", label: "User instance (Alice)", properties: { username: '"Alice"', points: 10 } },
      { address: "0x0B00", label: "User instance (Bob)", properties: { username: '"Bob"', points: 0 } }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: 'user1 = User("Alice")',
      explanation: "Pushes user1 to the Stack, pointing to address 0x0A00 on the Heap containing username='Alice'.",
      memory: { Stack: { user1: "0x0A00" }, Heap: { "0x0A00": { username: "Alice", points: 0 } } }
    },
    {
      line: 2,
      code: "user1.points += 10",
      explanation: "Looks up pointer 0x0A00 and updates the points attribute in Heap storage.",
      memory: { Stack: { user1: "0x0A00" }, Heap: { "0x0A00": { username: "Alice", points: 10 } } }
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "If u1 and u2 point to the same Heap address, what happens to u2 when we change u1's properties?",
      options: ["Nothing", "u2 updates as well because they reference the same memory slot", "An error is thrown", "u2 is deleted"],
      correct: 1,
      explanation: "Since both variables share the same pointer address, any modifications through either reference update the shared Heap object."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "class User:\n    pass",
      explanation: "Define our structural design blueprint."
    },
    {
      step: 2,
      code: "class User:\n    pass\n\nuser = User()",
      explanation: "Instantiate an active object in Heap memory."
    },
    {
      step: 3,
      code: 'class User:\n    pass\n\nuser = User()\nuser.name = "Alice"',
      explanation: "Assign custom properties using dot notation."
    }
  ]);

  return lesson;
}

module.exports = assembleObjects;

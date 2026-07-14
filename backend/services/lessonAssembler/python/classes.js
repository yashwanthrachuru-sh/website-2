// ============================================================
// backend/services/lessonAssembler/python/classes.js
// Handcrafted Conversational Classes Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleClasses(lang) {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever looked at an architectural blueprint for a housing complex? The blueprint is not a real house — it is just a paper plan.

However, builders use that single blueprint to build 50 real physical houses. Each physical house is constructed exactly according to the blueprint plans, but each house can have different family members, wall paint colors, or furniture inside.

### ❓ The Problem
Imagine keeping track of user profiles in a video game. Each player has a \`username\`, a \`score\`, and needs to be able to \`level_up()\`. If you use simple variables or dictionaries:
\`\`\python
player1_name = "Alice"
player1_score = 100
player2_name = "Bob"
player2_score = 150
\`\`\`
It becomes extremely messy to group data and functions together. If you update how leveling up works, you must rewrite the code for every individual player.

### 🚫 Why Old Ways Fail
Scattering user parameters in isolated variables leaves no structural bond. There is no unified template template to guarantee all user records have the same attributes.

### 💡 The Solution
We write a single class blueprint. It defines what attributes (variables) and methods (functions) a player has. Then, we create (instantiate) as many real player objects as we need from that blueprint.

### 📖 Formal Definition
A class is a user-defined blueprint or template that groups attributes (data variables) and methods (functional procedures) together into a single package. An object is a real instance created from that blueprint.
`;

  lesson.why_exists = `
Classes organize code structures by modeling real-world objects, supporting logic grouping, reuse, and encapsulation.
`;

  lesson.importance = `
They allow developers to maintain large codebases by decoupling data shapes from execution workflows.
`;

  lesson.learning_objectives = `
- Write class blueprints using custom parameters.
- Instantiate objects and access fields.
- Master the purpose of the constructor method \`__init__\`.
`;

  lesson.beginner_explanation = `
Think of a class as an cookie cutter. The cookie cutter is the blueprint; the real cookies you bake and eat are the objects.
`;

  lesson.detailed_concept = `
The class template lives in static code memory. When you instantiate an object, the program allocates space on the Heap memory to hold that instance's unique attributes.
`;

  lesson.internal_working = `
The constructor method \`__init__\` executes, binding values to the new instance space using the self reference address pointers.
`;

  lesson.syntax_breakdown = `
In Python, we declare a class using \`class\`:
- **Keyword**: \`class\` starts definition scopes.
- **Constructor**: \`__init__\` sets up initial variables.
- **Self Parameter**: Represents the specific instance address being created.
`;

  lesson.visual_flow = `
\`\`\`text
[ Blueprint: Class User ]  ──►  Instantiate ──► [ Object instance: Alice ]
                                           ──► [ Object instance: Bob ]
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Car blueprint vs physical cars.
- **Why it fits**: The drawing plan (class) lists fields like \`color\` and procedures like \`drive()\`. The factory uses it to build red cars and blue cars (objects) that drive on real roads.
`;

  lesson.beginner_example = `
\`\`\`python
class User:
    def __init__(self, name):
        self.name = name

user1 = User("Alice")
print(user1.name)
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`python
class Player:
    def __init__(self, username, score):
        self.username = username
        self.score = score

    def level_up(self):
        self.score += 50

p1 = Player("Alice", 100)
p1.level_up()
print(p1.username, "Score:", p1.score)
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`python
class ShoppingCart:
    def __init__(self, customer_name):
        self.customer_name = customer_name
        self.items = []

    def add_item(self, item, price):
        self.items.append({"name": item, "price": price})

    def get_total(self):
        total = 0
        for item in self.items:
            total += item["price"]
        return total

cart = ShoppingCart("Alice")
cart.add_item("Laptop", 1000)
cart.add_item("Mouse", 50)
print(cart.customer_name, "Total:", cart.get_total())
\`\`\`
`;

  lesson.production_example = `
Used in modern UI frameworks (like Django or React components) to model database tables and layout structures as objects.
`;

  lesson.line_by_line = `
1. Compiler stores class structure blueprints.
2. User calls \`Player("Alice", 100)\` to instantiate player.
3. Allocates Heap block memory, triggers constructor, maps attributes.
4. Outputs the name of the created player instance.
`;

  lesson.common_mistakes = `
### Missing self Argument
\`\`\`python
class User:
    def __init__(name):  # Missing self!
        self.name = name
\`\`\`
*Why it fails*: Python requires the first parameter of methods to be a reference to the instance itself (\`self\`).
`;

  lesson.best_practices = `
- Always capitalize class names using PascalCase (e.g., \`UserProfile\`).
- Keep data variables private and modify them only using class methods.
- Keep constructors small; do not perform complex logic inside \`__init__\`.
`;

  lesson.performance = `
Instantiating objects requires Heap allocation, which is slightly slower than stack allocation, but provides dynamic data flexibility.
`;

  lesson.interview_questions = `
- **Q: What is the difference between a class and an object?**
- **A**: A class is the conceptual template plan (design); an object is the physical instance residing in computer memory.
`;

  lesson.faqs = `
- **Q: What is self?**
- **A**: \`self\` is a pointer that points to the specific object instance that called the method.
`;

  lesson.mcqs = `
### Question 1: What is __init__ in a Python class?
- A) A normal function
- B) The constructor method that initializes new objects
- C) A loop controller
- D) A module compiler
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
__init__ is the constructor method triggered when creating a new object instance.
</details>
`;

  lesson.coding_practice = `
Create a class named \`Car\` with a constructor taking \`model\`.
`;

  lesson.debugging_exercises = `
Fix the constructor method error:
\`\`\`python
class User:
    def init(self, name): # Fix keyword
        self.name = name

u = User("Alice")
print(u.name)
\`\`\`
`;

  lesson.project_ideas = `
- **Game Inventory Tracker**: Build a class model managing items in a player's inventory bag.
`;

  lesson.summary = `
Classes bundle variables and functions into modular structures, enabling object modeling.
`;

  lesson.key_takeaways = `
- Classes are design blueprints; objects are physical allocations.
- \`__init__\` configures attributes upon creation.
`;

  lesson.related_topics = `
- Object Oriented Programming Principles
- Memory Allocation on Heap
`;

  lesson.next_learning_path = `
Now let's learn how to connect databases together using SQL JOIN!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "classes",
    theme: "classes",
    title: "Heap Object Layouts",
    heap: [
      { address: "0x0A00", label: "Player Object (p1)", attributes: { username: '"Alice"', score: 150 } },
      { address: "0x0B00", label: "Player Object (p2)", attributes: { username: '"Bob"', score: 100 } }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "class Player:",
      explanation: "Registers class blueprint.",
      memory: {}
    },
    {
      line: 6,
      code: 'p1 = Player("Alice", 100)',
      explanation: "Instantiates Player. Heap space is allocated at 0x0A00 and constructor is called.",
      memory: { "Heap 0x0A00 (Player p1)": { username: "Alice", score: 100 } }
    },
    {
      line: 7,
      code: "p1.level_up()",
      explanation: "Calls level_up method. The score variable at 0x0A00 is updated to 150.",
      memory: { "Heap 0x0A00 (Player p1)": { username: "Alice", score: 150 } }
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which parameter binds variables to class instances in methods?",
      options: ["this", "instance", "self", "me"],
      correct: 2,
      explanation: "Python uses 'self' to pass the reference pointer of the calling object."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "class Player:\n    pass",
      explanation: "Define empty class structure."
    },
    {
      step: 2,
      code: "class Player:\n    def __init__(self, username):\n        self.username = username",
      explanation: "Add the constructor to capture variables."
    },
    {
      step: 3,
      code: 'class Player:\n    def __init__(self, username):\n        self.username = username\n\np1 = Player("Alice")',
      explanation: "Instantiate a real object from the template."
    }
  ]);

  return lesson;
}

module.exports = assembleClasses;

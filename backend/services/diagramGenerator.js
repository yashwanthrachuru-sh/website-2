// ============================================================
// backend/services/diagramGenerator.js
// EduNet Human Teaching Engine — Diagram Generator Service
// ============================================================
'use strict';

const DIAGRAMS = {
  'Python Introduction': `
+-------------------------------------------------------+
|                 TRANSLATOR PIPELINE                   |
|                                                       |
|   Human Idea: print("Hello")                          |
|                       │                               |
|                       ▼                               |
|   +-----------------------------------------------+   |
|   |             PYTHON INTERPRETER                |   |
|   |  Translates English-like commands to bytes.   |   |
|   +-----------------------------------------------+   |
|                       │                               |
|                       ▼                               |
|   Computer Bytes: 01001011 01010100 (Runs!)           |
+-------------------------------------------------------+
`,
  'Variables': `
+------------------------------------+
|        LABELED STORAGE BOX         |
|                                    |
|   Label: [ student_score ]         |
|   +----------------------------+   |
|   | Value Inside: 75           |   |
|   +----------------------------+   |
|                                    |
+------------------------------------+
`,
  'Constants': `
+------------------------------------+
|         BIRTH CERTIFICATE          |
|                                    |
|   Label: [ DATE_OF_BIRTH ]         |
|   +----------------------------+   |
|   | Value Inside: 1995-06-15   |   |
|   +----------------------------+   |
|   | Status: [ LOCKED / SECURE ]|   |
|   +----------------------------+   |
|                                    |
+------------------------------------+
`,
  'If Statements': `
         [ Traffic Light Check ]
                    │
            Is light Green?
            /              \\
        (Yes)              (No)
         │                  │
         ▼                  ▼
   [ Drive Car ]      [ Stop Car ]
`,
  'Loops': `
      ┌───────────────────────┐
      │  Doing Jumping Jacks  │ ◄──┐
      └───────────┬───────────┘    │
                  │                │ Repeat until
                  ▼                │ counter = 20
         [ Increment Counter ]     │
                  │                │
                  ▼                │
          Is Counter < 20? ────────┘
                  │ (No)
                  ▼
             [ Stop Loop ]
`,
  'Functions': `
           Raw Inputs
      (Coffee Beans + Water)
               │
               ▼
     +───────────────────+
     |   COFFEE MACHINE  |
     |   (Function Code) |
     +───────────────────+
               │
               ▼
         Latte / Espresso
             (Output)
`,
  'Arrays': `
+-------------------------------------------------------+
|                       BOOKSHELF                       |
|   [Index 0]  [Index 1]  [Index 2]  [Index 3]  [Index 4] |
|   +-------+  +-------+  +-------+  +-------+  +-------+ |
|   | Book  |  | Book  |  | Book  |  | Book  |  | Book  | |
|   |   A   |  |   B   |  |   C   |  |   D   |  |   E   | |
|   +-------+  +-------+  +-------+  +-------+  +-------+ |
+-------------------------------------------------------+
`,
  'Objects': `
+------------------------------------+
|            CAR OBJECT              |
|                                    |
|   Properties:                      |
|   - Color: "Red"                   |
|   - Speed: 60                      |
|                                    |
|   Methods:                         |
|   - accelerate()                   |
|   - brake()                        |
|                                    |
+------------------------------------+
`,
  'Classes': `
  [ Architect Blueprint ]
            │
            ▼
     House Factory
      /     │     \\
     ▼      ▼      ▼
   House1 House2 House3 (Instances)
`,
  'Inheritance': `
        +-------------------+
        |   Animal (Parent) |
        |   - has_eyes: True|
        |   - eat()         |
        +---------┬---------+
                  │
                  ▼ (Inherits)
        +-------------------+
        |   Dog (Child)     |
        |   - bark()        |
        +-------------------+
`,
  'Polymorphism': `
      [ Universal Power Button ]
          /         │        \\
         ▼          ▼         ▼
     [ TV On ]   [ AC On ] [ Radio On ]
`,
  'SQL JOIN': `
  Sheet 1 (Orders)          Sheet 2 (Customers)
  +----------+----+        +----+-------+
  | Cust_ID  |Tot |        | ID | Name  |
  +----------+----+        +----+-------+
  |  10 ─────┼────┼────────┼─►10| Alice |
  |  20      | 90 |        | 30 | Bob   |
  +----------+----+        +----+-------+
`,
  'REST API': `
  [ Guest Table ] ──1. Order Request ──→ [ Waiter ]
                                             │
                                      2. Kitchen Delivery
                                             ▼
  [ Guest Table ] ◄──3. Serve Plate ◄── [ Waiter ]
`,
  'JSON': `
+------------------------------------+
|        FILLED CLIENT FORM          |
|                                    |
|   Name: "Alice"                    |
|   Age: 25                          |
|   Branch: "Computer Science"       |
|                                    |
+------------------------------------+
`,
  'Pointers': `
  Notepad Pointer            Physical House
  +---------------+          +---------------+
  |  0x7ffd53  ───┼─────────►|  123 Maple St |
  +---------------+          +---------------+
`,
  'Recursion': `
      +-----------------------------+
      |  Mirror Frame (n = 3)       |
      |   +-------------------------+
      |   | Reflection 2 (n = 2)    |
      |   |   +---------------------+
      |   |   | Reflection 1 (n=1)  |
      |   |   +---------------------+
      |   +-------------------------+
      +-----------------------------+
`
};

/**
 * Gets ASCII illustration for concept.
 * @param {string} conceptName - Normalized concept.
 * @returns {string} ASCII diagram.
 */
function getDiagram(conceptName) {
  for (const [key, val] of Object.entries(DIAGRAMS)) {
    if (key.toLowerCase() === (conceptName || '').toLowerCase()) {
      return val;
    }
  }

  // Fallback generic block
  return `
     +--------------------------+
     |   INPUT VARIABLES        |
     +------------┬-------------+
                  │
                  ▼
     +--------------------------+
     |   PROCESSING PIPELINE    |
     +------------┬-------------+
                  │
                  ▼
     +--------------------------+
     |   OUTPUT STATE           |
     +--------------------------+
`;
}

module.exports = {
  getDiagram
};

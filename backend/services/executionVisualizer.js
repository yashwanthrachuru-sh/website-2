// ============================================================
// backend/services/executionVisualizer.js
// EduNet Human Teaching Engine — Execution Visualizer Service
// ============================================================
'use strict';

/**
 * Returns an ASCII memory execution visualization for the concept.
 * @param {string} conceptName - Normalized concept.
 * @param {string} lang - Code language.
 * @returns {string} ASCII diagram.
 */
function getVisualization(conceptName, lang = 'javascript') {
  const c = (conceptName || '').toLowerCase();

  if (c.includes('python introduction') || c.includes('python')) {
    return `
=========================================
      PYTHON EXECUTION PIPELINE
=========================================
Source File: hello.py
Code: print("Hello, World!")

 [ STEP 1: Source Compilation ]
   The Python Compiler scans your source script (.py).
   Generates intermediate byte instructions (.pyc).
                  │
                  ▼
 [ STEP 2: Bytecode Translation ]
   Reads instruction: PRINT_ITEM ("Hello, World!")
                  │
                  ▼
 [ STEP 3: PVM Execution Loop ]
   The Python Virtual Machine (PVM) interprets bytecode
   and writes binary characters to the standard stdout stream.
                  │
                  ▼
 [ STEP 4: Standard Screen Output ]
   Hello, World!
`;
  }
  
  if (c.includes('variable')) {
    return `
=========================================
          MEMORY EXECUTION TRACE
=========================================
Code: student_marks = 75

[ STEP 1: Memory Allocation ]
CPU requests 8 bytes of storage slot...
RAM allocates address: 0x7ffd53

[ STEP 2: Address Mapping ]
Variable Name               Physical Memory Address
[ student_marks ]   ──→    [ 0x7ffd53 ]

[ STEP 3: Writing Value ]
Address 0x7ffd53 ──→ [ 01001011 ] (Binary 75)

Memory View:
+---------------+----------------+----------------+
| Variable Name | Memory Address | Stored Value   |
+---------------+----------------+----------------+
| student_marks | 0x7ffd53       | 75             |
+---------------+----------------+----------------+
`;
  }

  if (c.includes('constant')) {
    return `
=========================================
          MEMORY EXECUTION TRACE
=========================================
Code: const TAX_RATE = 0.05

[ STEP 1: Constant Assignment ]
RAM Allocates Address: 0x7ffd5a ──→ Value: 0.05
Compiler marks address 0x7ffd5a as [READ-ONLY]

[ STEP 2: Reassignment Check ]
Attempt: TAX_RATE = 0.08
Execution Engine queries 0x7ffd5a status...
Status is [READ-ONLY] -> Access Denied!

Memory View:
+---------------+----------------+----------------+-----------+
| Variable Name | Memory Address | Stored Value   | Flags     |
+---------------+----------------+----------------+-----------+
| TAX_RATE      | 0x7ffd5a       | 0.05           | READ-ONLY |
+---------------+----------------+----------------+-----------+
`;
  }

  if (c.includes('if')) {
    return `
=========================================
         BRANCH EXECUTION VISUALIZER
=========================================
Code: 
student_marks = 75
if student_marks > 50:
    print("Passed")

Execution Path:
Read student_marks value from memory slot (75)
Compare value in CPU register: 75 > 50

                   [ Compare: 75 > 50 ]
                            ↓
                    Is it Greater?
                     /          \\
                  (Yes)         (No)
                   ↓              ↓
             [True Branch]  [False Branch]
                   ↓              ↓
             Run block code   Skip statement block
             Print "Passed"
`;
  }

  if (c.includes('loop')) {
    return `
=========================================
          LOOP ITERATION VISUALIZER
=========================================
Code:
for lap in range(1, 4):
    print("Lap", lap)

Execution steps:
+-----------+---------------+------------------+---------------+
| Iteration | Counter (lap) | Condition check  | Output        |
+-----------+---------------+------------------+---------------+
| Step 1    | lap = 1       | 1 < 4 (True)     | "Lap 1"       |
| Step 2    | lap = 2       | 2 < 4 (True)     | "Lap 2"       |
| Step 3    | lap = 3       | 3 < 4 (True)     | "Lap 3"       |
| Step 4    | lap = 4       | 4 < 4 (False)    | [Loop Exits]  |
+-----------+---------------+------------------+---------------+
`;
  }

  if (c.includes('function')) {
    return `
=========================================
          CALL STACK VISUALIZER
=========================================
Code:
def total(price):
    return price + 5

total(10)

Runtime stack allocations:
+------------------------------------+
| Stack Frame: total()               |
| - Parameter: price = 10            |
| - Return Address: Line 5           |  <--- Executing total()
+------------------------------------+
| Stack Frame: main()                |
| - Local variables                  |
+------------------------------------+
`;
  }

  if (c.includes('join')) {
    return `
=========================================
          SQL JOIN VISUALIZER
=========================================
Table: orders                     Table: customers
+----+-------------+----+         +----+----------+
| id | customer_id | tot|         | id | name     |
+----+-------------+----+         +----+----------+
| 1  | 10          | 50 |         | 10 | "Alice"  |
| 2  | 20          | 90 |         | 30 | "Bob"    |
+----+-------------+----+         +----+----------+

Match Key Comparison: orders.customer_id == customers.id
- Row 1: Match found! customer_id 10 == id 10 ("Alice")
- Row 2: customer_id 20 == id 30? No match. (Skipped for INNER JOIN)

Compiled Results:
+----------+----------------+----------------+
| Order ID | Customer Name  | Total          |
+----------+----------------+----------------+
| 1        | "Alice"        | 50             |
+----------+----------------+----------------+
`;
  }

  if (c.includes('api')) {
    return `
=========================================
          REST API NETWORK VISUALIZER
=========================================
Client Application                   Backend API Router
[ Web Browser ]                     [ Express Server ]
      │                                    │
      │ ─── 1. HTTP POST /api/users ─────→ │ (Parse request headers)
      │      Body: {"username": "Alice"}   │ (Verify auth tokens)
      │                                    │
      │                                    │ ── 2. Run Database Query
      │                                    │    INSERT INTO users...
      │                                    │
      │ ←── 3. HTTP 201 Created Response ─ │ (JSON encode body data)
      │      Body: {"id": 1, "status": "ok"}│
      ▼                                    ▼
`;
  }

  // Fallback visual trace
  return `
=========================================
          EXECUTION STATED TRACE
=========================================
Concept: ${conceptName}

1. Initialize execution environments...
2. CPU parses statement declarations.
3. RAM variables are read and logged dynamically.

[ Code Block Input ] ──→ [ Processor Block ] ──→ [ Screen Output ]
`;
}

module.exports = {
  getVisualization
};

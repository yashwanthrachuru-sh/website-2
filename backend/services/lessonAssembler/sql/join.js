// ============================================================
// backend/services/lessonAssembler/sql/join.js
// Handcrafted Conversational SQL JOIN Lesson Builder (v6.1)
// ============================================================
'use strict';

const { createBaseLesson } = require('../baseLesson');

function assembleSQLJoin() {
  const lesson = createBaseLesson();

  lesson.definition = `
Have you ever tried matching two separate lists, like customer contact info and order billing totals, manually inside a spreadsheet?

Imagine you have two sheets in Microsoft Excel. Sheet 1 lists individual order records: "Order #101 was placed by customer ID 5 for $99". Sheet 2 lists customer details: "Customer ID 5 is Alice, contact email is alice@email.com". To write an invoice, you need to align Sheet 1 and Sheet 2, matching Customer IDs side-by-side.

### ❓ The Problem
Why not store name and email inside every order row? If Alice places 1,000 orders, you would write her email 1,000 times. If she updates her email, you must search and update all 1,000 order rows. If you miss one, your database becomes corrupted with conflicting data. This is called data redundancy.

### 🚫 Why Old Ways Fail
We normalize databases by splitting data into orders and customers tables. But fetching all orders, downloading them to our app, and running code loops to look up customer names is incredibly slow and drains network speeds.

### 💡 The Solution
We let the database engine perform the key matching in parallel on the server. The database alignments primary keys to foreign keys and returns a single combined dataset.

### 📖 Formal Definition
A SQL JOIN is a database query operation used to combine columns from two or more tables based on a shared column value (usually matching keys).
`;

  lesson.why_exists = `
SQL JOINs enable database normalization (reducing duplicate values) while allowing queries to compile unified reports.
`;

  lesson.importance = `
They allow developers to retrieve nested relations (like comments under posts) in a single fast database round-trip.
`;

  lesson.learning_objectives = `
- Differentiate between INNER JOIN, LEFT JOIN, and RIGHT JOIN.
- Connect tables using primary keys and foreign keys.
- Write query filters using \`ON\` mapping parameters.
`;

  lesson.beginner_explanation = `
Think of a SQL JOIN like merging two puzzle pieces together using their interlocking shapes. The shared key is what matches the pieces.
`;

  lesson.detailed_concept = `
The SQL Query Planner parses the statement. It looks at index tables and selects a lookup algorithm: Nested Loop, Merge Join, or Hash Match.
`;

  lesson.internal_working = `
The database engine loads the index tree for the matching keys, scanning pointers, combining matched row cells, and streaming them to the client.
`;

  lesson.syntax_breakdown = `
Here is a standard INNER JOIN query:
- **SELECT**: Lists the columns to return (e.g., \`orders.id, customers.name\`).
- **FROM**: The primary table to read (e.g., \`orders\`).
- **JOIN / ON**: Specifies the table to join and the key comparison check (e.g., \`ON orders.customer_id = customers.id\`).
`;

  lesson.visual_flow = `
\`\`\`text
Orders Table (customer_id) ──── ON customer_id == id ────► Customers Table (id)
\`\`\`
`;

  lesson.real_world_analogies = `
- **Analogy**: Merging Excel spreadsheets.
- **Why it fits**: You use a VLOOKUP function in Excel to copy names from a user details tab onto an orders sheet by matching user ID keys.
`;

  lesson.beginner_example = `
\`\`\`sql
SELECT orders.id, customers.name 
FROM orders 
INNER JOIN customers ON orders.customer_id = customers.id;
\`\`\`
`;

  lesson.intermediate_example = `
\`\`\`sql
SELECT orders.id, customers.name, orders.total 
FROM orders 
LEFT JOIN customers ON orders.customer_id = customers.id 
WHERE orders.total > 100;
\`\`\`
`;

  lesson.advanced_example = `
\`\`\`sql
SELECT c.id, c.name, SUM(o.total) AS total_spent 
FROM customers c 
INNER JOIN orders o ON c.id = o.customer_id 
GROUP BY c.id, c.name 
ORDER BY total_spent DESC;
\`\`\`
`;

  lesson.production_example = `
Used in checkout receipt generators to link items, profiles, and order tracking numbers.
`;

  lesson.line_by_line = `
1. The engine reads a row from the \`orders\` table (customer_id = 5).
2. It looks up ID 5 in the \`customers\` table index.
3. Finds "Alice", merges the rows, and appends the result to the output stream.
`;

  lesson.common_mistakes = `
### The Cartesian Product
\`\`\`sql
SELECT * FROM orders, customers;  # Missing ON clause!
\`\`\`
*Why it fails*: Without a key match condition, the database matches every order row to every customer row, producing a massive dataset that crashes servers.
`;

  lesson.best_practices = `
- Always create indexes on keys used in JOIN operations (Foreign Keys).
- Explicitly write columns names in the SELECT clause instead of using \`*\`.
- Use table aliases (e.g., \`FROM customers c\`) to keep statements clean.
`;

  lesson.performance = `
Joined tables using indexes run lookups in logarithmic O(log N) time, whereas missing indexes fallback to O(N * M) full scans.
`;

  lesson.interview_questions = `
- **Q: What is the difference between an INNER JOIN and a LEFT JOIN?**
- **A**: INNER JOIN only returns rows where matches exist in both tables; LEFT JOIN returns all rows from the left table, plus matches from the right (filling NULLs if missing).
`;

  lesson.faqs = `
- **Q: Can we join more than two tables?**
- **A**: Yes, you can chain multiple JOIN clauses sequentially in a single query.
`;

  lesson.mcqs = `
### Question 1: What happens if you perform a JOIN without specifying an ON condition?
- A) A syntax error is always thrown
- B) It returns a Cartesian Product (Cross Join) matching all rows
- C) It deletes both tables
- D) It returns only the left table
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong>
Omitting the ON criteria creates a Cross Join, pairing every row of Table A with every row of Table B.
</details>
`;

  lesson.coding_practice = `
Write an INNER JOIN linking \`students.id\` to \`grades.student_id\`.
`;

  lesson.debugging_exercises = `
Fix the incorrect JOIN query:
\`\`\`sql
SELECT orders.id, customer_name
FROM orders
INNER JOIN customers; -- Missing condition!
\`\`\`
`;

  lesson.project_ideas = `
- **Sales Analytics Dashboard**: Write joined queries linking orders, products, and categories tables.
`;

  lesson.summary = `
SQL JOINs link normalized relational tables in memory using shared keys to fetch dynamic, combined datasets.
`;

  lesson.key_takeaways = `
- Relational tables prevent duplicate updates anomalies.
- Indexing FK keys guarantees fast execution query performance.
`;

  lesson.related_topics = `
- Database Indexing B-Trees
- Database Normalization Rules
`;

  lesson.next_learning_path = `
Now let's learn how web systems exchange data using JSON!
`;

  // ── v6.1 Structured Interactive Visual Components ─────────────────────
  lesson.memoryDiagram = JSON.stringify({
    type: "joins",
    theme: "joins",
    title: "Table Keys Interlocking",
    tables: [
      {
        name: "orders",
        rows: [
          { id: 101, customer_id: 5, total: 99 },
          { id: 102, customer_id: 6, total: 150 }
        ]
      },
      {
        name: "customers",
        rows: [
          { id: 5, name: '"Alice"' },
          { id: 6, name: '"Bob"' }
        ]
      }
    ]
  });

  lesson.executionStepper = JSON.stringify([
    {
      line: 1,
      code: "SELECT orders.id, customers.name FROM orders",
      explanation: "The database scans the orders table. Reads first order: ID 101 (customer_id = 5).",
      memory: { current_order: { id: 101, customer_id: 5 } }
    },
    {
      line: 2,
      code: "INNER JOIN customers ON orders.customer_id = customers.id",
      explanation: "Looks up index id=5 in the customers table. Matches 'Alice'.",
      memory: { current_order: { id: 101, customer_id: 5 }, match: { id: 5, name: "Alice" } }
    },
    {
      line: 3,
      code: "Result Row",
      explanation: "Appends joined row { id: 101, name: 'Alice' } to response buffer.",
      memory: {},
      output: "101 | Alice"
    }
  ]);

  lesson.checkpointQuestions = JSON.stringify([
    {
      question: "Which JOIN returns all rows from Table A regardless of whether they exist in Table B?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
      correct: 1,
      explanation: "LEFT JOIN preserves all records of the left table (A), inserting NULLs for unmatched right fields."
    }
  ]);

  lesson.gradualCode = JSON.stringify([
    {
      step: 1,
      code: "SELECT orders.id\nFROM orders",
      explanation: "Start by selecting orders."
    },
    {
      step: 2,
      code: "SELECT orders.id, customers.name\nFROM orders\nINNER JOIN customers",
      explanation: "Add the target join table."
    },
    {
      step: 3,
      code: "SELECT orders.id, customers.name\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.id",
      explanation: "Define the key matching criteria using the ON clause."
    }
  ]);

  return lesson;
}

module.exports = assembleSQLJoin;

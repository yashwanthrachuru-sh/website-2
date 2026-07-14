// ============================================================
// backend/services/engine/conceptCodes.js
// EduNet Content Engine — Unified Concept Code Snippets (v6.2)
// Provides clean, valid, compile-ready code examples in Python, Java, JS, C, C++, SQL, HTML, CSS.
// ============================================================
'use strict';

const CODE_REGISTRY = {
  // ── VARIABLES & BASIC TYPES ──────────────────────────────────
  'variables': {
    python: {
      beginner: 'student_marks = 85\nbank_balance = 1200.50\nprint(f"Marks: {student_marks}, Balance: {bank_balance}")',
      intermediate: 'shopping_cart = ["book", "laptop", "mouse"]\nfor item in shopping_cart:\n    print(f"Processing: {item}")',
      advanced: 'class Account:\n    def __init__(self, owner: str, balance: float):\n        self.owner = owner\n        self.balance = balance\n\nuser = Account("Alice", 1500.0)'
    },
    java: {
      beginner: 'public class Main {\n    public static void main(String[] args) {\n        int studentMarks = 85;\n        double bankBalance = 1200.50;\n        System.out.println("Marks: " + studentMarks);\n    }\n}',
      intermediate: 'public class Main {\n    public static void main(String[] args) {\n        String[] shoppingCart = {"book", "laptop", "mouse"};\n        for (String item : shoppingCart) {\n            System.out.println("Processing: " + item);\n        }\n    }\n}',
      advanced: 'public class Account {\n    private String owner;\n    private double balance;\n    public Account(String owner, double balance) {\n        this.owner = owner;\n        this.balance = balance;\n    }\n}'
    },
    javascript: {
      beginner: 'const studentMarks = 85;\nconst bankBalance = 1200.50;\nconsole.log(`Marks: ${studentMarks}, Balance: ${bankBalance}`);',
      intermediate: 'const shoppingCart = ["book", "laptop", "mouse"];\nshoppingCart.forEach(item => {\n  console.log(`Processing: ${item}`);\n});',
      advanced: 'class Account {\n  constructor(owner, balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n}'
    },
    c: {
      beginner: '#include <stdio.h>\nint main() {\n    int studentMarks = 85;\n    float bankBalance = 1200.50f;\n    printf("Marks: %d, Balance: %.2f\\n", studentMarks, bankBalance);\n    return 0;\n}',
      intermediate: '#include <stdio.h>\nint main() {\n    char* shoppingCart[] = {"book", "laptop", "mouse"};\n    for (int i = 0; i < 3; i++) {\n        printf("Processing: %s\\n", shoppingCart[i]);\n    }\n    return 0;\n}',
      advanced: '#include <stdio.h>\nstruct Account {\n    char owner[50];\n    double balance;\n};\nint main() {\n    struct Account user = {"Alice", 1500.0};\n    printf("Owner: %s\\n", user.owner);\n    return 0;\n}'
    },
    cpp: {
      beginner: '#include <iostream>\nint main() {\n    int studentMarks = 85;\n    double bankBalance = 1200.50;\n    std::cout << "Marks: " << studentMarks << ", Balance: " << bankBalance << std::endl;\n    return 0;\n}',
      intermediate: '#include <iostream>\n#include <vector>\n#include <string>\nint main() {\n    std::vector<std::string> shoppingCart = {"book", "laptop", "mouse"};\n    for (const auto& item : shoppingCart) {\n        std::cout << "Processing: " << item << std::endl;\n    }\n    return 0;\n}',
      advanced: '#include <iostream>\n#include <string>\nclass Account {\npublic:\n    std::string owner;\n    double balance;\n    Account(std::string o, double b) : owner(o), balance(b) {}\n};\nint main() {\n    Account user("Alice", 1500.0);\n    return 0;\n}'
    },
    sql: {
      beginner: 'SELECT student_name, student_marks FROM student_scores WHERE student_marks > 80;',
      intermediate: 'SELECT category, SUM(price) FROM products GROUP BY category HAVING SUM(price) > 500;',
      advanced: 'WITH high_value AS (\n  SELECT * FROM orders WHERE total_amount > 1000\n)\nSELECT customer_id, COUNT(*) FROM high_value GROUP BY customer_id;'
    }
  },

  // ── POINTERS ──────────────────────────────────────────────────
  'pointers': {
    c: {
      beginner: '#include <stdio.h>\nint main() {\n    int bankBalance = 1500;\n    int *balancePointer = &bankBalance;\n    printf("Value: %d, Address: %p\\n", *balancePointer, balancePointer);\n    return 0;\n}',
      intermediate: '#include <stdio.h>\nvoid updateBalance(int *balance, int deposit) {\n    *balance += deposit;\n}\nint main() {\n    int bankBalance = 1500;\n    updateBalance(&bankBalance, 500);\n    printf("Updated Balance: %d\\n", bankBalance);\n    return 0;\n}',
      advanced: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int *scoresArray = (int*)malloc(3 * sizeof(int));\n    if (scoresArray == NULL) return 1;\n    scoresArray[0] = 85; scoresArray[1] = 90; scoresArray[2] = 95;\n    for(int i=0; i<3; i++) printf("Index %d: %d\\n", i, *(scoresArray + i));\n    free(scoresArray);\n    return 0;\n}'
    },
    cpp: {
      beginner: '#include <iostream>\nint main() {\n    int bankBalance = 1500;\n    int* balancePointer = &bankBalance;\n    std::cout << "Value: " << *balancePointer << ", Address: " << balancePointer << std::endl;\n    return 0;\n}',
      intermediate: '#include <iostream>\nvoid updateBalance(int* balance, int deposit) {\n    *balance += deposit;\n}\nint main() {\n    int bankBalance = 1500;\n    updateBalance(&bankBalance, 500);\n    std::cout << "Updated: " << bankBalance << std::endl;\n    return 0;\n}',
      advanced: '#include <iostream>\n#include <memory>\nint main() {\n    std::unique_ptr<int> smartPointer = std::make_unique<int>(1500);\n    std::cout << "Value inside smart pointer: " << *smartPointer << std::endl;\n    return 0;\n}'
    }
  },

  // ── SQL JOINs ────────────────────────────────────────────────
  'joins': {
    sql: {
      beginner: 'SELECT orders.order_id, customers.customer_name\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.customer_id;',
      intermediate: 'SELECT customers.customer_name, SUM(orders.total_amount) AS totalSpent\nFROM customers\nLEFT JOIN orders ON customers.customer_id = orders.customer_id\nGROUP BY customers.customer_name;',
      advanced: 'SELECT c.customer_name, o.order_date, p.product_name\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id\nINNER JOIN order_items oi ON o.order_id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.product_id\nORDER BY o.order_date DESC;'
    }
  },

  // ── LOOPS & ITERATION ─────────────────────────────────────────
  'loops': {
    python: {
      beginner: 'for index in range(5):\n    print(f"Repetition: {index}")',
      intermediate: 'item_count = 0\nwhile item_count < 3:\n    print(f"Item: {item_count}")\n    item_count += 1',
      advanced: 'matrix_records = [[1, 2], [3, 4]]\nflat_list = [val for row in matrix_records for val in row]\nprint(flat_list)'
    },
    java: {
      beginner: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            System.out.println("Repetition: " + i);\n        }\n    }\n}',
      intermediate: 'public class Main {\n    public static void main(String[] args) {\n        int count = 0;\n        while (count < 3) {\n            System.out.println("Item: " + count);\n            count++;\n        }\n    }\n}',
      advanced: 'public class Main {\n    public static void main(String[] args) {\n        int[][] matrix = {{1, 2}, {3, 4}};\n        for (int[] row : matrix) {\n            for (int val : row) {\n                System.out.println("Value: " + val);\n            }\n        }\n    }\n}'
    },
    javascript: {
      beginner: 'for (let index = 0; index < 5; index++) {\n  console.log(`Repetition: ${index}`);\n}',
      intermediate: 'let itemCount = 0;\nwhile (itemCount < 3) {\n  console.log(`Item: ${itemCount}`);\n  itemCount++;\n}',
      advanced: 'const matrixRecords = [[1, 2], [3, 4]];\nconst flatList = matrixRecords.flat();\nconsole.log(flatList);'
    }
  },

  // ── HTML SEMANTICS & FORMS ────────────────────────────────────
  'html_semantic_elements': {
    html: {
      beginner: '<header>\n  <h1>Website Portal</h1>\n  <nav>\n    <a href="/home">Home</a>\n  </nav>\n</header>',
      intermediate: '<main>\n  <article>\n    <h2>Semantic Articles</h2>\n    <p>Semantic tags improve accessibility.</p>\n  </article>\n  <aside>\n    <h3>Sidebar Details</h3>\n  </aside>\n</main>',
      advanced: '<footer>\n  <address>\n    Contact: support@edunet.com\n  </address>\n  <p>&copy; 2026 EduNet Learning.</p>\n</footer>'
    }
  },

  // ── CSS GRID LAYOUT ──────────────────────────────────────────
  'css_grid': {
    css: {
      beginner: '.grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 15px;\n}',
      intermediate: '.grid-dashboard {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  grid-auto-rows: minmax(100px, auto);\n  gap: 20px;\n}',
      advanced: '.page-layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n  grid-template-columns: 250px 1fr;\n}'
    }
  },

  // ── REACT COMPONENTS ─────────────────────────────────────────
  'react_fundamentals': {
    javascript: {
      beginner: 'import React, { useState } from "react";\n\nexport function ClickCounter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}',
      intermediate: 'import React, { useEffect, useState } from "react";\n\nexport function DataFetcher() {\n  const [data, setData] = useState([]);\n  useEffect(() => {\n    fetch("/api/data").then(res => res.json()).then(setData);\n  }, []);\n  return <ul>{data.map(d => <li key={d.id}>{d.name}</li>)}</ul>;\n}',
      advanced: 'import React, { useContext, createContext } from "react";\nconst ThemeContext = createContext("light");\nexport function ConsumerComponent() {\n  const theme = useContext(ThemeContext);\n  return <div className={`theme-${theme}`}>Theme active</div>;\n}'
    }
  },

  // ── ASYNC AWAIT / PROMISES ───────────────────────────────────
  'promises_asyncawait': {
    javascript: {
      beginner: 'const fetchUserData = () => {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id: 1, name: "Alice" }), 100);\n  });\n};',
      intermediate: 'async function getUserAndLogs() {\n  try {\n    const user = await fetchUserData();\n    console.log(`User: ${user.name}`);\n  } catch (err) {\n    console.error(`Failed: ${err.message}`);\n  }\n}',
      advanced: 'const fetchAllData = async () => {\n  const [user, logs] = await Promise.all([\n    fetch("/api/user").then(r => r.json()),\n    fetch("/api/logs").then(r => r.json())\n  ]);\n  return { user, logs };\n};'
    }
  }
};

// Fallbacks mapped
CODE_REGISTRY['variables_data_types'] = CODE_REGISTRY['variables'];
CODE_REGISTRY['control_flow_loops'] = CODE_REGISTRY['loops'];
CODE_REGISTRY['c_introduction_setup'] = CODE_REGISTRY['variables'];

/**
 * Returns compiler-ready code block.
 */
function getCodes(conceptKey, lang, level = 'beginner') {
  const cleanKey = String(conceptKey || '').toLowerCase();
  const cleanLang = String(lang || 'javascript').toLowerCase();
  
  let match = CODE_REGISTRY[cleanKey];
  if (!match) {
    // Try substring matching
    for (const [k, v] of Object.entries(CODE_REGISTRY)) {
      if (cleanKey.includes(k) || k.includes(cleanKey)) {
        match = v;
        break;
      }
    }
  }

  // If match found for this language and level, return it
  if (match && match[cleanLang] && match[cleanLang][level]) {
    return match[cleanLang][level];
  }

  // Smart compiler-ready fallback generator matching language syntax rules
  if (cleanLang === 'python' || cleanLang === 'py') {
    if (level === 'beginner') {
      return `student_age = 20\nstudent_name = "Alice"\nprint(f"Processing: {student_name}, Age: {student_age}")`;
    } else if (level === 'intermediate') {
      return `def calculate_average(scores_list):\n    if not scores_list:\n        return 0.0\n    return sum(scores_list) / len(scores_list)\n\nprint(calculate_average([85, 90, 95]))`;
    } else {
      return `class DatabaseConnector:\n    def __init__(self, host: str):\n        self.host = host\n    def execute_query(self, query: str):\n        print(f"Running: {query} on {self.host}")\n\ndb = DatabaseConnector("localhost")`;
    }
  }

  if (cleanLang === 'java') {
    if (level === 'beginner') {
      return `public class Main {\n    public static void main(String[] args) {\n        int studentAge = 20;\n        String studentName = "Alice";\n        System.out.println("Processing: " + studentName + ", Age: " + studentAge);\n    }\n}`;
    } else if (level === 'intermediate') {
      return `public class Calculator {\n    public double calculateAverage(int[] scoresList) {\n        if (scoresList.length == 0) return 0.0;\n        double sum = 0;\n        for (int score : scoresList) sum += score;\n        return sum / scoresList.length;\n    }\n}`;
    } else {
      return `public class DatabaseConnector {\n    private String host;\n    public DatabaseConnector(String host) {\n        this.host = host;\n    }\n    public void executeQuery(String query) {\n        System.out.println("Running: " + query + " on " + host);\n    }\n}`;
    }
  }

  if (cleanLang === 'c') {
    if (level === 'beginner') {
      return `#include <stdio.h>\nint main() {\n    int studentAge = 20;\n    char studentName[] = "Alice";\n    printf("Processing: %s, Age: %d\\n", studentName, studentAge);\n    return 0;\n}`;
    } else if (level === 'intermediate') {
      return `#include <stdio.h>\nfloat calculateAverage(int scoresList[], int size) {\n    if (size == 0) return 0.0f;\n    float sum = 0;\n    for (int i = 0; i < size; i++) sum += scoresList[i];\n    return sum / size;\n}\nint main() {\n    int list[] = {85, 90, 95};\n    printf("Avg: %.2f\\n", calculateAverage(list, 3));\n    return 0;\n}`;
    } else {
      return `#include <stdio.h>\nstruct DatabaseConnector {\n    char host[50];\n};\nvoid executeQuery(struct DatabaseConnector* db, char* query) {\n    printf("Running: %s on %s\\n", query, db->host);\n}\nint main() {\n    struct DatabaseConnector db = {"localhost"};\n    executeQuery(&db, "SELECT * FROM users;");\n    return 0;\n}`;
    }
  }

  if (cleanLang === 'cpp' || cleanLang === 'c++') {
    if (level === 'beginner') {
      return `#include <iostream>\n#include <string>\nint main() {\n    int studentAge = 20;\n    std::string studentName = "Alice";\n    std::cout << "Processing: " << studentName << ", Age: " << studentAge << std::endl;\n    return 0;\n}`;
    } else if (level === 'intermediate') {
      return `#include <iostream>\n#include <vector>\ndouble calculateAverage(const std::vector<int>& scoresList) {\n    if (scoresList.empty()) return 0.0;\n    double sum = 0;\n    for (int score : scoresList) sum += score;\n    return sum / scoresList.size();\n}\nint main() {\n    std::vector<int> list = {85, 90, 95};\n    std::cout << "Avg: " << calculateAverage(list) << std::endl;\n    return 0;\n}`;
    } else {
      return `#include <iostream>\n#include <string>\nclass DatabaseConnector {\nprivate:\n    std::string host;\npublic:\n    DatabaseConnector(std::string h) : host(h) {}\n    void executeQuery(std::string query) {\n        std::cout << "Running: " << query << " on " << host << std::endl;\n    }\n};\nint main() {\n    DatabaseConnector db("localhost");\n    db.executeQuery("SELECT * FROM users;");\n    return 0;\n}`;
    }
  }

  if (cleanLang === 'sql') {
    if (level === 'beginner') {
      return `SELECT * FROM users WHERE age > 18;`;
    } else if (level === 'intermediate') {
      return `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 5;`;
    } else {
      return `WITH user_sales AS (\n  SELECT user_id, SUM(amount) AS total FROM sales GROUP BY user_id\n)\nSELECT * FROM user_sales ORDER BY total DESC;`;
    }
  }

  if (cleanLang === 'html') {
    if (level === 'beginner') {
      return `<div>\n  <p>Static Block Content</p>\n</div>`;
    } else if (level === 'intermediate') {
      return `<form action="/submit" method="POST">\n  <label>Username</label>\n  <input type="text" name="username">\n</form>`;
    } else {
      return `<section id="dashboard">\n  <header>Dashboard Title</header>\n  <article>Metric Cards Content</article>\n</section>`;
    }
  }

  if (cleanLang === 'css') {
    if (level === 'beginner') {
      return `.card-container {\n  padding: 15px;\n  margin: 10px;\n}`;
    } else if (level === 'intermediate') {
      return `.flex-nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`;
    } else {
      return `@media (max-width: 600px) {\n  .responsive-grid {\n    grid-template-columns: 1fr;\n  }\n}`;
    }
  }

  // Default JavaScript fallback
  if (level === 'beginner') {
    return `const studentAge = 20;\nconst studentName = "Alice";\nconsole.log(\`Processing: \${studentName}, Age: \${studentAge}\`);`;
  } else if (level === 'intermediate') {
    return `function calculateAverage(scoresList) {\n  if (!scoresList.length) return 0.0;\n  const sum = scoresList.reduce((a, b) => a + b, 0);\n  return sum / scoresList.length;\n}\nconsole.log(calculateAverage([85, 90, 95]));`;
  } else {
    return `class DatabaseConnector {\n  constructor(host) {\n    this.host = host;\n  }\n  executeQuery(query) {\n    console.log(\`Running: \${query} on \${this.host}\`);\n  }\n}\nconst db = new DatabaseConnector("localhost");`;
  }
}

module.exports = {
  getCodes,
  CODE_REGISTRY
};

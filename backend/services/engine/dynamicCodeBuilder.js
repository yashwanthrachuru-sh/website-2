// ============================================================
// backend/services/engine/dynamicCodeBuilder.js
// EduNet Content Engine — Programmatic Code Builder (v6.3)
// Dynamically builds custom, compilable, and concept-specific examples.
// ============================================================
'use strict';

function cleanIdentifier(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function getVariableName(conceptWord, fallback) {
  const clean = cleanIdentifier(conceptWord);
  if (!clean || ['x','y','z','abc','test','hello','foo','bar','temp','val','num','str'].includes(clean)) {
    return fallback;
  }
  // camelCase or snake_case depending on lang
  return clean;
}

/**
 * Programmatically builds code blocks for a lesson.
 * @param {string} lang - Language identifier.
 * @param {string} conceptKey - Normalized concept key.
 * @param {string} focus - Focus identifier.
 * @param {string} lessonTitle - The exact lesson title.
 * @param {string} level - 'beginner', 'intermediate', or 'advanced'.
 * @returns {string} Fully formatted code block.
 */
function buildDynamicCode(lang, conceptKey, focus, lessonTitle, level) {
  const cleanLang = lang.toLowerCase();
  const cleanFocus = focus.toLowerCase();
  const cleanTitle = lessonTitle.toLowerCase();

  // Extract custom nouns based on lesson title to make code extremely specific
  let varName = 'activeConfig';
  let varVal = '250';
  let categoryName = 'payment';

  if (cleanTitle.includes('loop') || cleanTitle.includes('iterate')) {
    varName = 'iterationCounter';
    varVal = '0';
    categoryName = 'loop_check';
  } else if (cleanTitle.includes('pointer') || cleanTitle.includes('address')) {
    varName = 'memoryReference';
    varVal = '888';
    categoryName = 'hardware_ptr';
  } else if (cleanTitle.includes('join') || cleanTitle.includes('merge')) {
    varName = 'customerRecords';
    varVal = '101';
    categoryName = 'orders';
  } else if (cleanTitle.includes('react') || cleanTitle.includes('component')) {
    varName = 'activeTheme';
    varVal = '"dark"';
    categoryName = 'ui_state';
  } else if (cleanTitle.includes('api') || cleanTitle.includes('http')) {
    varName = 'endpointUrl';
    varVal = '"/api/v1/data"';
    categoryName = 'network';
  } else if (cleanTitle.includes('recursion') || cleanTitle.includes('recursive')) {
    varName = 'recursionDepth';
    varVal = '5';
    categoryName = 'factorial';
  } else if (cleanTitle.includes('stack') || cleanTitle.includes('queue')) {
    varName = 'elementIndex';
    varVal = '0';
    categoryName = 'buffer';
  } else if (cleanTitle.includes('tree') || cleanTitle.includes('bst')) {
    varName = 'treeNode';
    varVal = '50';
    categoryName = 'root';
  }

  // 1. PYTHON CODE GENERATION
  if (cleanLang === 'python' || cleanLang === 'py') {
    if (level === 'beginner') {
      return `# Setup variables for ${lessonTitle}\n${varName}_value = ${varVal}\nprint(f"Tracking ${categoryName}: {${varName}_value}")`;
    }
    if (level === 'intermediate') {
      if (cleanFocus.includes('loop') || cleanTitle.includes('loop')) {
        return `def run_${categoryName}_loop(limit_value):\n    for counter in range(limit_value):\n        print(f"Looping ${categoryName} step: {counter}")\n\nrun_${categoryName}_loop(3)`;
      }
      return `def verify_${categoryName}_setup(${varName}_param):\n    if ${varName}_param is not None:\n        return True\n    return False\n\nprint(verify_${categoryName}_setup(${varName}_value if '${varName}_value' in locals() else ${varVal}))`;
    }
    // Advanced
    return `class ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager:\n    def __init__(self, key_param):\n        self.key_param = key_param\n    def process_data(self, val_param):\n        print(f"Processing {lessonTitle}: {self.key_param} with value {val_param}")\n\nmanager = ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager("ProductionSetup")\nmanager.process_data(${varVal})`;
  }

  // 2. JAVASCRIPT CODE GENERATION
  if (cleanLang === 'javascript' || cleanLang === 'js') {
    if (level === 'beginner') {
      return `// Initialize settings for ${lessonTitle}\nconst ${varName}Value = ${varVal};\nconsole.log("Tracking ${categoryName}:", ${varName}Value);`;
    }
    if (level === 'intermediate') {
      if (cleanFocus.includes('loop') || cleanTitle.includes('loop')) {
        return `function run${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Loop(limitVal) {\n  for (let counter = 0; counter < limitVal; counter++) {\n    console.log("Looping step:", counter);\n  }\n}\nrun${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Loop(3);`;
      }
      return `function verify${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}(paramVal) {\n  return paramVal !== undefined && paramVal !== null;\n}\nconsole.log(verify${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}(${varVal}));`;
    }
    // Advanced
    return `class ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager {\n  constructor(keyParam) {\n    this.keyParam = keyParam;\n  }\n  processData(valParam) {\n    console.log("Processing ${lessonTitle}:", this.keyParam, "Value:", valParam);\n  }\n}\nconst managerInstance = new ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager("ProductionSetup");\nmanagerInstance.processData(${varVal});`;
  }

  // 3. JAVA CODE GENERATION
  if (cleanLang === 'java') {
    const className = `Class_${fileHash(lessonTitle)}`;
    if (level === 'beginner') {
      return `public class ${className} {\n    public static void main(String[] args) {\n        int ${varName}Value = ${varVal.includes('"') ? 99 : varVal};\n        System.out.println("Tracking ${categoryName}: " + ${varName}Value);\n    }\n}`;
    }
    if (level === 'intermediate') {
      if (cleanFocus.includes('loop') || cleanTitle.includes('loop')) {
        return `public class ${className} {\n    public static void runLoop(int limitVal) {\n        for (int counter = 0; counter < limitVal; counter++) {\n            System.out.println("Loop step: " + counter);\n        }\n    }\n    public static void main(String[] args) {\n        runLoop(3);\n    }\n}`;
      }
      return `public class ${className} {\n    public static boolean verifyState(int paramVal) {\n        return paramVal > 0;\n    }\n    public static void main(String[] args) {\n        System.out.println("Verified: " + verifyState(${varVal.includes('"') ? 99 : varVal}));\n    }\n}`;
    }
    // Advanced
    return `public class ${className} {\n    private String keyParam;\n    public ${className}(String keyParam) {\n        this.keyParam = keyParam;\n    }\n    public void processData(int valParam) {\n        System.out.println("Processing " + keyParam + " with value " + valParam);\n    }\n    public static void main(String[] args) {\n        ${className} manager = new ${className}("ProductionSetup");\n        manager.processData(500);\n    }\n}`;
  }

  // 4. C CODE GENERATION
  if (cleanLang === 'c') {
    if (level === 'beginner') {
      return `#include <stdio.h>\nint main() {\n    int ${varName}Value = ${varVal.includes('"') ? 99 : varVal};\n    printf("Tracking ${categoryName}: %d\\n", ${varName}Value);\n    return 0;\n}`;
    }
    if (level === 'intermediate') {
      if (cleanFocus.includes('loop') || cleanTitle.includes('loop')) {
        return `#include <stdio.h>\nvoid runLoop(int limitVal) {\n    for (int counter = 0; counter < limitVal; counter++) {\n        printf("Loop step: %d\\n", counter);\n    }\n}\nint main() {\n    runLoop(3);\n    return 0;\n}`;
      }
      return `#include <stdio.h>\nint verifyState(int paramVal) {\n    return paramVal > 0 ? 1 : 0;\n}\nint main() {\n    printf("Verified: %d\\n", verifyState(${varVal.includes('"') ? 99 : varVal}));\n    return 0;\n}`;
    }
    // Advanced
    return `#include <stdio.h>\nstruct ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager {\n    int keyParam;\n};\nvoid processData(struct ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager* manager, int valParam) {\n    printf("Processing: %d, Value: %d\\n", manager->keyParam, valParam);\n}\nint main() {\n    struct ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager manager = {1001};\n    processData(&manager, ${varVal.includes('"') ? 99 : varVal});\n    return 0;\n}`;
  }

  // 5. C++ CODE GENERATION
  if (cleanLang === 'cpp' || cleanLang === 'c++') {
    if (level === 'beginner') {
      return `#include <iostream>\nint main() {\n    int ${varName}Value = ${varVal.includes('"') ? 99 : varVal};\n    std::cout << "Tracking ${categoryName}: " << ${varName}Value << std::endl;\n    return 0;\n}`;
    }
    if (level === 'intermediate') {
      if (cleanFocus.includes('loop') || cleanTitle.includes('loop')) {
        return `#include <iostream>\nvoid runLoop(int limitVal) {\n    for (int counter = 0; counter < limitVal; counter++) {\n        std::cout << "Loop step: " << counter << std::endl;\n    }\n}\nint main() {\n    runLoop(3);\n    return 0;\n}`;
      }
      return `#include <iostream>\nbool verifyState(int paramVal) {\n    return paramVal > 0;\n}\nint main() {\n    std::cout << "Verified: " << verifyState(${varVal.includes('"') ? 99 : varVal}) << std::endl;\n    return 0;\n}`;
    }
    // Advanced
    return `#include <iostream>\n#include <string>\nclass ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager {\nprivate:\n    std::string keyParam;\npublic:\n    ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager(std::string key) : keyParam(key) {}\n    void processData(int valParam) {\n        std::cout << "Processing " << keyParam << " with " << valParam << std::endl;\n    }\n};\nint main() {\n    ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}Manager manager("ProductionSetup");\n    manager.processData(500);\n    return 0;\n}`;
  }

  // 6. SQL CODE GENERATION
  if (cleanLang === 'sql') {
    const tableName = `tbl_${categoryName}`;
    const colName = `${varName}_id`;
    if (level === 'beginner') {
      return `SELECT ${colName}, details FROM ${tableName} WHERE status = 'active';`;
    }
    if (level === 'intermediate') {
      return `SELECT ${colName}, COUNT(*) AS totalRecordCount\nFROM ${tableName}\nGROUP BY ${colName}\nHAVING COUNT(*) > 1;`;
    }
    // Advanced
    return `WITH cte_${categoryName} AS (\n  SELECT ${colName}, details_column\n  FROM ${tableName}\n  WHERE created_at > '2026-01-01'\n)\nSELECT * FROM cte_${categoryName} ORDER BY ${colName} DESC;`;
  }

  // 7. HTML CODE GENERATION
  if (cleanLang === 'html') {
    if (level === 'beginner') {
      return `<div id="${categoryName}-section">\n  <h2>Title: ${lessonTitle}</h2>\n  <p>Overview of details.</p>\n</div>`;
    }
    if (level === 'intermediate') {
      return `<form action="/submit-${categoryName}" method="POST">\n  <label for="input-field">Parameter Input:</label>\n  <input type="text" id="input-field" name="${varName}">\n</form>`;
    }
    return `<section class="layout-${categoryName}">\n  <header class="bar-header">\n    <h1>Dashboard Portal: ${lessonTitle}</h1>\n  </header>\n  <article class="data-view">\n    <p>Semantic page body text.</p>\n  </article>\n</section>`;
  }

  // 8. CSS CODE GENERATION
  if (cleanLang === 'css') {
    if (level === 'beginner') {
      return `.${categoryName}-card {\n  padding: 15px;\n  margin: 10px;\n  border-radius: 8px;\n}`;
    }
    if (level === 'intermediate') {
      return `.grid-${categoryName} {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 15px;\n}`;
    }
    return `@media (max-width: 600px) {\n  .layout-${categoryName} {\n    display: flex;\n    flex-direction: column;\n  }\n}`;
  }

  // Default general javascript fallback
  return `const ${varName}Val = ${varVal};\nconsole.log("Tracking:", ${varName}Val);`;
}

function fileHash(str) {
  return require('crypto').createHash('md5').update(str).digest('hex').substring(0, 8);
}

module.exports = {
  buildDynamicCode
};

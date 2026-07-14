// ============================================================
// backend/services/engine/languageProfiles.js
// EduNet Content Engine — Language-Specific Profiles
// Provides syntax, idioms, examples, and conventions per language
// ============================================================
'use strict';

const LANGUAGE_PROFILES = {

  // ── PYTHON ────────────────────────────────────────────────
  python: {
    name: 'Python',
    version: '3.x',
    paradigm: 'Multi-paradigm (OOP, Functional, Procedural)',
    indent: '    ',
    commentSingle: '#',
    commentMulti: ['"""', '"""'],
    nil: 'None',
    boolTrue: 'True',
    boolFalse: 'False',
    
    // Core Step 7 requirements
    syntax: 'Uses clean indentation blocks instead of curly braces. Statement endings do not require semicolons.',
    printing: 'print("Output message")',
    variables: 'studentAge = 20\nstudentName = "Alice"',
    functions: 'def calculateScore(baseScore, bonusPoints):\n    return baseScore + bonusPoints',
    loops: 'for index in range(5):\n    print(index)\n\nwhile score < 100:\n    score += 5',
    conditionals: 'if score >= 90:\n    print("Excellent")\nelif score >= 60:\n    print("Pass")\nelse:\n    print("Try again")',
    collections: 'scoresList = [85, 90, 75]\nuserProfile = {"username": "alice12", "level": 3}',
    classes: 'class UserAccount:\n    def __init__(self, username):\n        self.username = username',
    packages: 'pip (Package Installer for Python)',
    imports: 'import math\nfrom datetime import datetime',
    testing: 'unittest, pytest',
    idioms: 'List comprehensions: scores = [s + 5 for s in base_scores]. Generator expressions.',
    styleConventions: 'PEP 8: snake_case for variables/functions, PascalCase for classes, UPPER_CASE for constants.',
    
    keywords: {
      print: (val) => `print(${val})`,
      varDecl: (name, val) => `${name} = ${val}`,
      constDecl: (name, val) => `${name.toUpperCase()} = ${val}  # Convention: UPPER_CASE constants`,
      typedVar: (type, name, val) => `${name}: ${type} = ${val}`,
      ifBlock: (cond, body) => `if ${cond}:\n    ${body}`,
      elifBlock: (cond, body) => `elif ${cond}:\n    ${body}`,
      elseBlock: (body) => `else:\n    ${body}`,
      forLoop: (var_, iter, body) => `for ${var_} in ${iter}:\n    ${body}`,
      whileLoop: (cond, body) => `while ${cond}:\n    ${body}`,
      funcDef: (name, params, body) => `def ${name}(${params}):\n    ${body}`,
      classDef: (name, parent, body) => parent 
        ? `class ${name}(${parent}):\n    ${body}` 
        : `class ${name}:\n    ${body}`,
      returnStmt: (val) => `return ${val}`,
      import: (mod) => `import ${mod}`,
      fromImport: (mod, names) => `from ${mod} import ${names}`,
      tryBlock: (body, err, handler) => `try:\n    ${body}\nexcept ${err} as e:\n    ${handler}`,
      listComp: (expr, var_, iter) => `[${expr} for ${var_} in ${iter}]`,
      lambda: (params, body) => `lambda ${params}: ${body}`,
    },
    
    dataTypes: {
      int: 'int',
      float: 'float',
      string: 'str',
      bool: 'bool',
      list: 'list',
      dict: 'dict',
      tuple: 'tuple',
      set: 'set',
      none: 'None',
    },
    
    conventions: [
      'Use snake_case for variables and functions: student_name, calculate_total()',
      'Use PascalCase for class names: BankAccount, StudentProfile',
      'Use UPPER_SNAKE_CASE for constants: MAX_RETRY_COUNT = 3',
      'Docstrings use triple quotes: """This function calculates tax."""',
      'Type hints improve readability: def greet(name: str) -> str:',
      'Use list comprehensions over manual loops when readable',
      'Prefer f-strings for formatting: f"Hello, {student_name}!"',
    ],
    
    commonMistakes: [
      { wrong: 'x = 5', fix: 'student_age = 5', reason: 'Use descriptive variable names' },
      { wrong: 'if x == True:', fix: 'if is_valid:', reason: 'Boolean flags should be expressive' },
      { wrong: 'list = [1,2,3]', fix: 'student_scores = [1,2,3]', reason: 'Never shadow built-in names' },
      { wrong: 'except:', fix: 'except ValueError as e:', reason: 'Always catch specific exception types' },
    ],
    
    codeStyle: 'PEP 8 — Python Enhancement Proposal 8',
    fileExtension: '.py',
    runCommand: 'python3 filename.py',
  },

  // ── JAVASCRIPT ────────────────────────────────────────────
  javascript: {
    name: 'JavaScript',
    version: 'ES2023+',
    paradigm: 'Multi-paradigm (OOP, Functional, Event-driven)',
    indent: '  ',
    commentSingle: '//',
    commentMulti: ['/*', '*/'],
    nil: 'null',
    boolTrue: 'true',
    boolFalse: 'false',

    // Core Step 7 requirements
    syntax: 'Uses curly braces for blocks. Requires semicolons or relies on automatic semicolon insertion (ASI).',
    printing: 'console.log("Output message");',
    variables: 'let studentAge = 20;\nconst customerName = "Alice";',
    functions: 'function calculateScore(baseScore, bonusPoints) {\n  return baseScore + bonusPoints;\n}',
    loops: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\nwhile (score < 100) {\n  score += 5;\n}',
    conditionals: 'if (score >= 90) {\n  console.log("Excellent");\n} else if (score >= 60) {\n  console.log("Pass");\n} else {\n  console.log("Try again");\n}',
    collections: 'let scoresList = [85, 90, 75];\nlet userProfile = { username: "alice12", level: 3 };',
    classes: 'class UserAccount {\n  constructor(username) {\n    this.username = username;\n  }\n}',
    packages: 'npm (Node Package Manager)',
    imports: 'const math = require("math");\nimport { datetime } from "datetime";',
    testing: 'Jest, Mocha, Jasmine',
    idioms: 'Arrow functions, destructuring: const { username } = userProfile. Spread/rest operators.',
    styleConventions: 'Airbnb/Standard guides: camelCase for variables/functions, PascalCase for classes, SCREAMING_SNAKE_CASE for constant configs.',
    
    keywords: {
      print: (val) => `console.log(${val});`,
      varDecl: (name, val) => `let ${name} = ${val};`,
      constDecl: (name, val) => `const ${name} = ${val};`,
      typedVar: (type, name, val) => `/** @type {${type}} */\nlet ${name} = ${val};`,
      ifBlock: (cond, body) => `if (${cond}) {\n  ${body}\n}`,
      elifBlock: (cond, body) => `else if (${cond}) {\n  ${body}\n}`,
      elseBlock: (body) => `else {\n  ${body}\n}`,
      forLoop: (var_, iter, body) => `for (const ${var_} of ${iter}) {\n  ${body}\n}`,
      whileLoop: (cond, body) => `while (${cond}) {\n  ${body}\n}`,
      funcDef: (name, params, body) => `function ${name}(${params}) {\n  ${body}\n}`,
      arrowFunc: (name, params, body) => `const ${name} = (${params}) => {\n  ${body}\n};`,
      classDef: (name, parent, body) => parent
        ? `class ${name} extends ${parent} {\n  ${body}\n}`
        : `class ${name} {\n  ${body}\n}`,
      returnStmt: (val) => `return ${val};`,
      import: (mod) => `const ${mod} = require('${mod}');`,
      esImport: (names, mod) => `import { ${names} } from '${mod}';`,
      tryBlock: (body, handler) => `try {\n  ${body}\n} catch (error) {\n  ${handler}\n}`,
      asyncFunc: (name, params, body) => `async function ${name}(${params}) {\n  ${body}\n}`,
      awaitCall: (expr) => `await ${expr}`,
      promise: (resolve, reject) => `new Promise((resolve, reject) => {\n  ${resolve}\n});`,
    },
    
    dataTypes: {
      number: 'Number',
      string: 'String',
      bool: 'Boolean',
      array: 'Array',
      object: 'Object',
      null: 'null',
      undefined: 'undefined',
      symbol: 'Symbol',
      bigint: 'BigInt',
    },
    
    conventions: [
      'Use camelCase for variables and functions: studentName, calculateTotal()',
      'Use PascalCase for classes and constructors: BankAccount, OrderManager',
      'Use SCREAMING_SNAKE_CASE for module constants: MAX_RETRY_COUNT',
      'Prefer const over let; never use var in modern code',
      'Use template literals: `Hello, ${studentName}!`',
      'Use arrow functions for callbacks and functional patterns',
      'Always handle Promise rejections with .catch() or try/await',
    ],
    
    commonMistakes: [
      { wrong: 'var x = 5', fix: 'const studentAge = 5', reason: 'var has function scope, causing subtle bugs' },
      { wrong: 'if (value == null)', fix: 'if (value === null)', reason: 'Use strict equality to avoid type coercion' },
      { wrong: 'arr.forEach(item => arr.push(item+1))', fix: 'const newArr = arr.map(item => item + 1)', reason: 'Never mutate an array while iterating it' },
    ],
    
    codeStyle: 'Airbnb or Standard JS',
    fileExtension: '.js',
    runCommand: 'node filename.js',
  },

  // ── JAVA ──────────────────────────────────────────────────
  java: {
    name: 'Java',
    version: 'Java 17+ (LTS)',
    paradigm: 'Object-Oriented, Strongly Typed',
    indent: '    ',
    commentSingle: '//',
    commentMulti: ['/*', '*/'],
    nil: 'null',
    boolTrue: 'true',
    boolFalse: 'false',

    // Core Step 7 requirements
    syntax: 'Strongly typed class-based language. Statements terminate with semicolons.',
    printing: 'System.out.println("Output message");',
    variables: 'int studentAge = 20;\nString customerName = "Alice";',
    functions: 'public int calculateScore(int baseScore, int bonusPoints) {\n    return baseScore + bonusPoints;\n}',
    loops: 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n\nwhile (score < 100) {\n    score += 5;\n}',
    conditionals: 'if (score >= 90) {\n    System.out.println("Excellent");\n} else if (score >= 60) {\n    System.out.println("Pass");\n} else {\n    System.out.println("Try again");\n}',
    collections: 'List<Integer> scoresList = Arrays.asList(85, 90, 75);\nMap<String, Object> userProfile = new HashMap<>();',
    classes: 'public class UserAccount {\n    private String username;\n    public UserAccount(String username) {\n        this.username = username;\n    }\n}',
    packages: 'Maven, Gradle',
    imports: 'import java.util.List;\nimport java.util.HashMap;',
    testing: 'JUnit, TestNG',
    idioms: 'Streams API for collections pipeline. Lambda expressions for interfaces.',
    styleConventions: 'Google Java Style: camelCase for variables/methods, PascalCase for classes, UPPER_SNAKE_CASE for static final constants.',
    
    keywords: {
      print: (val) => `System.out.println(${val});`,
      varDecl: (name, val) => `var ${name} = ${val};`,
      typedVar: (type, name, val) => `${type} ${name} = ${val};`,
      constDecl: (name, val) => `static final String ${name.toUpperCase()} = ${val};`,
      ifBlock: (cond, body) => `if (${cond}) {\n    ${body}\n}`,
      forLoop: (var_, iter, body) => `for (var ${var_} : ${iter}) {\n    ${body}\n}`,
      whileLoop: (cond, body) => `while (${cond}) {\n    ${body}\n}`,
      funcDef: (name, params, returnType, body) => `public ${returnType} ${name}(${params}) {\n    ${body}\n}`,
      classDef: (name, parent, body) => parent
        ? `public class ${name} extends ${parent} {\n    ${body}\n}`
        : `public class ${name} {\n    ${body}\n}`,
      returnStmt: (val) => `return ${val};`,
      import: (pkg) => `import ${pkg};`,
      tryBlock: (body, exType, handler) => `try {\n    ${body}\n} catch (${exType} e) {\n    ${handler}\n}`,
    },
    
    conventions: [
      'Use camelCase for variables and methods: studentName, calculateInterest()',
      'Use PascalCase for class names: StudentRecord, BankTransaction',
      'Use UPPER_SNAKE_CASE for constants: MAX_ACCOUNT_LIMIT',
      'Every class in its own file matching the class name',
      'Use @Override annotation when overriding parent methods',
      'Program to interfaces, not implementations',
      'Use StringBuilder for string concatenation in loops',
    ],
    
    codeStyle: 'Google Java Style Guide',
    fileExtension: '.java',
    runCommand: 'javac FileName.java && java FileName',
  },

  // ── C ─────────────────────────────────────────────────────
  c: {
    name: 'C',
    version: 'C11/C17',
    paradigm: 'Procedural, Systems Programming',
    indent: '    ',
    commentSingle: '//',
    commentMulti: ['/*', '*/'],
    nil: 'NULL',
    boolTrue: '1',
    boolFalse: '0',

    // Core Step 7 requirements
    syntax: 'Procedural systems language. Code block structure is rigid. Requires semicolons.',
    printing: 'printf("Output message\\n");',
    variables: 'int studentAge = 20;\nchar customerName[50] = "Alice";',
    functions: 'int calculateScore(int baseScore, int bonusPoints) {\n    return baseScore + bonusPoints;\n}',
    loops: 'for (int i = 0; i < 5; i++) {\n    printf("%d\\n", i);\n}\n\nwhile (score < 100) {\n    score += 5;\n}',
    conditionals: 'if (score >= 90) {\n    printf("Excellent\\n");\n} else if (score >= 60) {\n    printf("Pass\\n");\n} else {\n    printf("Try again\\n");\n}',
    collections: 'int scoresList[3] = {85, 90, 75};',
    classes: 'struct UserAccount {\n    char username[50];\n};',
    packages: 'System repositories (apt, dnf, vcpkg)',
    imports: '#include <stdio.h>\n#include <stdlib.h>',
    testing: 'Check, CUnit, Unity',
    idioms: 'Pointer arithmetic. Direct memory allocations with malloc and free.',
    styleConventions: 'Linux Kernel style: snake_case for functions/variables, UPPER_CASE for macros/defines.',
    
    keywords: {
      print: (val, fmt) => `printf("${fmt || '%s\\n'}", ${val});`,
      varDecl: (type, name, val) => `${type} ${name} = ${val};`,
      constDecl: (name, val) => `#define ${name.toUpperCase()} ${val}`,
      ifBlock: (cond, body) => `if (${cond}) {\n    ${body}\n}`,
      forLoop: (init, cond, incr, body) => `for (${init}; ${cond}; ${incr}) {\n    ${body}\n}`,
      whileLoop: (cond, body) => `while (${cond}) {\n    ${body}\n}`,
      funcDef: (returnType, name, params, body) => `${returnType} ${name}(${params}) {\n    ${body}\n}`,
      structDef: (name, fields) => `struct ${name} {\n    ${fields}\n};`,
      malloc: (type, count) => `(${type}*)malloc(${count} * sizeof(${type}))`,
      free: (ptr) => `free(${ptr});`,
      include: (header) => `#include <${header}>`,
      pointerDecl: (type, name) => `${type}* ${name};`,
      addressOf: (var_) => `&${var_}`,
      deref: (ptr) => `*${ptr}`,
    },
    
    conventions: [
      'Use snake_case for all names: student_count, calculate_average()',
      'Prefix constants with module name: BANK_MAX_WITHDRAWAL',
      'Always check return values from malloc(), fopen(), etc.',
      'Free all dynamically allocated memory to prevent leaks',
      'Use const for read-only parameters: const char* name',
      'Initialize all variables — uninitialized values cause undefined behavior',
      'Keep functions short and focused — one responsibility per function',
    ],
    
    codeStyle: 'Linux Kernel Coding Style / MISRA C',
    fileExtension: '.c',
    runCommand: 'gcc -o program filename.c && ./program',
  },

  // ── C++ ───────────────────────────────────────────────────
  cpp: {
    name: 'C++',
    version: 'C++17/C++20',
    paradigm: 'Multi-paradigm (OOP, Generic, Systems)',
    indent: '    ',
    commentSingle: '//',
    commentMulti: ['/*', '*/'],
    nil: 'nullptr',
    boolTrue: 'true',
    boolFalse: 'false',

    // Core Step 7 requirements
    syntax: 'Object-oriented extension of C. Support templates. Requires semicolons.',
    printing: 'std::cout << "Output message" << std::endl;',
    variables: 'int studentAge = 20;\nstd::string customerName = "Alice";',
    functions: 'int calculateScore(int baseScore, int bonusPoints) {\n    return baseScore + bonusPoints;\n}',
    loops: 'for (int i = 0; i < 5; i++) {\n    std::cout << i << std::endl;\n}\n\nwhile (score < 100) {\n    score += 5;\n}',
    conditionals: 'if (score >= 90) {\n    std::cout << "Excellent" << std::endl;\n} else if (score >= 60) {\n    std::cout << "Pass" << std::endl;\n} else {\n    std::cout << "Try again" << std::endl;\n}',
    collections: 'std::vector<int> scoresList = {85, 90, 75};\nstd::map<std::string, int> userProfile;',
    classes: 'class UserAccount {\nprivate:\n    std::string username;\npublic:\n    UserAccount(std::string name) : username(name) {}\n};',
    packages: 'Conan, vcpkg',
    imports: '#include <iostream>\n#include <vector>',
    testing: 'Google Test, Catch2',
    idioms: 'RAII (Resource Acquisition Is Initialization). Smart pointers (unique_ptr, shared_ptr).',
    styleConventions: 'C++ Core Guidelines: camelCase/snake_case mix, PascalCase for classes, UPPER_SNAKE_CASE for macros/constants.',
    
    keywords: {
      print: (val) => `std::cout << ${val} << std::endl;`,
      varDecl: (type, name, val) => `${type} ${name} = ${val};`,
      autoDecl: (name, val) => `auto ${name} = ${val};`,
      constDecl: (name, val) => `constexpr auto ${name} = ${val};`,
      ifBlock: (cond, body) => `if (${cond}) {\n    ${body}\n}`,
      forRange: (type, var_, cont, body) => `for (${type} ${var_} : ${cont}) {\n    ${body}\n}`,
      forLoop: (init, cond, incr, body) => `for (${init}; ${cond}; ${incr}) {\n    ${body}\n}`,
      funcDef: (returnType, name, params, body) => `${returnType} ${name}(${params}) {\n    ${body}\n}`,
      classDef: (name, parent, body) => parent
        ? `class ${name} : public ${parent} {\npublic:\n    ${body}\n};`
        : `class ${name} {\npublic:\n    ${body}\n};`,
      templateFunc: (T, returnType, name, params, body) => `template<typename ${T}>\n${returnType} ${name}(${params}) {\n    ${body}\n}`,
      smartPtr: (type, name, val) => `std::unique_ptr<${type}> ${name} = std::make_unique<${type}>(${val});`,
      vectorDecl: (type, name) => `std::vector<${type}> ${name};`,
      include: (header) => `#include <${header}>`,
    },
    
    conventions: [
      'Prefer smart pointers (unique_ptr, shared_ptr) over raw pointers',
      'Use RAII: resources are acquired in constructor, released in destructor',
      'Prefer const wherever possible: const std::string& name',
      'Use auto for complex type declarations',
      'Prefer range-based for loops over indexed loops',
      'Use nullptr instead of NULL or 0',
      'Use std::string over C-style char arrays',
    ],
    
    codeStyle: 'C++ Core Guidelines',
    fileExtension: '.cpp',
    runCommand: 'g++ -std=c++17 -o program filename.cpp && ./program',
  },

  // ── SQL ───────────────────────────────────────────────────
  sql: {
    name: 'SQL',
    version: 'SQL:2016 / MySQL 8 / PostgreSQL 15',
    paradigm: 'Declarative, Set-based',
    indent: '  ',
    commentSingle: '--',
    commentMulti: ['/*', '*/'],
    nil: 'NULL',
    boolTrue: 'TRUE',
    boolFalse: 'FALSE',

    // Core Step 7 requirements
    syntax: 'Declarative language. Semicolons separate statements.',
    printing: 'SELECT "Output message";',
    variables: 'SET @studentAge = 20;',
    functions: 'CREATE FUNCTION calculateScore(baseScore INT, bonusPoints INT) RETURNS INT BEGIN ... END;',
    loops: 'WHILE score < 100 DO ... END WHILE;',
    conditionals: 'CASE WHEN score >= 90 THEN "Excellent" ELSE "Pass" END',
    collections: 'Relational tables and rows.',
    classes: 'Not natively supported.',
    packages: 'DB extensions/schemas.',
    imports: 'Not applicable (use libraries/drivers in host languages).',
    testing: 'tSQLt, pgTAP',
    idioms: 'Set-based queries instead of iterative loops. Table joins.',
    styleConventions: 'Uppercase keywords (SELECT, FROM), snake_case for tables/columns.',
    
    keywords: {
      print: (val) => `SELECT ${val};`,
      varDecl: (name, val) => `SET @${name} = ${val};`,
      constDecl: (name, val) => `-- Constant reference: ${name} = ${val}`,
      select: (cols, table, where) => where
        ? `SELECT ${cols}\nFROM ${table}\nWHERE ${where};`
        : `SELECT ${cols}\nFROM ${table};`,
      insertInto: (table, cols, vals) => `INSERT INTO ${table} (${cols})\nVALUES (${vals});`,
      updateSet: (table, set, where) => `UPDATE ${table}\nSET ${set}\nWHERE ${where};`,
      deleteFrom: (table, where) => `DELETE FROM ${table}\nWHERE ${where};`,
      createTable: (name, cols) => `CREATE TABLE ${name} (\n  ${cols}\n);`,
      joinClause: (type, table, on) => `${type} JOIN ${table} ON ${on}`,
      groupBy: (cols) => `GROUP BY ${cols}`,
      orderBy: (cols) => `ORDER BY ${cols}`,
      having: (cond) => `HAVING ${cond}`,
      ifBlock: (cond, then, else_) => `CASE WHEN ${cond} THEN ${then} ELSE ${else_} END`,
    },
    
    conventions: [
      'Use snake_case for table and column names: order_items, customer_email',
      'Keyword casing: UPPERCASE SQL keywords for readability',
      'Always use explicit column names — avoid SELECT *',
      'Use meaningful table aliases: customers AS c, orders AS o',
      'Index foreign key columns for JOIN performance',
      'Use transactions for multi-step operations',
      'Always test queries on a development database before production',
    ],
    
    codeStyle: 'ANSI SQL + vendor best practices',
    fileExtension: '.sql',
    runCommand: 'mysql -u user -p database < filename.sql',
  },

  // ── HTML ──────────────────────────────────────────────────
  html: {
    name: 'HTML',
    version: 'HTML5',
    paradigm: 'Markup Language, Document Structure',
    indent: '  ',
    commentSingle: '',
    commentMulti: ['<!--', '-->'],
    nil: '',

    // Core Step 7 requirements
    syntax: 'Tagged markup language.',
    printing: '<p>Output message</p>',
    variables: '<span id="studentAge">20</span>',
    functions: 'Not applicable.',
    loops: 'Not applicable.',
    conditionals: 'Not applicable.',
    collections: 'DOM elements, Lists (ul, ol).',
    classes: 'Not applicable (uses class attributes for CSS).',
    packages: 'Not applicable.',
    imports: '<link rel="stylesheet" href="...">\n<script src="..."></script>',
    testing: 'W3C Validator, Axe Accessibility',
    idioms: 'Semantic tags (<main>, <section>).',
    styleConventions: 'Lowercase tags and attributes. Indent child tags.',
    
    keywords: {
      print: (val) => `<p>${val}</p>`,
      varDecl: (name, val) => `<span id="${name}">${val}</span>`,
      element: (tag, attrs, content) => `<${tag}${attrs ? ' ' + attrs : ''}>${content}</${tag}>`,
      voidElement: (tag, attrs) => `<${tag}${attrs ? ' ' + attrs : ''}>`,
      attribute: (name, val) => `${name}="${val}"`,
      classAttr: (names) => `class="${names}"`,
      idAttr: (name) => `id="${name}"`,
      dataAttr: (name, val) => `data-${name}="${val}"`,
    },
    
    conventions: [
      'Use semantic elements: <header>, <nav>, <main>, <article>, <footer>',
      'Always include alt text on images for accessibility',
      'Use lowercase element and attribute names',
      'Validate HTML with W3C validator',
      'Structure: doctype, html, head, body hierarchy',
    ],
    
    codeStyle: 'W3C / WHATWG HTML Living Standard',
    fileExtension: '.html',
    runCommand: 'Open in browser',
  },

  // ── CSS ───────────────────────────────────────────────────
  css: {
    name: 'CSS',
    version: 'CSS3 / Modern CSS',
    paradigm: 'Stylesheet Language, Visual Presentation',
    indent: '  ',
    commentSingle: '',
    commentMulti: ['/*', '*/'],
    nil: 'none',

    // Core Step 7 requirements
    syntax: 'Rule-based layout language using curly braces and colon declarations.',
    printing: '.output { content: "Output message"; }',
    variables: ':root {\n  --student-age: 20;\n}',
    functions: 'color: rgb(255, 0, 0);\nwidth: calc(100% - 20px);',
    loops: 'Not applicable.',
    conditionals: '@media (max-width: 600px) {\n  ...\n}',
    collections: 'Selectors listing multiple elements.',
    classes: 'CSS classes (.card, .btn).',
    packages: 'Not applicable (uses package managers like npm for CSS preprocessors).',
    imports: '@import url("styles.css");',
    testing: 'Lighthouse audits, Stylelint',
    idioms: 'Flexbox centering, Grid layouts, custom properties.',
    styleConventions: 'BEM naming conventions, lowercase properties.',
    
    keywords: {
      rule: (selector, props) => `${selector} {\n  ${props}\n}`,
      property: (name, val) => `${name}: ${val};`,
      mediaQuery: (condition, rules) => `@media (${condition}) {\n  ${rules}\n}`,
      variable: (name, val) => `--${name}: ${val};`,
      useVariable: (name) => `var(--${name})`,
      flexContainer: () => `display: flex;\njustify-content: center;\nalign-items: center;`,
      gridContainer: (cols) => `display: grid;\ngrid-template-columns: ${cols};`,
      animation: (name, duration, props) => `@keyframes ${name} {\n  ${props}\n}\n.element { animation: ${name} ${duration}; }`,
    },
    
    conventions: [
      'Use BEM naming: .card__title, .card--highlighted',
      'Define design tokens as CSS custom properties (variables)',
      'Mobile-first: write base styles for small screens, then media queries for larger',
      'Avoid !important; use specificity management instead',
      'Group related properties together in a logical order',
    ],
    
    codeStyle: 'BEM / CSS Modules / Modern CSS',
    fileExtension: '.css',
    runCommand: 'Link in HTML <link rel="stylesheet" href="style.css">',
  },

};

/**
 * Gets the language profile for a given language identifier.
 */
function getProfile(lang) {
  const normalized = (lang || 'javascript').toLowerCase()
    .replace('reactjs', 'javascript')
    .replace('nodejs', 'javascript')
    .replace('node.js', 'javascript')
    .replace('typescript', 'javascript');
  
  return LANGUAGE_PROFILES[normalized] || LANGUAGE_PROFILES.javascript;
}

/**
 * Generates a language-specific code block.
 */
function codeBlock(lang, code) {
  const normalizedLang = (lang || 'javascript').toLowerCase();
  return `\`\`\`${normalizedLang}\n${code}\n\`\`\``;
}

/**
 * Returns the print statement for a given language and value.
 */
function printStatement(lang, value) {
  const profile = getProfile(lang);
  return profile.keywords.print(value);
}

/**
 * Returns a variable declaration for a given language.
 */
function varDeclaration(lang, name, value) {
  const profile = getProfile(lang);
  if (lang === 'c' || lang === 'cpp' || lang === 'java') {
    return profile.keywords.typedVar ? profile.keywords.typedVar('int', name, value) : `${name} = ${value}`;
  }
  return profile.keywords.varDecl(name, value);
}

module.exports = { getProfile, codeBlock, printStatement, varDeclaration, LANGUAGE_PROFILES };

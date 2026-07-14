// ============================================================
// backend/services/conceptDetector.js
// EduNet Human Teaching Engine — Concept Detection Service
// ============================================================
'use strict';

/**
 * Normalizes a topic/title and detects Language, Category, Subcategory, Concept, Difficulty, and Prerequisites.
 * @param {string} topic - The title of the lesson/module.
 * @param {string} lang - The programming language.
 * @returns {Object} Detected concept metadata metadata.
 */
function detect(topic, lang = 'javascript') {
  const t = (topic || '').toLowerCase();
  const normalizedLang = (lang || 'javascript').toLowerCase();

  // ConceptDNA mapping database
  let category = 'General Programming';
  let subcategory = 'Fundamentals';
  let concept = 'General Programming';
  let difficulty = 'Beginner';
  let prerequisites = [];

  // Match Python Introduction & Setup
  if (t.includes('python') && (t.includes('introduction') || t.includes('setup') || t.includes('start'))) {
    category = 'Python Basics';
    subcategory = 'Setup & Environment';
    concept = 'Python Introduction';
    difficulty = 'Beginner';
    prerequisites = [];
  }
  // Match loop concepts
  else if (t.includes('for_loop') || t.includes('for loop') || (t.includes('loop') && t.includes('for'))) {
    category = 'Control Flow';
    subcategory = 'Loop Structures';
    concept = 'Loops';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  } else if (t.includes('while_loop') || t.includes('while loop') || (t.includes('loop') && t.includes('while'))) {
    category = 'Control Flow';
    subcategory = 'Loop Structures';
    concept = 'Loops';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  } else if (t.includes('break')) {
    category = 'Control Flow';
    subcategory = 'Loop Control';
    concept = 'Loops';
    difficulty = 'Intermediate';
    prerequisites = ['Loops'];
  } else if (t.includes('continue')) {
    category = 'Control Flow';
    subcategory = 'Loop Control';
    concept = 'Loops';
    difficulty = 'Intermediate';
    prerequisites = ['Loops'];
  } else if (t.includes('loop') || t.includes('iteration') || t.includes('repeat')) {
    category = 'Control Flow';
    subcategory = 'Loop Structures';
    concept = 'Loops';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  }

  // Match condition/if statements
  else if (t.includes('nested if') || t.includes('nested_if')) {
    category = 'Control Flow';
    subcategory = 'Conditional Statements';
    concept = 'If Statements';
    difficulty = 'Intermediate';
    prerequisites = ['If Statements'];
  } else if (t.includes('if-else') || t.includes('if else') || t.includes('if_else')) {
    category = 'Control Flow';
    subcategory = 'Conditional Statements';
    concept = 'If Statements';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  } else if (t.includes('elif') || t.includes('else if') || t.includes('switch') || t.includes('match')) {
    category = 'Control Flow';
    subcategory = 'Conditional Statements';
    concept = 'If Statements';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  } else if (t.includes('if') || t.includes('condition') || t.includes('decis') || t.includes('control flow') || t.includes('branching') || t.includes('logic')) {
    category = 'Control Flow';
    subcategory = 'Conditional Statements';
    concept = 'If Statements';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Boolean Logic'];
  }

  // Match variables & constants
  else if (t.includes('constant')) {
    category = 'Variables & Memory';
    subcategory = 'Data Storage';
    concept = 'Constants';
    difficulty = 'Beginner';
    prerequisites = ['Variables'];
  } else if (t.includes('variable') || t.includes('assign') || t.includes('let') || t.includes('data type') || t.includes('data_type')) {
    category = 'Variables & Memory';
    subcategory = 'Data Storage';
    concept = 'Variables';
    difficulty = 'Beginner';
    prerequisites = [];
  }

  // Match OOP: inheritance, polymorphism, classes, objects, abstraction
  else if (t.includes('polymorphism')) {
    category = 'Object-Oriented Programming';
    subcategory = 'Core Pillars';
    concept = 'Polymorphism';
    difficulty = 'Advanced';
    prerequisites = ['Classes', 'Inheritance'];
  } else if (t.includes('inheritance')) {
    category = 'Object-Oriented Programming';
    subcategory = 'Core Pillars';
    concept = 'Inheritance';
    difficulty = 'Intermediate';
    prerequisites = ['Classes', 'Objects'];
  } else if (t.includes('class')) {
    category = 'Object-Oriented Programming';
    subcategory = 'Core Structure';
    concept = 'Classes';
    difficulty = 'Intermediate';
    prerequisites = ['Objects', 'Functions'];
  } else if (t.includes('object') || t.includes('oop') || t.includes('abstraction') || t.includes('encapsulation') || t.includes('structure')) {
    category = 'Object-Oriented Programming';
    subcategory = 'Core Structure';
    concept = 'Objects';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Functions'];
  }

  // Match Stack / Queue / Heap
  else if (t.includes('stack')) {
    category = 'Data Structures';
    subcategory = 'Linear Structures';
    concept = 'Stack';
    difficulty = 'Intermediate';
    prerequisites = ['Arrays', 'Pointers'];
  } else if (t.includes('queue')) {
    category = 'Data Structures';
    subcategory = 'Linear Structures';
    concept = 'Queue';
    difficulty = 'Intermediate';
    prerequisites = ['Arrays', 'Pointers'];
  } else if (t.includes('linked list') || t.includes('linked_list')) {
    category = 'Data Structures';
    subcategory = 'Linked Structures';
    concept = 'Linked List';
    difficulty = 'Intermediate';
    prerequisites = ['Pointers'];
  } else if (t.includes('hashmap') || t.includes('hash map') || t.includes('dictionary') || t.includes('hashing')) {
    category = 'Data Structures';
    subcategory = 'Key-Value Storage';
    concept = 'Hash Map';
    difficulty = 'Intermediate';
    prerequisites = ['Arrays'];
  } else if (t.includes('tree')) {
    category = 'Data Structures';
    subcategory = 'Hierarchical Structures';
    concept = 'Tree';
    difficulty = 'Advanced';
    prerequisites = ['Recursion', 'Linked List'];
  } else if (t.includes('graph')) {
    category = 'Data Structures';
    subcategory = 'Relational Networks';
    concept = 'Graph';
    difficulty = 'Advanced';
    prerequisites = ['Tree', 'Stack', 'Queue'];
  } else if (t.includes('array') || t.includes('list')) {
    category = 'Data Structures';
    subcategory = 'Linear Structures';
    concept = 'Arrays';
    difficulty = 'Beginner';
    prerequisites = ['Variables'];
  }

  // Match recursion
  else if (t.includes('recursion') || t.includes('recursive')) {
    category = 'Variables & Memory';
    subcategory = 'Reusability';
    concept = 'Recursion';
    difficulty = 'Advanced';
    prerequisites = ['Functions', 'Call Stack'];
  }

  // Match functions
  else if (t.includes('func') || t.includes('method') || t.includes('parameter') || t.includes('return')) {
    category = 'Variables & Memory';
    subcategory = 'Reusability';
    concept = 'Functions';
    difficulty = 'Beginner';
    prerequisites = ['Variables', 'Control Flow'];
  }

  // Match SQL / Join / Databases
  else if (t.includes('join')) {
    category = 'Database Management';
    subcategory = 'Table Relations';
    concept = 'SQL JOIN';
    difficulty = 'Intermediate';
    prerequisites = ['Schema Basics'];
  } else if (t.includes('index')) {
    category = 'Database Management';
    subcategory = 'Performance';
    concept = 'Indexes';
    difficulty = 'Advanced';
    prerequisites = ['Schema Basics'];
  } else if (t.includes('group') || t.includes('aggregate')) {
    category = 'Database Management';
    subcategory = 'Queries';
    concept = 'Database';
    difficulty = 'Intermediate';
    prerequisites = ['Schema Basics'];
  } else if (t.includes('sql') || t.includes('database') || t.includes('query') || t.includes('schema')) {
    category = 'Database Management';
    subcategory = 'Fundamentals';
    concept = 'Database';
    difficulty = 'Beginner';
    prerequisites = [];
  }

  // Match REST API / HTTP / JSON
  else if (t.includes('rest api') || t.includes('api') || t.includes('fetch')) {
    category = 'Web Development';
    subcategory = 'Web APIs';
    concept = 'REST API';
    difficulty = 'Intermediate';
    prerequisites = ['Functions', 'HTTP'];
  } else if (t.includes('http') || t.includes('request') || t.includes('response')) {
    category = 'Web Development';
    subcategory = 'Client-Server Communication';
    concept = 'HTTP';
    difficulty = 'Beginner';
    prerequisites = [];
  } else if (t.includes('json') || t.includes('structured data')) {
    category = 'Web Development';
    subcategory = 'Structured Formats';
    concept = 'JSON';
    difficulty = 'Beginner';
    prerequisites = [];
  }

  // Match Pointers
  else if (t.includes('pointer') || t.includes('address') || t.includes('reference') || t.includes('memory')) {
    category = 'System Programming';
    subcategory = 'Memory Addresses';
    concept = 'Pointers';
    difficulty = 'Intermediate';
    prerequisites = ['Variables'];
  }

  return {
    language: normalizedLang,
    category,
    subcategory,
    concept,
    difficulty,
    prerequisites
  };
}

module.exports = {
  detect
};

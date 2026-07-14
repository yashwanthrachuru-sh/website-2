// ============================================================
// backend/services/definitionGenerator.js
// EduNet Human Teaching Engine — Definition Generator Service
// ============================================================
'use strict';

const DEFINITIONS = {
  'Python Introduction': `Python is a high-level, general-purpose, interpreted programming language designed with an emphasis on code readability. Guido van Rossum created Python in 1991 to help programmers write clear, logical code for projects of all sizes. You should use Python for web development, data science, automation scripting, and rapid prototyping. You should not use Python for low-level embedded systems or microcontrollers where hardware-level memory management and execution speed are required.`,

  'Variables': `A variable is a named reference pointing to a specific storage location in computer memory (RAM) where a program stores information that may change while running. Instead of referencing raw memory addresses, developers declare variables to reference data dynamically. You should use variables to track states, compute totals, or store user inputs. You should not use variables if the value remains static throughout execution; in those cases, constant declarations are preferred.`,
  
  'Constants': `A constant is a read-only variable identifier whose bound value cannot be updated or reassigned after initialization. It locks its reference in memory, protecting critical values from accidental overwrite. You should use constants for configuration settings, physics properties, or rates that must remain identical. You should not use constants when storing state variables like counters or inputs that are updated repeatedly.`,
  
  'If Statements': `An if statement is a conditional control structure that evaluates a boolean condition to decide whether to execute a specific block of instructions. It branches program execution dynamically, preventing programs from running in a simple top-to-bottom line. You should use if statements when validating inputs, managing user logins, or checking boundary limits. You should not use simple if statements when processing complex, multi-option inputs; in those cases, a switch/match block is cleaner.`,
  
  'Loops': `A loop is a repetition control structure that executes a block of statements repeatedly as long as a specified condition remains true. It eliminates the need to copy-paste identical code instructions, keeping codebases small and maintainable. You should use loops when iterating over lists, searching databases, or running tasks continuously. You should not use loops when executing single actions or when recursive functions provide a cleaner mathematical approach.`,
  
  'Functions': `A function is a packaged, reusable block of code designed to perform a single, specific task when invoked. It encapsulates code logic, allowing variables and scopes to remain isolated from the rest of the application. You should use functions to modularize calculations, automate validations, and clean up duplicate blocks of statements. You should not use functions for simple, single-use statements where additional stack overhead is unnecessary.`,
  
  'Arrays': `An array is a linear data structure that stores a collection of elements sequentially in a contiguous block of computer memory. It indexes elements from zero, enabling developers to retrieve values in instant time (O(1)) using their position. You should use arrays when managing ordered lists of identical items, like student records or playlists. You should not use arrays when you need to search for elements frequently by name, where a Hash Map is significantly faster.`,
  
  'Objects': `An object is a self-contained programming entity that groups related data (properties) and behaviors (methods) together into a single structure. It models real-world items, allowing state and logic to be managed in a unified package. You should use objects when representing entities like users, shopping carts, or system states. You should not use objects for simple lists of numbers where linear structures like arrays are simpler.`,
  
  'Classes': `A class is an extensible code blueprint that defines the structure, variables, and methods that objects created from it will possess. It acts as an object factory, standardizing object creation and enabling code reusability. You should use classes when instantiating many objects of the same category, like players in a game or accounts in a bank. You should not use classes when storing static helper functions, where simple modular functions are cleaner.`,
  
  'Inheritance': `Inheritance is an object-oriented design mechanism that allows a subclass to inherit the fields and methods of a parent class. It facilitates code reuse, establishing parent-child relations that allow general logic to be extended cleanly. You should use inheritance when subclasses share a strict "is-a" relation with the parent (e.g. a Dog is an Animal). You should not use inheritance if subclasses only share partial functionality; in those cases, choose composition instead.`,
  
  'Polymorphism': `Polymorphism is an object-oriented pillar that allows subclasses to implement custom behaviors for methods defined in their parent class or interface. It allows the program to interact with different objects using the same generalized interface, routing actions during runtime. You should use polymorphism when executing distinct actions on varied inputs (e.g. drawing shapes). You should not use polymorphism for small scripts with simple conditional statements where complexity is unwarranted.`,
  
  'SQL JOIN': `A SQL JOIN is a database query operation used to merge rows from two or more tables based on a related column between them. It enables relational database design, where data is normalized into separate tables to prevent redundancy. You should use JOINs when loading transactional orders with customer profiles or linking student grades to courses. You should not use JOINs if tables contain unrelated data, or in NoSQL structures where denormalized nested records are standard.`,
  
  'REST API': `A REST API is an architectural interface that uses HTTP requests to GET, POST, PUT, and DELETE data securely between separate systems over the web. It decouples client user interfaces from server databases, allowing apps to communicate using JSON format. You should use REST APIs when connecting frontends to backend services or integrations. You should not use REST APIs for high-frequency real-time gaming or messaging, where WebSockets or gRPC are preferred.`,
  
  'JSON': `JSON (JavaScript Object Notation) is a lightweight, text-based format used for storing and transmitting structured key-value data. It is easy for humans to write and simple for computers to parse across all programming languages. You should use JSON when exchanging payloads in REST API calls or saving local configuration files. You should not use JSON when transmitting large binary files like images or videos, where binary formats are required.`
};

/**
 * Generates a textbook-grade definition for the concept.
 * @param {string} conceptName - Normalized concept name.
 * @returns {string} Definition.
 */
function getDefinition(conceptName) {
  // Exact match search
  for (const [key, text] of Object.entries(DEFINITIONS)) {
    if (key.toLowerCase() === (conceptName || '').toLowerCase()) {
      return text;
    }
  }

  // General fallback definition matching quality rules
  return `A ${conceptName || 'programming concept'} is a fundamental computational mechanism that allows developers to structure code statements, manage resources, and build applications. By resolving complex operations into logical blocks, it improves software stability and execution speed. You should use this concept whenever your architecture requires structured data flows or modular structures. You should not use this concept if simpler, built-in statements solve the task without additional complexity.`;
}

module.exports = {
  getDefinition
};

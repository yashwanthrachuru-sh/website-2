// ============================================================
// backend/services/quizGenerator.js
// EduNet Human Teaching Engine — Quiz Generator Service
// ============================================================
'use strict';

const QUIZ_BANK = {
  'Python Introduction': {
    mcqs: [
      { q: 'Who created the Python programming language in 1991?', o: ['A) Dennis Ritchie', 'B) Bjarne Stroustrup', 'C) Guido van Rossum', 'D) James Gosling'], a: 'C', e: 'Guido van Rossum designed and released Python in 1991 with a focus on code readability.' },
      { q: 'What is the role of the Python Virtual Machine (PVM)?', o: ['A) To download Python packages', 'B) To execute compiled bytecode instructions step-by-step', 'C) To edit source script files', 'D) To compile C++ codes'], a: 'B', e: 'The PVM acts as the interpreter execution runtime loop for compiled bytecode.' },
      { q: 'Which terminal command runs a Python script named hello.py?', o: ['A) compile hello.py', 'B) run hello.py', 'C) python3 hello.py', 'D) execute hello.py'], a: 'C', e: 'The standard python3 CLI tool executes script files directly.' }
    ],
    practices: [
      { title: 'Your First Script', desc: 'Write a script using the print function to output "Hello, World!" to the screen.' }
    ]
  },
  'Variables': {
    mcqs: [
      { q: 'What is the primary role of a variable in memory?', o: ['A) To compile commands', 'B) To label a physical memory location (RAM) to hold data', 'C) To clear hardware registers', 'D) To define static layouts'], a: 'B', e: 'Variables map names to physical RAM addresses so data can be stored and referenced.' },
      { q: 'Which is a best practice for naming variables?', o: ['A) Use single letters like x, y, z', 'B) Use short codes like usr_t_sc', 'C) Use descriptive names like student_marks', 'D) Use numerical names like 1st_name'], a: 'C', e: 'Descriptive naming makes variables self-documenting and easy to read.' },
      { q: 'What error typically occurs when accessing an undeclared variable?', o: ['A) SyntaxError', 'B) ReferenceError or NameError', 'C) TypeError', 'D) DivisionByZeroError'], a: 'B', e: 'The execution engine raises a NameError/ReferenceError if the symbol name does not exist in the identifier table.' }
    ],
    practices: [
      { title: 'Declaring scores', desc: 'Create a variable named student_marks and initialize it to 85. Print it to check execution.' },
      { title: 'Updating totals', desc: 'Add 15 to the student_marks variable dynamically. Output the updated value.' }
    ]
  },
  'Constants': {
    mcqs: [
      { q: 'Why do constants exist in programming?', o: ['A) To make code compile faster', 'B) To declare values that should not change during execution', 'C) To allocate heap structures', 'D) To support dynamic scoping'], a: 'B', e: 'Constants lock reference variables to prevent accidental reassignments.' },
      { q: 'What happens if you try to reassign a constant variable in JavaScript?', o: ['A) The compiler ignores it', 'B) It throws a TypeError', 'C) It restarts the computer', 'D) The value updates anyway'], a: 'B', e: 'Reassigning a const binding raises a TypeError: Assignment to constant variable.' },
      { q: 'Which variable name represents a standard constant naming format?', o: ['A) taxRate', 'B) tax_rate', 'C) TAX_RATE', 'D) Tax_rate'], a: 'C', e: 'Uppercase letters with underscores are standard conventions for constant values.' }
    ],
    practices: [
      { title: 'Locking Tax Rates', desc: 'Declare a constant TAX_RATE equal to 0.15. Attempt to reassign it to 0.18 and check the compiler error.' }
    ]
  },
  'If Statements': {
    mcqs: [
      { q: 'What is the primary function of an if statement?', o: ['A) To duplicate code statements', 'B) To branch code execution based on conditional checks', 'C) To perform mathematical division', 'D) To allocate stack variables'], a: 'B', e: 'If statements route execution counters depending on Boolean checks.' },
      { q: 'What operator represents logical comparison check?', o: ['A) =', 'B) == or ===', 'C) =>', 'D) +='], a: 'B', e: 'Logical checks require comparison operators. The single equals symbol performs assignments.' },
      { q: 'When is a nested if statement appropriate?', o: ['A) For all decisions', 'B) When one condition check depends on another condition check succeeding', 'C) For loops execution', 'D) When memory is constrained'], a: 'B', e: 'Nested conditions check secondary factors after primary filters pass.' }
    ],
    practices: [
      { title: 'Validating Age checks', desc: 'Write a conditional checking if user_age is greater than or equal to 18. Print access allowed or access denied.' }
    ]
  },
  'Loops': {
    mcqs: [
      { q: 'What problem is resolved by loops?', o: ['A) Memory allocation limits', 'B) Code duplication when repeating identical tasks', 'C) Scoping lookup warnings', 'D) Typing formatting checks'], a: 'B', e: 'Loops automate repeating statement blocks, keeping scripts small.' },
      { q: 'What happens when a loop exit check is unreachable?', o: ['A) The program runs faster', 'B) An infinite loop runs, freezing execution', 'C) The compiler stops', 'D) The variable is deleted'], a: 'B', e: 'If boundary conditions never turn false, loops run indefinitely.' },
      { q: 'When should a for loop be preferred over a while loop?', o: ['A) When the number of iterations is known beforehand', 'B) When conditions check complex databases', 'C) When referencing constant variables', 'D) When memory is full'], a: 'A', e: 'For loops iterate over fixed ranges or bounds.' }
    ],
    practices: [
      { title: 'Printing repetitions', desc: 'Write a loop that prints the numbers 1 to 5 to check loops iteration.' }
    ]
  }
};

/**
 * Gets MCQs and exercises for the concept.
 * @param {string} conceptName - Normalized concept.
 * @returns {Object} Quizzes.
 */
function getQuiz(conceptName) {
  for (const [key, val] of Object.entries(QUIZ_BANK)) {
    if (key.toLowerCase() === (conceptName || '').toLowerCase()) {
      return val;
    }
  }

  // Fallback
  return {
    mcqs: [
      { q: `What is the main role of ${conceptName}?`, o: ['A) Compile instructions', 'B) Resolve structural problems cleanly', 'C) Delete data', 'D) Initialize hardware'], a: 'B', e: 'Every concept serves to resolve programmatic needs cleanly.' }
    ],
    practices: [
      { title: `Applying ${conceptName}`, desc: `Write a code block demonstrating the use of ${conceptName} in a clean script.` }
    ]
  };
}

module.exports = {
  getQuiz
};

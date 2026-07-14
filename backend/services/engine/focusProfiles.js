// ============================================================
// backend/services/engine/focusProfiles.js
// EduNet Content Engine — Reusable Focus Profiles (v6.2)
// Provides unique focus-specific lesson structures and compilers.
// ============================================================
'use strict';

const FOCUS_PROFILES = {
  // ── 1. INTRODUCTION ──────────────────────────────────────────
  'Introduction': {
    title: 'Introduction',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `${name} was created to solve critical software bottlenecks. ${conceptProfile.why_exists}`,
        importance: `Learning ${name} in ${langProfile.name} provides the essential foundation for mastering structured program architecture.`,
        learning_objectives: [
          `Understand the core motivation and historical context of ${name}.`,
          `Write your first basic syntax instructions implementing ${name}.`,
          `Understand how standard applications utilize this concept in production.`
        ],
        beginner_explanation: `Welcome to ${name}! ${conceptProfile.beginner_explanation} In this introduction, we inspect why developers need this mechanism and how it simplifies logical statements.`,
        detailed_concept: `${conceptProfile.detailed_concept} In this introductory segment, we focus on the high-level virtual machine or compiler lifecycle.`,
        internal_working: `At startup, the runtime initializes tables for this scope. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 2. SETUP & ENVIRONMENT ───────────────────────────────────
  'Setup': {
    title: 'Setup & Environment',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Without a properly configured environment, compilers or runtime interpreters cannot locate library paths for ${name}, throwing path configuration errors.`,
        importance: `Establishing a correct compiler setup ensures that scripts compile quickly without path resolution alerts.`,
        learning_objectives: [
          `Install the correct ${langProfile.name} execution runtime version (${langProfile.version || 'latest'}).`,
          `Configure environmental path variables to recognize compile commands.`,
          `Verify verification scripts inside your shell console.`
        ],
        beginner_explanation: `Let's set up the coding environment for ${name}! Before writing code, we need to install the execution interpreter and configure standard folder paths.`,
        detailed_concept: `Environment paths map execution commands. ${conceptProfile.detailed_concept} Verify your settings using terminal query options.`,
        internal_working: `System loader commands link runtime executable packages. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 3. SYNTAX OVERVIEW ────────────────────────────────────────
  'Syntax': {
    title: 'Syntax Overview',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Compilers require strict spelling grammar rules. Incorrect syntax crashes parsing scripts before execution begins.`,
        importance: `Writing clean syntax prevents compilation crashes and makes blocks readable for other team developers.`,
        learning_objectives: [
          `Master standard keywords and brackets rules for ${name}.`,
          `Recognize correct parameters and return definitions.`,
          `Identify how operators configure assignments.`
        ],
        beginner_explanation: `Syntax represents the spelling rules of a programming language. Let's inspect the grammatical guidelines to declare and write ${name} statements in ${langProfile.name}.`,
        detailed_concept: `Syntactic compiler tokens: ${conceptProfile.detailed_concept} Following strict style conventions helps V8/PVM engines optimize code paths.`,
        internal_working: `The lexical parser converts statements into abstract syntax trees. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 4. CONTROL FLOW & BRANCHING ──────────────────────────────
  'Control Flow': {
    title: 'Control Flow & Logic',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Applications must make branching decisions. Control flow evaluates dynamic expressions to route instructions.`,
        importance: `Directing execution branches dynamically allows software to respond to user settings and database thresholds.`,
        learning_objectives: [
          `Learn how ${name} participates inside logical expressions.`,
          `Apply comparison operators to evaluate dynamic conditions.`,
          `Route program instructions across alternative branches.`
        ],
        beginner_explanation: `Control flow lets programs make choices. Instead of running every line sequentially, we use conditional gates to decide which paths execute based on ${name} values.`,
        detailed_concept: `Branching instructions alter CPU execution pointers. ${conceptProfile.detailed_concept} The ALU processes logic flags to determine block routing.`,
        internal_working: `Processes logical statements, setting memory status indicators to control execution jumps. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 5. LOOPS & ITERATION ─────────────────────────────────────
  'Logic': {
    title: 'Logic & Iteration',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Repeating calculations manually is repetitive and inflates software scripts. Iteration loops automate repetitions at CPU speeds.`,
        importance: `Loop structures process data arrays and lists efficiently, managing index counters automatically.`,
        learning_objectives: [
          `Apply loop cycles (for, while) to traverse elements related to ${name}.`,
          `Manage iteration counter variables without creating freezes.`,
          `Implement break and continue gates inside loop cycles.`
        ],
        beginner_explanation: `Iteration loops automate repeating tasks. We instruct the computer to execute a block of statements multiple times until a condition changes.`,
        detailed_concept: `Loop frames allocate registers to track index values. ${conceptProfile.detailed_concept} Branch prediction optimizes loop returns.`,
        internal_working: `The virtual machine sets up jumps, incrementing counters in stack frames before checking conditions. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 6. FUNCTIONS & MODULES ───────────────────────────────────
  'Functions': {
    title: 'Functional Design',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Monolithic script files are difficult to read and test. Packing actions into callable functions modularizes features cleanly.`,
        importance: `Functions wrap complex statements, taking parameters and returning values to separate concerns.`,
        learning_objectives: [
          `Encapsulate statements inside callable functions related to ${name}.`,
          `Map parameters and return values safely inside method signatures.`,
          `Control variable scope scope levels across functional execution stacks.`
        ],
        beginner_explanation: `Functions are like shortcuts for code. You package statements under a custom name, allowing you to run them anytime by calling that name.`,
        detailed_concept: `Invocation pushes clean frames onto the call stack. ${conceptProfile.detailed_concept} Local variables reside strictly inside this frame boundary.`,
        internal_working: `Allocates stack records storing parameter pointers, executing return instruction pointers on exit. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 7. CLASSES & STRUCTS ─────────────────────────────────────
  'Classes': {
    title: 'Object-Oriented Architecture',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Loose attributes and separate arrays lead to coordinate bugs. Classes bind state attributes and behavioral methods together into single models.`,
        importance: `Classes act as reusable templates, organizing attributes and behaviors to represent real-world concepts in code.`,
        learning_objectives: [
          `Declare custom class templates representing ${name}.`,
          `Define member attributes and constructor routines inside classes.`,
          `Instantiate object instances using new keywords.`
        ],
        beginner_explanation: `Classes are blueprints. If you build a house, the blueprint lists the rooms (attributes) and how doors open (methods). Each physical house built is an object instance.`,
        detailed_concept: `Class blueprints register types. ${conceptProfile.detailed_concept} Method pointers map to class vtables to handle object instances.`,
        internal_working: `Defines structure definitions, mapping instance object layouts in stack or heap partitions. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 8. OBJECTS & STATE ───────────────────────────────────────
  'Objects': {
    title: 'Object Properties & Instances',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Static blueprints do not store client states. Object instances hold individual values, managing state transitions dynamically.`,
        importance: `Working with instances allows programs to track distinct entity details (like separate user profiles or checkout carts) concurrently.`,
        learning_objectives: [
          `Access and modify instance attributes using dot notation structures.`,
          `Manage state mutations inside ${name} object parameters.`,
          `Track reference bindings in memory fields.`
        ],
        beginner_explanation: `Objects are instances created from blueprints. If "Dog" is a class, a beagle named "Buddy" is an object storing his own age and name values.`,
        detailed_concept: `Instances allocate slots dynamically in Heap memory. ${conceptProfile.detailed_concept} Pointers hold references pointing to these heap segments.`,
        internal_working: `Allocates variable storage on heap registers, returning reference address indexes to the stack. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 9. ENCAPSULATION & DATA SAFETY ───────────────────────────
  'Encapsulation': {
    title: 'Data Encapsulation & Safety',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Direct access to instance variables allows external scripts to overwrite variables with invalid values, causing crashes.`,
        importance: `Restricting access secures variables, requiring external scripts to use validation methods (getters/setters).`,
        learning_objectives: [
          `Apply private access modifiers to restrict variable access inside ${name}.`,
          `Expose secure public getter and setter validation methods.`,
          `Prevent state pollution by locking structural properties.`
        ],
        beginner_explanation: `Encapsulation acts like a capsule shell. It hides internal components, exposing only standard dial switches to verify that values stay safe.`,
        detailed_concept: `Compilers enforce visibility restrictions during compile parsing. ${conceptProfile.detailed_concept} Attempted direct reads trigger syntax errors.`,
        internal_working: `Applies compile-time visibility checks, blocking direct register references from outer classes. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 10. ABSTRACTION & INTERFACES ─────────────────────────────
  'Abstraction': {
    title: 'Interface Abstraction',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Interacting with complex internal subroutines bloats code structures. Abstraction hides low-level details behind clean interfaces.`,
        importance: `Interfaces standardize how systems communicate, allowing developers to swap sub-modules without editing main app files.`,
        learning_objectives: [
          `Define clean, abstract method interfaces for ${name}.`,
          `Hide internal calculations behind simple public gateways.`,
          `Implement abstract interfaces across alternative class models.`
        ],
        beginner_explanation: `Abstraction is like driving a car. You use a steering wheel and pedals (Interface) without needing to inspect the cylinders or fuel injectors (Internal details).`,
        detailed_concept: `Abstract models define specifications. ${conceptProfile.detailed_concept} Compilers enforce method implementation at compile-time.`,
        internal_working: `Resolves calls using method address tables (vtables), routing calls to implementation addresses. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 11. PERFORMANCE & OPTIMIZATION ───────────────────────────
  'Performance': {
    title: 'Performance & Complexity',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Suboptimal algorithms execute slowly as datasets grow, causing systems to hang. Performance analysis targets scaling issues.`,
        importance: `Optimizing code structures guarantees fast database and network operations when client counts scale.`,
        learning_objectives: [
          `Measure and analyze execution times for ${name} routines.`,
          `Compare algorithm complexities using Big-O time models.`,
          `Reduce memory overhead by avoiding garbage allocation steps.`
        ],
        beginner_explanation: `Performance checks verify how code scales. We analyze if an algorithm runs fast when managing thousands of rows, choosing optimal structures to avoid lag.`,
        detailed_concept: `Analyzes time/space scaling boundaries. ${conceptProfile.detailed_concept} Profiling tools trace hot paths to identify processing bottlenecks.`,
        internal_working: `Minimizes memory copies and context switching, aligning loops to execute inside CPU caches. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 12. ADVANCED CONCEPTS ────────────────────────────────────
  'Advanced Concepts': {
    title: 'Advanced Operations',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Standard features do not cover complex operations like concurrency, thread locks, or dynamic routing templates.`,
        importance: `Mastering advanced patterns is key to building highly scalable, enterprise-grade software.`,
        learning_objectives: [
          `Implement dynamic configurations related to ${name}.`,
          `Manage complex state variables and multi-thread interactions.`,
          `Avoid concurrency locks and state sync bugs.`
        ],
        beginner_explanation: `Now we explore advanced mechanisms. We inspect behind-the-scenes allocations and optimize concurrency paths inside ${langProfile.name}.`,
        detailed_concept: `Advanced execution states: ${conceptProfile.detailed_concept} The runtime manages advanced execution threads and garbage heaps.`,
        internal_working: `Locks execution blocks using mutexes, managing memory registers to prevent data race conditions. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 13. DEBUGGING & TROUBLESHOOTING ──────────────────────────
  'Debugging': {
    title: 'Debugging & Diagnostics',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Bugs, typos, and reference errors crash code. Debugging profiles help locate code mistakes, trace variable states, and read stack logs.`,
        importance: `Having a solid debugging workflow makes diagnosing, tracing, and resolving errors fast and straightforward.`,
        learning_objectives: [
          `Locate and read error line coordinates inside stack traces.`,
          `Inspect variable states at breakpoints during runtime steps.`,
          `Diagnose memory leaks and trace scoping issues.`
        ],
        beginner_explanation: `Debugging is detective work. We analyze crash logs to trace why variables did not hold expected values, repairing logic mistakes.`,
        detailed_concept: `Error dump tables record thread parameters. ${conceptProfile.detailed_concept} The compiler outputs debug symbols mapping lines to binary.`,
        internal_working: `The runtime traps crashes, outputting register values and stack frame lists to stderr. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 14. TESTING & ASSERTIONS ─────────────────────────────────
  'Testing': {
    title: 'Testing & Quality',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Manual regression checks are slow and miss bugs. Automated testing runs script suites to verify features stay working.`,
        importance: `Automated tests verify that updates do not break working modules, protecting software deployments.`,
        learning_objectives: [
          `Write structured assertions to test ${name} logic inputs.`,
          `Develop automated unit test routines using test frameworks.`,
          `Mock database outputs to run tests in isolation.`
        ],
        beginner_explanation: `Testing writes helper code to verify the main code. We feed inputs to a function, asserting that the output matches expected results.`,
        detailed_concept: `Tests verify assertions. ${conceptProfile.detailed_concept} Test runners evaluate exit statuses to report test coverage rates.`,
        internal_working: `Executes isolated test processes, verifying output assertions and logging errors. ${conceptProfile.internal_working}`,
      };
    }
  },

  // ── 15. BEST PRACTICES ───────────────────────────────────────
  'Best Practices': {
    title: 'Best Practices & Clean Code',
    compose: (concept, lang, conceptProfile, langProfile) => {
      const name = conceptProfile.concept || concept.conceptKey;
      return {
        why_exists: `Spaghetti code structures make maintenance difficult. Clean code guidelines enforce standard conventions.`,
        importance: `Following standard conventions makes configurations readable for other developers, easing future updates.`,
        learning_objectives: [
          `Apply language styling conventions (snake_case, camelCase) cleanly.`,
          `Avoid name collisions and restrict global variable definitions.`,
          `Structure code to support unit testing and documentation.`
        ],
        beginner_explanation: `Best practices help write clean code. We follow guidelines on names, comments, and file sizes to make code professional and readable.`,
        detailed_concept: `Static code analysis checks rules. ${conceptProfile.detailed_concept} Adhering to standards helps engines compile pathways efficiently.`,
        internal_working: `Compilers perform dead-code elimination, optimizing modules when layouts follow strict import bounds. ${conceptProfile.internal_working}`,
      };
    }
  }
};

// Map similar focuses to avoid missing keys
FOCUS_PROFILES['Testing & Quality'] = FOCUS_PROFILES['Testing'];
FOCUS_PROFILES['Debugging & Diagnostics'] = FOCUS_PROFILES['Debugging'];
FOCUS_PROFILES['Control Flow & Logic'] = FOCUS_PROFILES['Control Flow'];
FOCUS_PROFILES['Logic & Iteration'] = FOCUS_PROFILES['Logic'];
FOCUS_PROFILES['Functional Design'] = FOCUS_PROFILES['Functions'];
FOCUS_PROFILES['Object-Oriented Architecture'] = FOCUS_PROFILES['Classes'];
FOCUS_PROFILES['Object Properties & Instances'] = FOCUS_PROFILES['Objects'];
FOCUS_PROFILES['Data Encapsulation & Safety'] = FOCUS_PROFILES['Encapsulation'];
FOCUS_PROFILES['Interface Abstraction'] = FOCUS_PROFILES['Abstraction'];
FOCUS_PROFILES['Performance & Complexity'] = FOCUS_PROFILES['Performance'];
FOCUS_PROFILES['Advanced Operations'] = FOCUS_PROFILES['Advanced Concepts'];
FOCUS_PROFILES['Best Practices & Clean Code'] = FOCUS_PROFILES['Best Practices'];
FOCUS_PROFILES['Setup & Environment'] = FOCUS_PROFILES['Setup'];
FOCUS_PROFILES['Core Concepts'] = FOCUS_PROFILES['Introduction'];
FOCUS_PROFILES['Projects'] = FOCUS_PROFILES['Introduction'];
FOCUS_PROFILES['Exercises'] = FOCUS_PROFILES['Introduction'];
FOCUS_PROFILES['Interview Preparation'] = FOCUS_PROFILES['Introduction'];
FOCUS_PROFILES['Deployment'] = FOCUS_PROFILES['Setup'];
FOCUS_PROFILES['Packages'] = FOCUS_PROFILES['Setup'];

/**
 * Gets a focus profile template.
 */
function getProfile(focus) {
  const clean = String(focus || 'Introduction').trim();
  if (FOCUS_PROFILES[clean]) return FOCUS_PROFILES[clean];

  for (const [k, v] of Object.entries(FOCUS_PROFILES)) {
    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase())) {
      return v;
    }
  }

  // fallback
  return FOCUS_PROFILES['Introduction'];
}

module.exports = {
  getProfile,
  FOCUS_PROFILES
};

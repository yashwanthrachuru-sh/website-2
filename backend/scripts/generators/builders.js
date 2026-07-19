'use strict';

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function namingRules(lang) {
  const map = {
    python: ['Use snake_case for variables and functions', 'Use PascalCase for classes', 'Use UPPER_SNAKE_CASE for constants', 'Use lowercase for module names'],
    javascript: ['Use camelCase for variables and functions', 'Use PascalCase for classes and components', 'Use UPPER_SNAKE_CASE for constants', 'Use kebab-case for file names'],
    java: ['Use camelCase for variables and methods', 'Use PascalCase for classes', 'Use UPPER_SNAKE_CASE for constants', 'Use lowercase for packages'],
    typescript: ['Use camelCase for variables and functions', 'Use PascalCase for classes, interfaces, and types', 'Use UPPER_SNAKE_CASE for constants'],
    sql: ['Use UPPER_CASE for SQL keywords', 'Use snake_case for table and column names', 'Use singular for table names'],
    cpp: ['Use snake_case for functions and variables', 'Use PascalCase for classes', 'Use UPPER_SNAKE_CASE for macros'],
    c: ['Use snake_case for functions and variables', 'Use UPPER_SNAKE_CASE for macros', 'Use PascalCase for typedefs']
  };
  return map[lang] || map.javascript;
}

function mermaidDiagram(type) {
  const map = {
    CONDITIONALS: 'flowchart TD\n    A[Start] --> B{Condition?}\n    B -->|True| C[Execute If-Block]\n    B -->|False| D[Execute Else-Block]\n    C --> E[Continue]\n    D --> E\n    E --> F[End]',
    LOOPS: 'flowchart TD\n    A[Start] --> B[Initialize Counter]\n    B --> C{Condition True?}\n    C -->|Yes| D[Execute Loop Body]\n    D --> E[Update Counter]\n    E --> C\n    C -->|No| F[Exit Loop]',
    FUNCTIONS: 'flowchart LR\n    A[Call Function] --> B[Pass Arguments]\n    B --> C[Execute Body]\n    C --> D[Return Result]\n    D --> E[Caller Resumes]',
    VARIABLES: 'flowchart LR\n    subgraph Memory\n        A[Variable Name] --> B[Memory Address]\n        B --> C[Stored Value]\n    end\n    D[Assignment] --> A\n    E[Read Operation] --> A',
    LISTS: 'flowchart LR\n    subgraph List\n        A[Index 0] --> B[Index 1]\n        B --> C[Index 2]\n        C --> D[...]\n    end\n    E[Access by Index] -->|O(1)| A',
    LINKED_LIST: 'flowchart LR\n    A[Head] -->|next| B[Node 1]\n    B -->|next| C[Node 2]\n    C -->|next| D[Node 3]\n    D -->|next| E[null]',
    STACK: 'flowchart TB\n    subgraph Stack\n        A[Top] --> B[Item 2]\n        B --> C[Item 1]\n        C --> D[Bottom]\n    end\n    E[Push] --> A\n    A --> F[Pop]',
    QUEUE: 'flowchart LR\n    subgraph Queue\n        A[Front] --> B[Item 1]\n        B --> C[Item 2]\n        C --> D[Rear]\n    end\n    F[Enqueue] --> D\n    A --> G[Dequeue]',
    TREE: 'graph TD\n    A[Root] --> B[Left]\n    A --> C[Right]\n    B --> D[Leaf L]\n    B --> E[Leaf R]\n    C --> F[Leaf L]\n    C --> G[Leaf R]',
    RECURSION: 'flowchart TD\n    A[factorial(n)] --> B{n <= 1?}\n    B -->|Yes| C[Return 1]\n    B -->|No| D[Return n * factorial(n-1)]\n    D --> A',
    SORTING: 'flowchart TD\n    A[Unsorted] --> B[Compare Adjacent]\n    B --> C{In Order?}\n    C -->|No| D[Swap]\n    C -->|Yes| E[Move Next]\n    D --> E\n    E --> F{Pass Done?}\n    F -->|No| B\n    F -->|Yes| G{Sorted?}\n    G -->|No| A\n    G -->|Yes| H[Done]',
    SEARCHING: 'flowchart TD\n    A[Sorted Array] --> B[Find Middle]\n    B --> C{Target == Mid?}\n    C -->|Yes| D[Found!]\n    C -->|No| E{Target < Mid?}\n    E -->|Yes| F[Search Left]\n    E -->|No| G[Search Right]\n    F --> B\n    G --> B',
    OOP: 'classDiagram\n    class Animal {\n        +String name\n        +speak()\n    }\n    class Dog {\n        +speak()\n    }\n    Animal <|-- Dog',
    HASH_TABLE: 'flowchart LR\n    A[Key] --> B[Hash Function]\n    B --> C[Index]\n    C --> D[Slot]\n    D --> E[(Key, Value)]',
    GRAPH: 'graph LR\n    A[Node A] --- B[Node B]\n    A --- C[Node C]\n    B --- D[Node D]\n    C --- D',
    DYNAMIC_PROGRAMMING: 'flowchart TD\n    A[Problem] --> B[Subproblem 1]\n    A --> C[Subproblem 2]\n    B --> D[Base]\n    C --> D\n    D --> E[Memoize]\n    E --> F[Combine]\n    F --> G[Solution]',
    DATABASE: 'erDiagram\n    ENTITY {\n        int id PK\n        string name\n    }\n    ENTITY ||--o{ RELATED : has',
    COMPREHENSIONS: 'flowchart LR\n    A[Input] --> B[Transform]\n    B --> C{Filter?}\n    C -->|Pass| D[Output]\n    C -->|Fail| E[Skip]',
    FILE_IO: 'flowchart TD\n    A[Open File] --> B[Read/Write Data]\n    B --> C{More Data?}\n    C -->|Yes| B\n    C -->|No| D[Close File]\n    D --> E[Done]',
    EXCEPTIONS: 'flowchart TD\n    A[Try Block] --> B{Exception?}\n    B -->|No| C[Continue]\n    B -->|Yes| D[Exception Handler]\n    D --> E[Finally Block]\n    C --> E',
    MODULES: 'flowchart LR\n    A[Main] -->|import| B[Module A]\n    A -->|import| C[Module B]\n    B --> D[Function]\n    B --> E[Class]',
    GENERIC: 'flowchart TD\n    A[Input] --> B[Process]\n    B --> C[Output]'
  };
  const m = '```mermaid\n' + (map[type] || map.GENERIC) + '\n```';
  return m;
}

function buildBeginner(data, lang, conceptType) {
  return {
    curiosityQuestion: data.curiosityQuestion,
    whyExists: data.whyExists,
    problemItSolves: data.problemItSolves,
    withoutVariables: data.withoutVariables,
    whereUsed: data.whereUsed,
    realWorldAnalogy: data.realWorldAnalogy,
    simpleExplanation: data.simpleExplanation,
    syntaxExplanation: data.syntaxExplanation || 'Refer to the code examples below for syntax.',
    examples: data.examples || [],
    visualDiagram: mermaidDiagram(conceptType),
    stepByStepExecution: data.stepByStepExecution || [
      { step: 1, action: 'Understand the concept', explanation: 'Read through the explanation and examples.' },
      { step: 2, action: 'Write the code', explanation: 'Implement the concept in your own project.' },
      { step: 3, action: 'Test your implementation', explanation: 'Verify it works with different inputs.' }
    ],
    memoryDiagram: data.memoryDiagram || {
      stack: '[Stack]\n  Local variables and call context',
      heap: '[Heap]\n  Dynamic data structures'
    },
    namingRules: namingRules(lang),
    commonMistakes: data.commonMistakes || [
      'Not fully understanding the concept before using it',
      'Copying code without understanding why it works'
    ]
  };
}

function buildIntermediate(data, lang) {
  return {
    deeperExplanation: data.deeperExplanation || `This concept goes deeper when you consider how it interacts with other parts of your ${lang} program.`,
    mutabilityExplained: data.mutabilityExplained || `Consider whether your data structures should be mutable or immutable when implementing this pattern.`,
    noneValue: data.noneValue || 'Always check for null/None/undefined values — this is the most common source of runtime errors.',
    internalImplementation: data.internalImplementation || `The ${lang} runtime handles this efficiently behind the scenes.`,
    examples: data.intermediateExamples || data.examples || [],
    bestPractices: data.bestPractices || [
      'Validate inputs before processing',
      'Handle edge cases explicitly',
      'Write tests for both success and failure paths',
      'Document expected behavior'
    ],
    debuggingWalkthrough: data.debuggingWalkthrough || {
      scenario: 'A common bug occurs when edge cases are not handled properly.',
      steps: ['Reproduce the issue', 'Check input values', 'Verify assumptions', 'Test boundary conditions']
    },
    edgeCases: data.edgeCases || ['Empty input', 'Maximum values', 'Unexpected types', 'Resource exhaustion'],
    performanceNotes: data.performanceNotes || {
      notes: `Performance depends on the specific implementation. Profile to identify bottlenecks.`,
      bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n^2)' }
    }
  };
}

function buildExpert(data, lang, rmTitle) {
  return {
    overview: data.expertOverview || `At the expert level, this concept requires understanding ${lang} runtime internals and production optimization strategies.`,
    industryContext: data.industryContext || `In production ${rmTitle} systems, this pattern is implemented with attention to performance, security, and maintainability.`,
    examples: data.expertExamples || [],
    codeReviewChecklist: data.codeReviewChecklist || [
      'Does the implementation handle all error cases?',
      'Is the code readable and maintainable?',
      'Are there performance concerns?',
      'Is the approach appropriate for the scale?'
    ],
    testingPatterns: data.testingPatterns || {
      unitTests: 'Test individual components in isolation',
      integrationTests: 'Test with actual dependencies',
      propertyBasedTests: 'Test with random inputs',
      benchmarkTests: 'Measure performance under load'
    },
    refactoringGuide: data.refactoringGuide || {
      smell: 'Implementation is too complex or tightly coupled',
      solution: 'Break into smaller, focused functions',
      steps: ['Identify responsibilities', 'Separate concerns', 'Extract reusable parts', 'Verify behavior']
    },
    securityConsiderations: data.securityConsiderations || ['Validate all inputs', 'Avoid exposing internal state', 'Log without leaking sensitive data'],
    scalability: data.scalability || {
      considerations: 'Design for statelessness to enable horizontal scaling.',
      recommendations: ['Implement caching', 'Use connection pooling', 'Monitor performance metrics']
    },
    complexityAnalysis: data.complexityAnalysis || {
      timeComplexity: 'Varies by implementation',
      spaceComplexity: 'Varies by implementation',
      notes: 'Analyze specific implementation for accurate complexity bounds'
    }
  };
}

function buildPractice(data, lang) {
  const py = lang === 'python';
  const js = lang === 'javascript' || lang === 'typescript';
  const jv = lang === 'java';

  function wrapCode(code) {
    if (!code) {
      return py
        ? `def solution():\n    # Your code here\n    pass`
        : `function solution() {\n  // Your code here\n}`;
    }
    return code;
  }

  const d = data.practice || {};
  return {
    easy: {
      title: d.easyTitle || `${data.title} — Basic Practice`,
      description: d.easyDesc || 'Write a basic implementation of this concept.',
      starterCode: wrapCode(d.easyStarter),
      solution: wrapCode(d.easySolution),
      hints: d.easyHints || ['Start with a simple case', 'Test your code with sample inputs'],
      difficulty: 'easy'
    },
    medium: {
      title: d.mediumTitle || `${data.title} — Intermediate Challenge`,
      description: d.mediumDesc || 'Extend your implementation to handle edge cases and errors.',
      starterCode: wrapCode(d.mediumStarter),
      solution: wrapCode(d.mediumSolution),
      hints: d.mediumHints || ['Consider what could go wrong', 'Add proper error handling', 'Test edge cases'],
      difficulty: 'medium'
    },
    hard: {
      title: d.hardTitle || `${data.title} — Expert Challenge`,
      description: d.hardDesc || 'Build a production-quality implementation with optimizations.',
      starterCode: wrapCode(d.hardStarter),
      solution: wrapCode(d.hardSolution),
      hints: d.hardHints || ['Think about performance', 'Consider concurrent access', 'Profile your solution'],
      difficulty: 'hard'
    },
    debugging: {
      title: d.debugTitle || `Debug the ${data.title}`,
      description: d.debugDesc || `The following ${lang} code has bugs. Find and fix them.`,
      buggyCode: wrapCode(d.debugBuggy),
      fixedCode: wrapCode(d.debugFixed),
      bugs: d.debugBugs || ['Bug 1', 'Bug 2']
    }
  };
}

function buildQuiz(data) {
  const mcqs = (data.quiz && data.quiz.mcqs) || [
    {
      id: 'q1',
      question: `What is the primary purpose of ${data.title}?`,
      options: ['To solve a specific programming problem', 'To make code run faster', 'To replace all other patterns', 'To eliminate testing'],
      answer: 0,
      explanation: `${data.title} is designed to solve a specific, common programming problem in a standardized way.`
    },
    {
      id: 'q2',
      question: `When should you use ${data.title.toLowerCase()}?`,
      options: ['In every situation', 'When the specific problem it solves arises', 'Never, it is outdated', 'Only in enterprise applications'],
      answer: 1,
      explanation: `Use ${data.title.toLowerCase()} when you encounter the specific problem it was designed to solve.`
    },
    {
      id: 'q3',
      question: 'What is a common mistake beginners make?',
      options: ['Reading documentation', 'Forgetting to handle edge cases', 'Writing too many comments', 'Testing their code'],
      answer: 1,
      explanation: 'Beginners often focus only on the happy path and forget to handle edge cases.'
    }
  ];
  const checkpoints = (data.quiz && data.quiz.checkpoints) || [
    { id: 'cp1', question: `True or False: ${data.title} is only relevant for beginners.`, answer: false, explanation: 'This concept is relevant at all skill levels — from basics to advanced optimizations.' },
    { id: 'cp2', question: `True or False: Understanding ${data.title.toLowerCase()} helps you write better code.`, answer: true, explanation: 'Mastering this concept directly translates to writing more reliable and maintainable code.' }
  ];
  return { mcqs, checkpoints };
}

function buildProject(data, lang) {
  const py = lang === 'python';
  function wrapCode(code) {
    if (!code) {
      return py
        ? `# Project Starter\n# Implement your solution here\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`
        : `// Project Starter\n// Implement your solution here\n\nfunction main() {\n  \n}\n\nmain();`;
    }
    return code;
  }
  const p = data.project || {};
  return {
    title: p.title || `${data.title} — Mini Project`,
    tagline: p.tagline || `Apply your ${data.title.toLowerCase()} knowledge in a practical project`,
    description: p.description || `Build a complete application demonstrating ${data.title}.`,
    requirements: p.requirements || ['Implement core functionality', 'Handle error cases', 'Write tests', 'Document your solution'],
    learningGoals: p.learningGoals || ['Apply the concept in a practical context', 'Build a portfolio-ready project'],
    starterCode: wrapCode(p.starterCode),
    solution: wrapCode(p.solution),
    expectedOutput: p.expectedOutput || 'Your application produces the expected output.',
    solutionExplanation: p.solutionExplanation || 'This project demonstrates practical application of the concept.',
    extensions: p.extensions || ['Add additional features', 'Optimize performance', 'Build a web interface']
  };
}

function buildCheatsheet(data, lang) {
  return {
    title: `${data.title} — Quick Reference`,
    sections: [
      { title: 'Core Syntax', content: (data.cheatsheet && data.cheatsheet.syntax) || 'Refer to code examples in the lesson.' },
      { title: 'Key Concepts', content: (data.cheatsheet && data.cheatsheet.concepts) || ['Concept 1', 'Concept 2', 'Concept 3'] },
      { title: 'Common Patterns', content: (data.cheatsheet && data.cheatsheet.patterns) || ['Pattern 1: basic usage', 'Pattern 2: with error handling'] },
      {
        title: "Do's and Don'ts",
        content: data.cheatsheet && data.cheatsheet.dosDonts ? data.cheatsheet.dosDonts : [
          '✓ Understand the concept before using it',
          '✓ Test with edge cases',
          '✓ Follow language idioms',
          '✗ Copy code without understanding',
          '✗ Ignore error handling',
          '✗ Overcomplicate the solution'
        ]
      }
    ]
  };
}

function buildInterview(data) {
  const qs = (data.interview && data.interview.questions) || [
    {
      question: `Explain ${data.title} as if teaching it to a junior developer.`,
      answer: `I would start with the problem it solves, then show a simple example, explain the core concepts, and finally demonstrate common patterns and pitfalls.`,
      followUp: 'What are the most common mistakes developers make with this concept?'
    },
    {
      question: `What are the performance implications of ${data.title.toLowerCase()} in production?`,
      answer: `In production systems, ${data.title.toLowerCase()} must be implemented with attention to performance, memory usage, and error handling.`,
      followUp: 'How would you benchmark your implementation?'
    },
    {
      question: `Describe a real-world scenario where ${data.title.toLowerCase()} is the right solution.`,
      answer: `${data.title} is appropriate whenever you encounter a specific, recurring programming problem that this pattern addresses.`,
      followUp: 'What alternatives exist and when would you use them?'
    }
  ];
  return { questions: qs };
}

function buildRevision(data) {
  return {
    oneLineSummary: data.oneLineSummary || `${data.title} is a fundamental concept in programming that every developer should understand.`,
    summary: data.summary || `This lesson covered what ${data.title} is, why it exists, how to use it correctly, common mistakes, and best practices for production code.`,
    keyTakeaways: data.keyTakeaways || [
      `${data.title} solves a specific programming problem`,
      'Always handle edge cases and errors',
      'Follow language idioms and best practices',
      'Test your implementation thoroughly'
    ],
    memoryTricks: data.memoryTricks || [
      `Think of ${data.title.toLowerCase()} as a tool in your programming toolbox — use it when the situation calls for it`,
      'Practice by building small projects that use this concept'
    ],
    preInterviewChecklist: data.preInterviewChecklist || [
      `Can you explain ${data.title} in one sentence?`,
      `Can you write a basic implementation from memory?`,
      'Do you know the common pitfalls?',
      'Can you discuss performance characteristics?'
    ],
    commonErrors: data.commonErrors || [
      'Not fully understanding the problem the concept solves',
      'Overcomplicating the implementation',
      'Ignoring edge cases',
      'Skipping tests'
    ],
    mindMap: data.mindMap || { central: data.title, branches: ['Definition', 'Basic Usage', 'Advanced Patterns', 'Common Pitfalls', 'Best Practices'] },
    nextTopics: data.nextTopics || [`Advanced ${data.title.toLowerCase()} patterns`, `Testing ${data.title.toLowerCase()}`, `Performance optimization`],
    estimatedLearningTime: { review: 10, practice: 25, master: 40 }
  };
}

function buildResources(data, rmTitle) {
  return {
    links: [
      {
        title: `${rmTitle} Official Documentation`,
        url: `https://docs.example.com/${rmTitle.toLowerCase()}/${data.title.toLowerCase().replace(/\\s+/g, '-')}`,
        type: 'documentation',
        description: `Official reference for ${data.title} in ${rmTitle}`
      }
    ],
    books: [
      {
        title: `${rmTitle}: The Comprehensive Guide`,
        author: 'Industry Expert',
        description: `Covers ${data.title} in depth with practical examples`
      }
    ],
    communities: [
      {
        name: `${rmTitle} Community Forum`,
        url: `https://community.example.com/${rmTitle.toLowerCase()}`,
        description: `Discuss ${data.title} with other developers`
      }
    ]
  };
}

function buildVideos(data) {
  return {
    recommendations: [
      {
        title: `${data.title} — Beginner's Tutorial`,
        platform: 'YouTube',
        duration: '15-20 minutes',
        description: `A gentle introduction to ${data.title} for beginners`,
        difficulty: 'beginner'
      },
      {
        title: `Advanced ${data.title} Patterns`,
        platform: 'YouTube',
        duration: '25-30 minutes',
        description: `Deep dive into production ${data.title} patterns`,
        difficulty: 'advanced'
      }
    ]
  };
}

function buildAllContent(data, lang, rmTitle, conceptType) {
  return {
    beginner: buildBeginner(data, lang, conceptType),
    intermediate: buildIntermediate(data, lang),
    expert: buildExpert(data, lang, rmTitle),
    practice: buildPractice(data, lang),
    quiz: buildQuiz(data),
    project: buildProject(data, lang),
    cheatsheet: buildCheatsheet(data, lang),
    interview: buildInterview(data),
    revision: buildRevision(data),
    resources: buildResources(data, rmTitle),
    videos: buildVideos(data)
  };
}

module.exports = { buildAllContent, mermaidDiagram, namingRules };

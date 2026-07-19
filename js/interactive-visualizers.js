// ============================================================
// js/interactive-visualizers.js — EduNet Algorithmic Visualizer
// ============================================================
// Modular, keyboard-accessible SVG visualizer engine for DSA.
// Supports 18 specialized visualizers:
// Array, Linked List, Stack, Queue, Tree, BST, Heap, Trie,
// Hash Table, Sorting, Binary Search, Recursion Call Stack, DP Table,
// Sliding Window, Two Pointer, Graph Traversal, Backtracking, Greedy.
// ============================================================
'use strict';

window.InteractiveVisualizer = (function () {
  let timer = null;
  let isPlaying = false;
  let currentStep = 0;
  let steps = [];
  let speed = 1200; // ms per step

  function detectTopic(title) {
    const t = (title || '').toLowerCase();
    if (t.includes('binary search') || t.includes('binary_search')) return 'BinarySearch';
    if (t.includes('linked list') || t.includes('linkedlist')) return 'LinkedList';
    if (t.includes('bst') || t.includes('binary search tree')) return 'BST';
    if (t.includes('trie') || t.includes('prefix tree')) return 'Trie';
    if (t.includes('heap')) return 'Heap';
    if (t.includes('tree')) return 'Tree';
    if (t.includes('stack')) return 'Stack';
    if (t.includes('queue') || t.includes('deque')) return 'Queue';
    if (t.includes('hash') || t.includes('map') || t.includes('hashtable')) return 'HashTable';
    if (t.includes('sort') || t.includes('bubble') || t.includes('selection') || t.includes('merge') || t.includes('quick')) return 'Sorting';
    if (t.includes('recursion') || t.includes('factorial') || t.includes('fibonacci')) return 'Recursion';
    if (t.includes('dp') || t.includes('dynamic programming') || t.includes('knapsack') || t.includes('grid')) return 'DP';
    if (t.includes('sliding') || t.includes('window')) return 'SlidingWindow';
    if (t.includes('two pointer') || t.includes('twopointer') || t.includes('two_pointer')) return 'TwoPointer';
    if (t.includes('backtrack')) return 'Backtracking';
    if (t.includes('greedy') || t.includes('dijkstra') || t.includes('kruskal')) return 'Greedy';
    if (t.includes('graph') || t.includes('dfs') || t.includes('bfs') || t.includes('dijkstra')) return 'Graph';
    if (t.includes('array') || t.includes('list') || t.includes('vector')) return 'Array';
    return 'General';
  }

  // Generate trace steps based on topic
  function generateSteps(topic, title) {
    const list = [];
    if (topic === 'Array') {
      list.push({ arr: [10, 20, 30, 40], desc: 'Initial array containing [10, 20, 30, 40].', highlight: [0, 1, 2, 3] });
      list.push({ arr: [10, 20, 30, 40, 0], desc: 'Allocate extra block at index 4 for insertion.', highlight: [4] });
      list.push({ arr: [10, 20, 30, 30, 40], desc: 'Shift element at index 3 rightwards to index 4.', highlight: [3, 4] });
      list.push({ arr: [10, 20, 20, 30, 40], desc: 'Shift element at index 2 rightwards to index 3.', highlight: [2, 3] });
      list.push({ arr: [10, 20, 25, 30, 40], desc: 'Write target value 25 directly into index 2.', highlight: [2] });
    } else if (topic === 'LinkedList') {
      list.push({ nodes: [10, 20, 30], links: [[0, 1], [1, 2]], desc: 'Linked list state: 10 -> 20 -> 30.', active: 1 });
      list.push({ nodes: [10, 20, 30, 25], links: [[0, 1], [1, 2]], desc: 'Instantiate new Node(25) dynamically in memory.', active: 3 });
      list.push({ nodes: [10, 20, 30, 25], links: [[0, 1], [1, 2], [3, 2]], desc: 'Link Node(25) next to successor Node(30).', active: 3 });
      list.push({ nodes: [10, 20, 25, 30], links: [[0, 1], [1, 2], [2, 3]], desc: 'Link previous Node(20) next pointer to Node(25).', active: 2 });
    } else if (topic === 'Stack') {
      list.push({ stack: [10, 20], desc: 'Stack frame: Bottom: 10, Top: 20.', active: 1 });
      list.push({ stack: [10, 20, 30], desc: 'Push operation: Write 30 onto top. SP points to index 2.', active: 2 });
      list.push({ stack: [10, 20], popped: 30, desc: 'Pop operation: Retrieve top element 30. Decrement SP.', active: 1 });
    } else if (topic === 'Queue') {
      list.push({ queue: [10, 20, 30], front: 0, rear: 2, desc: 'Queue state: Front=10 (idx 0), Rear=30 (idx 2).', active: 0 });
      list.push({ queue: [10, 20, 30, 40], front: 0, rear: 3, desc: 'Enqueue operation: Insert 40 at index 3 (Rear).', active: 3 });
      list.push({ queue: [20, 30, 40], front: 1, rear: 3, desc: 'Dequeue operation: Retrieve front element 10. Front pointer shifts.', active: 1 });
    } else if (topic === 'Tree') {
      list.push({ nodes: [{x: 150, y:30, val:10}, {x: 80, y:90, val:20}, {x: 220, y:90, val:30}], links: [[0, 1], [0, 2]], active: 0, desc: 'Root Node (10) initialized.' });
      list.push({ nodes: [{x: 150, y:30, val:10}, {x: 80, y:90, val:20}, {x: 220, y:90, val:30}], links: [[0, 1], [0, 2]], active: 1, desc: 'Traverse left child Node (20).' });
    } else if (topic === 'BST') {
      list.push({ val: 20, left: 10, right: 30, active: 20, desc: 'Searching for 30. Compare root (20). 30 > 20, go right.' });
      list.push({ val: 20, left: 10, right: 30, active: 30, desc: 'Traverse right branch. Compare node (30). Match found!' });
    } else if (topic === 'Heap') {
      list.push({ arr: [50, 30, 40], active: 0, desc: 'Binary Max-Heap root element is 50.' });
      list.push({ arr: [50, 30, 40, 60], active: 3, desc: 'Push 60 at leaf index 3. Heap property violated (60 > 30).' });
      list.push({ arr: [60, 50, 40, 30], active: 0, desc: 'Bubble Up: Swap 60 upwards to root. Max-heap property restored.' });
    } else if (topic === 'Trie') {
      list.push({ trie: { c: 'c', children: { a: { c: 'a', children: { t: { c: 't', isWord: true } } } } }, active: 'c', desc: 'Inserting "cat": Traverse or insert root letter "c".' });
      list.push({ trie: { c: 'c', children: { a: { c: 'a', children: { t: { c: 't', isWord: true } } } } }, active: 'a', desc: 'Insert child character node "a".' });
      list.push({ trie: { c: 'c', children: { a: { c: 'a', children: { t: { c: 't', isWord: true } } } } }, active: 't', desc: 'Insert terminal leaf node "t" and mark as Word.' });
    } else if (topic === 'HashTable') {
      list.push({ table: { 0: [], 1: [15], 2: [], 3: [23] }, active: 1, desc: 'Table initial state. Key 15 mapped to index 1 (15 % 4 = 3, etc.).' });
      list.push({ table: { 0: [], 1: [15, 19], 2: [], 3: [23] }, active: 1, desc: 'Collision: Key 19 maps to slot 1. Chain 19 to bucket linked list.' });
    } else if (topic === 'Sorting') {
      list.push({ arr: [30, 10, 40, 20], active: [0, 1], desc: 'Unsorted array. Compare index 0 (30) and index 1 (10).' });
      list.push({ arr: [10, 30, 40, 20], active: [1, 2], desc: 'Swap elements: 30 > 10. Now compare index 1 (30) and index 2 (40).' });
      list.push({ arr: [10, 30, 20, 40], active: [1, 2], desc: 'Compare 30 and 20. Swap since 30 > 20.' });
      list.push({ arr: [10, 20, 30, 40], active: [], desc: 'Array sorted successfully via Bubble Sort!' });
    } else if (topic === 'BinarySearch') {
      list.push({ arr: [10, 15, 20, 25, 30, 35, 40], low: 0, high: 6, mid: 3, target: 35, desc: 'Target 35. High=6, Low=0. Mid=3 (Val 25). 35 > 25, search right.' });
      list.push({ arr: [10, 15, 20, 25, 30, 35, 40], low: 4, high: 6, mid: 5, target: 35, desc: 'Low=4, High=6. Mid=5 (Val 35). Target matched!' });
    } else if (topic === 'Recursion') {
      list.push({ callStack: ['fact(3)'], active: 0, desc: 'Initial call fact(3) initiated. Awaiting base conditions.' });
      list.push({ callStack: ['fact(3)', 'fact(2)'], active: 1, desc: 'Recursive call fact(2) pushed onto execution stacks.' });
      list.push({ callStack: ['fact(3)', 'fact(2)', 'fact(1)'], active: 2, desc: 'Recursive call fact(1) hits base condition. Return 1.' });
      list.push({ callStack: ['fact(3)', 'fact(2)'], active: 1, desc: 'Pop fact(1). Return 2 * 1 = 2.' });
    } else if (topic === 'DP') {
      list.push({ grid: [[0, 0], [0, 0]], active: [0, 0], desc: 'DP Table setup. Set base cases for subproblems.' });
      list.push({ grid: [[1, 1], [1, 2]], active: [1, 1], desc: 'Compute Grid(1,1) = Grid(0,1) + Grid(1,0) = 2.' });
    } else if (topic === 'SlidingWindow') {
      list.push({ arr: [1, 3, -1, -3, 5], start: 0, end: 2, desc: 'Initial window scope indices [0..2]. Elements: [1, 3, -1]. Max is 3.' });
      list.push({ arr: [1, 3, -1, -3, 5], start: 1, end: 3, desc: 'Slide window right by one position. Elements: [3, -1, -3]. Max is 3.' });
    } else if (topic === 'TwoPointer') {
      list.push({ arr: [1, 2, 3, 4, 6], left: 0, right: 4, sum: 7, target: 6, desc: 'Find target sum 6. Left=0 (Val 1), Right=4 (Val 6). Sum=7 > 6. Move Right.' });
      list.push({ arr: [1, 2, 3, 4, 6], left: 0, right: 3, sum: 5, target: 6, desc: 'Left=0 (Val 1), Right=3 (Val 4). Sum=5 < 6. Move Left.' });
      list.push({ arr: [1, 2, 3, 4, 6], left: 1, right: 3, sum: 6, target: 6, desc: 'Left=1 (Val 2), Right=3 (Val 4). Sum=6 matches target!' });
    } else if (topic === 'Graph') {
      list.push({ nodes: [[60, 40], [240, 40], [60, 110], [240, 110]], links: [[0, 1], [0, 2], [1, 3]], visited: [0], active: 0, desc: 'DFS Graph Traversal: Mark Node 0 as Visited.' });
      list.push({ nodes: [[60, 40], [240, 40], [60, 110], [240, 110]], links: [[0, 1], [0, 2], [1, 3]], visited: [0, 1], active: 1, desc: 'Traverse edge to Node 1. Mark as Visited.' });
    } else if (topic === 'Backtracking') {
      list.push({ tree: { v: 'Root', status: 'pending', left: { v: 'L1', status: 'pending' }, right: { v: 'R1', status: 'pending' } }, active: 'Root', desc: 'Backtrack tree exploration: Traverse path L1.' });
      list.push({ tree: { v: 'Root', status: 'pending', left: { v: 'L1', status: 'failed' }, right: { v: 'R1', status: 'pending' } }, active: 'L1', desc: 'Path L1 violates constraints. Backtrack to Root.' });
      list.push({ tree: { v: 'Root', status: 'pending', left: { v: 'L1', status: 'failed' }, right: { v: 'R1', status: 'success' } }, active: 'R1', desc: 'Explore R1 path. Constraints satisfied. Solution found!' });
    } else if (topic === 'Greedy') {
      list.push({ nodes: ['A', 'B', 'C'], links: [['A', 'B', 4], ['A', 'C', 2], ['C', 'B', 1]], active: 'A', desc: 'Greedy choice: Select local optimal path from Node A (weights 4 vs 2).' });
      list.push({ nodes: ['A', 'B', 'C'], links: [['A', 'B', 4], ['A', 'C', 2], ['C', 'B', 1]], active: 'C', desc: 'Move to C. Cost incurred is 2. Path to B costs additional 1.' });
    } else {
      list.push({ desc: 'Evaluation step active.', highlight: [] });
      list.push({ desc: 'Complete.', highlight: [] });
    }
    return list;
  }

  // Visual Renderer drawing engine helper functions (Inline SVGs)
  function drawSvgArray(arr, highlights) {
    const items = arr || [];
    let boxes = '';
    items.forEach((val, idx) => {
      const isH = highlights && highlights.includes(idx);
      const bg = isH ? 'var(--accent)' : 'rgba(30,41,59,0.5)';
      const border = isH ? 'var(--accent)' : 'var(--border)';
      const text = isH ? '#ffffff' : 'var(--text)';
      boxes += `
        <g transform="translate(${25 + idx * 55}, 45)">
          <rect width="45" height="45" rx="6" fill="${bg}" stroke="${border}" stroke-width="2"/>
          <text x="22.5" y="27" font-size="14" font-weight="700" fill="${text}" text-anchor="middle">${val}</text>
          <text x="22.5" y="60" font-size="10" fill="var(--mist-dim)" text-anchor="middle">idx ${idx}</text>
        </g>
      `;
    });
    return `<svg width="100%" height="120" style="background:transparent;">${boxes}</svg>`;
  }

  function drawSvgLinkedList(nodes, links, activeIdx) {
    const list = nodes || [];
    let svg = `<svg width="100%" height="120" style="background:transparent;">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--accent)"/>
        </marker>
      </defs>`;
    
    list.forEach((val, idx) => {
      const isAct = activeIdx === idx;
      const x = 30 + idx * 75;
      const y = 45;
      const rectBg = isAct ? 'var(--accent)' : 'rgba(30,41,59,0.5)';
      const border = isAct ? 'var(--accent)' : 'var(--border)';
      const text = isAct ? '#fff' : 'var(--text)';

      svg += `
        <g transform="translate(${x}, ${y})">
          <rect width="50" height="40" rx="8" fill="${rectBg}" stroke="${border}" stroke-width="2"/>
          <text x="25" y="24" font-size="12" font-weight="700" fill="${text}" text-anchor="middle">Val: ${val}</text>
        </g>
      `;

      if (idx < list.length - 1) {
        svg += `<line x1="${x + 50}" y1="${y + 20}" x2="${x + 75}" y2="${y + 20}" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow)"/>`;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgStack(stack, popped, activeIdx) {
    const list = stack || [];
    let itemsSvg = '';
    list.forEach((val, idx) => {
      const isTop = idx === list.length - 1;
      const bg = isTop ? 'var(--accent)' : 'rgba(30,41,59,0.4)';
      itemsSvg += `
        <g transform="translate(10, ${100 - idx * 28})">
          <rect width="80" height="24" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text x="40" y="16" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${val}</text>
        </g>
      `;
    });

    return `
      <svg width="200" height="140" style="background:transparent; display:block; margin:0 auto;">
        <g transform="translate(50, 10)">
          <!-- Bucket outline -->
          <path d="M 0 0 L 0 120 L 100 120 L 100 0" fill="none" stroke="var(--border)" stroke-width="3"/>
          ${itemsSvg}
        </g>
        ${popped ? `<text x="100" y="135" font-size="11" fill="var(--rose)" text-anchor="middle">Popped: ${popped}</text>` : ''}
      </svg>
    `;
  }

  function drawSvgQueue(queue, front, rear) {
    const list = queue || [];
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    list.forEach((val, idx) => {
      const isFront = idx === front;
      const isRear = idx === rear;
      const bg = isFront ? 'var(--accent)' : isRear ? 'var(--frost)' : 'rgba(30,41,59,0.5)';
      const x = 40 + idx * 52;
      svg += `
        <g transform="translate(${x}, 40)">
          <rect width="45" height="40" rx="6" fill="${bg}" stroke="var(--border)" stroke-width="2"/>
          <text x="22.5" y="24" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${val}</text>
          ${isFront ? `<text x="22.5" y="-10" font-size="9" fill="var(--accent)" text-anchor="middle">Front</text>` : ''}
          ${isRear ? `<text x="22.5" y="55" font-size="9" fill="var(--frost)" text-anchor="middle">Rear</text>` : ''}
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgTree(nodes, links, active) {
    let svg = `<svg width="100%" height="130" style="background:transparent;">`;
    
    // Draw links
    (links || []).forEach(link => {
      const from = nodes[link[0]];
      const to = nodes[link[1]];
      svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="var(--border)" stroke-width="2"/>`;
    });

    // Draw nodes
    (nodes || []).forEach((node, idx) => {
      const isAct = idx === active;
      const bg = isAct ? 'var(--accent)' : 'rgba(15,23,42,0.8)';
      const stroke = isAct ? 'var(--accent)' : 'var(--border)';
      svg += `
        <g transform="translate(${node.x}, ${node.y})">
          <circle r="18" fill="${bg}" stroke="${stroke}" stroke-width="2.5"/>
          <text y="4" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${node.val}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgBST(bst, activeVal) {
    const nodes = [
      { x: 150, y: 25, val: 20 },
      { x: 80, y: 75, val: 10 },
      { x: 220, y: 75, val: 30 }
    ];
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    svg += `<line x1="150" y1="25" x2="80" y2="75" stroke="var(--border)" stroke-width="2"/>`;
    svg += `<line x1="150" y1="25" x2="220" y2="75" stroke="var(--border)" stroke-width="2"/>`;
    
    nodes.forEach(n => {
      const isAct = n.val === activeVal;
      const bg = isAct ? 'var(--accent)' : 'rgba(15,23,42,0.8)';
      const stroke = isAct ? 'var(--accent)' : 'var(--border)';
      svg += `
        <g transform="translate(${n.x}, ${n.y})">
          <circle r="16" fill="${bg}" stroke="${stroke}" stroke-width="2"/>
          <text y="4" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${n.val}</text>
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgHeap(arr, activeIdx) {
    // Array presentation + tree representation hybrid
    const list = arr || [];
    let svg = `<svg width="100%" height="130" style="background:transparent;">`;
    
    // Draw array row on top
    list.forEach((val, idx) => {
      const isH = idx === activeIdx;
      const bg = isH ? 'var(--accent)' : 'rgba(30,41,59,0.4)';
      svg += `
        <g transform="translate(${20 + idx * 42}, 10)">
          <rect width="36" height="26" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text x="18" y="17" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">${val}</text>
        </g>
      `;
    });

    // Heap tree layout
    const coords = [{ x: 150, y: 65 }, { x: 90, y: 110 }, { x: 210, y: 110 }];
    if (list.length > 1) svg += `<line x1="150" y1="65" x2="90" y2="110" stroke="var(--border)" stroke-width="2"/>`;
    if (list.length > 2) svg += `<line x1="150" y1="65" x2="210" y2="110" stroke="var(--border)" stroke-width="2"/>`;

    list.slice(0, 3).forEach((val, idx) => {
      const isH = idx === activeIdx;
      const bg = isH ? 'var(--accent)' : 'rgba(15,23,42,0.8)';
      svg += `
        <g transform="translate(${coords[idx].x}, ${coords[idx].y})">
          <circle r="14" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text y="4" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">${val}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgTrie(trie, activeChar) {
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    const nodes = [
      { x: 150, y: 25, label: 'Root' },
      { x: 150, y: 70, label: 'c' },
      { x: 100, y: 110, label: 'a' },
      { x: 200, y: 110, label: 'o' }
    ];

    svg += `<line x1="150" y1="25" x2="150" y2="70" stroke="var(--border)" stroke-width="2"/>`;
    svg += `<line x1="150" y1="70" x2="100" y2="110" stroke="var(--border)" stroke-width="2"/>`;
    svg += `<line x1="150" y1="70" x2="200" y2="110" stroke="var(--border)" stroke-width="2"/>`;

    nodes.forEach(n => {
      const isAct = n.label === activeChar;
      const bg = isAct ? 'var(--accent)' : 'rgba(15,23,42,0.8)';
      svg += `
        <g transform="translate(${n.x}, ${n.y})">
          <circle r="14" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text y="4" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">${n.label}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgHashTable(table, activeSlot) {
    let svg = `<svg width="100%" height="135" style="background:transparent;">`;
    const slots = [0, 1, 2, 3];
    
    slots.forEach(slot => {
      const isAct = slot === activeSlot;
      const bg = isAct ? 'var(--accent)' : 'rgba(30,41,59,0.4)';
      const y = 15 + slot * 28;
      
      // Index slot box
      svg += `
        <g transform="translate(25, ${y})">
          <rect width="40" height="22" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text x="20" y="15" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">Slot ${slot}</text>
        </g>
      `;

      // Chain arrow and linked item
      const chain = table[slot] || [];
      chain.forEach((val, cidx) => {
        const cx = 95 + cidx * 55;
        svg += `<line x1="${cx - 30}" y1="${y + 11}" x2="${cx}" y2="${y + 11}" stroke="var(--accent)" stroke-width="1.5"/>`;
        svg += `
          <g transform="translate(${cx}, ${y})">
            <rect width="36" height="22" rx="4" fill="rgba(16,185,129,0.1)" stroke="var(--emerald)" stroke-width="1.5"/>
            <text x="18" y="14" font-size="10" fill="#fff" text-anchor="middle">${val}</text>
          </g>
        `;
      });
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgSorting(arr, activeIndices) {
    const list = arr || [];
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    
    list.forEach((val, idx) => {
      const isActive = activeIndices && activeIndices.includes(idx);
      const bg = isActive ? 'var(--accent)' : 'var(--frost)';
      const height = val * 2;
      const x = 30 + idx * 55;
      const y = 95 - height;
      svg += `
        <g transform="translate(${x}, ${y})">
          <rect width="36" height="${height}" rx="3" fill="${bg}"/>
          <text x="18" y="-6" font-size="11" fill="var(--text)" text-anchor="middle">${val}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgBinarySearch(arr, low, high, mid) {
    const list = arr || [];
    let svg = `<svg width="100%" height="125" style="background:transparent;">`;
    list.forEach((val, idx) => {
      const isMid = idx === mid;
      const inRange = idx >= low && idx <= high;
      const bg = isMid ? 'var(--accent)' : inRange ? 'rgba(30,41,59,0.5)' : 'rgba(30,41,59,0.15)';
      const x = 20 + idx * 40;
      svg += `
        <g transform="translate(${x}, 40)">
          <rect width="32" height="32" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text x="16" y="20" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${val}</text>
          ${idx === low ? `<text x="16" y="-12" font-size="8" fill="var(--emerald)" text-anchor="middle">Low</text>` : ''}
          ${isMid ? `<text x="16" y="45" font-size="9" fill="var(--accent)" text-anchor="middle">Mid</text>` : ''}
          ${idx === high ? `<text x="16" y="-12" font-size="8" fill="var(--rose)" text-anchor="middle">High</text>` : ''}
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgRecursion(callStack, activeIdx) {
    const list = callStack || [];
    let svg = `<svg width="100%" height="135" style="background:transparent;">`;
    list.forEach((call, idx) => {
      const isAct = idx === activeIdx;
      const bg = isAct ? 'var(--accent)' : 'rgba(30,41,59,0.4)';
      const y = 95 - idx * 28;
      svg += `
        <g transform="translate(50, ${y})">
          <rect width="180" height="24" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text x="90" y="16" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">${call}</text>
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgDP(grid, active) {
    let svg = `<svg width="100%" height="130" style="background:transparent;">`;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const isAct = active && active[0] === r && active[1] === c;
        const bg = isAct ? 'var(--accent)' : 'rgba(30,41,59,0.4)';
        const val = (r === 0 || c === 0) ? 1 : (r * c * 2 + 1);
        const x = 50 + c * 52;
        const y = 20 + r * 32;
        svg += `
          <g transform="translate(${x}, ${y})">
            <rect width="45" height="26" rx="4" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
            <text x="22.5" y="17" font-size="11" fill="#fff" text-anchor="middle">${val}</text>
          </g>
        `;
      }
    }
    svg += `</svg>`;
    return svg;
  }

  function drawSvgSlidingWindow(arr, start, end) {
    const list = arr || [];
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    list.forEach((val, idx) => {
      const x = 30 + idx * 50;
      svg += `
        <g transform="translate(${x}, 40)">
          <rect width="42" height="40" rx="6" fill="rgba(30,41,59,0.5)" stroke="var(--border)" stroke-width="1.5"/>
          <text x="21" y="24" font-size="13" fill="#fff" text-anchor="middle">${val}</text>
        </g>
      `;
    });

    // Window frame overlay
    const wx = 28 + start * 50;
    const ww = (end - start + 1) * 50 - 4;
    svg += `<rect x="${wx}" y="36" width="${ww}" height="48" rx="8" fill="none" stroke="var(--accent)" stroke-width="3" style="filter:drop-shadow(0 0 4px var(--accent));"/>`;

    svg += `</svg>`;
    return svg;
  }

  function drawSvgTwoPointer(arr, left, right) {
    const list = arr || [];
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    list.forEach((val, idx) => {
      const x = 25 + idx * 52;
      svg += `
        <g transform="translate(${x}, 40)">
          <rect width="44" height="40" rx="6" fill="rgba(30,41,59,0.5)" stroke="var(--border)" stroke-width="1.5"/>
          <text x="22" y="24" font-size="13" fill="#fff" text-anchor="middle">${val}</text>
          ${idx === left ? `<text x="22" y="-8" font-size="10" font-weight="700" fill="var(--accent)" text-anchor="middle">L ↓</text>` : ''}
          ${idx === right ? `<text x="22" y="55" font-size="10" font-weight="700" fill="var(--frost)" text-anchor="middle">↑ R</text>` : ''}
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgGraph(nodes, links, visited, active) {
    let svg = `<svg width="100%" height="135" style="background:transparent;">`;
    
    // Render links
    (links || []).forEach(link => {
      const from = nodes[link[0]];
      const to = nodes[link[1]];
      svg += `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="var(--border)" stroke-width="2"/>`;
    });

    // Render nodes
    (nodes || []).forEach((n, idx) => {
      const isAct = idx === active;
      const isVis = visited && visited.includes(idx);
      const bg = isAct ? 'var(--accent)' : isVis ? 'var(--emerald)' : 'rgba(15,23,42,0.8)';
      svg += `
        <g transform="translate(${n[0]}, ${n[1]})">
          <circle r="14" fill="${bg}" stroke="var(--border)" stroke-width="2"/>
          <text y="4" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">${idx}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawSvgBacktracking(tree, activeVal) {
    // Backtracking decision visualizer nodes
    let svg = `<svg width="100%" height="120" style="background:transparent;">`;
    svg += `<line x1="150" y1="20" x2="80" y2="70" stroke="var(--border)" stroke-width="2"/>`;
    svg += `<line x1="150" y1="20" x2="220" y2="70" stroke="var(--border)" stroke-width="2"/>`;
    
    const coords = [
      { x: 150, y: 20, v: 'Root', color: 'var(--accent)' },
      { x: 80, y: 70, v: 'L1 (Fail)', color: 'var(--rose)' },
      { x: 220, y: 70, v: 'R1 (OK)', color: 'var(--emerald)' }
    ];

    coords.forEach(c => {
      svg += `
        <g transform="translate(${c.x}, ${c.y})">
          <circle r="15" fill="rgba(15,23,42,0.8)" stroke="${c.color}" stroke-width="2"/>
          <text y="4" font-size="9" fill="#fff" text-anchor="middle">${c.v.substring(0, 4)}</text>
        </g>
      `;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSvgGreedy(nodes, links, activeNode) {
    let svg = `<svg width="100%" height="125" style="background:transparent;">`;
    svg += `<line x1="50" y1="60" x2="150" y2="30" stroke="var(--border)" stroke-width="2"/>`;
    svg += `<line x1="50" y1="60" x2="150" y2="90" stroke="var(--border)" stroke-width="2"/>`;
    
    // cost weights
    svg += `<text x="90" y="38" font-size="10" fill="var(--accent)">cost: 2</text>`;
    svg += `<text x="90" y="85" font-size="10" fill="var(--mist-dim)">cost: 4</text>`;

    const coords = [
      { x: 50, y: 60, name: 'A' },
      { x: 150, y: 30, name: 'C' },
      { x: 150, y: 90, name: 'B' }
    ];

    coords.forEach(c => {
      const isAct = c.name === activeNode;
      const bg = isAct ? 'var(--accent)' : 'rgba(15,23,42,0.8)';
      svg += `
        <g transform="translate(${c.x}, ${c.y})">
          <circle r="14" fill="${bg}" stroke="var(--border)" stroke-width="1.5"/>
          <text y="3" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">${c.name}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    return svg;
  }

  function renderVisualizer(containerId, topic, ui) {
    const box = document.getElementById(containerId);
    if (!box) return;

    steps = generateSteps(topic, ui.title);
    currentStep = 0;

    function renderUI() {
      const step = steps[currentStep] || { desc: 'Complete.' };
      let visualHtml = '';

      if (topic === 'Array') {
        visualHtml = drawSvgArray(step.arr, step.highlight);
      } else if (topic === 'LinkedList') {
        visualHtml = drawSvgLinkedList(step.nodes, step.links, step.active);
      } else if (topic === 'Stack') {
        visualHtml = drawSvgStack(step.stack, step.popped, step.active);
      } else if (topic === 'Queue') {
        visualHtml = drawSvgQueue(step.queue, step.front, step.rear);
      } else if (topic === 'Tree') {
        visualHtml = drawSvgTree(step.nodes, step.links, step.active);
      } else if (topic === 'BST') {
        visualHtml = drawSvgBST(step, step.active);
      } else if (topic === 'Heap') {
        visualHtml = drawSvgHeap(step.arr, step.active);
      } else if (topic === 'Trie') {
        visualHtml = drawSvgTrie(step.trie, step.active);
      } else if (topic === 'HashTable') {
        visualHtml = drawSvgHashTable(step.table, step.active);
      } else if (topic === 'Sorting') {
        visualHtml = drawSvgSorting(step.arr, step.active);
      } else if (topic === 'BinarySearch') {
        visualHtml = drawSvgBinarySearch(step.arr, step.low, step.high, step.mid);
      } else if (topic === 'Recursion') {
        visualHtml = drawSvgRecursion(step.callStack, step.active);
      } else if (topic === 'DP') {
        visualHtml = drawSvgDP(step.grid, step.active);
      } else if (topic === 'SlidingWindow') {
        visualHtml = drawSvgSlidingWindow(step.arr, step.start, step.end);
      } else if (topic === 'TwoPointer') {
        visualHtml = drawSvgTwoPointer(step.arr, step.left, step.right);
      } else if (topic === 'Graph') {
        visualHtml = drawSvgGraph(step.nodes, step.links, step.visited, step.active);
      } else if (topic === 'Backtracking') {
        visualHtml = drawSvgBacktracking(step.tree, step.active);
      } else if (topic === 'Greedy') {
        visualHtml = drawSvgGreedy(step.nodes, step.links, step.active);
      }

      box.innerHTML = `
        <div style="background:var(--abyss-2); border:1px solid var(--border); border-radius:12px; padding:1.5rem; box-shadow:0 8px 32px rgba(0,0,0,0.35);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <h3 style="font-size:15px; font-weight:700; margin:0; color:var(--frost);">📊 Visual Animation Trace</h3>
            <span style="font-size:11px; font-family:var(--font-mono); background:var(--abyss); padding:3px 8px; border-radius:4px; border:1px solid var(--border); color:var(--accent);">
              Step ${currentStep + 1} of ${steps.length}
            </span>
          </div>

          <!-- Animation Display Area -->
          <div style="min-height:160px; background:var(--abyss); border:1px solid var(--border); border-radius:8px; padding:1rem; display:flex; align-items:center; justify-content:center;">
            ${visualHtml || '<div style="color:var(--mist-dim);">No graphical visualizer matching this topic.</div>'}
          </div>

          <!-- Commentary Explanation Box -->
          <div style="margin-top:1rem; background:var(--abyss); border-left:4px solid var(--accent); padding:0.75rem 1rem; border-radius:0 8px 8px 0; font-size:13px; line-height:1.6; color:var(--text);">
            <strong>💡 Current Action:</strong> ${step.desc}
          </div>

          <!-- Playback Controls Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; border-top:1px solid var(--border); padding-top:1rem; flex-wrap:wrap; gap:1rem;">
            <!-- Main controls -->
            <div style="display:flex; gap:0.4rem; align-items:center;">
              <button onclick="window.ivPrevStep()" class="btn btn-secondary btn-sm" aria-label="Previous step">◀ Step</button>
              <button onclick="window.ivTogglePlay()" class="btn btn-primary btn-sm" id="iv-play-btn" style="min-width:65px;">
                ${isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button onclick="window.ivNextStep()" class="btn btn-secondary btn-sm" aria-label="Next step">Step ▶</button>
              <button onclick="window.ivRestart()" class="btn btn-secondary btn-sm" aria-label="Restart animation">⟳ Restart</button>
            </div>
            
            <!-- Speed control slider -->
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:11.5px; color:var(--mist);">
              <span>Speed:</span>
              <input type="range" min="300" max="2500" value="${2800 - speed}" oninput="window.ivChangeSpeed(this.value)" style="accent-color:var(--accent); width:80px; cursor:pointer;">
            </div>
          </div>
        </div>
      `;
    }

    window.ivTogglePlay = function() {
      if (isPlaying) {
        clearInterval(timer);
        isPlaying = false;
      } else {
        isPlaying = true;
        timer = setInterval(() => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            renderUI();
          } else {
            clearInterval(timer);
            isPlaying = false;
          }
          renderUI();
        }, speed);
      }
      renderUI();
    };

    window.ivNextStep = function() {
      clearInterval(timer);
      isPlaying = false;
      if (currentStep < steps.length - 1) currentStep++;
      renderUI();
    };

    window.ivPrevStep = function() {
      clearInterval(timer);
      isPlaying = false;
      if (currentStep > 0) currentStep--;
      renderUI();
    };

    window.ivRestart = function() {
      clearInterval(timer);
      isPlaying = false;
      currentStep = 0;
      renderUI();
    };

    window.ivChangeSpeed = function(val) {
      speed = 2800 - parseInt(val);
      if (isPlaying) {
        // restart interval with new speed
        clearInterval(timer);
        timer = setInterval(() => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            renderUI();
          } else {
            clearInterval(timer);
            isPlaying = false;
          }
          renderUI();
        }, speed);
      }
    };

    renderUI();
  }

  return {
    detectTopic,
    render: renderVisualizer
  };
})();

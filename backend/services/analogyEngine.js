// ============================================================
// backend/services/analogyEngine.js
// EduNet Human Teaching Engine — Analogy Engine Service
// ============================================================
'use strict';

const ANALOGIES = {
  'Python Introduction': {
    analogy: 'Universal Language Translator',
    story: `Imagine visiting a foreign country where you don't speak the local language. You hire a translator who stands next to you. Every time you say something in English, the translator speaks to the locals, gets their response, and translates it back into English for you in real-time. Python acts exactly like this translator, converting your human-readable thoughts into machine code instructions.`,
    mapping: [
      { code: 'Python Script (.py)', real: 'Your spoken English words' },
      { code: 'Python Interpreter', real: 'The physical translator speaking both languages' },
      { code: 'Output Response', real: 'The local responses translated back to you' }
    ]
  },
  'Variables': {
    analogy: 'Labeled Storage Box',
    story: `Imagine packing items into cardboard boxes when moving houses. To avoid opening every box to find your items, you write a label on the outside: "Kitchen Utensils" or "Books". The label stays the same, but the items inside can change. Programming uses variables exactly like these storage boxes. It gives a name (label) to a space in memory, so you can save or update values easily.`,
    mapping: [
      { code: 'Variable Label', real: 'Box Label (e.g. "Kitchen")' },
      { code: 'Stored Value', real: 'Physical Items inside the box' },
      { code: 'Reassignment', real: 'Taking out an item and putting in a new one' }
    ]
  },
  'Constants': {
    analogy: 'Birth Certificate',
    story: `When a person is born, their birth date is officially recorded on a birth certificate. That date becomes a fixed property. No matter what changes occur later in life, that birth date remains identical and cannot be rewritten. In coding, constants act like this certificate. They register a value in memory once and lock it down so it cannot be changed.`,
    mapping: [
      { code: 'Constant Label', real: 'Birth Certificate Label' },
      { code: 'Constant Value', real: 'Locked Date (e.g. June 15th)' },
      { code: 'Reassignment Error', real: 'Being prevented from changing the birth date' }
    ]
  },
  'If Statements': {
    analogy: 'Traffic Signal',
    story: `Imagine arriving at a busy street intersection. You look up at the traffic signal. If the light is Green, you press the accelerator and drive. If the light is Red, you press the brake and stop. The decision determines your action. An if statement behaves like this traffic signal, routing execution paths depending on whether a check evaluates to True or False.`,
    mapping: [
      { code: 'If Statement Check', real: 'Traffic Light color check' },
      { code: 'True Condition', real: 'Green light (Drive)' },
      { code: 'False Condition', real: 'Red light (Stop)' }
    ]
  },
  'Loops': {
    analogy: 'Morning Exercise repetition',
    story: `Imagine doing jumping jacks during morning exercises. The trainer says: "Do jumping jacks until you reach 20." You start doing one, increment your internal count to 1, check if you hit 20 (No), do another, increment to 2, check again, and repeat the cycle until the counter reaches 20. A loop runs code blocks in loops just like this exercise.`,
    mapping: [
      { code: 'Loop Code Block', real: 'Doing one jumping jack' },
      { code: 'Iteration Counter', real: 'Counting repetitions in your head' },
      { code: 'Boundary Check', real: 'Checking if counter has hit 20' }
    ]
  },
  'Functions': {
    analogy: 'Coffee Machine',
    story: `Think of a coffee machine in an office kitchen. You don't rebuild the boiling tubes, filters, and heating pads every time you want a cup of coffee. Instead, you press a button, pass inputs (coffee beans and water), the machine runs its internal process, and pours out a cup of coffee. Functions are reusable machines that run complex logic for you.`,
    mapping: [
      { code: 'Function Definition', real: 'The physical assembly of the coffee machine' },
      { code: 'Function Inputs', real: 'Beans, water, and milk' },
      { code: 'Function Output', real: 'Latte or Espresso' }
    ]
  },
  'Arrays': {
    analogy: 'Bookshelf holding books',
    story: `Imagine a bookshelf designed with 10 slots side-by-side, numbered from 0 to 9. You can place exactly one book in each slot. If you want to check the book in slot 3, you walk straight to slot index 3 without checking slots 0, 1, or 2. This structure keeps items organized and makes direct access instant.`,
    mapping: [
      { code: 'Array Slots', real: 'Bookshelf Slots' },
      { code: 'Index Position', real: 'Slot number (0 to 9)' },
      { code: 'Contiguous Memory', real: 'Books resting side-by-side in space' }
    ]
  },
  'Objects': {
    analogy: 'A Physical Car',
    story: `Think of a physical car parked in a garage. It has properties that describe it: its color is "black", its brand is "Tesla", and its fuel is "electric". It also has actions it can perform: accelerate, brake, and lock doors. Objects bundle these properties (states) and methods (behaviors) together in a single package.`,
    mapping: [
      { code: 'Object Name', real: 'The specific car' },
      { code: 'Properties', real: 'Car details (Color, Speed)' },
      { code: 'Methods', real: 'Car actions (Accelerate, Horn)' }
    ]
  },
  'Classes': {
    analogy: 'House architectural plan',
    story: `Before builders build a neighborhood, an architect designs a detailed architectural plan. The plan isn't a physical house; it is a blueprint showing room sizes, dimensions, and door placements. Using this blueprint, builders can build hundreds of identical houses. A class is a blueprint, and objects are the physical houses built from it.`,
    mapping: [
      { code: 'Class Definition', real: 'The paper blueprint drawing' },
      { code: 'Object Instance', real: 'A physical house built in the street' },
      { code: 'Constructor initialization', real: 'Laying the foundation and building walls' }
    ]
  },
  'Inheritance': {
    analogy: 'Family Traits inheritance',
    story: `Children inherit physical characteristics—like eye color, hair texture, and general height ranges—from their parents. They don't have to grow these features from scratch; they are passed down. The children can then learn unique skills, like speaking French or playing piano. OOP inheritance allows code classes to inherit fields and methods from parent classes.`,
    mapping: [
      { code: 'Parent Class', real: 'Biological Mother/Father' },
      { code: 'Child Class', real: 'Son or Daughter' },
      { code: 'Inherited Methods', real: 'Inherited physical features (Eye color)' }
    ]
  },
  'Polymorphism': {
    analogy: 'Universal Remote control',
    story: `Think of a universal remote control. It has a single "Power" button. When you point the remote at a television and click power, the TV turns on. Point it at an air conditioner and click power, the fan starts blowing. The command is identical ("Power"), but the devices execute different internal actions depending on their specific type.`,
    mapping: [
      { code: 'Common Method name', real: 'Universal Power Button' },
      { code: 'Polymorphic execution', real: 'TV turning on vs AC blowing' },
      { code: 'Subclass Override', real: 'Internal wiring of each specific appliance' }
    ]
  },
  'SQL JOIN': {
    analogy: 'Combining Excel spreadsheets',
    story: `Imagine managing two sheets in Excel: Sheet 1 list order details and customer IDs. Sheet 2 lists customer details and customer IDs. To send emails to buyers, you need to combine them. You search for matching customer IDs across both sheets to align rows. A SQL JOIN merges relational tables in databases using this comparison check.`,
    mapping: [
      { code: 'First SQL Table', real: 'Sheet 1 (Orders)' },
      { code: 'Second SQL Table', real: 'Sheet 2 (Customers)' },
      { code: 'ON condition match', real: 'Matching Customer IDs across tables' }
    ]
  },
  'REST API': {
    analogy: 'Restaurant Waiter',
    story: `Imagine visiting a restaurant. You sit at a table and look at the menu. You don't walk into the kitchen, search the fridge, and heat the pans. Instead, you order from the waiter. The waiter carries your order to the kitchen, the kitchen prepares it, and the waiter brings back the plate. A REST API is the waiter delivering requests and responses.`,
    mapping: [
      { code: 'Client Request', real: 'Customer ordering from the menu' },
      { code: 'REST API router', real: 'The waiter taking details to the kitchen' },
      { code: 'Server / Database', real: 'The kitchen preparing the food' }
    ]
  },
  'JSON': {
    analogy: 'Filled Application Form',
    story: `Think of a standard application form. It has structured keys: "First Name", "Age", "Address" with boxes to write values. When filled, anyone reading it can understand the data instantly. JSON formats programming variables into structured text keys and values so different applications can exchange data cleanly.`,
    mapping: [
      { code: 'JSON string keys', real: 'Form fields (e.g. "First Name")' },
      { code: 'JSON string values', real: 'Your handwritten inputs' },
      { code: 'Syntax constraints', real: 'Fitting data inside the specific boxes' }
    ]
  },
  'Pointers': {
    analogy: 'Notepad containing a Home Address',
    story: `Imagine a friend wants to visit your house. Instead of building an identical copy of your house and shipping it to your friend, you write your address on a notepad: "123 Maple Street". The notepad doesn't contain a house; it contains coordinates to find the house in physical space. A pointer variable is a notepad holding memory coordinates.`,
    mapping: [
      { code: 'Pointer variable', real: 'The notepad holding the written address' },
      { code: 'Reference address', real: 'The physical house address ("123 Maple Street")' },
      { code: 'Dereferencing', real: 'Driving to the location to enter the physical house' }
    ]
  },
  'Recursion': {
    analogy: 'Mirrors reflecting each other',
    story: `Imagine standing between two parallel mirrors in a fitting room. You look in, and see a reflection of yourself. But inside that reflection is a smaller reflection, and inside that is another, going infinitely deep. Each mirror reflection represents a nested function call. To stop the recursion, an exit condition (like closing one mirror) is required.`,
    mapping: [
      { code: 'Recursive call', real: 'Nested mirror reflection' },
      { code: 'Base case condition', real: 'The smallest reflection that fades or hits the frame' },
      { code: 'Call Stack allocation', real: 'Reflective frames stacking in space' }
    ]
  }
};

/**
 * Gets analogy metadata.
 * @param {string} conceptName - Normalized concept.
 * @returns {Object} Analogy details.
 */
function getAnalogy(conceptName) {
  for (const [key, val] of Object.entries(ANALOGIES)) {
    if (key.toLowerCase() === (conceptName || '').toLowerCase()) {
      return val;
    }
  }

  // Fallback
  return {
    analogy: 'Standard Toolbox Tool',
    story: `Imagine selecting a tool from a toolbox. Each tool (a hammer, a screwdriver) is designed to solve a specific physical problem. You choose the right tool for the job. Programming concepts are tools that help organize and run code statements.`,
    mapping: [
      { code: 'Concept Statement', real: 'Physical Tool' },
      { code: 'Execution', real: 'Applying the tool to the work' }
    ]
  };
}

module.exports = {
  getAnalogy
};

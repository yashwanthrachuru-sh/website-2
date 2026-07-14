const fs = require('fs');

const filePath = '/home/asta/Desktop/website-2/backend/curriculum/engine/ConceptContentEngine.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find unescaped ${ (not preceded by \)
// In javascript regex, a negative lookbehind is (?<!\\)
// So we find (?<!\\)\${
// Let's replace (?<!\\)\${ with \${
// But wait! We need to make sure we only do it where it's NOT supposed to be a JS interpolation.
// In ConceptContentEngine.js, what is a genuine JS interpolation?
// Actually, let's look at the matches:
// 1. Python code comments/prints like print(f"Deposited ${amount:.2f}")
// 2. Python variable examples print(f"Price: ${product_price:.2f}")
// If we look at our previous grep for \${:
// - line 414: console.log(\`Item: \${name} - \$\${price} (Tax: \$\${tax.toFixed(2)})\`);
// - line 479: const greeting = \`Welcome, \${firstName} \${lastName}!\`;
// - line 498: const receipt = \`Price: \$\${price.toFixed(2)} | Tax: \$\${tax.toFixed(2)} | Total: \$\${(price + tax).toFixed(2)}\`;
// Note that line 414, 479, 498 are inside template literals that use backticks. They are escaped as \${ already.
// The unescaped ones are inside python/java code blocks which are enclosed in backticks or strings.
// Let's find any occurrences of `${` (without a preceding backslash `\`) and see if they should be escaped.
// Let's write a clean line-by-line processor.

const lines = content.split('\n');
let fixedCount = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Find index of unescaped ${
  let idx = 0;
  while ((idx = line.indexOf('${', idx)) !== -1) {
    // Check if it is preceded by a backslash
    if (idx === 0 || line[idx - 1] !== '\\') {
      // It is unescaped!
      // Let's check if this is a genuine JS template string in a JS file, or if it is inside python/java/sql block.
      // Usually, inside ConceptContentEngine.js, all occurrences of ${ in python, java, sql code must be escaped as \${.
      // In JS code blocks inside backticks, we also escape them as \${ because they are inside a outer JS backtick string!
      // So actually, ALL occurrences of ${ in the file that are not escaped (except maybe some string pattern) should be escaped!
      // Let's see: if we look at the grep results, all valid JS ones inside backticks are already escaped as \${ in the source code.
      // So any unescaped ${ is a bug!
      // Let's escape it.
      line = line.substring(0, idx) + '\\$' + line.substring(idx + 1);
      fixedCount++;
      idx += 2; // skip past the escaped \$
    } else {
      idx += 1;
    }
  }
  lines[i] = line;
}

if (fixedCount > 0) {
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Successfully fixed ${fixedCount} unescaped "\${" occurrences in ConceptContentEngine.js`);
} else {
  console.log('No unescaped "\${" occurrences found.');
}

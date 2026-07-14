const fs = require('fs');

let content = fs.readFileSync('/home/asta/Desktop/website-2/backend/scratch/original_generator.js', 'utf8');
// Replace escaped newlines with actual newlines
content = content.replace(/\\n/g, '\n');
content = content.replace(/\\"/g, '"');
content = content.replace(/\\\\/g, '\\');

fs.writeFileSync('/home/asta/Desktop/website-2/backend/scratch/original_generator_formatted.js', content);
console.log('Unescaped and saved to original_generator_formatted.js!');

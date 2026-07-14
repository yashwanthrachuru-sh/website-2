const fs = require('fs');
const readline = require('readline');

async function findWrite() {
  const fileStream = fs.createReadStream('/home/asta/.gemini/antigravity-ide/brain/76a5e378-4eb7-471c-a416-af65b1911bc5/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 1;
  for await (const line of rl) {
    if (line.includes('LessonGenerator.js') && line.includes('CodeContent') && !line.includes('find_generator.js')) {
      console.log(`Line #${index}: Found potential write!`);
      // Find the start of CodeContent
      const searchStr = '"CodeContent":';
      const startIdx = line.indexOf(searchStr);
      if (startIdx !== -1) {
        const body = line.substring(startIdx + searchStr.length, startIdx + searchStr.length + 1000);
        console.log(`Body start:\n${body.substring(0, 500)}...\n`);
      }
    }
    index++;
  }
}

findWrite().catch(console.error);

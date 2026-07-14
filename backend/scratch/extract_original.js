const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('/home/asta/.gemini/antigravity-ide/brain/76a5e378-4eb7-471c-a416-af65b1911bc5/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 1;
  for await (const line of rl) {
    if (index === 53) {
      // Parse the JSON line
      const obj = JSON.parse(line);
      const toolCall = obj.tool_calls[0];
      const code = toolCall.args.CodeContent;
      fs.writeFileSync('/home/asta/Desktop/website-2/backend/scratch/original_generator.js', code);
      console.log('Successfully wrote original generator code to backend/scratch/original_generator.js!');
      break;
    }
    index++;
  }
}

extract().catch(console.error);

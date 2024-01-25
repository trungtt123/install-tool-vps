const fs = require('fs');
const readline = require('readline');

async function readAndDeleteLine(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: readStream });

  let isFirstLine = true;
  let firstLineData = null;
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      firstLineData = line;
      break;
    } else {
      // Do something with the remaining lines
    }
  }

  // Delete the first line from the file
  const remainingData = await rl.remainingInput;
  console.log(remainingData);
  fs.writeFileSync(filePath, remainingData);

  return firstLineData;
}
module.exports = readAndDeleteLine;
const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);
  const chargers = lines.map(line => Number(line)).sort((a, b) => a - b);

  const diffs = chargers.slice(1).map((rating, i) => rating - chargers[i]);

  const single = diffs.filter(diff => diff == 1).length+1;
  const triple = diffs.filter(diff => diff == 3).length+1;

  console.log(`EX 10-1: ${single} single jolt jumps and ${triple} three jolt jumps multiply to ${single * triple}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  let chargers = lines.map(line => Number(line)).sort((a, b) => a - b);
  chargers = [0, ...chargers, chargers[chargers.length-1]+3];

  pathCount = chargers.map(c => 0);
  pathCount [0] = 1;

  for (let i = 0; i < chargers.length-1; i++) {
    const num = chargers[i];
    for (let j = 1; j < 4; j++) {
      if (chargers.includes(num + j)) {
        pathCount[chargers.indexOf(num+j)] += pathCount [i];
      }
    }
  }

  console.log(`EX 10-2: There are ${pathCount[pathCount.length-1]} ways to charge the device.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 10-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 10-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
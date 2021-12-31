const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);
  const initNums = lines[0].split(",").map(num => Number(num));

  let numLast = {};

  for (let i = 0; i < initNums.length-1; i++) {
    numLast[initNums[i]] = i+1;
  }

  let last = initNums[initNums.length-1];

  for (let i = initNums.length; i < 2020; i++) {
    if (typeof (numLast[last]) != 'number') {
      numLast[last] = i;
      last = 0;
    } else {
      const newNum = i - numLast[last];
      numLast[last] = i; 
      last = newNum;
    }
  } 

  console.log(`EX 14-1: The last number said is ${last} after 2020 rounds.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  const initNums = lines[0].split(",").map(num => Number(num));

  let numLast = [0];
  for (let i = 0; i < 30000000; i++) {
    numLast.push(-1);
  }

  for (let i = 0; i < initNums.length-1; i++) {
    numLast[initNums[i]] = i+1;
  }

  let last = initNums[initNums.length-1];

  for (let i = initNums.length; i < 30000000; i++) {
    if (numLast[last] == -1) {
      numLast[last] = i;
      last = 0;
    } else {
      const newNum = i - numLast[last];
      numLast[last] = i; 
      last = newNum;
    }
  } 

  console.log(`EX 14-2: The last number said is ${last} after 30,000,000 rounds.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
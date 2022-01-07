const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);
  const modNum = 20201227;
  const handShake = 7;

  let num = 1;
  let count = 0;

  while (num != Number(lines[0])) {
    num = num * handShake;
    num = num % modNum;
    count++;
  }

  let target = Number(lines[1]);
  num = 1;
  for (let i = 0; i < count; i++) {
    num = num * target;
    num = num % modNum;
  }
  console.log(`EX 25-1: The encryption key is ${num}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 25-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
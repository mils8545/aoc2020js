const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const combos = (nums) => {
  let retArr = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      retArr.push(nums[i]+nums[j]);
    }
  }
  retArr = retArr.sort();
  return retArr.filter((num, i) => num != retArr[i-1]);
}

const ex1 = (file) => {
  const lines = readFile(file);
  const nums = lines.map(line => Number(line));

  let checkNum = 25;
  if (lines.length < checkNum + 1) checkNum = 5;

  let errorNum;

  for (let i = checkNum; i < lines.length; i++) {
    if (!combos(nums.slice(i - checkNum, i)).includes(nums[i])) errorNum = nums[i];
  }

  console.log(`EX 09-1: The number that is in error is ${errorNum}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  const nums = lines.map(line => Number(line));

  let checkNum = 25;
  if (lines.length < checkNum + 1) checkNum = 5;

  let errorNum;

  for (let i = checkNum; i < lines.length; i++) {
    if (!combos(nums.slice(i - checkNum, i)).includes(nums[i])) errorNum = nums[i];
  }

  for (let i = 0; i < lines.length; i++) {
    let count = 1;
    while ((nums.slice(i, i+count).reduce((prev, curr) => prev + curr,0) < errorNum) && i + count < lines.length) {
      count++;
    }
    if (nums.slice(i, i+count).reduce((prev, curr) => prev + curr,0) == errorNum) {
      if (count > 1) {
        const run = nums.slice(i, i+count).sort((a,b) => a - b);
        console.log(`EX 09-2: ${run[0] + run[run.length-1]} is the sum of the smallest and largest number in the range.`);
      }
    }
  }
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 09-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 09-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
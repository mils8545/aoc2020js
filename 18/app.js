const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const evaluateEX1 = (line) => {
  let newLine = line;
  while (newLine.includes(")")) {
    let openI = -1;
    let closeI = -1;
    let i = 0;
    while (closeI < 0) {
      if (newLine[i] == "(") openI = i;
      if (newLine[i] == ")") closeI = i;
      i++;
    }
    let slice = newLine.slice(openI, closeI+1);
    newLine = newLine.replace(slice, evaluateEX1(slice.slice(1, -1)));
  }

  let ents = newLine.split(" ").map(ent => (ent != "*" && ent != "+") ? Number(ent) : ent);
  let ret = ents[0];

  for (let i = 1; i < ents.length; i+=2) {
    if (ents[i] == "*") ret *= ents[i+1];
    if (ents[i] == "+") ret += ents[i+1];
  }

  return ret;
}

const evaluateEX2 = (line) => {
  let newLine = line;
  while (newLine.includes(")")) {
    let openI = -1;
    let closeI = -1;
    let i = 0;
    while (closeI < 0) {
      if (newLine[i] == "(") openI = i;
      if (newLine[i] == ")") closeI = i;
      i++;
    }
    let slice = newLine.slice(openI, closeI+1);
    newLine = newLine.replace(slice, evaluateEX2(slice.slice(1, -1)));
  }

  let ents = newLine.split(" ").map(ent => (ent != "*" && ent != "+") ? Number(ent) : ent);

  while (ents.includes("+")) {
    let plusI = ents.indexOf("+");
    let temp = ents[plusI-1] + ents[plusI+1];
    ents.splice(plusI - 1, 3, temp);
  }

  while (ents.includes("*")) {
    let plusI = ents.indexOf("*");
    let temp = ents[plusI-1] * ents[plusI+1];
    ents.splice(plusI - 1, 3, temp);
  }

  let ret = ents[0];

  return ret;
}

const ex1 = (file) => {
  const lines = readFile(file);

  const vals = lines.map(line => evaluateEX1(line));

  const total = vals.reduce((prev, curr) => prev + curr,0);

  console.log(`EX 18-1: The total of all problems is ${total}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  const vals = lines.map(line => evaluateEX2(line));

  const total = vals.reduce((prev, curr) => prev + curr,0);

  console.log(`EX 18-2: The total of all problems is ${total}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 18-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 18-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
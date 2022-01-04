const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const parseLines = (lines) => {
  let dict = {};
  let words = [];
  let i = 0;
  while (lines[i] != "") {
    const line = lines[i];
    dict[line.slice(0, line.indexOf(":"))] = "("+line.slice(line.indexOf(":")+2).split(" ").join(")(").replaceAll("(|)", "|").replaceAll('"a"', "a").replaceAll('"b"', "b") +")";
    i++;
  }

  i++;

  while (i < lines.length) {
    words.push(lines[i]);
    i++;
  }

  return {dict: dict, words: words};
}

const ex1 = (file) => {
  const lines = readFile(file);

  let {dict, words} = parseLines(lines);

  let bigRule = dict[0];
  let parsed = false;
  let i = 0;
  while (!parsed) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (digits.includes(bigRule[i])) {
      let j = 1;
      while (digits.includes(bigRule[i+j])) {
        j++;
      }
      bigRule = bigRule.slice(0,i) + dict[bigRule.slice(i,i+j)] + bigRule.slice(i+j);
      i = 0;
    }
    i++;
    if (i >= bigRule.length) {
      parsed = true;
    }
  }

  bigRule = "^" + bigRule + "$";

  let re = new RegExp(bigRule)

  let count = words.filter(word => re.test(word)).length;

  console.log(`EX 19-1: ${count} entries match the rules.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let {dict, words} = parseLines(lines);

  let longrule = "";
  for (let i = 1; i < 5; i++) {
    longrule += "(42)".repeat(i) + "(31)".repeat(i) + "|"; 
  }

  dict[11] = longrule.slice(0, -1);
  dict[8] = "(42)+";

  let bigRule = dict[0];
  let parsed = false;
  let i = 0;
  while (!parsed) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (digits.includes(bigRule[i])) {
      let j = 1;
      while (digits.includes(bigRule[i+j])) {
        j++;
      }
      bigRule = bigRule.slice(0,i) + dict[bigRule.slice(i,i+j)] + bigRule.slice(i+j);
      i = 0;
    }
    i++;
    if (i >= bigRule.length) {
      parsed = true;
    }
  }

  bigRule = "^" + bigRule + "$";

  let re = new RegExp(bigRule)

  let count = words.filter(word => re.test(word)).length;

  console.log(`EX 19-2: ${count} entries match the rules.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 19-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 19-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
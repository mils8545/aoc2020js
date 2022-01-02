const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);

  let dict = {};

  let i = 0;
  while (lines[i] != "") {
    const line = lines[i];
    dict[line.slice(0, line.indexOf(":"))] = line.slice(line.indexOf(":")+2).split(" | ").map(entry => entry.split(" "));
    i++;
  }

  let queue = [];
  let valid = [];
  queue.push(dict['0'][0]);
  while (queue.length > 0) {
    let current = queue.shift();
    if (current[current.length-1] == '"a"' || current[current.length-1] == '"b"') {
      valid.push(current);
    } else {
      let rIndex = -1;
      let i = 0;
      while (rIndex < 0) {
        if (!(current[i] == '"a"' || current[i] == '"b"')) rIndex = i;
        i++;
      }
      dict[current[rIndex]].forEach(br => {
        queue.push([...current.slice(0, rIndex), br, ...current.slice(rIndex+1)].flat());
      });
    }
  }
  valid = valid.map(line => line.map(e => e[1]).join(""));
  console.log(valid);

//  console.log(`EX 19-1: The total of all problems is ${total}.`);
};

const ex2 = (file) => {
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 19-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 19-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
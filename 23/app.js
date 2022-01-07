const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const turn = circle => {
  let lifted = circle.splice(1, 3);
  target = circle[0] - 1;
  if (target == 0) target = 9;
  while (lifted.includes(target)) {
    target--;
    if (target == 0) target = 9;
  }
  circle.splice(circle.indexOf(target)+1, 0, ...lifted);
  circle.push(circle.shift());
};

const turnEX2 = (circle, current) => {
  let lifted = [current.next.val, current.next.next.val, current.next.next.next.val];
 
  target = current.val - 1;
  if (target == 0) target = circle.length;
  while (lifted.includes(target)) {
    target--;
    if (target == 0) target = circle.length;
  }

  let temp = current.next.next.next.next;
  current.next.next.next.next = circle[target-1].next;
  circle[target-1].next = current.next;
  current.next = temp;

  return current.next;
};

const ex1 = (file) => {
  const lines = readFile(file);

  let circle = lines[0].split("").map(num => Number(num));

  for (let i = 0; i < 100; i++) {
    turn(circle);
  }

  while (circle[0] != 1) {
    circle.push(circle.shift());
  }

  console.log(`EX 23-1: The order of the cups after 1 is ${circle.slice(1).join("")}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  const circleInit = lines[0].split("").map(num => Number(num));
  const circleSize = 1000000;
  const runs = 10000000;

  let circle = Array.from(new Array(circleSize), (arr, i) => ({val: i+1}));

  for (let i = 0; i < circleSize - 1; i++) {
    circle[i].next = circle[i+1];
  }
  for (let i = 0; i < circleInit.length; i++) {
    circle[circleInit[i]-1].next = circle[circleInit[i+1]-1];
  }

  circle[circleInit[circleInit.length-1]-1].next = circle[circleInit.length];

  if (circle.length > circleInit.length) {
    circle[circle.length-1].next = circle[circleInit[0]-1];
  } else {
    circle[circleInit[circleInit.length-1]-1].next = circle[circleInit[0]-1];
  }

  let current = circle[circleInit[0]-1];

  for (let i = 0; i < runs; i++) {
    current = turnEX2(circle, current);
  }

  let answer = circle[0].next.val * circle[0].next.next.val;

  console.log(`EX 23-2: The product of the cup labels is ${answer}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 23-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 23-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const dirs = {N: {x: 0, y: 1}, E: {x: 1, y: 0}, S: {x: 0, y: -1}, W: {x: -1, y: 0}};
const turns = ['E', 'S', 'W', 'N'];

const moveCompass = (ins, pos) => {
  return {x: pos.x + (dirs[ins.dir].x * ins.count), y: pos.y + (dirs[ins.dir].y * ins.count)};  
}

const manhattanDistance = (pos) => {
  return Math.abs(pos.x) + Math.abs(pos.y);
}

const ex1 = (file) => {
  const lines = readFile(file);
  const instructions = lines.map(line => ({dir: line[0], count: Number(line.slice(1))}));

  let pos = {x: 0, y: 0};
  let dir = 0;

  instructions.forEach(ins => {
    if (turns.includes(ins.dir)) {
      pos = moveCompass(ins, pos);
    } else if (ins.dir == "F") {
      pos = moveCompass({dir: turns[dir], count: ins.count}, pos);
    } else if (ins.dir == "R") {
      dir = (dir + (ins.count / 90)) % 4;
    } else if (ins.dir == "L") {
      dir = (dir - (ins.count / 90)+4) % 4;
    }
  });

  console.log(`EX 12-1: The instructions end at a Manhattan Distance of ${manhattanDistance(pos)} from the start.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  const instructions = lines.map(line => ({dir: line[0], count: Number(line.slice(1))}));

  let shipPos = {x: 0, y: 0};
  let wayPos = {x: 10, y: 1};

  instructions.forEach(ins => {
    if (turns.includes(ins.dir)) {
      wayPos = moveCompass(ins, wayPos);
    } else if (ins.dir == "F") {
      shipPos = {x: shipPos.x + (wayPos.x * ins.count), y: shipPos.y + (wayPos.y * ins.count)};
    } else if (ins.dir == "R") {
      if (ins.count == 90) {
        wayPos = {x: wayPos.y, y: -wayPos.x};
      }
      if (ins.count == 180) {
        wayPos = {x: -wayPos.x, y: -wayPos.y};
      }
      if (ins.count == 270) {
        wayPos = {x: -wayPos.y, y: wayPos.x};
      }
    } else if (ins.dir == "L") {
      if (ins.count == 90) {
        wayPos = {x: -wayPos.y, y: wayPos.x};
      }
      if (ins.count == 180) {
        wayPos = {x: -wayPos.x, y: -wayPos.y};
      }
      if (ins.count == 270) {
        wayPos = {x: wayPos.y, y: -wayPos.x};
      }
    }
  });
  console.log(`EX 12-2: The instructions end at a Manhattan Distance of ${manhattanDistance(shipPos)} from the start.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 12-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 12-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
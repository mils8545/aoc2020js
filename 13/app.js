const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);

  const startTime = Number(lines[0]);
  const busses = lines[1].split(",").filter(entry => entry != "x").map(entry => Number(entry)).sort((a,b) => a-b);
  const busTimes = busses.map(bus => (Math.floor(startTime / bus) + 1) * bus);

  const soonestBusTime = busTimes.reduce((prev, curr) => Math.min(prev, curr), Infinity);
  const soonestBus = busses[busTimes.indexOf(soonestBusTime)];

  console.log(`EX 13-1: Bus ${soonestBus} will arrive in ${soonestBusTime - startTime} for a multiple of ${soonestBus*(soonestBusTime - startTime)}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  const busses = lines[1].split(",").map(bus => (bus == "x") ? "x" : Number(bus));

  let matching = [];
  numBusses = busses.filter(bus => bus != 'x').length;
  let time = 0;
  let increment = busses[0];

  while (matching.length < numBusses) {
    time += increment;
    matching = [];
    busses.forEach((bus, i) => {
      if (bus != 'x') {
        if ((time + i) % bus == 0) matching.push(bus);
      }
    });
    const calcedIncrement = matching.reduce((prev, curr) => prev * curr, 1);
    if (calcedIncrement > 1) increment = calcedIncrement;
  }

  console.log(`EX 13-2: The first time the busses match the schedule is ${time}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 13-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 13-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
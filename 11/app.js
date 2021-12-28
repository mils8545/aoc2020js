const { performance } = require("perf_hooks");

let change;

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const expandMap = (imageMap, fill) => {
  let retMap = [];
  let blankLine = [];
  for (let i = 0; i < imageMap[0].length + 2; i++) {
    blankLine.push(fill);
  }
  retMap.push(blankLine);
  for (let i = 0; i < imageMap.length; i++) {
    let line = imageMap[i];
    line.unshift(fill);
    line.push(fill);
    retMap.push(line);
  }
  retMap.push([...blankLine]);
  return retMap;
}

const calculateEX1 = (map) => {
  change = false;
  const height = map.length;
  const width = map[0].length;
  let retArr = map.map(line => line.map(cell => "."));
  map = expandMap(map, ".");
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const area = [...map[y].slice(x, x+3), ...map[y+1].slice(x, x+3), ...map[y+2].slice(x, x+3)];
      const filledCount = area.filter(seat => seat == "#").length;
      if (map[y+1][x+1] == "L") {
        if (filledCount == 0) {
          retArr[y][x] = "#";
          change = true;  
        } else {
          retArr[y][x] = "L";
        }
      } else if (map[y+1][x+1] == "#") {
        if (filledCount > 4) {
          retArr[y][x] = "L";
          change = true;  
        } else {
          retArr[y][x] = "#";
        }
      }
  }

  return retArr;
}

const dirs = [[-1,-1], [0,-1], [1,-1], [-1, 0], [1, 0], [-1,1], [0,1], [1,1]];

const calculateEX2 = (map) => {
  change = false;
  const height = map.length;
  const width = map[0].length;
  let retArr = map.map(line => line.map(cell => "."));
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let filledCount = 0;
      dirs.forEach(dir => {
        let found = ".";
        let mult = 1;
        while ((found == ".") && ((y + (dir[0] * mult)) >= 0) && ((y + (dir[0] * mult)) < height)
          && ((x + (dir[1] * mult)) >= 0) && ((x + (dir[1] * mult)) < width)) {
          found = map[y + (dir[0] * mult)][x + (dir[1] * mult)];
          mult++;
        }
        if (found == "#") filledCount++;
      });

      if (map[y][x] == "L") {
        if (filledCount == 0) {
          retArr[y][x] = "#";
          change = true;  
        } else {
          retArr[y][x] = "L";
        }
      } else if (map[y][x] == "#") {
        if (filledCount > 4) {
          retArr[y][x] = "L";
          change = true;  
        } else {
          retArr[y][x] = "#";
        }
      }
  }

  return retArr;
}

const ex1 = (file) => {
  const lines = readFile(file);
  const initialState = lines.map(line => line.split(""));
  change = true;
  let map = initialState;

  while (change) {
    map = calculateEX1(map);
  }

  const occupiedCount = map.flat().filter(cell => cell == "#").length;

  console.log(`EX 11-1: There are ${occupiedCount} occupied seats when the system stabilizes.`);
};

const ex2 = (file) => {
  const lines = readFile(file);
  const initialState = lines.map(line => line.split(""));
  change = true;
  let map = initialState;

  while (change) {
    map = calculateEX2(map);
  }

  const occupiedCount = map.flat().filter(cell => cell == "#").length;

  console.log(`EX 11-2: There are ${occupiedCount} occupied seats when the system stabilizes.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 11-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 11-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
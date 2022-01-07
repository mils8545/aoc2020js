const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const parseLine = (line) => {
  let dirArr = [];
  let dirs = {e: 0, w: 0, se: 0, sw: 0, ne: 0, nw: 0};
  let x;
  let y;
 
  while (line.length > 0) {
    if (line[0] == 'w' || line[0] == 'e') {
      dirs[line[0]] += 1;
      line = line.slice(1);
    } else {
      dirs[line.slice(0,2)] += 1;
      line = line.slice(2);
    }
  }

  let r = dirs['sw'] + dirs['se'] - dirs['nw'] - dirs['ne'];
  let q = dirs['ne'] + dirs['e'] - dirs['sw'] - dirs['w'];
  let s = dirs['nw'] + dirs['w'] - dirs['se'] - dirs['e'];

  return(r + ":" + q + ":" + s);
}

const turn = map => {
  const neighbours = [[1, -1, 0], [1, 0, -1], [0, 1, -1], [-1, 1, 0], [-1, 0, 1], [0, -1, 1]];

  // let retMap = Array.from(new Array(250), i => Array.from(new Array(250), j => Array.from(new Array(250), k => false)));

  let retMap = [];
  for (let i = 0; i < 250; i++) {
    let plane = [];
    for (let j = 0; j < 250; j++) {
      let row = [];
      for (let k = 0; k < 250; k++) {
        row.push(false);
      }
      plane.push(row);
    }
    retMap.push(plane);
  }

  for (let i = 1; i < 249; i++) {
    for (let j = 1; j < 249; j++) {
      for (let k = 1; k < 249; k++) {
        let count = 0;
        neighbours.forEach(cell => {
          if (map[i+cell[0]][j+cell[1]][k+cell[2]]) count++;
        })
        if (map[i][j][k]) {
          if (count == 1 || count == 2) {
            retMap[i][j][k] = true;
          }
        } else {
          if (count == 2) {
            retMap[i][j][k] = true;
          }
        }
      }
    }
  }
  return retMap;
}

const ex1 = (file) => {
  const lines = readFile(file);

  let tiles = [];

  lines.forEach(line => {
    let parsed = parseLine(line);
    if (tiles.includes(parsed)) {
      tiles = [...tiles.slice(0, tiles.indexOf(parsed)), ...tiles.slice(tiles.indexOf(parsed)+1)];
    } else {
      tiles.push(parsed);
    }
  });

  console.log(`EX 24-1: There are ${tiles.length} black tiles.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let tiles = [];

  lines.forEach(line => {
    let parsed = parseLine(line);
    if (tiles.includes(parsed)) {
      tiles = [...tiles.slice(0, tiles.indexOf(parsed)), ...tiles.slice(tiles.indexOf(parsed)+1)];
    } else {
      tiles.push(parsed);
    }
  });

  let map = [];
  for (let i = 0; i < 250; i++) {
    let plane = [];
    for (let j = 0; j < 250; j++) {
      let row = [];
      for (let k = 0; k < 250; k++) {
        row.push(false);
      }
      plane.push(row);
    }
    map.push(plane);
  }

  tiles.forEach(tile => {
    const coords = tile.split(":").map(num => Number(num));
    map[coords[0]+125][coords[1]+125][coords[2]+125] = true;
  });

  for(let i = 0; i < 100; i++) {
    map = turn(map);
  } 

  let count = map.flat().flat().filter(tile => tile).length;
  console.log(`EX 24-2: After 100 days there are ${count} black tiles.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 24-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 24-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
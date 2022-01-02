const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const expandEX1 = (cells, padding) => {
  let retArr = [];
  const zCount = cells.length;
  const yCount = cells[0].length;
  const xCount = cells[0][0].length;

  let zArr;
  let yArr;

  retArr.push(Array.from(new Array(yCount+2), y => Array.from(new Array(xCount+2), x => padding)));

  for (let i = 0; i < zCount; i++) {
    zArr = [];
    zArr.push(Array.from(new Array(xCount+2), x => padding));

    for (let j = 0; j < yCount; j++) {
      yArr = [padding, ...cells[i][j], padding];
      zArr.push(yArr);
    }

    zArr.push(Array.from(new Array(xCount+2), x => padding));

    retArr.push(zArr);
  }


  
  retArr.push(Array.from(new Array(yCount+2), y => Array.from(new Array(xCount+2), x => padding)));

  return retArr;
};

const expandEX2 = (cells, padding) => {
  let retArr = [];

  const wCount = cells.length
  const zCount = cells[0].length;
  const yCount = cells[0][0].length;
  const xCount = cells[0][0][0].length;

  let wArr;
  let zArr;
  let yArr;

  retArr.push(Array.from(new Array(zCount+2), z => Array.from(new Array(yCount+2), 
    y => Array.from(new Array(xCount+2), x => padding))));

  for (let i = 0; i < wCount; i++) {
    wArr = [];
    wArr.push(Array.from(new Array(yCount+2), y => Array.from(new Array(xCount+2), x => padding)));
    for (let j = 0; j < zCount; j++) {
      zArr = [];
      zArr.push(Array.from(new Array(xCount+2), x => padding));
      for (let k = 0; k < yCount; k++) {
        yArr = [padding, ...cells[i][j][k], padding];
        zArr.push(yArr);
      }
      zArr.push(Array.from(new Array(xCount+2), x => padding));
      wArr.push(zArr);
    }
    wArr.push(Array.from(new Array(yCount+2), y => Array.from(new Array(xCount+2), x => padding)));
    retArr.push(wArr);
  }
  
  retArr.push(Array.from(new Array(zCount+2), z => Array.from(new Array(yCount+2), y => Array.from(new Array(xCount+2), x => padding))));

  return retArr;
};

const blankCopyEX1 = (cells, fill) => {
  const zCount = cells.length;
  const yCount = cells[0].length;
  const xCount = cells[0][0].length;

  retArr = Array.from(new Array(zCount), z => (Array.from(new Array(yCount), y => Array.from(new Array(xCount), x => fill))));

  return retArr;
}

const blankCopyEX2 = (cells, fill) => {
  const wCount = cells.length;
  const zCount = cells[0].length;
  const yCount = cells[0][0].length;
  const xCount = cells[0][0][0].length;

  retArr = Array.from(new Array(wCount), w => (Array.from(new Array(zCount), 
    z => (Array.from(new Array(yCount), y => Array.from(new Array(xCount), x => fill))))));

  return retArr;
}

const stepEX1 = (cells) => {
  let neighbours = [];
  for (let i = -1; i < 2; i++)
    for (let j = -1; j < 2; j++)
      for (let k = -1; k < 2; k++)
        if (!(i == 0 && j == 0 && k == 0)) neighbours.push([i,j,k]);

  const zCount = cells.length;
  const yCount = cells[0].length;
  const xCount = cells[0][0].length;

  let retArr = blankCopyEX1(cells, ".");

  for (let i = 0; i < zCount; i++)
    for (let j = 0; j < yCount; j++)
      for (let k = 0; k < xCount; k++) {
        let activeCount = 0;
        neighbours.forEach(n => {
          const ni = i + n[0];
          const nj = j + n[1];
          const nk = k + n[2];
          if ((ni >= 0)&&(nj >= 0)&&(nk >= 0)&&(ni < zCount)&&(nj < yCount)&&(nk < xCount)) {
            if (cells[ni][nj][nk] == "#") activeCount++;
          }
        });
        if (cells[i][j][k] == "#" && activeCount >= 2 && activeCount <= 3) retArr[i][j][k] = "#";
        if (cells[i][j][k] == "." && activeCount == 3 ) retArr[i][j][k] = "#";
      }
  return retArr;
}

const stepEX2 = (cells) => {
  let neighbours = [];
  for (let i = -1; i < 2; i++)
    for (let j = -1; j < 2; j++)
      for (let k = -1; k < 2; k++)
        for (let l = -1; l < 2; l++)
          if (!(i == 0 && j == 0 && k == 0 && l == 0)) neighbours.push([i,j,k,l]);

  const wCount = cells.length;
  const zCount = cells[0].length;
  const yCount = cells[0][0].length;
  const xCount = cells[0][0][0].length;

  let retArr = blankCopyEX2(cells, ".");

  for (let i = 0; i < wCount; i++)
    for (let j = 0; j < zCount; j++)
      for (let k = 0; k < yCount; k++)
        for (let l = 0; l < xCount; l++) {
          let activeCount = 0;
          neighbours.forEach(n => {
            const ni = i + n[0];
            const nj = j + n[1];
            const nk = k + n[2];
            const nl = l + n[3];
            if ((ni >= 0)&&(nj >= 0)&&(nk >= 0)&&(nl >= 0)&&(ni < wCount)&&(nj < zCount)&&(nk < yCount)&&(nl < xCount)) {
              if (cells[ni][nj][nk][nl] == "#") activeCount++;
            }
          });
          if (cells[i][j][k][l] == "#" && activeCount >= 2 && activeCount <= 3) retArr[i][j][k][l] = "#";
          if (cells[i][j][k][l] == "." && activeCount == 3 ) retArr[i][j][k][l] = "#";
        }
  return retArr;
}

const printCells = (cells) => {
  console.log ("================");
  for (let i = 0; i < cells.length; i++) {
    console.log (cells[i].map(x => x.join("")).join("\r\n"));
    console.log ("----------------");
  }
}

const ex1 = (file) => {
  const lines = readFile(file);

  let cells = [lines.map(line => line.split("").map(cell => cell))];

  for (let i = 0; i < 6; i++) {
    cells = expandEX1(cells, '.');
    cells = stepEX1(cells);
  }

  console.log(`EX 17-1: There are ${cells.flat().flat().filter(cell => cell == "#").length} active cells after 6 cycles.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let cells = [[lines.map(line => line.split("").map(cell => cell))]];

  for (let i = 0; i < 6; i++) {
    cells = expandEX2(cells, '.');
    cells = stepEX2(cells);
  }

  console.log(`EX 17-2: There are ${cells.flat().flat().flat().filter(cell => cell == "#").length} active cells after 6 cycles.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 17-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 17-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
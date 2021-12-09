const fs = require('fs')

const readFileLines = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return data.split('\r\n');
      } catch (err) {
        console.error(err);
      }
} 

const checkPath = (lines, xInc, yInc) => {
    const pathWidth = lines[0].length;
    let xPos = 0;
    let yPos = 0;
    let treeCount = 0;
    while (yPos < lines.length) {
        if (lines[yPos][xPos] == "#") treeCount++;
        xPos = (xPos + xInc) % pathWidth;
        yPos += yInc;
    }
    return treeCount;
}

const ex1 = (path) => {
  const fileLines = readFileLines(path);
  const pathWidth = fileLines[0].length;
  let treeCount = checkPath(fileLines, 3, 1);
  
  console.log(`EX1: Ouch I hit ${treeCount} trees`);
}

const ex2 = (path) => {
    const fileLines = readFileLines(path);
    const pathWidth = fileLines[0].length;
    const slopes = [[1,1],[3,1],[5,1],[7,1],[1,2]];

    let trees = slopes.map((slope) => checkPath(fileLines, ...slope)); 
    
    let mult = trees.reduce((prev, curr) => prev * curr, 1);

    console.log(`EX2: Ouch I would hit ${trees.join(',')} trees and get ${mult} bruises.`);
}

ex1(process.argv[2]);
ex2(process.argv[2]);

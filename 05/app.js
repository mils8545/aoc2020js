const readFileLines = (path) => {
  const fs = require('fs')
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data.split('\r\n');
  } catch (err) {
    console.error(err);
  }
}

const bitArrayToInteger = (barray) => {
  const intVal = barray.reverse()
    .reduce((prev, curr, i) => prev + ((curr) ? Math.pow(2, i) : 0),0);
  return intVal;
}

const parsePass = (line) => {
  const rowBits = (line.slice(0,7))
    .split("")
    .map(bit => (bit == "F") ? 0 : 1);
  const columnBits = (line.slice(7))
    .split("")
    .map(bit => (bit == "L") ? 0 : 1);
  const row = bitArrayToInteger(rowBits);
  const column = bitArrayToInteger(columnBits);
  return {row: row, column: column, seatID: row * 8 + column};
}

const ex1 = (path) => {
  const fileLines = readFileLines(path);

  const maxID = fileLines.reduce((prev, curr) => Math.max(prev, parsePass(curr).seatID), -Infinity);

  console.log(`EX1: The highest seat ID is ${maxID}.`)
}

const ex2 = (path) => {
  const fileLines = readFileLines(path);

  const seatIDs = fileLines.map(line => parsePass(line).seatID);
  const maxSeat = seatIDs.reduce((prev, curr) => Math.max(prev, curr), -Infinity);
  const minSeat = seatIDs.reduce((prev, curr) => Math.min(prev, curr), Infinity);

  for (let i = minSeat + 1; i < maxSeat; i++) {
    if (!seatIDs.includes(i)) console.log(`EX2: My seat ID is ${i}`); 
  }
}

ex1(process.argv[2]);
ex2(process.argv[2]);

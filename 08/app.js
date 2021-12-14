let bagPaths = [];
let bagCounts = [];

const readFileLines = (path) => {
  const fs = require('fs')
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data.split('\r\n');
  } catch (err) {
    console.error(err);
  }
}

const runProgram = (prg) => {
  let progCounter = 0;
  let accumulator = 0;
  let run = true;
  while (run) {
    prg[progCounter].ran = true;
    switch (prg[progCounter].op) {
      case 'nop':
        progCounter++;        
        break;
      case 'acc':
        accumulator += prg[progCounter].reg;
        progCounter++;        
        break;
      case 'jmp':
        progCounter += prg[progCounter].reg;        
        break;
      default:
        console.log("Op not known")
        break;
    }
    if (progCounter >= prg.length) {
      run = false;
    } else if (prg[progCounter].ran == true) {
      run = false;
    }
  }
  return {stopped: progCounter >= prg.length, accumulator: accumulator};
}

const ex1 = (path) => {
  const lines = readFileLines(path);
  const prg = lines.map(line => ({op: line.split(" ")[0], reg: Number(line.split(" ")[1]), ran: false}));
  const {stopped, accumulator} = runProgram(prg);
  console.log(`EX1: The accumulator is set at ${accumulator} after the program starts to repeat`); 
}

const ex2 = (path) => {
  const lines = readFileLines(path);
  let stopped = false;
  let accumulator = 0;
  let prg;
  bugIndex = 0;
  while (!stopped) {
    prg = lines.map(line => ({op: line.split(" ")[0], reg: Number(line.split(" ")[1]), ran: false}));
    if (prg[bugIndex].op == 'nop') {
      prg[bugIndex].op = 'jmp';
    } else if (prg[bugIndex].op == 'jmp') {
      prg[bugIndex].op = 'nop';
    }
    const result = runProgram(prg);
    stopped = result.stopped;
    accumulator = result.accumulator;
    bugIndex++;
  }
  console.log(`EX2: The accumulator is set at ${accumulator} after the fixed program runs`); 
}

ex1(process.argv[2]);
ex2(process.argv[2]);

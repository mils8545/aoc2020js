const fs = require('fs')

const readFileLines = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return data.split('\r\n');
      } catch (err) {
        console.error(err);
      }
} 

const checkPasswordEx1 = (minL, maxL, L, password) => {
    const re = new RegExp(`[^${L}]`, 'g');
    const count = password.replace(re, "").length;
    return ((minL <= count) && (count <= maxL));
}

const checkPasswordEx2 = (posA, posB, L, password) => {
    const re = new RegExp(`[^${L}]`, 'g');
    const count = (password[posA-1] + password[posB-1]).replace(re, "").length;
    return (count == 1);
}

const parseLine = (line) => {
    const a = line.slice(0,line.indexOf('-'));
    const b = line.slice(line.indexOf('-')+1, line.indexOf(' '));
    const L = line.slice(line.indexOf(':')-1,line.indexOf(':'));
    const password = line.slice(line.indexOf(':') + 2);
    return ([a, b, L, password]);
}

const ex1 = (path) => {
    const fileLines = readFileLines(path);
    validCount = fileLines.reduce((prev, curr) => {
        const line = parseLine(curr);
        const valid = checkPasswordEx1(...line);
        if (valid) {
            return prev + 1;
        } else {
            return prev;
        }
    }, 0);
    console.log(`EX1: Valid Password Count is ${validCount}`);
}

const ex2 = (path) => {
    const fileLines = readFileLines(path);
    validCount = fileLines.reduce((prev, curr) => {
        const line = parseLine(curr);
        const valid = checkPasswordEx2(...line);
        if (valid) {
            return prev + 1;
        } else {
            return prev;
        }
    }, 0);
    console.log(`EX2: Valid Password Count is ${validCount}`);
}

ex1(process.argv[2]);
ex2(process.argv[2]);

const fs = require('fs')

const readFileLines = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return data.split('\r\n');
      } catch (err) {
        console.error(err);
      }
} 

const ex1 = (path) => {
    const fileLines = readFileLines(path);
    const entries = fileLines.map((line) => Number(line));
    const target = 2020;

    for (let i = 0; i < entries.length - 1; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            if (entries[i] + entries[j] == target) {
                console.log(`Ex1: ${entries[i]} * ${entries[j]} = ${entries[i] * entries[j]} `);
            }
        }
    }
}

const ex2 = (path) => {
    const fileLines = readFileLines(path);
    const entries = fileLines.map((line) => Number(line));
    const target = 2020;

    for (let i = 0; i < entries.length - 1; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            for (let k = j + 1; k < entries.length; k++) {
                if (entries[i] + entries[j] + entries[k] == target) {
                    console.log(`Ex1: ${entries[i]} * ${entries[j]} * ${entries[k]} = ${entries[i] * entries[j] * entries[k]}`);
    
                }
            }
        }
    }
}

ex1(process.argv[2]);
ex2(process.argv[2]);

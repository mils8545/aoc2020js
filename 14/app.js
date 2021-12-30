const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const readMask = (line) => {
  let returnMask = line.slice(7).split("").map(bit => (bit == 'X')? 'X' : Number(bit));
  return returnMask;
}

const intToBinary = (num) => {
  let retArr = [];
  for (let i = 0; i < 36; i++) {
    retArr.unshift(Math.floor(num/Math.pow(2, i))%2);
  };
  return retArr;
}

const binaryToInt = (bitArr) => {
  return bitArr.reverse().reduce((prev, curr, i) => prev + Math.pow(2, i) * curr, 0);
}

const applyMask = (bitArr, mask) => {
  let retArr = [];
  for (let i = 0; i < bitArr.length; i++) {
    if (mask[i] == 'X') {
      retArr.push(bitArr[i]);
    } else {
      retArr.push(mask[i]);
    }
  }
  return retArr;
}

const maskAddresses = (addrArr, mask) => {
  const maskCount = mask.filter(bit => bit == 'X').length;
  const queueFinalSize = Math.pow(2, maskCount);

  let addrMask = [];
  mask.forEach((bit, i) => {
    if (bit == "0") {
      addrMask.push(addrArr[i]);
    } else {
      addrMask.push(bit);
    }
  });

  let queue = [addrMask];

  while (queue.length < queueFinalSize) {
    let newAddr = [...(queue[0])];
    queue.shift();
    const xPos = newAddr.indexOf("X");
    newAddr[xPos] = 0;
    queue.push([...newAddr]);
    newAddr[xPos] = 1;
    queue.push([...newAddr]);
  }
  return queue;
}

const ex1 = (file) => {
  const lines = readFile(file);

  let mem = {};
  let mask;

  lines.forEach(line => {
    if (line[1] == 'a') {
      mask = readMask(line);
    } else {
      let addr = Number(line.slice(line.indexOf('[') + 1, line.indexOf(']')));
      let num = Number(line.slice(line.indexOf('=')+2));
      mem[addr] = binaryToInt(applyMask(intToBinary(num), mask));

    }
  });

  const total = (Object.values(mem).reduce((prev, curr) => prev + curr,0));

  console.log(`EX 14-1: The total of all memory addresses is ${total}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let mem = {};
  let mask;
  
  lines.forEach(line => {
    if (line[1] == 'a') {
      mask = readMask(line);
    } else {
      const addr = Number(line.slice(line.indexOf('[') + 1, line.indexOf(']')));
      const num = Number(line.slice(line.indexOf('=')+2));
      const queue = maskAddresses(intToBinary(addr), mask);
      queue.forEach(entry => {
        mem[binaryToInt(entry)] = num;
      }); 
    }
  });

  const total = (Object.values(mem).reduce((prev, curr) => prev + curr,0));

  console.log(`EX 14-2: The total of all memory addresses is ${total}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 14-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 14-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
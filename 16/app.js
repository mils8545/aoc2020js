const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);

  let fields = [];
  let nextLine = lines.shift();

  while (nextLine != "") {
    const name = nextLine.slice(0, nextLine.indexOf(":"));
    const min1 = Number(nextLine.slice(nextLine.indexOf(":")+1, nextLine.indexOf("-")));
    const max1 = Number(nextLine.slice(nextLine.indexOf("-")+1, nextLine.indexOf(" or ")));
    const range2 = nextLine.slice(nextLine.indexOf(" or ")+4 );
    const min2 = Number(range2.slice(0, range2.indexOf("-")));
    const max2 = Number(range2.slice(range2.indexOf("-")+1));
    fields.push({name: name, min1: min1, max1: max1, min2: min2, max2: max2});
    nextLine = lines.shift();
  }
  lines.shift();
  const myTicket = lines.shift().split(",").map(num => Number(num));

  lines.shift();
  lines.shift();

  const nearbyTickets = lines.map(line => line.split(",").map(num => Number(num)));

  let errors = [];

  nearbyTickets.forEach(ticket => {
    ticket.forEach(num => {
      let valid = false;
      fields.forEach(field => {
        if (((num >= field.min1) && (num <= field.max1)) || ((num >= field.min2) && (num <= field.max2))) {
          valid = true;
        }
      });
      if (!valid) errors.push(num);
    });
  });

 console.log(`EX 16-1: The error rate is ${errors.reduce((prev, curr) => prev + curr, 0)}.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let fields = {};
  let nextLine = lines.shift();

  while (nextLine != "") {
    const name = nextLine.slice(0, nextLine.indexOf(":"));
    const min1 = Number(nextLine.slice(nextLine.indexOf(":")+1, nextLine.indexOf("-")));
    const max1 = Number(nextLine.slice(nextLine.indexOf("-")+1, nextLine.indexOf(" or ")));
    const range2 = nextLine.slice(nextLine.indexOf(" or ")+4 );
    const min2 = Number(range2.slice(0, range2.indexOf("-")));
    const max2 = Number(range2.slice(range2.indexOf("-")+1));
    fields[name] = {min1: min1, max1: max1, min2: min2, max2: max2};
    nextLine = lines.shift();
  }
  lines.shift();
  const myTicket = lines.shift().split(",").map(num => Number(num));

  lines.shift();
  lines.shift();

  const nearbyTickets = lines.map(line => line.split(",").map(num => Number(num)));

  let invalidIndexes = [];

  nearbyTickets.forEach((ticket, i) => {
    ticket.forEach((num) => {
      let valid = false;
      Object.values(fields).forEach(field => {
        if (((num >= field.min1) && (num <= field.max1)) || ((num >= field.min2) && (num <= field.max2))) {
          valid = true;
        }
      });
      if (!valid) invalidIndexes.push(i);
    });
  });

  invalidIndexes.reverse().forEach(i => nearbyTickets.splice(i, 1));

  fieldNames = Object.keys(fields);
  
  let possibilities = [];
  for (let i = 0; i < fieldNames.length; i++) {
    possibilities.push([...fieldNames]);
  }
  
  for (let i = 0; i < fieldNames.length; i++) {
    let delList = [];
    possibilities[i].forEach(fName => {
      let valid = true;
      if (!(((myTicket[i] >= fields[fName].min1) && (myTicket[i] <= fields[fName].max1)) ||   
          ((myTicket[i] >= fields[fName].min2) && (myTicket[i] <= fields[fName].max2)))) {
        valid = false;
      }
      nearbyTickets.forEach(ticket => {
        if (!(((ticket[i] >= fields[fName].min1) && (ticket[i] <= fields[fName].max1)) ||   
            ((ticket[i] >= fields[fName].min2) && (ticket[i] <= fields[fName].max2)))) {
          valid = false;
        }
      });
      if (!valid) {
        delList.push(fName);
      }
    });
    delList.forEach(fName => {
      possibilities[i] = [...(possibilities[i].slice(0, possibilities[i].indexOf(fName))),...(possibilities[i].slice(possibilities[i].indexOf(fName)+1))];
    });

    
  }

  let filtered = false;
  while (!filtered) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (possibilities[i].length == 1) {
        const fName = possibilities[i][0];
        for (let j = 0; j < fieldNames.length; j++) {
          if ((i != j) && (possibilities[j].indexOf(fName) >= 0)) {
            possibilities[j] = [...(possibilities[j].slice(0, possibilities[j].indexOf(fName))),...(possibilities[j].slice(possibilities[j].indexOf(fName)+1))];
          }
        }
      }
    }
    filtered = true;
    possibilities.forEach(list => {
      if (list.length > 1) filtered = false;
    });
  }

  const departureTotal = possibilities.reduce((prev, curr, i) => {
    if (curr[0].includes("departure")) {
      return prev * myTicket[i];
    } else {
      return prev;
    }
  },1);

  console.log(`EX 16-2: The product of the departure fields on my ticket is ${departureTotal}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 16-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 16-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
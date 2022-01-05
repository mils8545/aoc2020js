const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n\r\n/);
  return lines;
};

const p1Win = (p1Deck, p2Deck) => {
  p1Deck.push(p1Deck.shift());
  p1Deck.push(p2Deck.shift());
}

const p2Win = (p1Deck, p2Deck) => {
  p2Deck.push(p2Deck.shift());
  p2Deck.push(p1Deck.shift());
}

const runTurn = (p1Deck, p2Deck) => {
  if (p1Deck[0] > p2Deck[0]) {
    p1Win(p1Deck, p2Deck);
  } else {
    p2Win(p1Deck, p2Deck);
  }
}

const playGameEX2 = (p1Deck, p2Deck) => {
  let decks = [];
  while (p1Deck.length > 0 && p2Deck.length > 0) {
    const ds = p1Deck.join(",") + "|" + p2Deck.join(",");
    if (decks.includes(ds)) return true;
    decks.push(ds);

    if ((p1Deck.length > (p1Deck[0])) && (p2Deck.length > (p2Deck[0]))) {
      if (playGameEX2([...p1Deck].slice(1, p1Deck[0]+1), [...p2Deck].slice(1, p2Deck[0]+1))) {
        p1Win(p1Deck, p2Deck);
      } else {
        p2Win(p1Deck, p2Deck);
      }
    } else {
      runTurn(p1Deck, p2Deck);
    }
  }
  if (p1Deck.length > 0) {
    return true;
  } else {
    return false;
  }
}

const ex1 = (file) => {
  const lines = readFile(file);

  let p1Deck = lines[0].split("\r\n").slice(1).map(num => Number(num));
  let p2Deck = lines[1].split("\r\n").slice(1).map(num => Number(num));

  while (p1Deck.length > 0 && p2Deck.length > 0) {
    runTurn(p1Deck, p2Deck);
  }

  let score = 0;

  if (p1Deck.length > 0) {
    score = p1Deck.reverse().reduce((prev, curr, i) => prev + ((i+1)*curr),0);
  } else {
    score = p2Deck.reverse().reduce((prev, curr, i) => prev + ((i+1)*curr),0);
  }

  console.log(`EX 22-1: The winning score is ${score} points.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let p1Deck = lines[0].split("\r\n").slice(1).map(num => Number(num));
  let p2Deck = lines[1].split("\r\n").slice(1).map(num => Number(num));

  playGameEX2(p1Deck, p2Deck);

  let score = 0;

  if (p1Deck.length > 0) {
    score = p1Deck.reverse().reduce((prev, curr, i) => prev + ((i+1)*curr),0);
  } else {
    score = p2Deck.reverse().reduce((prev, curr, i) => prev + ((i+1)*curr),0);
  }

  console.log(`EX 22-2: The winning score is ${score} points.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 22-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 22-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
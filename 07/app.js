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

const parseBags = (lines) => {
  const bags = lines.map((line) => [line.slice(0, line.indexOf("bags contain")-1), line.slice(line.indexOf("bags contain")+13).split(",").map(bag => bag.slice(0, bag.indexOf('bag')-1))]);
  for (let i = 0; i < bags.length; i++) {
    if (bags[i][1][0] == 'no other') {
      bags[i][1] = [];
    } else {
      for (let j = 1; j < bags[i][1].length; j++) {
        bags[i][1][j] = bags[i][1][j].slice(1);
      }
      bags[i].push(bags[i][1].map(bag => Number(bag.slice(0, 1))));
      bags[i][1] = (bags[i][1].map(bag => bag.slice(2)));
    }
  }
  return bags;
}

const reverseBags = (bags) => {
  let bagList = bags.map(bag => bag[0]);
  let retBags = {};
  bagList.forEach(bag => retBags[bag] = {counts: [], bags: []});
  bags.forEach(bag => bag[1].forEach((heldBag, i) => {
    retBags[heldBag].bags.push(bag[0]);
    retBags[heldBag].counts.push(bag[2][i]);
  }));

  return(retBags);
}

const mapBags = (bags, path) => {
  //console.log(path);
  const curBag = path[path.length-1];
  if (curBag != path[0]) bagPaths.push(path); 
  bags[curBag].bags.forEach(nextBag => mapBags(bags, [...path, nextBag]));

}

const mapBagsEx2 = (bags, path, count) => {
  const curBag = path[path.length-1];
  const bagIndex = bags.map(bag => bag[0]).indexOf(curBag);

  // console.log(path);
  // console.log(count);


  if (bags[bagIndex][1].length == 0) {
    bagPaths.push(path);
    bagCounts.push(count);
    return 1;
  } else {
    let total = 0;
    bags[bagIndex][1].forEach((nextBag, i) => {
      //console.log(bags[bagIndex][2][i], nextBag);
      total += mapBagsEx2(bags, [...path, nextBag], [...count, bags[bagIndex][2][i]]) * bags[bagIndex][2][i];
    });
    //console.log(total);
    return total + 1;
  }

}

const ex1 = (path) => {
  const lines = readFileLines(path);
  let bags = parseBags(lines);
  bags = reverseBags(bags);
  bagPaths = [];
  mapBags(bags, ["shiny gold"]);
  let uniqueBags = bagPaths.map(path => path[path.length-1]).sort();
  uniqueBags = uniqueBags.filter((bag, i) => bag != uniqueBags[i-1]);
  console.log(`EX1: There are ${uniqueBags.length} bags that can contain a Shiny Gold bag directly or indirectly`); 
}

const ex2 = (path) => {
  const lines = readFileLines(path);
  let bags = parseBags(lines);
  bagPaths = [];
  bagCounts = [];

  const total = mapBagsEx2(bags, ["shiny gold"], [1]) - 1;
  // console.log(bagPaths);
  // console.log(bagCounts);

  console.log(`EX2: There are ${total} bags that can fit inside of a Shiny Gold bag directly or indirectly`); 
}

ex1(process.argv[2]);
ex2(process.argv[2]);

const readFileLines = (path) => {
  const fs = require('fs')
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data.split('\r\n\r\n').map(entry => entry.split('\r\n'));
  } catch (err) {
    console.error(err);
  }
}

const flattenToUnique = (group) => {
  const flatSort = group.join("")
    .split("")
    .sort();
  const flatUnique = flatSort.reduce((prev, curr) => (curr == prev[prev.length-1]) ? prev : [...prev, curr], [flatSort[0]]);

  return flatUnique;
}

const countUniversal = (group) => {
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  let alphaCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (let i = 0; i < group.length; i++) {
    for (let j = 0; j < alpha.length; j++) {
      if (group[i].includes(alpha[j])) alphaCount[j] += 1;
    }
  }
  const universal = alphaCount.map((count, i) => (count == group.length) ? alpha[i] : "" ).filter(item => item != "");

  return universal;
}

const ex1 = (path) => {
  const answers = readFileLines(path);
  const groupAnswers = answers.map((group) => flattenToUnique(group));
  const groupAnswersCalc = groupAnswers.reduce((prev, curr) => prev + curr.length, 0); 
  console.log(`EX1: The product of the groups total yes answers is ${groupAnswersCalc}`); 
}

const ex2 = (path) => {
  const answers = readFileLines(path);
  const groupAnswers = answers.map((group) => countUniversal(group));
  const groupAnswersCalc = groupAnswers.reduce((prev, curr) => prev + curr.length, 0); 

  console.log(`EX2: The product of the groups universal answers total is ${groupAnswersCalc}`); 
}

ex1(process.argv[2]);
ex2(process.argv[2]);

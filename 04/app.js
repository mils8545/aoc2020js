const readFileLines = (path) => {
  const fs = require('fs')
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data.split('\r\n\r\n').map(line => line.replaceAll('\r\n', " "));
  } catch (err) {
    console.error(err);
  }
}

const lineToObject = (line) => {
  let ret = {};
  let entries = line
    .split(" ")
    .forEach(entry => ret[entry.slice(0,3)] = entry.slice(4));
  return ret;
}

const validPassportEx1 = (passport) => {
  return ((Object.keys(passport).length == 8) || ((Object.keys(passport).length == 7) && (!passport.cid)));
}

const validPassportEx2 = (passport) => {
  let valid = true;
  if (Object.keys(passport).length < 7) return false;
  if ((Object.keys(passport).length == 7) && (!!passport.cid)) return false;
  // byr (Birth Year) - four digits; at least 1920 and at most 2002.
  if ((Number(passport.byr) < 1920) || (Number(passport.byr) > 2002)) return false;
  // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  if ((Number(passport.iyr) < 2010) || (Number(passport.iyr) > 2020)) return false;
  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  if ((Number(passport.eyr) < 2020) || (Number(passport.eyr) > 2030)) return false;
  // hgt (Height) - a number followed by either cm or in:
  if (!(passport.hgt.includes("in")) && !(passport.hgt.includes("cm"))) return false;
  // If cm, the number must be at least 150 and at most 193.
  if (passport.hgt.includes("cm")) {
    const cm = Number(passport.hgt.replace("cm",""));
    if ((cm < 150) || (cm > 193)) return false;
  }
  // If in, the number must be at least 59 and at most 76.
  if (passport.hgt.includes("in")) {
    const cm = Number(passport.hgt.replace("in",""));
    if ((cm < 59) || (cm > 76)) return false;
  }
  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  if (passport.hcl[0] != "#") return false;
  if (passport.hcl.length != 7) return false;
  if (passport.hcl.replace(/[^0-9a-f]/gi, '').length != 6) return false;
  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  const eyeColors = ['amb','blu','brn','gry','grn','hzl','oth'];
  if (!eyeColors.includes(passport.ecl)) return false;
  // pid (Passport ID) - a nine-digit number, including leading zeroes.
  if (passport.pid.replace(/[^0-9]/gi, '').length != 9) return false;

  return valid;
}

const ex1 = (path) => {
  const fileLines = readFileLines(path);

  const validCount = fileLines.reduce((prev, line) => prev + (validPassportEx1(lineToObject(line)) ? 1 : 0), 0);
  console.log(`EX1: There are ${validCount} valid passports.`);
}

const ex2 = (path) => {
  const fileLines = readFileLines(path);

  const validCount = fileLines.reduce((prev, line) => prev + (validPassportEx2(lineToObject(line)) ? 1 : 0), 0);
  console.log(`EX2: There are ${validCount} valid passports.`);


}

ex1(process.argv[2]);
ex2(process.argv[2]);

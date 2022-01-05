const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n/);
  return lines;
};

const ex1 = (file) => {
  const lines = readFile(file);

  let dishes = lines.map(line => ({ingredients: line.slice(0, line.indexOf("(")-1).split(" "),
       allergens: line.slice(line.indexOf("(")+10, -1).split(", ")}));

  let allergenList = [];

  dishes.forEach(dish => allergenList = [...allergenList, ...dish.allergens]);

  allergenList = allergenList.sort();
  allergenList = allergenList.filter((allergen, i) => (allergen != allergenList[i-1]));

  let ingredientList = [];
  dishes.forEach(dish => ingredientList = [...ingredientList, ...dish.ingredients]);

  ingredientList = ingredientList.sort();
  ingredientList = ingredientList.filter((ingredient, i) => (ingredient != ingredientList[i-1]));

  let allergens = {};
  
  allergenList.forEach(allergen => {
    let count = 0;
    let ingredients = [];
    dishes.forEach(dish => {
      if (dish.allergens.includes(allergen)) {
        count++;
        ingredients = [...ingredients, ...dish.ingredients];
      }
    });
    ingredients = ingredients.sort();
    let ingredientSingles = ingredients.filter((ingredient, i) => ingredient != ingredients[i-1]);
    ingredientSingles = ingredientSingles.filter(ingredient => ingredients.filter(ing => ing == ingredient).length == count);
    allergens[allergen] = ingredientSingles;
  });

  let safeIngredients = [...ingredientList];
  safeIngredients = safeIngredients.filter(ing => {
    let safe = true;
    Object.values(allergens).forEach(list => {
      list.forEach(aing => {
        if (ing == aing) safe = false
      });
    });
    return safe;
  });

  let safeCount = 0;
  dishes.forEach(dish => {
    dish.ingredients.forEach(ing => {
      if (safeIngredients.includes(ing)) safeCount++;
    });
  });

  console.log(`EX 21-1: There are ${safeCount} safe ingredients used in the dishes.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let dishes = lines.map(line => ({ingredients: line.slice(0, line.indexOf("(")-1).split(" "),
       allergens: line.slice(line.indexOf("(")+10, -1).split(", ")}));

  let allergenList = [];

  dishes.forEach(dish => allergenList = [...allergenList, ...dish.allergens]);

  allergenList = allergenList.sort();
  allergenList = allergenList.filter((allergen, i) => (allergen != allergenList[i-1]));

  let allergens = {};
  
  allergenList.forEach(allergen => {
    let count = 0;
    let ingredients = [];
    dishes.forEach(dish => {
      if (dish.allergens.includes(allergen)) {
        count++;
        ingredients = [...ingredients, ...dish.ingredients];
      }
    });
    ingredients = ingredients.sort();
    let ingredientSingles = ingredients.filter((ingredient, i) => ingredient != ingredients[i-1]);
    ingredientSingles = ingredientSingles.filter(ingredient => ingredients.filter(ing => ing == ingredient).length == count);
    allergens[allergen] = ingredientSingles;
  });

  let done = false;

  while (!done) {
    allergenList.forEach(allergen => {
      if (allergens[allergen].length == 1) {
        allergenList.forEach(allergen2 => {
          if (allergen != allergen2 && allergens[allergen2].includes(allergens[allergen][0])) {
            allergens[allergen2].splice(allergens[allergen2].indexOf(allergens[allergen][0]),1);
          } 
        });
      }
    });
    done = true;
    allergenList.forEach(allergen => {
      if (allergens[allergen].length != 1) done = false;
    });
  }

  console.log(`EX 21-2: There alphabetical by allergen name ingredients are ${Object.values(allergens).map(all => all[0]).join(",")}.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 21-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 21-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
const { performance } = require("perf_hooks");

const readFile = (readFile) => {
  const fs = require("fs");
  const data = fs.readFileSync(readFile, { encoding: "utf8", flag: "r" });
  let lines = data.split(/\r\n\r\n/);
  return lines;
};

const printMap = (map) => {
  map.forEach(line => console.log(line.join(" ")));
}

const rotateMap = (map) => {
  let retMap = [];
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  for (let i = mapWidth - 1; i >= 0; i--) {
    let row = [];
    for (let j = 0; j < mapHeight; j++) {
      row.push(map[j][i]);
    }
    retMap.push(row);
  }
  return retMap;
}

const flipMap = (map) => {
  let retMap = [];
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  for (let i = 0; i < mapHeight; i++) {
    let row = [];
    for (let j = mapWidth - 1; j >= 0; j--) {
      row.push(map[i][j]);
    }
    retMap.push(row);
  }
  return retMap;
}

let compareEdges = (map1, map2) => {
  let match = true;
  const mapHeight = map1.length;
  const mapWidth = map1[0].length;
  for (let i = 0; i < mapWidth; i++) {
    if (map1[0][i] != map2[mapHeight-1][i]) match = false; 
  }
  if (match) return 1;
  match = true;
  for (let i = 0; i < mapWidth; i++) {
    if (map1[mapHeight-1][i] != map2[0][i]) match = false; 
  }
  if (match) return 4;
  match = true;
  for (let i = 0; i < mapHeight; i++) {
    if (map1[i][mapWidth-1] != map2[i][0]) match = false; 
  }
  if (match) return 2;
  match = true;
  for (let i = 0; i < mapHeight; i++) {
    if (map1[i][0] != map2[i][mapWidth-1]) match = false; 
  }
  if (match) return 8;
  return 0;
}

let compareTiles = (tile1, tile2) => {
  let map2 = tile2.map;
  for (let i = 0; i < 4; i++) {
    if (compareEdges(tile1.map, map2) > 0) return compareEdges(tile1.map, map2);
    map2 = rotateMap(map2);
  }
  map2 = flipMap(tile2.map);
  for (let i = 0; i < 4; i++) {
    if (compareEdges(tile1.map, map2) > 0) return compareEdges(tile1.map, map2);
    map2 = rotateMap(map2);
  }
  return false;
}

let matchTile = (tile1, tile2) => {
  let map2 = tile2.map;
  for (let i = 0; i < 4; i++) {
    if (compareEdges(tile1.map, map2) > 0) return map2;
    map2 = rotateMap(map2);
  }
  map2 = flipMap(tile2.map);
  for (let i = 0; i < 4; i++) {
    if (compareEdges(tile1.map, map2) > 0) return map2;
    map2 = rotateMap(map2);
  }
  return false;
}

const reduceMap = (imageMap) => {
  let retMap = [];
  let blankLine = [];
  for (let i = 1; i < imageMap.length-1; i++) {
    let line = imageMap[i];
    line.shift();
    line.pop();
    retMap.push(line);
  }
  return retMap;
}

//                   # 
// #    ##    ##    ###
//  #  #  #  #  #  #   
// 01234567890123456789

const monster = [[0,1],[1,2],[4,2],[5,1],[6,1],[7,2],[10,2],[11,1],[12,1],[13,2],[16,2],[17,1],[18,1],[19,1],[18,0]];

const countMonsters = (map) => {
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  let count = 0;
  for (let i = 0; i < mapHeight - 3; i++)
    for (let j = 0; j < mapWidth - 20; j++) {
      let nessie = true;
      monster.forEach((coord) => {
        if (map[i+coord[1]][j+coord[0]] != "#") {
          nessie = false;
        }
      });
      if (nessie) count++;
    }
  return count;
}

const ex1 = (file) => {
  const lines = readFile(file);

  let tiles = lines.map(l => {
    let tile = l.split('\r\n');
    return {num: Number(tile[0].slice(5, -1)), map: tile.slice(1).map(line => line.split("")), matches: []};
  });

  for(let i = 0; i < tiles.length; i++)
    for (let j = 0; j < tiles.length; j++) {
      if (i != j) {
        if (compareTiles(tiles[i], tiles[j]))
          tiles[i].matches.push(j);
      }
    }
  
  let corners = tiles.filter(tile => (tile.matches.length == 2)).reduce((prev, curr) => prev * curr.num, 1);

  console.log(`EX 20-1: ${corners} is the product of the corners IDs.`);
};

const ex2 = (file) => {
  const lines = readFile(file);

  let tiles = lines.map(l => {
    let tile = l.split('\r\n');
    return {num: Number(tile[0].slice(5, -1)), map: tile.slice(1).map(line => line.split("")), matches: []};
  });

  for(let i = 0; i < tiles.length; i++)
    for (let j = 0; j < tiles.length; j++) {
      if (i != j) {
        if (compareTiles(tiles[i], tiles[j]))
          tiles[i].matches.push(j);
      }
    }

  let corner1 = 0;
  while (tiles[corner1].matches.length != 2) corner1++;

  while (compareTiles(tiles[corner1], tiles[tiles[corner1].matches[0]]) 
    + compareTiles(tiles[corner1], tiles[tiles[corner1].matches[1]]) != 6) {
      tiles[corner1].map = rotateMap(tiles[corner1].map);
    }

  let tilemap = [[corner1]];

  let row = 0;
  let rowsFilled = false;

  while (!rowsFilled) {
    let next = -1;
    tiles[tilemap[row][0]].matches.forEach(match => {
      if (compareTiles(tiles[tilemap[row][0]], tiles[match]) == 4) {
        next = match;
        tilemap.push([match]);
      }
    });
    tiles[next].map = matchTile(tiles[tilemap[row][0]], tiles[next]);
    if (tiles[next].matches.length < 3) {
      rowsFilled = true;
    } else {
      row++;
    }
  }

  for (let i = 0; i < tilemap.length; i++) {
    let col = 0;
    let colsFilled = false;
    while (!colsFilled) {
      let next = -1;
      tiles[tilemap[i][col]].matches.forEach(match => {
        if (compareTiles(tiles[tilemap[i][col]], tiles[match]) == 2) {
          next = match;
          tilemap[i].push(match);
        }
      });
      tiles[next].map = matchTile(tiles[tilemap[i][col]], tiles[next]);
      if (tiles[next].matches.length < tiles[tilemap[i][col]].matches.length) {
        colsFilled = true;
      } else {
        col++;
      }
    }
  }

  tiles.forEach(tile => tile.map = reduceMap(tile.map));

  let mergedMap = [];
  tilemap.forEach(line => {
    for (let i = 0; i < tiles[0].map.length; i++) {
      let mapLine = [];
      line.forEach(tileNum => {
        mapLine.push(...tiles[tileNum].map[i]);
      });
      mergedMap.push(mapLine);    
    }
  });

  let maxMonsters = 0;
  for (let i = 0; i < 4; i++) {
    maxMonsters = Math.max(maxMonsters, (countMonsters(mergedMap)));
    mergedMap = rotateMap(mergedMap);
  }
  mergedMap = flipMap(mergedMap);
  for (let i = 0; i < 4; i++) {
    maxMonsters = Math.max(maxMonsters, (countMonsters(mergedMap)));
    mergedMap = rotateMap(mergedMap);
  }

  const roughness = mergedMap.flat().filter(cell => cell == "#").length - (15 * maxMonsters);
  
  console.log(`EX 20-2: The seas nave a roughness of ${roughness} and contain ${maxMonsters} monsters.`);
};

let startTime = performance.now();
ex1(process.argv[2]);
let endTime = performance.now();
console.log(`Exercise 20-1 took ${(endTime - startTime).toPrecision(5)} milliseconds`);

startTime = performance.now();
ex2(process.argv[2]);
endTime = performance.now();
console.log(`Exercise 20-2 took ${(endTime - startTime).toPrecision(5)} milliseconds`);
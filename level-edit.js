#!/usr/bin/node
// Run with Node.JS
const fs = require('fs');
const OBJECTS = [null, null, "_", "#", "#", "x", "X", "^", "|"];

function getCostume(symbol) {
  const index = OBJECTS.indexOf(symbol);
  if(index === -1) {
    console.log('what is ' + symbol);
    return 2;
  }
  return index;
}

function unpack() {
  const level_data = fs.readFileSync("level.raw").toString();
  const cols = level_data.match(/.{64}/g).map(x => x.match(/.{2}/g).map(y => parseInt(y)));

  console.log('Level is ' + cols.length + 'x32');

  if(cols.length % 128 !== 0) {
    console.log('Error: Level width must be divisible by 128');
    process.exit();
  }

  let data = '';
  for (let i = 0; i < cols.length; i += 128) {
    for (let j = 0; j < 32; j++) {
      data += cols.slice(i, i+128).map(x => OBJECTS[x[j]]).join('') + '\n';    
    }
    data += '\n\n';
  }

  fs.writeFileSync(
    'level.txt',
    data
  );

  console.log('Created level.txt');
}

function pack() {
  const pretty = fs.readFileSync("level.txt").toString();
  const sections = pretty.match(/(?:.{128}\n){32}/g)

  console.log('Level has ' + sections.length + ' sections. (' + sections.length * 128 + 'x32 total)')
  const data = sections.map(section => {
    const split = section.split("\n");
    let string = '';
    for (let i = 0; i < 128; i++) {
      for (let j = 0; j < 32; j++) {
        string += getCostume(split[j][i]).toString().padStart(2, '0');
      }
    }
    return string;
  }).join('');

  fs.writeFileSync(
    'level.raw',
    data
  );
  console.log('Created level.raw');
}

function unknown() {
  console.log('Usage: level-edit unpack|pack');
  console.log('');
}

({ pack, unpack }[process.argv[2]] || unknown)()
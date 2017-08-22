'use strict';

const fs = require('fs');
const deflate = require('deflate-js');
let fileContent; 

console.log('** Read File **');
console.time('Read File');
fs.readFile('./alice29.txt', (err, data) => {
  if (err) throw err;
  console.timeEnd('Read File');
  console.log(`File size before compress: ${data.length}`)
  
  // compress file
  console.log('\n\n** Compress File **');
  console.time('Compress File');
  fileContent = deflate.deflate(data, 9);
	console.timeEnd('Compress File');
  console.log(`File size after compress: ${fileContent.length}`)
	
  // write compressed file
  console.time('Write Compressed File');
  fs.writeFile('./temp/compressed.txt', fileContent, (err) => {
    if (err) throw err;
    console.log('\n\n** Write Compressed File **');
		console.timeEnd('Write Compressed File');
  });

  //decompress file
  console.log('\n\n** Decompress File **');
  console.time('Decompress File');
  let decompressedFile = deflate.inflate(fileContent);
  console.timeEnd('Decompress File');
  let stringContent = dataToString(decompressedFile);
  console.log(`File size after decompress: ${stringContent.length}`)

  //write decompressed file
  console.time('Write Decompressed File');
  fs.writeFile('./temp/decompressed.txt', stringContent, (err) => {
    if (err) throw err;
    console.log('\n\n** Write Decompressed File **');
    console.timeEnd('Write Decompressed File');
  });
});

function dataToString (data) {
  return data.map(function(byte) {
    return String.fromCharCode(byte);
  }).join('');
}
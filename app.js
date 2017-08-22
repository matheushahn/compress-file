/*jshint esversion: 6 */  
/*jslint devel: true */
'use strict';
console.time('Run Time');

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const compression = bluebird.promisifyAll(require('deflate-js'));
let fileSizeDecompressed;
let fileSizeCompressed;

console.log('** Read File **');
console.time('Read File');
fs.readFileAsync('./alice29.txt')
  .then(compress)
  .then(writeCompressFile)
  .then(decompress)
  .then(writeDecompressFile)
  .then(data => {
    console.log('\n\n** App Details **')
    console.timeEnd('Run Time');
    console.log(`Compression Rate = ${fileSizeDecompressed/fileSizeCompressed}`)
  })
  .catch(err => console.log(err));

function dataToString (data) {
  return data.map(function(byte) {
    return String.fromCharCode(byte);
  }).join('');
}

function compress (data) {
  return new Promise(function (resolve, reject) {
    console.timeEnd('Read File');
    console.log(`File size before compress: ${data.length} bytes`);

    // compress file
    console.log('\n\n** Compress File **');
    console.time('Compress File');
    let compressed = compression.deflate(data, 9);
    fileSizeCompressed = compressed.length;
    console.timeEnd('Compress File'); 
    console.log(`File size after compress: ${compressed.length} bytes`);
    resolve(compressed);
  });
}

function writeCompressFile(compressedData) {
  return new Promise(function (resolve, reject) {
    console.time('Write Compressed File');
    fs.writeFileAsync('./temp/compressed.txt', compressedData)
      .then(res => {
        console.log('\n\n** Write Compressed File **');
        console.timeEnd('Write Compressed File');
        resolve(compressedData);
      })
      .catch(err => reject(err));
  });
}

function decompress(fileContent) {
  return new Promise(function (resolve, reject) {
    console.time('Decompress File');
    console.log('\n\n** Decompress File **');
    let decompressedFile = compression.inflate(fileContent);
    fileSizeDecompressed = decompressedFile.length;
    console.timeEnd('Decompress File');
    console.log(`File size after decompress: ${decompressedFile.length} bytes`);
    resolve(decompressedFile);
  });
}

function writeDecompressFile(decompressedData) {
  return new Promise(function (resolve, reject) {
    console.time('Write Decompressed File');
    fs.writeFileAsync('./temp/decompressed.txt', decompressedData)
      .then( response => {
        console.log('\n\n** Write Decompressed File **');
        console.timeEnd('Write Decompressed File');
        resolve(response);
      })
      .catch(err => reject(err));
    });
}
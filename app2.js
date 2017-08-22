'use strict';
console.time('App execution time')

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const compression = require('lossless-text-compression');

console.log('** Read File **')
console.time('Read File')
fs.readFileAsync('./alice29.txt', 'utf8')
  .then(compress)
  .then(writeCompressFile)
  .then(decompress)
  .then(writeDecompressFile)
  .catch(err => console.log(err))

function dataToString (data, cb) {
  return data.map(function(byte) {
    return String.fromCharCode(byte)
  }).join('')
}

function compress (data, cb) {
  return new Promise(function (resolve, reject) {
    console.timeEnd('Read File')
    console.log(`File size before compress: ${data.length} bytes`)

    // compress file
    console.log('\n\n** Compress File **')
    console.time('Compress File')
    compression.encode(data)
      .then(compressed => {
        console.timeEnd('Compress File')  
        console.log(`File size after compress: ${compressed.length} bytes`)
        resolve(compressed)
      })
      .catch(err => reject(err))
  })
}

function writeCompressFile(data, cb) {
  return new Promise(function (resolve, reject) {
    console.time('Write Compressed File')
    fs.writeFile('./temp/compressed.txt', data)
      .then( compressed => {
        console.log('\n\n** Write Compressed File **')
        console.timeEnd('Write Compressed File')
        resolve(compressed)
      })
      .catch(err => reject(err))
  })
}

function decompress(data, cb) {
  return new Promise(function (resolve, reject) {
    console.time('Decompress File')
    console.log('\n\n** Decompress File **')
    return compression.decode(fileContent)
      .then(decompressedFile => {
        console.timeEnd('Decompress File')
        let stringContent = dataToString(decompressedFile)
        console.log(`File size after decompress: ${stringContent.length} bytes`)
        resolve(stringContent)
      })
      .catch(err => reject(err))
  })
}

function writeDecompressFile(data) {
  console.time('Write Decompressed File')
  fs.writeFile('./temp/decompressed.txt', data)
    .then( response => {
      console.log('\n\n** Write Decompressed File **')
      console.timeEnd('Write Decompressed File')
      console.timeEnd('App execution time')
    })
    .catch(err => console.log(err))
}


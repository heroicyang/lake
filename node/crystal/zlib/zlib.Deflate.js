var fs=require('fs');
var zlib=require('zlib');

var read=fs.createReadStream('node.txt');
var write=fs.createWriteStream('node.deflate');
var sa=fs.createWriteStream('una.txt');

var deflate=zlib.createDeflate();
var inflate=zlib.createInflate();

read.pipe(deflate).pipe(write);
deflate.pipe(inflate);
inflate.pipe(sa);
//console.log(gzip);

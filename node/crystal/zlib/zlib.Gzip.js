var fs=require('fs');
var zlib=require('zlib');

var read=fs.createReadStream('node.txt');
var write=fs.createWriteStream('node.gz');
var sa=fs.createWriteStream('unnodea.txt');
var sb=fs.createWriteStream('unnodeb.txt');
var sc=fs.createWriteStream('unnodec.txt');
var sd=fs.createWriteStream('unnoded.txt');
var se=fs.createWriteStream('unnodee.txt');
var sf=fs.createWriteStream('unnodef.txt');
var gzip=zlib.createGzip();
var gnzip=zlib.createGunzip();

read.pipe(gzip).pipe(write);
gzip.pipe(gnzip)

gnzip.pipe(sa);
gnzip.pipe(sb);
gnzip.pipe(sc);
gnzip.pipe(sd);
gnzip.pipe(se);
gnzip.pipe(sf);
//console.log(gzip);

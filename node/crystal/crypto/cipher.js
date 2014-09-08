var crypto=require('crypto');
var fs=require('fs');

var cipher=crypto.createCipher('seed','123456');
var decipher=crypto.createDecipher('seed','123456');
var rstream=fs.createReadStream('./info.txt');

var space;
rstream.on('data',function(chunk){
	cipher.update(chunk);
})
rstream.on('end',function(){
	space=cipher.final();
})
//rstream.pipe(cipher);

/*
var rstream=fs.createReadStream('./info.jpg');
var wstream=fs.createWriteStream('./hello.jpg');

rstream.pipe(wstream);
*/

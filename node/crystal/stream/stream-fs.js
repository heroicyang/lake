var fs=require('fs');

var readstream=fs.createReadStream('sea.png');
var writestream=fs.createWriteStream('river.png');
readstream.on('data',function(chunk){
	writestream.write(chunk);
})
readstream.on('end',function(){
	writestream.end();
})

/*
var arr=[];
var data;
readstream.on('open',function(){
	console.log('the stream is open');
})
readstream.on('data',function(chunk){
	arr.push(chunk);
})
readstream.on('end',function(){
	data=Buffer.concat(arr);
	writestream.write(data);
	writestream.end();
});
*/


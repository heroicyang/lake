process.stdin.on('end',function(){
	process.stdout.write('end');
})
function gets(cb){
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data',function(chunk){
		process.stdin.pause();
		cb(chunk);
	});
}
gets(function(result){
	console.log("["+result+"]");
})


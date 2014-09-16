/**
 * Module dependencies.
 */
var net=require('net');
var server=net.createServer();
server.on('connection',function(socket){
	socket.on('data',function(data){
		console.log(data.toString());
		socket.write('hello world');
		socket.end();
	})
})
server.listen(80);
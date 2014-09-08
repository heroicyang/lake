var http = require('http');
var server = new http.Server();
function onRa(req,res){
	res.write("<h1>headers</h1>");
}
function onRb(req,res){
	res.write(req.method);
	res.write(req.url);
	res.write(req.httpVersion);
	console.log(req.headers);
	/*----http 信息头----*/
	res.write(req.headers.host);
	res.write(req.headers.accept);
}
function onRe(req,res){
	res.write("<h1>this is re</h1>");
	res.end();
}
server.listen(60);
server.on('request',onRa);
server.on('request',onRb);
server.on('request',onRe);
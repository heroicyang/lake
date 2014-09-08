var http = require('http');

var serv=new http.Server();
var sera=new http.Server();

serv.listen(2000);
serv.on('request',function(req,res){
	res.write('hello world!');
	res.end();
})

sera.listen(2024);
sera.on('request',function(req,res){
	res.write('wawo world!');
	res.end();
})

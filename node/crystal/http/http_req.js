var http = require('http');


var serv=new http.Server();

serv.listen(80);
serv.on('request',function(req,res){
	//res.setHeader('Content-Type','text/html');
	res.writeHead(200,{'Content-Type':'text/html'});
	
	res.write("method:"+req.method+"</br>");
	res.write("url: "+req.url+"</br>");
	res.write("httpVersion:"+req.httpVersion+"</br>");
	//res.write("ip:"+req.connection.remoteAddress);
	
	console.log(req);
	//console.log(req.headers);
	//console.log(req.socket);
	
	
	res.end();
})

 
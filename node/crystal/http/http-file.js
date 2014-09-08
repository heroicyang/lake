var http = require('http');
var serv=new http.Server();

serv.listen(80);
serv.on('request',function(req,res){
	var buffers=[];
	req.on('data',function(chunk){
		buffers.push(chunk);
	})
	req.on('end',function(){
		req.file=Buffer.concat(buffers);
		console.log(req.file);
	})
})


 
var http=require('http');
var url=require('url');
var path=require('path');

var serv=new http.Server();

serv.on('request',function(req,res){
	var pathname=url.parse(req.url).pathname;
	var ext=path.extname(pathname);
	console.log(req.url);
	console.log(pathname);
	console.log(ext);
	res.end();
})

serv.listen(80);

var http=require('http'),
 	connect=require('connect');
var fs=require('fs');

var app = connect();
/*
app.use(function(req,res,next){
	console.log(req.connection.remoteAddress);
	console.log(req.url);
	console.log(req.port);
	res.writeHead(200,{'Content-Type':'text/plain'})
	res.write('connect-a');
    //res.end('hello world!');
    next();
	});
*/
app.use(connect.static(__dirname));
app.use(function(req,res){
	var ff=fs.createWriteStream("a.jpg");
	req.pipe(ff);
	req.on('end',function(){
		res.end();
	})
})

http.createServer(app)
	.listen(80);


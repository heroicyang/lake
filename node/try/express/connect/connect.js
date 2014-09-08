var http=require('http'),
 	connect=require('connect');


var app = connect();

app.use(function(req,res,next){
	//console.log(req.connection.remoteAddress);
	//console.log(req.url);
	//console.log(req.port);
	res.writeHead(200,{'Content-Type':'text/plain'})
	res.write('connect-a');
    //res.end('hello world!');
    next();
});
app.use(function(req,res,next){
	res.write(req.url);
	res.write('port:'+req.port);
	res.end('connect-b');
})


http.createServer(app)
	.listen(80);


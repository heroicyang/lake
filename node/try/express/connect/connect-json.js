var http=require('http'),
 	connect=require('connect');


var app = connect();
app.use(connect.static(__dirname+"/public"));

http.createServer(app)
	.listen(80);


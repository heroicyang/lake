var http=require('http');
var express=require('express');
var fs=require('fs');

var app=express();


app.use(express.static(__dirname+"/meteor"));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname+'/wave' }));



app.post('/file/add',function(req,res){
	res.send(200,"haha")
})
app.post('/create',function(req,res){
	console.log(req.body);
	res.send(200,'haha');
})

http.createServer(app).listen(80);


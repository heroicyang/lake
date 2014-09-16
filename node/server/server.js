/*=========================
>nodejs http静态文件服务器
===========================*/

//加载系统模块
var http=require('http'),
    url=require("url"),
    fs=require('fs'),
    path=require('path');

//加载自有模块
var mime=require('./mime').types;
	set=require('./set');

var sera=new http.Server();
//静态文件响应函数
sera.on('request',function(req,res){
  
    ////////设置路径名/////
    //
    //如果请求结尾是以 / 结尾 那么在 /后面加上默认读取文件
    //如果请求结尾不是以/ 结尾 但是是一个路径名
    //
    ///////////////////////////

	var pathname=url.parse(req.url).pathname;
	if(pathname.slice(-1)==="/"){
		pathname=pathname+set.index;
	}

	var realpath=path.join(set.spath,path.normalize(pathname.replace('..','')));
	console.log(req.url);
    console.log(realpath);
     

	/////////读取文件 并传送
	fs.exists(realpath,function(exists){
		if(!exists){
			res.writeHead(404,{'Content-Type':'text/html'});
			res.write("<p style='text-align:center'>wawo we can not find!</p>");
			res.end();
		}else{
			//ext获得路径的文件类型名.png.avi需要裁减第一个字符
			var ext=path.extname(realpath);
			ext=ext ? ext.slice(1):'unknown';

			var raw=fs.createReadStream(realpath);
			var contenttype=mime[ext] || "text/plain";
			res.writeHead(200,{'Content-Type':contenttype});
			raw.pipe(res);
		}
	})
	
});
sera.listen('80');


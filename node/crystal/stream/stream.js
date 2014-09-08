/*=======================
从输出结果上可以看出
没有data事件
所以body为空
但是响应end事件 会输出wowa 为什么？
所以可能
http服务的request在req接收完数据后触发
=========================*/
var http=require('http');

var serv=new http.Server();
serv.on('request',function(req,res){
	var body='';
	req.setEncoding('utf8');
	req.on('data',function(chunk){
		body +=chunk;
		console.log('data comming:');
		console.log(chunk);
	})
	req.on('end',function(){
		//var data=JSON.parse(body);
		console.log(body);
		console.log('wowa');
		res.write('wowa');
		res.end();
	})
	req.on('close',function(){
		console.log(body);
		console.log('wowa');
		res.write('wowa');
		res.end();
	})
})
serv.listen(80)

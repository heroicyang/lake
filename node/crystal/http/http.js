var http = require('http');

var serv=new http.Server();
/**
*http 请求头到达时 便会触发request事件
*req 作为流接收请求体
*/
serv.on('request',function(req,res){
	res.write('hello world!');
	res.end();
})
serv.listen(2000);

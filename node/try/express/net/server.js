var http = require('http');
var server = new http.Server();

var node=server;
node.get=function(url,vec){
	server.on('request',function(req,res){
		var method=req.method;
		console.log(method);
		if(method=="GET"){
			vec(req,res);
		}else{
			console.log(method);
		}
	});
};
module.exports=node;
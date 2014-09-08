var http = require('http');

http.get("http://127.0.0.1:80",function(res){
	console.log(res.statusCode);
})


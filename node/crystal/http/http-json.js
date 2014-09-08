var http = require('http');

var serv=new http.Server();
serv.listen(800);
serv.on('request',function(req,res){
    res.writeHead(200,{'Content-Type':'application/json'});
    //var json=new Buffer('{"node":"123456789"}','utf8');
    var data={
    	node:123,
    	str:'123456',
    	arr:[
    		00,
    		11,
    		22,
    		33,
    		44,
    		55,
    		66
    	]
    }
	res.write(JSON.stringify(data));
	res.end();
})


var port=8124;
var http=require('http');
var htutil=require('./htutil');

var server=http.createServer(function(req,res){
    htutil.loadParams(req,res,undefined);
    if(req.requrl.pathname)
})


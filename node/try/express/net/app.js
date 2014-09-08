var node=require('./server');

node.get('/',function(req,res){
	res.write('hello world!');
});
node.get('/',function(req,res){
	res.write('hello node!');
	res.end();
});
node.listen('80');
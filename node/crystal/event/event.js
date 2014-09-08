var Emitter=require('events').EventEmitter;
var emit=new Emitter();

function b(stream){
	console.log('event '+stream+' 2');
}

emit.on('connection',function(stream){
	console.log('event '+stream+' 0');
});
emit.on('connection',function(stream){
	console.log('event '+stream+' 1');
});
emit.on('connection',b);
emit.on('connection',function(stream){
	console.log('event '+stream+' 3');
});
emit.on('connection',function(stream){
	console.log('event '+stream+' 4');
});
console.log(Emitter.listenerCount(emit,'connection'));


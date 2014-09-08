var EventEmitter=require('events').EventEmitter;
var event=new EventEmitter();
var current=1;
event.on('connect1',function(){
	console.log('hello connect a');
});
event.on('connect2',function(){
	console.log('hello connect b');
});
setInterval(function(){
	event.emit('connect'+current);
	current=current+1;
},4000);
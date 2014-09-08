var name='hi node';
exports.show=function(){
	console.log(name);
}
exports.emit=function(data){
	name=data;
}
console.log('this is moduleb');

var func=function() {
	this.name="jesua";
	this.world="hello world!";
}
func.add=function(a,b){
	return a+b;
};
func.prototype={
	constructor:func,
	say:function(){
		alert('hi'+' '+this.name+' '+this.world);
	}
}
var c=func.add(1,2);
console.log(c);


var Person=function(name){
	this.name=name;
};
Person.prototype={
	sayname:function(){
		console.log(this.name);
	}
}
var Chinese=function(name,nation){
	Person.call(this,name);
	this.nation=nation;
}
Chinese.prototype=Object.create(Person.prototype);
Chinese.prototype.saynation=function(){
	console.log(this.nation);
}
var a=new Chinese('avaer','newzland')
a.sayname()
a.saynation()
console.log(Person.prototype);
console.log(Chinese.prototype);

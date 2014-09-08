function say(){
	console.log(this.name);
}
var sa={name:'i am sa'};
var sb={name:'i am sb'};
var sc={name:'i am sc'};
var a=say.apply(sa);
say.apply(sb);
say.apply(sc);
console.log(a);

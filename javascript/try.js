function say(){
	console.log(this.name);
}
var n={name:'node'}
n.say=say
n.say()

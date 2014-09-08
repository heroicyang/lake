var parent = { 
	name: 'jack', 
	age: 30, 
	isMarried: false
} 
parent.porotype={
	saya:function(){
		console.log(this.name);
	},
	sayb:function(){
		console.log(this.age);
	}
}
var d={
	fire:'fire fox'
}
d=Object.create(parent)
console.log(d.saya)

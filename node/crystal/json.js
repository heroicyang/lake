var data={
	node:123,
	str:'this is json data',
	hh:'hello world'
}
var str=JSON.stringify(data);

console.log(str);
console.log(typeof str);

var o=JSON.parse(str);
console.log(o);
//console.log(typeof o);

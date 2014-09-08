var str,str2;
var buf,buf2;
var j;
console.time('string')
for(j=0;j<1000;j++){
	var x=j+'';
	str +=x;
}
console.timeEnd('string')

console.time('buffer')
buf=new Buffer(10)
for(j=0;j<1000;j++){
	var x=j+'';
	buf.write(x,j);
}
console.timeEnd('buffer')

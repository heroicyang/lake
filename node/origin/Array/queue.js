var arr=['零','一','二','三','四','五','六','七','八','九']
function apush(){
	arr.push(arr.shift())
}
function apop(){
	arr.splice(0,0,arr.pop())
}
apop();
apop();
apush();
apush();
console.log(arr);


var a={
	0:'this is zero',
	1:'this is a',
	2:'this is b',
	8:'this is c',
	name:'object'
}
console.log(a[8]);
/*------------------------------------------
当调用a[8]时 并不是调用对象a的第八个元素 而是
将数字8转换为字符串'8'然后调取对应键值的
对象
--------------------------------------------*/
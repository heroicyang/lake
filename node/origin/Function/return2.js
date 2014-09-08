/*
函数内的return
只会跳出本级函数
而不会跳出父级函数
*/
function a(){
	function b(){
		function c(){
			console.log('this is c');
			return;
		}
		c();
		console.log('this is b');
	}
	b();
	console.log('this is a');
}
a();


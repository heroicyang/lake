/*
break 跳出for循环
return 跳出函数
*/
function a(){
	for(var n=0;n<9;n++){
		if(n==3){
			//break;
			return;
		}
		console.log(n);
	}
	console.log('end');	
}
a();

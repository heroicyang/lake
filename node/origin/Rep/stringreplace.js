var str="<b>你好</b><div><b>&nbsp;</b><span>{<b>title</b>}<span><span>{author_all}</span></span></span></div><div>你的作品很棒</div><div>&nbsp;<span>{<i>eamil</i>}</span></div>"
str.replace(/\{(.+?)\}/g,function(value0,value1,value2){
	console.log(value0);
	console.log(value1);
	console.log(value2);
	//console.log(value3);
	//console.log(value4);
	//console.log(value5);
})


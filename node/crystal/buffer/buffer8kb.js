var os=require('os');
var leak_buf_ary=[];
var show_memory_usage=function(){//打印系统空闲内存
	console.log('free memory'+Math.ceil(os.freemem()/(1024*1024))+'MB');
}
show_memory_usage();
var do_buf_leak=function(){
	var leak_char='1';
	var loop=100000;
	var buf1_ary=[];
	while(loop--){
		buf1_ary.push(new Buffer(1024));
		leak_buf_ary.push(new Buffer(loop+leak_char));
	}
	console.log("before gc");
	show_memory_usage();
	buf1_ary=null;
	return;
}

console.log("process start");
show_memory_usage();

do_buf_leak();

var j=10000;
setInterval(function(){
	console.log("after gc");
	show_memory_usage();
},1000*60);

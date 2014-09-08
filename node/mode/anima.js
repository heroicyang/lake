/*===============================================================
原理 所有的动画效果都可最终简约为一个数值的变动
每一个数值的变动精简为一个Ani实例
所有的Ani实例push入timers数组中

interval每隔13ms更新一次 每次更新便将存储在timers数组中的Ani实例
依次遍历 根据时间差 和 动画参数 计算出此实例此刻的值 并赋值之
----------------------[[参数说明]]-----------------
elem                  元素
options:
	duration		   间隔
	easing             
	callback
name                  元素缓动键值
-----------------[[move函数 动画参数]]------------------------
start          //起始数值
end            //结束数值

=================================================================*/
function Ani(){
	this._init_.apply(this,arguments);
};
Ani.timerid=null;   //interval指针
Ani.timers=[];	    //元素序列
Ani.easing={
	swing: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	}
}; 
Ani.tick=function(){
	if(Ani.timerid) return;
	Ani.timerid=setInterval(function(){
		if(!Ani.timers.length){
			Ani.stop();
			return;
		}
		for(var i=0,ele=Ani.timers[i];i<Ani.timers.length;i++){
			ele.step();
		}
	},13);
}
Ani.stop=function(){
	clearInterval(Ani.timerid);
	Ani.timerid=null;
}
//=====================[[原型]]==============
Ani.prototype={
	_init_:function(elem,options,name){
		this.elem=elem;			  
		this.options=options;     //动画相关参数
		this.name=name;			  //需要动画的键值
	},
	move:function(from,to){
		this.startTime=new Date().getTime();
		this.start=from;
		this.end=to;
		Ani.timers.push(this);
		Ani.tick();
	},
	/*\
	每隔13ms调用一次此函数 
	根据时间间隔确定现在的值
	如果超过了时间duration 则赋值最终值同时停止本实例
	\*/
	step:function(){
		var now=new Date().getTime();
		var nowPos;
		if(now>(this.startTime+this.options.duration)){
			nowPos=this.end;
			this.options.callback.call(this.elem);
			this.stop();
		}else{
			var n=now-this.startTime;
			var state=n/this.options.duration;
			var pos=Ani.easing[this.options.easing](state,n,0,1,this.options.duration);
			nowPos=this.start+((this.end-this.start)*pos);
		}
		this.update(this.name,nowPos);
	},
	/*\
	更新函数
	\*/
	update:function(name,value){
		this.elem[name]=value;
		console.log(name+":"+value);
	},
	//timers中查找本元素 然后删除
	stop:function(){
		for(var i=0;i<Ani.timers.length;i++){
			if(Ani.timers[i]===this){
				Ani.timers.splice(i,1);
			}
		}
	}
}
var options={
	duration:2000,
	easing:'swing',
	callback:function(){
		console.log('hello world!');
	}
}
var ele={'a':0};
var ani=new Ani(ele,options,'a');
ani.move(0,200);





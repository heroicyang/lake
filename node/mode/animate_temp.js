/*=================================================================
原理 仅有一个interval 页面所有动画效果都可简约为一个数值的变动
每一个数值的变动精简为一个FX实例 
interval 没格13ms更新一次 每次更新便将所有FX实例数值更新一次

jquery中每个元素都有个fx数组 专门存储animate函数 
fx数组中的函数并不能同时运行
每个函数运行完毕后  以队列形式弹出下一个函数并执行
执行完毕后 接着调用下一个函数 直至为空
==================================================================*/
var timers=[];          //存储FX实例
var timerid;            //interval指针

/*___________________________________________________________
    FX对象定义 所有元素的所有属性变化都会生成一个FX实例
    elem:            //dom元素
    options:
        duration     //间隔
        easing       //过度函数
        callback     //回调函数
    name:            //要动画的参数名
    -----------------------------------
    startTime        //起始时间
    start            //起始数值
    end              //结束数值
____________________________________________________________*/
function FX(elem,options,name){
    this.elem=elem;
    this.options=options;
    this.name=name;
}
/*----------------------------------------
起始函数 确定起始时间 起始数值 结束数值
------------------------------------------*/
FX.prototype.custom=function(from,to){
    this.startTime=jQuery.now();
    this.start=from;
    this.end=to;
    timers.push(this);
    FX.tick();
}
/*----------------------------------------
interval启动函数 若已启动就不必再启动了
-----------------------------------------*/
FX.tick=function(){
    if(timerid) return;
    timerid=setInterval(function(){
        for(var i=0,c;c=timers[i++];){
            c.step();
        }
        if(!timers.length){
            FX.stop();
        }
    },13);
}
/*---------------------------------------------
核心函数 每隔13ms调用一次根据时间间隔确定现在的
值 如果超过了时间duration 则赋值最终值同时停止
本实例
----------------------------------------------*/
FX.prototype.step=function(){
    var t=jQuery.now();
    var nowPos;
    if(t>(this.startTime+this.options.duration)){
        nowPos=this.end;
        this.options.callback.call(this.elem);
        this.stop();
    }else{
        var n=t-this.startTime;
        var state=n/this.options.duration;
        var pos=jQuery.easing[this.options.easing](state,n,0,1,this.options.duration);
        nowPos=this.start+((this.end-this.start)*pos);
    }
    this.update(nowPos,this.name);
}
/*------------------------------------------
停止本元素的动画 检查timers里面元素为本元素的
FX实例 然后移除
--------------------------------------------*/
FX.prototype.stop=function(){
    for(var i=timers.length-1;i>=0;i--){
        if(timers[i]===this){
            timers.splice(i,1);
        }
    }
}
/*---更新数值---*/
FX.prototype.update=function(value,name){
    var style={};
    style[name]=value;
    this.elem.css(style);
}
/*---停止所有动画 clearInterval---*/
FX.stop=function(){
    clearInterval(timerid);
    timerid=null;
}
/*------------------------------------------------------------------------------*/
var options={
    duration:2000,
    easing:'swing',
    callback:function(){
        console.log('hello world!');
    }
}
var se=$('.div1');
var ele=new FX(se,options,'left');
ele.custom(0,200)



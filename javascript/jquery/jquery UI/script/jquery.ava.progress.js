/*-----------------------------------------

第一个 jquery widget 小部件


--------------原型体{}内--------------------

原型体内可调用的变量

this.element    本元素
this.options    指代什么
this.option     函数设置参数
     
以下划线_开头的函数 如
_private:function(options){函数体}
为私有函数外界无法调用

其他函数 如
public:function(options){函数体}
为公有函数 外界可以通过以下方式调用
$('元素名').插件名('公有函数名',参数一,参数二,参数N);

this                                        指什么
_init                                       what?
_create                                     widget调用时 执行此函数
_trigger(type,event,data)                   what?
_destroy
_constrain
-------------------------------------------



----------------------------------------------*/

(function($){

    $.widget("avatar.progress",
           {
                options:{
                    value:0
                },
                _init: function(){
                },
				
				/*---------------
				创建时执行的函数
				----------------*/
                _create:function(){
                 this._update();
				 console.log(this.widgetName);
                },
				name:'wawa thi is widget',
				/*--------------
				公有函数 根据输入的数值
				设置options参数
				如无数值输入 
				返回options.value的值
				---------------*/
                val:function(value){
                    if(value===undefined){
                        return this.options.value;
                    }
                    else{
                        this.options.value=value;
                        this._update();
                    }
                },
				
               /*---------------------
               根据options数值 更新参数
			   若大于100 取100
			   若小于0   取0
                ---------------------*/
                _update:function(){
                     var _constrain=function(value){                 //内部函数 根据输入数值截取0到100的数值 
                                if (value > 100) {
                                    value = 100;
                                    }
                                if (value < 0) {
                                   value = 0;
                                    }
                                   return value;
                                };
                     var progress=_constrain(this.options.value)+"%";
                     this.element.text(progress);
                }
           }
          );

})(jQuery);
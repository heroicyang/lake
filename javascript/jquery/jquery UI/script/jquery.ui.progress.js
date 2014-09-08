/*-----------------------------------------

第一个 jquery widget 小部件


--------------原型体{}内--------------------

原型体内可调用的变量

this.element    本元素
this.options    指代什么
this._trigger   事件光散
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
                // this._update();
                },
				
                _create:function(){
                  this._update();
                },
				
				val:function(value){
				  this.options.value=value;
				  this._update();
				},
				
				_complete:function(){
				 alert('haha callback are great');
				},
				
                _update:function(){
                   var progress=this.options.value+'%';
				   this.element.text(progress);
				   if(this.options.value==100){
				      this._complete();
				   }
                }
           }
          );

})(jQuery);
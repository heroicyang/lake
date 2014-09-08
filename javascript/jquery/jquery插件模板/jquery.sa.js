/*
插件编写规范

   1 jquery对象变量前加“$”
   2 使用bind来绑定事件
   3 私有变量 函数 以_开头
   4 函数注释
		{
		input 传入变量
		energ 内部变量
		}

*/

/******
插件名称
******/
(function($){
    $.fn.saname= function(options){
        /*函数参数*/   
	   var _opts = $.extend({}, $.fn.saname.defaults, options);
       return this.each(function(){
	   $this = $(this);
        //在这里写代码代码
        });    
    }
	/***
	默认参数调节
	***/
	$.fn.saname.defaults = {
	
	};	 
})(jQuery);
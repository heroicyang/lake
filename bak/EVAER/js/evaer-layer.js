/*===============
>层插件
>evaer-layer
================*/
(function($) {
    
    var Layer=function(param){
    	return new Layer.o.init(param);
    }
    Layer.o=Layer.prototype={
    	init:function(param){
            console.log(param);
    	},
        //显示隐藏切换
        toggle:function(){
            this[this.isactive()? "hide":"show"]();
        },
        //显示
    	show:function(){
            console.log('show haha');
    	},
        //隐藏
    	hide:function(){
            console.log('hide haha');
    	},
        //判断显示或隐藏
        isactive:function(){

        }
    }
    Layer.o.init.prototype=Layer.prototype;
    $.layer=Layer;
})(window.jQuery);

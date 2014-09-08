/*======================================
>jquery 滑动固定插件
>使用方法
	><div class='hello'>
	></div>
	>$('.hello').fix({top:0,bottom:600});
>参数说明
	>top:元素顶部距离整个页面顶部多高时固定        默认为0
	>bottom:元素底部距离整个页面底部多远时取消固定 默认为0
========================================*/

(function($) {
	$.fn.fix = function(options) {
		var opts = $.extend({}, $.fn.fix.defaults, options); //获得参数
		var $window=$(window);
		var $document=$(document);
		var that=$(this);
		refresh();
		//注册事件
		$window.scroll(onscroll);
		/*==================
		刷新元素的固定位置信息
		===================*/
		function refresh(){
			that.each(function(){
				var $this=$(this);
				var $container=opts.container ? $this.closest(opts.container):$(document.body);
				var offset=$this.offset();
				var coffset=$container.offset();
				$this.data("fix",{
					from:opts.container? coffset.top : offset.top,
					to:coffset.top+$container.height()-$this.outerHeight()
				})
				console.log(coffset);
				console.log($this.data('fix'));
			})
		}
		//事件一响应函数
		function scrolla(se){
			se.removeClass('fixb').addClass('fixa');
		}
		//事件二响应函数
		function scrollb(se){
			se.removeClass('fixa').addClass('fixb');
		}
		//位置清理函数
		function clearscroll(se){
			se.removeClass('fixa').removeClass('fixb');
		}
		/*=========================
		>核心函数 
		>判断 三种状态 可视页面顶部
		>在top线以下         状态=0
		>到达top线 卡住     
		>bottom线以上        状态=1
		>到达bottom线卡住    状态=2
		==========================*/
		var status = 0; //初始状态值
		function onscroll() {
			var oscrolltop = $window.scrollTop();
			that.each(function(){
				var $this=$(this);
				var pos=$this.data('fix');
				var from=pos.from;
				var to=pos.to;
				if(oscrolltop<=from){
					if(status!==0){
						clearscroll($this);
						status=0;
					}
				}else if(oscrolltop < to){
					if(status!==1){
						scrolla($this);
						status=1;
					}
				}else{
					if(status!==2){
						scrollb($this);
						status = 2;
					}
				}
			})
		}
	}
	//设定预设值
	$.fn.fix.defaults = {
	}
})(jQuery);
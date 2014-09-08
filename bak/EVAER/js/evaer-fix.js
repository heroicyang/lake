/*———————————————————————————————————————————————————————
@evaer evaer.lofter.com
jquery 滑动固定插件
使用方法
	<div class='hello'>
	</div>
	$('.hello').fix({top:0,bottom:600});
参数说明
	top:元素顶部距离整个页面顶部多高时固定        默认为0
	bottom:元素底部距离整个页面底部多远时取消固定 默认为0
—————————————————————————————————————————————————————————*/

(function($) {
	$.fn.fix = function(options) {
		var opts = $.extend({}, $.fn.fix.defaults, options); //获得参数
		return this.each(function() {
			var Awindow = $(window);
			var Adocument = $(document);
			var Athis = $(this); //获取本元素
			var oheight = Athis.height(); //获取高度
			var owidth = Athis.width(); //获取宽度
			var otop = Athis.offset().top - opts.top; //获得元素距离页面顶端高度多少时固定
			var obottom=opts.bottom;
			var ofloat = Athis.css('float'); //获取元素的浮动属性
			//var oleft=Athis.offset().left;        //获取元素距离页面左边的坐标
			/*-----------------------------------
		 	克隆元素 去除 clss id
		 	仅保留 width height float
		 	取外围宽高 同时设margin padding为0
		 	------------------------------------*/
			var oclone = Athis.clone();
			oclone.html('').removeAttr('class').removeAttr('id').css({
				width: Athis.outerWidth(true),
				height: Athis.outerHeight(true),
				padding: '0',
				margin: '0',
				border: 'none',
				float: ofloat
			}).hide().insertAfter(Athis);
			/*---------------------------
			核心函数 
			判断 三种状态 可视页面顶部
			在top线以上         状态=0
			在top线以下     
				bottom线以上    状态=1
				bottom线以上    状态=2
		 	--------------------------*/
			var oload = 0; //状态值

			function ofixed(top, bottom) {
				var oscrolltop = Awindow.scrollTop();
				/*--获取距离页面底部的像素值--*/
				var bot = Adocument.height() - bottom - Athis.outerHeight();
				if (oscrolltop <= top) {
					if (oload !== 0) {
						Athis.removeAttr('style');
						oclone.hide();
						oload = 0;
					}
				} else {
					if (oscrolltop < bot) {
						if (oload !== 1) {
							oclone.show();
							Athis.css({
								position: 'fixed',
								top: '0px',
								width: owidth,
								height: oheight
							});
							oload = 1;
						}
					} else {
						if (oload !== 2) {
							var relatop=bot-otop;
							oclone.hide();
							Athis.css({
								position: 'relative',
								top: relatop
							});
							oload = 2;
						}
					}
				}
			}
			/*注册事件*/
			Awindow.scroll(function() {
				ofixed(otop, obottom)
			});
		});
	}
	//设定预设值
	$.fn.fix.defaults = {
		top: 0, //当元素距离页面顶部多少时就开始固定
		bottom:0
	}
})(jQuery);
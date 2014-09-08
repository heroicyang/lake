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
define(function(require,exports,module){
    var $=require('jquery');

    function spy(ele,top){
        var se=$(ele);
        var as=se.find('[data-target]');
        as.click(function(){
            var es=$(this);
            var target=$(es.attr('data-target'));
            var t=target.offset().top-top;
            $(window).scrollTop(t);
        })
    }
    module.exports=spy;
})
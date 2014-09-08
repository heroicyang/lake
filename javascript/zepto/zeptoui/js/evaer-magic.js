/*====================
>渐隐渐现幻灯flash插件
>鼠标划入不同的标记
>标记类名变为active
>flash内容的相关类名变为active和相关的动画类名
==============================================*/
(function($){
    /*============
    >Magic对象定义
    ==============*/
    var Magic=function(se){
        this.ele=se;
        var child=this.ele.children();
        this.lis=child.eq(1).children();
        this.conts=child.eq(0).children();
        this.current=0;
        this.length=this.conts.length;
        this.timer={};
        this.init();
    }
    Magic.prototype={
        init:function(){
            var that=this;
            that.lis.eq(0).addClass('active');
            that.lis.mouseenter(function() {
                var se = $(this);
                var num = se.index();
                that.change(num);
            });
            that.circle(true);
        },
        /*=======
        >自启函数
        ========*/
        circle:function(bool){
            var that=this;
            var num=that.current>=(that.length-1) ? 0:that.current+1;
            if(bool){
                clearTimeout(that.timer);
                that.timer=setTimeout(function(){that.change(num)},6000);
            }
            else{
                clearTimeout(that.timer);
            }
        },
        /*===========
        >change主函数
        ============*/
        change:function(num){
            var that=this;
            that.circle(false);
            //重复选中一个图像 不发生变化
            if(num==that.current){
                that.circle(true);
                return;   
            }            
            that.lis.eq(num).addClass('active').siblings().removeClass('active');
            that.conts.removeClass('active').removeClass('a-fadein');
            that.conts.eq(that.current).addClass('active').css({'z-index':0});
            that.conts.eq(num).addClass('active').css({'z-index':1}).addClass('a-fadein');
            that.current=num;
            that.circle(true);
        }
    }
    /*===========
    >链接至jquery
    =============*/
    $.fn.magic= function () {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('magic')
            if (!data) $this.data('magic', (data = new Magic($this)));
        })
    }
    $(function(){
        $("[data-m='magic']").magic();
    })
})(Zepto);

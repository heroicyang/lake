/*=================
>evaer 折叠插件
>插件只和结构和类名active相关
==================*/
(function($){

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    var Accordion=function(ele){
        this.se=$(ele);
        this.cons=this.se.children();
        this.touchs=this.cons.children(':first-child');
        this.init();
    }
    Accordion.prototype={
        init:function(){
            var that=this;
            this.touchs.on('click',function(){
                var se=$(this);
                that.toggle(se); 
            })
        },
        /*======================================
        >切换事件 根据是否有类名 .active进行切换
        >当快速点击时例如 
            >在打开一个折叠卡的动画进行时点击 因为未打开完毕 会将这次的动画效果加入队列
            >当打开动画执行完毕后 加入队列里的其余打开动画因为已经达到最终效果所以会立马执行完毕 不会有冗余动画队列
            >打开动画完毕后 加入类名.active 点击事件再次发生时执行关闭动画 若动画期间有点击事件会和打开事件一样进行
        =======================================*/
        toggle:function(em){
            if(em.parent().hasClass('active')){
                this.ehide(em);
            }else{
                this.eshow(em);
            }
        },
        /*====================
        >显示事件
        >参数为折叠的那个头元素
        ======================*/
        eshow:function(em){
            var that=this;
            that.touchs.not(em).each(function(){that.ehide($(this))});
            em.next().show();
            em.parent().addClass('active');
        },
        /*===================
        >隐藏事件
        >参数为折叠的那个头元素
        =====================*/
        ehide:function(em){
            em.next().hide();
            em.parent().removeClass('active');
        }
    }

    $.UI['Accordion']=Accordion;

    //自动加载
    $(function(e) {
        $("[data-ui-accordion]").each(function() {
            var $this = $(this);
            var data = $this.data('accordion')
            if (!data) $this.data('accordion', (data = new Accordion(this)));
        });
    });
})(jQuery);


/*--------------------
渐隐渐现幻灯jquery插件   
=====================*/
(function($){
    var Accordion=function(ele){
        this.se=$(ele);
        this.cons=this.se.find('.m-ac-cube');
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
        /*参数为折叠的那个头元素*/
        eshow:function(em){
            var that=this;
            that.touchs.not(em).each(function(){that.ehide($(this))});
            em.parent().addClass('active');
        },
        ehide:function(em){
            em.parent().removeClass('active');
        },
        toggle:function(em){
            if(em.parent().hasClass('active')){
                this.ehide(em);
            }else{
                this.eshow(em);
            }
        }  
    }
    $.fn.accordion= function () {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('accordion')
            if (!data) $this.data('accordion', (data = new Accordion(this)));
        })
    }
})(Zepto);

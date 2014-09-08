/*===============
>array插件
>一直循环哦
================*/
(function($) {

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}
    
    /*==========
    >Arr对象定义
    ============*/
    var Arr= function(element) {
        this.se = $(element);
        this.con=this.se.find('.m-arr-con');
        var childs=this.con.children();
        this.elength=childs.length;
        //this.ewidth=childs.eq(0).width();
        this.ewidth=120;//这里需要想想怎么写啊 为什么宽度不稳定
        this.vecl=this.se.find('sub');
        this.vecr=this.se.find('sup');
        this.init();
    }
    Arr.prototype={
        init:function(){
            var that=this;
            this.vecl.click(function(){
                that.shinel(4);
            });
            this.vecr.click(function(){
                that.shiner(4);
            })
        },
        shinel:function(num){
            var that=this;
            var ltstr=":lt("+num+")";
            that.con.animate({left:-that.ewidth*num},500,function(){
                that.con.children(ltstr).appendTo(that.con);
                that.con.css({left:0});
            })
        },
        shiner:function(num){
            var that=this;
            var gtstr=":gt("+(that.elength-num-1)+")";
            that.con.children(gtstr).prependTo(that.con);
            that.con.css({left:-that.ewidth*num});
            that.con.animate({left:0},500);
        }
    }

    $.UI['Arr']=Arr;
    /*
    $.fn.marr = function(options) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('marr')
            if (!data) $this.data('marr', (data = new Arr(this, options)));
            if (typeof options == 'string') data[options]();
        })
    }
    */
    //自动执行
    $(function(){
        $("[data-ui-arr]").each(function() {
            var $this = $(this);
            var data = $this.data('arr')
            if (!data) $this.data('arr', (data = new Arr(this)));
        });
    });

})(jQuery);
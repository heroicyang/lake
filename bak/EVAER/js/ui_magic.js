/*============================
>渐隐渐现幻灯jquery插件   
==============================*/
(function($){
    
    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    var Magic=function(se){
        this.ele=se;
        var _children=se.children();
        this.lis=_children.eq(1).children();
        this.conts=_children.eq(0).children();
        this.length=this.conts.length;
        this.current=0;
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

        //循环函数 bool  为true时5s后变换
        //bool为false时  直接清除定时函数
        circle:function(bool){
            var that=this;
            var num=that.current>=(that.length-1) ? 0:that.current+1;
            if(bool){
                clearTimeout(that.timer);
                that.timer=setTimeout(function(){that.change(num)},5000);
            }
            else{
                clearTimeout(that.timer);
            }
        },

        //
        //
        change:function(num){
            var that=this;
            /*===============================================
            >下面两句话位置不可替换
            >当让所有正在进行的动画停止时 会马上触发circle函数 
            >而此时需要清除这次circle
            ================================================*/
            that.conts.stop(true,true);
            that.circle(false);         
            /*==============================================
            >如果触发同一位置会导致num=current 即prev元素=current元素
            >下面的回调函数执行时 元素渐现后 原本想隐藏上一个元素
            >但因为prev=current  本元素渐现后会立即消失
            >这条语句防止了这样的情况的发生
            >直接返回
            ===============================================*/
            if(num==that.current){
                that.circle(true);
                return;   
            }            
            that.lis.eq(num).addClass('active').siblings().removeClass('active');
            var prev=that.conts.eq(that.current);
            var current=that.conts.eq(num);
            prev.css({'z-index':1});
            current.css({'z-index':2}).fadeIn('normal',function(){
                prev.hide();
                that.current=num;
                that.circle(true);
            });
        }
    }

    $.UI['Magic']=Magic;

    //自动执行
    $(function(){
        $("[data-ui-maga]").each(function() {
            var $this = $(this);
            var data = $this.data('magic')
            if (!data) $this.data('magic', (data = new Magic($this)));
        });
    });
})(jQuery);

/*==========================
>左移右移幻灯jquery插件   
=============================*/
(function($){
    
    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    var Magicb=function(se){
        this.ele=se;                
        this.current=0;
        this.conts=se.find('.m-magb-con').children();
        this.lis=se.find('ul').children();
        this.length=this.conts.length;
        this.vleft=se.find('sub');
        this.vright=se.find('sup');
        this.timer={};
        this.init();
    }
    Magicb.prototype={
        init:function(){
            var that=this;
            that.circle(true);
            that.vleft.click(function(){
                var num;
                if(that.current==0){
                    num=that.length-1;
                }else{
                    num=that.current-1;
                }
                that.change(num,true);
            });
            that.vright.click(function(){
               var num;
               if(that.current==that.length-1){
                    num=0;
               }else{
                    num=that.current+1;
               }
               that.change(num,false);
            })
            that.lis.hover(function(){
                var se=$(this);
                var num=se.index();
                if(num<that.current){
                    that.change(num,true);
                }else{
                    that.change(num,false);
                }
            })
        },
        /*==========
        >定时启动函数
        ============*/
        circle:function(bool){
            var that=this;
            var num=that.current>=(that.length-1) ? 0:that.current+1;
            if(bool){
                clearTimeout(that.timer);
                that.timer=setTimeout(function(){that.change(num,false)},5000);
            }
            else{
                clearTimeout(that.timer);
            }
        },
        /*\
        >num 说明了下个显示的div的编号
        >bool变量定义了往哪个方向滑动
            >true 往右滑动 false 往左滑动
        \*/
        change:function(num,bool){
            var that=this;
            /*\
            >下面两句话位置不可替换
            >当让所有正在进行的动画停止时 会马上触发circle函数 
            >而此时需要清除这次circle
            \*/
            that.conts.stop(true,true);
            that.circle(false);
             /*\
            >如果触发同一位置会导致num=current 即prev元素=current元素
            >下面的回调函数执行时 元素渐现后 原本想隐藏上一个元素
            >但因为prev=current  本元素渐现后会立即消失
            >这条语句防止了这样的情况的发生
            \*/
            if(num==that.current){
                that.circle(true);
                return;   
            }
            var elea=that.conts.eq(that.current);
            var eleb=that.conts.eq(num);
            var dur=400;
            if(bool){
                elea.animate({left:'100%'},dur,function(){elea.removeClass('active');that.circle(true);});
                eleb.addClass('active')
                    .css({left:'-100%'})
                    .animate({left:'0'},dur);
            }else{
                elea.animate({left:'-100%'},dur,function(){elea.removeClass('active');that.circle(true);});
                eleb.addClass('active')
                    .css({left:'100%'})
                    .animate({left:'0'},dur);
            }
            that.current=num
            that.actli(num);
        },
        actli:function(num){
            this.lis.eq(num).addClass('active').siblings().removeClass('active');
        }       
    }

    $.UI['Magicb']=Magicb;

    //自动执行
    $(function(){
        $("[data-ui-magb]").each(function() {
            var $this = $(this);
            var data = $this.data('magicb')
            if (!data) $this.data('magicb', (data = new Magicb($this)));
        });
    });
})(jQuery);

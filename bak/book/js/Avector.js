/*==============
 [[导航栏组件]]
================*/
(function($){

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    var Vector=function(element,options){
        this.element=$(element);
        this.head=$('.m-vector-icon',this.element);               //导航标志
        this.body=$('.m-vector-nav',this.element);                //导航主内容
        this.options=$.extend({},Vector.defaultOptions,options);
        this.init();
    };
    Vector.prototype={

        //初始化函数
        init:function(){
            var that=this;

            //事件注册
            this.head.on('click',function(e){
                e.preventDefault();
                that.body.toggle();
            })

            this.vectors=this.body.find('b');
            this.vectors.on('click',function(e){
                e.preventDefault();
                that.toggle($(this).parent());
            });

            this.as=this.body.find('a');
            this.as.on('click',function(e){
                that.active($(this));
                $('html').height()  //强制刷新 否则有时候导航的会消失 
            });
        },
        //打开li元素
        open:function($li){
            if(!$li.hasClass('in')) return;
            $li.children('b').text('>');
            $li.removeClass('in');
        },
        //关闭li元素
        close:function($li){
            if($li.hasClass('in')) return;
            $li.children('b').text('<');
            $li.addClass('in');
        },
        //仅打开li元素及关联的父级元素
        simpleOpen:function($li){
            var that=this;
            this.open($li);
            $li.siblings().each(function(){
                that.close($(this));
            });
            $li.parents('li').each(function(){
                that.open($(this));
                $(this).siblings().each(function(){
                    that.close($(this));
                })
            })
        },
        //切换li元素开合
        toggle:function($li){
            $li.hasClass('in') ? this.open($li):this.close($li)
        },
        //激活a元素同时打开对应的li元素
        active:function($a){
            this.body.find('a').removeClass('active');
            $a.addClass('active');
            this.simpleOpen($a.parent())
        }
    };
    Vector.defaultOptions={};

    $.UI['Vector']=Vector;

})(jQuery);

/*===============
 [[滚动侦听组件]]
=================*/
(function($){
    
    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{};

    var $win=$(window);

    var ScrollSpy=function(element,options){

        this.element=$(element);
        this.options=$.extend({},ScrollSpy.defaults,options);

        this.init();

    };
    ScrollSpy.prototype={

        //初始化函数
        init:function(){
            var that=this;
            this.inviewstate=false;        //是否在视窗内
            this.onlinestate=false;        //是否在视窗顶部和某条水平线内
            $win.on('scroll',function(){that.refresh.call(that)})
        },

        //检查更新函数
        refresh:function(){
            var inview=this.isInview(this.element);
            var online=this.isOnline(this.element);
            
            if(inview && !this.inviewstate){
                this.inviewstate=true;
                this.element.trigger('scrollspy.inview');
            }else if(!inview && this.inviewstate){
                this.inviewstate=false;
                this.element.trigger('scrollspy.outview');
            }

            if(online && !this.onlinestate){
                this.onlinestate=true;
                this.element.trigger('scrollspy.online');
            }else if(!online && this.onlinestate){
                this.onlinestate=false;
                this.element.trigger('scrollspy.offline');
            }

        },
        //判断元素是否在窗口中
        isInview:function($element){

            var win_left=$win.scrollLeft(),
                win_top=$win.scrollTop();

            var offset=$element.offset(),
                left=offset.left,
                top=offset.top;

            if(top+$element.height() >= win_top && top <= win_top+$win.height()
            && left+$element.width() >= win_left && left <= win_left+$win.width()){
                return true;
            }else{
                return false;
            }

        },
        //判断元素是否在窗口顶部和某条水平线间的区域
        //@line 此距离视窗顶部的距离 默认为200
        isOnline:function($element,line){

            line=line? line:100;

            var win_top=$win.scrollTop();
            var top=$element.offset().top;

            if(top >= win_top && top <= win_top+line){
                return true;
            }else{
                return false;
            }

        }

    }

    ScrollSpy.defaults={};

    $.UI['ScrollSpy']=ScrollSpy;

    //文档加载完毕后自动加载
    $(function(){
        $("[data-uk-scrollspy]").each(function(){
            var $element=$(this);
            if (!$element.data("scrollspy")) {
                var obj = new ScrollSpy(this);
            }
        })
    })

})(jQuery);   

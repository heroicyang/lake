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

            line=line? line:160;

            var win_top=$win.scrollTop();
            var top=$element.offset().top;

            if(top+$element.height() >= win_top && top <= win_top+line){
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
        $("[data-ui-scrollspy]").each(function(){
            var $element=$(this);
            if (!$element.data("scrollspy")) {
                var obj = new ScrollSpy(this);
            }
        })
    })

})(jQuery); 

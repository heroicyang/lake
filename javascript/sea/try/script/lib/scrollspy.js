/*———————————————————————————————————————————————————————
@evaer evaer.lofter.com
滚动侦听插件
—————————————————————————————————————————————————————————*/
define(function(require,exports,module){
    var $=require('jquery');
    var $window=$(window);

    /*----滑动侦测定义----*/
    function ScrollSpy(ele,opts){
        this.se=$(ele);                                   //滑动元素
        this.con=this.se.is('body')? $(window):this.se;   //若传入的元素为body则滑动容器为window
        this.nav=$(this.se.attr('data-target'));          //导航容器

        this.refresh();
        this.spyevent();
        /*---事件注册---*/
        var spyevent= $.proxy(this.spyevent, this)
        this.con.on('scroll',spyevent);
    }
    ScrollSpy.prototype={

        constructor:ScrollSpy,

        /***根据nav导航 或滑动内容的dom变动 刷新元素长度 及元素top值数组***/
        refresh:function(){
            var as=this.nav.find("[href]");
            this.leng=as.length;    //滚动元素个数
            var top_arr=[];         //存储滚动元素的top值
            for(var i=0;i<this.leng;i++){
                var href=as.eq(i).attr('href');
                top_arr.push($(href).offset().top);
            }
            this.t_array=top_arr;
        },
        /***滚动侦听函数***/
        spyevent:function(){
            var self=this;
            var top=self.con.scrollTop()+20;
            var array=self.t_array;
            for(var i=0;i<self.leng;i++){
                if(
                    self.activenum != i
                    && top>=array[i]
                    && (!array[i+1] ||top<=array[i+1])
                ){
                    //console.log(i);
                    self.active(i);
                    return;
                }
            }
        },
        /***激活对应元素***/
        active:function(num){
            this.activenum=num;
            var as=this.nav.find("[href]");
            as.eq(num).addClass('active').siblings().removeClass('active');
        }
    }

    /***自动加载***/
    $("[data-spy='scroll']").each(function(){
        new ScrollSpy(this);
    })
})
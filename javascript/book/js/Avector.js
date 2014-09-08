(function($){

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    var Vector=function(element,options){
        this.element=$(element);
        this.head=$('.m-vector-icon',this.element);
        this.body=$('.m-vector-nav',this.element);
        this.options=$.extend({},Vector.defaultOptions,options);
        this.init();
  };
  Vector.prototype={

    //初始化函数
    init:function(){
        var that=this;

        this.head.on('click',function(e){
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

})(jQuery)

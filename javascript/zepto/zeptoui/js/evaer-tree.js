/*\
>Tree树形菜单插件
>evaer-tree
\*/
(function($) {
    /*\
    >Tree对象定义
    \*/
    var Tree = function(element, options) {
        this.element = $(element);
        this.options = options;
        this.vectors=$('i',this.element);
        this.init();
    }
    Tree.prototype = {
        constructor: Tree,
        /*\
        >*初始化函数 根据<i>是否有类名来设定状态
        >*并给元素<i>加载响应函数
        \*/
        init:function(){
            var that=this;
            this.vectors.each(function(){
                var $this=$(this);
                if($this.parent().hasClass('in')){
                    $this.data('tr',true);
                }else{
                    $this.data('tr',false);
                }
            });
            that.refresh();
            this.vectors.click(function(){
                var se=$(this);
                if(se.data('tr')){
                    se.data('tr',false)
                }else{
                    se.data('tr',true)
                }
                that.refresh();
            })
        },
        /*\
        >根据每个文件夹的状态值显示或隐藏文件夹
        \*/
        refresh:function(){
            this.vectors.each(function(){
                var that=$(this);
                var open=that.data('tr');
                if(open){
                    that.parent().removeClass('in');
                }else{
                    that.parent().addClass('in');
                }
            })
        },
        /*\
        >函数打开所有子菜单
        \*/
        open:function(){
            this.vectors.data('tr',true);
            this.refresh();
        },
        /*\
        >函数关闭所有子菜单
        \*/
        close:function(){
            this.vectors.data('tr',false);
            this.refresh();
        }
    }
    /*\
    >bridge链接jquery
    \*/
    $.fn.tree = function(options) {
        return this.each(function(){
            var $this = $(this);
            /*
            var data = $this.data('tree')
            if (!data) $this.data('tree', (data = new Tree(this, options)));
            if (typeof options == 'string') data[options]();
            */
            var data=$this.get(0)['tree'];
            if(!data) $this.get(0)['tree']=new Tree(this,options);
            if(typeof options == 'string') data[options]();
        })
    }
})(Zepto);
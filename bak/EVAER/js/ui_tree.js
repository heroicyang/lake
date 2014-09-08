(function($) {

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    /*\
    Tree对象定义
    \*/
    var Tree = function(element, options) {
        this.element = $(element);
        this.options = options;
        this.vectors=$('label',this.element);
        this.init();
    }
    Tree.prototype = {
        constructor: Tree,
        /*\
        初始化函数 根据<i>是否有类名来设定状态
        并给元素<i>加载响应函数
        \*/
        init:function(){
            var that=this;
            this.vectors.each(function(){
                var $this=$(this);
                if($this.parent().hasClass('in')){
                    $this.data('tr',false);
                }else{
                    $this.data('tr',true);
                }
            });
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
        根据每个文件夹的状态值显示或隐藏文件夹
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
        函数打开所有子菜单
        \*/
        open:function(){
            this.vectors.data('tr',true);
            this.refresh();
        },
        /*\
        函数关闭所有子菜单
        \*/
        close:function(){
            this.vectors.data('tr',false);
            this.refresh();
        }
    }

    $.UI['Tree']=Tree;

    //自动加载
    $(function(e) {
        $("[data-ui-tree]").each(function() {
            var $this = $(this);
            var data = $this.data('tree')
            if (!data) $this.data('tree', (data = new Tree(this)));
        });
    });
    
})(window.jQuery);
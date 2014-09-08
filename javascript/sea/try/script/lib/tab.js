/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 上午8:52
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $= require('jquery');

    function tab(ele){
        var se=$(ele);
        var content=se.children();
        var spans=content.eq(0).children(); //切换按钮组
        var cons=content.eq(1).children();  //切换内容

        console.log(cons);
        spans.eq(0).addClass('active').siblings().removeClass('active');
        cons.eq(0).show().siblings().hide();
        spans.click(function(){
                var btn= $(this),
                _index = btn.index();
                btn.addClass('active').siblings().removeClass('active');
                cons.eq(_index).show().siblings().hide();
            });
    }
    module.exports=tab;
});
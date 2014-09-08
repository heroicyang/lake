/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 上午8:52
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');

    function Fly(ele) {
        var con = $(ele); //容器
        var spans = $('span', con); //nav元素
        var i = $('<b></b>');       //创建游标元素

        var left=con.offset().left;
        var current = spans.filter('.current');
        var wid = current.outerWidth();
        con.css({
            position: 'relative'
        });
        i.css({
            position: 'absolute',
            height: '2px',
            background: '#ff7800',
            bottom: 0,
            width: wid,
            left: current.offset().left-left
        });
        i.appendTo(con);
        spans.hover(function() {
            i.stop(true);
            var se = $(this);
            var wid=se.outerWidth();
            var lef=se.offset().left-left;
            i.animate({left:lef,width:wid},'normal');
        },function(){
            var wid=current.outerWidth();
            var lef=current.offset().left-left;
            i.animate({left:lef,width:wid},'normal');
        })
    }

    module.exports=Fly;
});
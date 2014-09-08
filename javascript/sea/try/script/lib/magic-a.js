/**--------
幻灯片函数
淡隐淡现
 --------*/
define(function(require, exports, module) {
    var $ = require('jquery');

    function magic(ele) {
        var current = 0;
        var se=$(ele);
        var conts = se.children().eq(0).children();
        var length=conts.length;
        var lis = se.children().eq(1).children();
        var timer;

        lis.eq(0).addClass('active');
        conts.eq(0).addClass('active');
        /*---切换主函数---*/
        function change(num) {
            conts.eq(current).fadeOut('slow');
            conts.eq(num).fadeIn('slow', function() {
                changeli(num);
                current = num;
                circle(true);
            });
        }
        /*---小圆圈变换---*/
        function changeli(num) {
            lis.eq(num).addClass('active').siblings().removeClass('active');
        }
        /*---定时函数---*/
        function circle(bule) {
            clearTimeout(timer);
            if (bule) {
                var num;
                if (current >=length-1) num = 0;
                else num = current + 1;
                timer = setTimeout(function() {
                    change(num)
                }, 3200);
            }
        }
        /*---事件注册---*/
        lis.click(function() {
            var se = $(this);
            var num = se.index();
            if (num !== current) {
                circle(false);
                change(num);
            }
        });
        /*--自动定时启动--*/
        circle(true);
    }
    module.exports = magic;
});
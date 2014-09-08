/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-11-7
 * Time: 下午2:45
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    lb=$("#liebiao").offset();
    bd=$("#biaodan").offset();
    bg=$("#biaoge").offset();
    an=$("#anniu").offset();
    tb=$("#tubiao").offset();
$("[href='#liebiao']").click(function(){
    $('body').animate({scrollTop:lb.top-60},800);
    });
$("[href='#biaodan']").click(function(){
        $('body').animate({scrollTop:bd.top-60},800);
    });
$("[href='#biaoge']").click(function(){
        $('body').animate({scrollTop:bg.top-60},800);
    });
$("[href='#anniu']").click(function(){
        $('body').animate({scrollTop:an.top-60},800);
    });
$("[href='#tubiao']").click(function(){
        $('body').animate({scrollTop:tb.top-60},800);
    });
});

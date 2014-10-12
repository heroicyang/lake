/*
*main
*/
(function(){
    /*
    var href=location.href;
    var info=href.split('?info=')[1];

    info=decodeURI(info);
    info=JSON.parse(info);

    console.log(info);
    */
    var chart;
    var $container=$('#container');
    if(!window.Raphael){
        $container.css({'text-align':'center','padding-top':'40px','font-size':'26px','font-weight':'bold'});
        $container.text('系统浏览器不支持显示此图表');
        return;
    }
    window.renderChart=function(type,info){
        $container.empty();
        switch(type){
            case "a":
            chart=new app.Typea($container,info);
            break;
            case "b":
            chart=new app.Typeb($container,info);
            break;
            case "c":
            chart=new app.Typec($container,info);
            break;
            case "d":
            chart=new app.Typed($container,info);
            break;
        }
    };
})();


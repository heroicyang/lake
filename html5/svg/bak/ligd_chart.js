/**********
 * chart demo页
 **********/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;

    var Raphael=require('raphael'),
        util = require('util'),
        Line=require('uilibs/chart/linechart'),
        Bubble=require('uilibs/chart/bubblechart'),
        Funnel=require('uilibs/chart/funnelchart_a'),
        Funnelb=require('uilibs/chart/funnelchart_b'),
        Dialog = require("dialog");

    var AttachmentRename=require('modules/crm-attachment-rename/crm-attachment-rename');
    var Highsea=require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
    var Expiretime=require('modules/crm-highsea-expiretime/crm-highsea-expiretime');
    var Cusedit=require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit');

	var chart=require('modules/crm-chart/mainchart');
    
    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        
        $('.sub-tpl-switch-mask').hide();
        
        //初始化line图
        var line=new Line({
            "element":"#chart-task"
        });
        line.render({
            xAxis:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            yAxis:{
                max:800,
                linenum:5
            },
            title:"全年业绩都非常好",
            template:"<%=num%>月已完成￥<%=dataa%>,目标￥<%=datab%>",
            width:800,          //宽度(px)
            height:340,         //高度(px)
            topgutter:60,       //顶部边距(px)
            bottomgutter:60,    //底部边距(px)
            series:[
                {
                    name:'数据c',
                    type:'cube',
                    mark:'dataa',
                    data:[10,180,110,300,220,520,116,460,120,340,311,660],
                    color:'orange'
                },
                {
                    name:'数据d',
                    type:'dbcube',
                    mark:'datab',
                    data:[[10,10],[180,110],[130,110],[520,300],[460,220],[520,340],[280,116],[660,460],[240,120],[600,340],[540,311],[660,220]],
                    color:'#ccc',
                    lcolor:'orange'
                },
                {
                    name:'数据a',
                    type:'line',
                    mark:'datac',
                    data:[10,180,110,300,220,520,116,460,120,340,311,660],
                    color:'green'
                },
                {
                    name:'数据b',
                    type:'line',
                    mark:'datad',
                    data:[240,320,10,30,520,120,316,160,420,140,211,160],
                    color:'#00aeff'
                }
            ]
        })

        //初始化Bubble图
        var bubble=new Bubble({
            "element":"#chart-bubble",
        });
        bubble.render({
            width:800,          //宽度(em)
            height:340,         //高度(em)
            topgutter:60,       //顶部边距(em)
            bottomgutter:60,    //底部边距(em)
            rightgutter:20,     //右边距(em)
            tip:"名字是{{name}},单数是{{num}}",
            xAxis:{
                label:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                start:0,
                end:120  
            },
            yAxis:{
                max:100,
                linenum:2,
                label:function(value){
                    return value+'%';
                }
            },
            series:[
            	/*
                {   
                    type:'normal',
                    name:'bubblea',
                    data: [[97,36,18],[94,74,28],[68,76,18],[64,87,28],[68,27,18],[74,90,28],[7,93,18],[51,16,38],[38,12,48],[57,86,18]],
                    color:'#0ba6da'
                },
                {
                    type:'normal',
                    name:'bubbleb',
                    data:[[25,10,18],[2,75,18],[11,54,9],[86,55,7],[5,30,11],[90,63,22],[91,33,11],[97,30,13],[15,67,21],[54,25,18]],
                    color:'#5153aa'
                },
            	*/
                {
                    type:'num',
                    name:'bubblec',
                    data:[[15,47,8],[25,12,8],[35,76,8],[45,30,8],[55,98,8],[65,17,8],[75,60,8],[85,78,8],[95,12,8],[105,77,8]],
                    color:'#1ed2dc'
                },
                {
                    type:'num',
                    name:'bubbled',
                    data:[[5,47,8],[15,12,8],[25,176,8],[35,30,8],[45,98,8],[55,17,8],[65,60,8],[75,78,8],[85,12,8],[95,77,8]],
                    color:'orange'
                }
            ]
        })

        //初始化漏斗图
        var funnel=new Funnel({
            "element":"#chart-funnel"
        });
        funnel.render({
                width:450,                //宽度(em)
                height:460,               //高度(em)
                toppadding:0,            //顶部边距(em)
                bottompadding:0,         //底部边距(em)
                rightpadding:150,         //右部边距(em)
                title:"Sales funnel",
                series:{
                    name:'Unique users',
                    label:function(val){return '$'+val},
                    data:[
                        ['初期沟通(10%)',600,'#1ed2dc'],
                        ['立项跟踪(30%)',500,'#277ebf'],
                        ['呈报方案(50%)',400,'#a434a6'],
                        ['商务谈判(80%)',300,'#ee5582'],
                        ['已成交待追款(95%)',200,'#f3674c'],
                        ['赢单(100%)',100,'#ff963c']
                    ]
                }
        });
        
        //popup试验
        var poppaper=Raphael($('#chart-popup')[0],600,400);

        poppaper.circle(200,100,6);
        poppaper.circle(300,100,6);
        poppaper.circle(400,100,6);
        poppaper.circle(200,200,6);
        poppaper.circle(300,200,6);
        poppaper.circle(400,200,6);
        poppaper.circle(200,300,6);
        poppaper.circle(300,300,6);
        poppaper.circle(400,300,6);


    var popup=poppaper.popup(200,100,"hello world \n this is pandula world \n what a beautiful world","left-top","start");
        poppaper.popup(300,100,"hello world","middle-top");
        poppaper.popup(400,100,"hello world","right-top");
        poppaper.popup(200,200,"hello world","left-middle");
        poppaper.popup(300,200,"hello world","middle-middle");
        poppaper.popup(400,200,"hello world","right-middle");
        poppaper.popup(200,300,"hello world","left-bottom");
        poppaper.popup(300,300,"hello world","middle-bottom");
        poppaper.popup(400,300,"hello world","right-bottom");
        popup.ltranslate(400,0,"hello world \n this is pandula world \n what a beautiful world","right-bottom");


    var rename = new AttachmentRename({});
    var highsea=new Highsea();
    var expiretime=new Expiretime();
    var cusedit=new Cusedit();

    $('.highseasBtn').click(function(){
        //rename.show(100,'oldname');
        highsea.show(30);
    })
    $('.newhighsea').click(function(){
    	highsea.show();
    })
    $('.settime').click(function(){
        expiretime.show(1403070925000,30);
    })
    $('.customeredit').click(function(){
        cusedit.show({
            customerID:520,
            dialogType:1
        })
    })
    $('.customereditb').click(function(){
        cusedit.show({
            customerID:520
        })
    })
    $('.customereditc').click(function(){
        cusedit.show({
            customerID:520,
            dialogType:2
        })
    })

    highsea.on('addSuccess',function(data){
 
    });
    highsea.on('deleteSuccess',function(){
    });
    highsea.on('modifySuccess',function(data){
    });
   
    expiretime.on('submit',function(val){
    })
    };
});   

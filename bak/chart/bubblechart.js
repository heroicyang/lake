/*
chart-bubble
{
    width:800,          //宽度(em)
    height:340,         //高度(em)
    topgutter:60,       //顶部边距(em)
    bottomgutter:60,    //底部边距(em)
    rightgutter:20,     //右边距(em)
    tip:"{{num}}月已完成￥{{dataa}},目标￥{{datab}}",                   //
    xAxis:{
        label:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        max:120   
    },
    yAxis:{
        max:100,
        linenum:2,
        label:function(value){
            return value+'%';
        }
    },
    series:[
        {   
            type:'normal',
            name:'bubblea',
            data: [[97,136,8,{more:data}],[94,74,8,{more:data}],[68,76,8,{}],[64,87,8,{}],[68,27,8,{}],[74,90,8,{}],[7,93,8,{}],[51,116,8],[38,12,8],[57,86,8]],
            color:'#0ba6da'
        },
        {
            type:'normal',
            name:'bubbleb',
            data:[[25,10,8],[2,75,8],[11,154,8],[86,55,8],[5,30,8],[90,63,8],[91,33,8],[97,30,8],[15,167,8],[54,25,8]],
            tip:"",
            color:'#5153aa'
        },
        {
            type:'num',
            name:'bubblec',
            data:[[47,47,8],[20,12,8],[6,176,8],[38,30,8],[57,98,8],[61,117,8],[83,60,8],[67,78,8],[64,12,8],[30,77,8]],<%=num%>月已完成￥<%=dataa%>,目标￥<%=datab%>
            color:'#1ed2dc'
        },
        {
            type:'num',
            name:'bubbled',
            data:[[97,47,8],[120,12,8],[96,176,8],[98,30,8],[87,98,8],[116,17,8],[93,60,8],[103,78,8],[114,12,8],[90,77,8]],
            color:'orange'
        }
    ]
}
*/

define(function(require, exports, module) {
    
    var Raphael=require('raphael'),
        helper=require('./chart-helper.js');

    var Bubble=function(opts){
    	this._init_.apply(this,arguments);
    };
   	Bubble.prototype={
        /*============
         * 组件初始化
         ============*/
        _init_:function(opts){
        	opts=opts||{};
            this.opts=opts;
            this.element=$(opts.element);  //svg DOM元素
                                              
            if(opts.autoRender){
                this.render();
            }
        },

        /*============
         * 渲染chart
         * 主要绘制坐标轴 标识 标题 自动触发更新数据
         * @param info 绘制图表所需的所有信息 若不传入则取配置信息中的info
         ============*/
        render:function(info){
            var $element=this.element;

            var info=this.info=info || this.opts.info;
            var paper=this.paper=Raphael(this.element[0],this.info.width,this.info.height);     //画布  
            var svgelement=this.svgelement={};                                                	//存储相关svg元素

            //获取数据中的最大值 若传入0则赋值100
            //同时max还要兼顾除以linenum出现小数的情况,为了不出现小数 重新根据linenum计算max
            var max=info.yAxis.max || 100;
                max=Math.ceil(max/info.yAxis.linenum)*info.yAxis.linenum;
            info.yAxis.max=max;

            //设置默认字体大小
            var fontsize=info.fontsize=13;

            //获取纵坐标标度中最大值 占据的宽度 加上10px的padding
            var leftgutter=info.leftgutter=(function(){
                var text=paper.transNumber(max || 100);
                text=info.yAxis.label? info.yAxis.label(text):text;

                var svgtext=paper.text(-10000,-10000,text).attr('font-size',fontsize).hide();
                var width=svgtext.getBBox().width;
                svgtext.remove();
                return width+10;              
              	})()

            //根据info信息 算出行高 列宽等 并存入info
            var X = info.X  =(info.width-leftgutter-info.rightgutter) / (info.xAxis.label.length),        //获取列宽 (em)
                mx= info.mx =(info.width-leftgutter-info.rightgutter) / (info.xAxis.end-info.xAxis.start),                 //横坐标单位转换

                my= info.my =(info.height-info.topgutter-info.bottomgutter) / max,                        //纵坐标单位转换
                ly= info.ly =max/info.yAxis.linenum,                                           //确定行高
                Y = info.Y  =my*ly;                                                                       //根据行数确定行高(em)
            if(info.tip){info.tip=_.template(info.tip)};                                                  //

            //图表坐标轴中间线的x坐标 有的时候会用到
            var xline=info.xline=leftgutter+(info.width-leftgutter-info.rightgutter)/2;
            var yline=info.yline=info.topgutter+(info.height-info.topgutter-info.bottomgutter)/2;

            /*\
            [[绘制坐标轴]]
            原点x 为 左边距 + 0.5
            原点y 为 画布高度-底部边距 - 0.5
            宽度为 画布宽度 - 左边距 - 一列宽
            高度为 画布高度 - 顶部边距 - 底部边距
            \*/
            var coord=paper.drawCoord(info.leftgutter - 1,info.height -info.bottomgutter - .5,
                                      info.width -info.leftgutter-info.rightgutter,info.height - info.topgutter - info.bottomgutter, 
                                      info.xAxis.label.length,info.yAxis.linenum);

            //绘制横坐标上的标识
            for(var i=0;i<info.xAxis.label.length;i++){
                paper.text(info.leftgutter+X*(i+.5),info.height-info.bottomgutter+14,info.xAxis.label[i]).attr({'fill':'#444','font-size':info.fontsize});
            }

            //绘制纵坐标上的标识
            for(var j=0;j<info.yAxis.linenum+1;j++){
            	var ytext=paper.transNumber(Math.round(info.ly*j));          //如果数字位数过多每3位加一个逗号
            	ytext=info.yAxis.label? info.yAxis.label(ytext):ytext;       //如果y轴有单位(摄氏度 kg) 则转换之
                paper.text(info.leftgutter-9,info.height-info.bottomgutter-info.Y*j,ytext).attr({'text-anchor':'end','fill':'#444','font-size':info.fontsize});
            }

            this.update(info.series);

        },
        /*=========
         *更新数据
         ========*/
        update:function(series){
            var that=this;
            var paper=this.paper;
            var svgelement=this.svgelement;

            svgelement.eveEle=paper.set();

            for(var i=0;i<series.length;i++){
            	if(!series[i]) continue;
                var data,information,             
                    seriesName={name:series[i]['name']};  

                switch(series[i].type){

                    case 'normal':
                        data=series[i].data;

                        for(var j=0;j<data.length;j++){
                            information=_.extend({},data[j][3],seriesName);
                            //绘制气泡 x y color size false information
                            svgelement.eveEle.push(that._drawbubble(data[j][0],data[j][1],series[i].color,data[j][2],false,information));
                        }

                        break;
                    case 'num':
                        data=series[i].data;

                        for(var j=0;j<data.length;j++){
                            information=_.extend({},data[j][3],seriesName);
                            //绘制气泡 x y color size 6 information
                            svgelement.eveEle.push(that._drawbubble(data[j][0],data[j][1],series[i].color,false,data[j][2],information));
                        }

                        break;

                }

            }

            //加载事件处理函数
            that._addEvent();

        },
        /*=====================================
        *绘制气泡
        *x y 参数的单位 以坐标轴上的坐标数据为准
        *======================================*/
        _drawbubble:function(x,y,color,size,num,information){

            color= color || "#ff9600";     //默认颜色
            size=size || 10;               //默认大小

            var that=this;
            var paper=this.paper,
                info=this.info;
                
            if(x<info.xAxis.start || x>info.xAxis.end){
                return;
            }

            var cx=info.leftgutter+(x-info.xAxis.start)*info.mx,                  //转换为画布坐标
            	cy=info.height-info.bottomgutter-y*info.my;    //转换为画布坐标

            var bubble=paper.circle(cx,cy,size).attr({'fill':color,'stroke':'none'});

            var eventBubble=bubble;

            //如果num参数含有数字则填充数字
            if(num!==false){
                paper.text(cx,cy,num).attr({'fill':'#fff'});
                var bubbleMask=paper.circle(cx,cy,size).attr({'fill':'#fff','stroke':'none','opacity':0});
                bubbleMask.toFront();
                eventBubble=bubbleMask;
                information.num=num;
                eventBubble.data('info',info.tip(information));
            }else{
                information.num=0
                eventBubble.data('info',info.tip(information));
            }
            return eventBubble;
        },
        /*========
        气泡注册事件
        ==========*/
        _addEvent:function(){
            var that=this;
            var paper=that.paper;
            var eveEle=that.svgelement.eveEle;
            var info=this.info;

            //提示信息tip起始隐藏
            that.svgelement.tip=paper.popup(100,200,"hello i am popup\n this is secondline\n this is thirdline","left-top","start").hide();

            eveEle.forEach(function(element){
                element.hover(function(){
                    clearTimeout(that.svgelement.tip.timeVector);
                    var x=this.attr('cx');
                    var y=this.attr('cy');

                    var vector=['left','top'];
                    if(x<info.xline){vector[0]="right"}
                    else if(x==info.xline){vector[0]='middle'};

                    if(y<info.yline){vector[1]='bottom'}
                    else if(y==info.xline){vector[1]=='middle'};

                    vector=vector.join('-');
                    that.svgelement.tip.show().ltranslate(x,y,element.data('info'),vector);
                },function(){
                    that.svgelement.tip.timeVector=setTimeout(function(){that.svgelement.tip.hide();},200);
                })
            })
        },
        /*=======
         * 销毁
         *======*/
        destory:function(){
            if(this.paper){
                this.paper.remove();
            }
        }
    };

    return Bubble;
});


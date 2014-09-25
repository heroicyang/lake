/**
* chart-line
*       
opts.info={
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
    legend:false,       //默认显示图例 除非设为false
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
};
*/
var Line=function(){
    this._init_.apply(this,arguments);
};
Line.prototype={
    /**
     * 组件初始化
     **/
    _init_:function(opts){
        opts=opts||{};
        this.opts=opts;
        this.element=$(opts.element);  //svg DOM元素
        
        if(opts.autoRender){
            this.render();
        }
    },

    /*===============================================================
     * 渲染chart
     * 主要绘制坐标轴 标识 标题 自动触发更新数据
     * @param info 绘制图表所需的所有信息 若不传入则取配置信息中的info
     ================================================================*/
    render:function(info){

        var $element=this.element; 
        this.info=info || this.opts.info;
        this.paper=Raphael(this.element[0],info.width,info.height);    //画布  
        this.svgelement={};                     //存储相关svg元素
        this.svgelement.AXIS=this.paper.set();  //存储坐标轴相关元素
        this.svgelement.MAP=this.paper.set();   //存储图形元素


        var paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;

        //默认字体大小
        var fontsize=info.fontsize=13;

        //获取数据中的最大值 若传入0则赋值100
        //同时max还要兼顾除以linenum出现小数的情况,为了不出现小数 重新根据linenum计算max
        var max=info.yAxis.max || 100;
        max=Math.ceil(max/info.yAxis.linenum)*info.yAxis.linenum;
        
        //获取纵坐标标度中最大值 占据的宽度 加上10px的padding
        var leftgutter=info.leftgutter=(function(){
            var text=paper.transNumber(max || 100),
                svgtext=paper.text(-10000,-10000,text).attr('font-size',fontsize).hide();
            var width=svgtext.getBBox().width;
            svgtext.remove();
            return width+10;              
            })()

        //根据info信息 算出行高 列宽等 并存入info
        var X=info.X=(info.width-leftgutter) / (info.xAxis.length),               //获取列宽 (px)
            my=info.my=(info.height-info.topgutter-info.bottomgutter) / max,      //算出像素和数值间的转换数
            ly=info.ly=max/info.yAxis.linenum,                                    //
            Y=info.Y=my*ly;                                                       //根据行数确定行高(px)
           
        info.max=max;
        info.template=_.template(info.template);

        /*\
        [[绘制坐标轴]]
        原点x 为 左边距 + 0.5
        原点y 为 画布高度-底部边距 - 0.5
        宽度为 画布宽度 - 左边距 - 右边距
        高度为 画布高度 - 顶部边距 - 底部边距
        \*/
        var coord=paper.drawCoord(info.leftgutter-1,info.height -info.bottomgutter - .5,
                                  info.width -info.leftgutter,info.height - info.topgutter - info.bottomgutter, 
                                  info.xAxis.length,info.yAxis.linenum);
        svgelement.AXIS.push(coord);
        //绘制标题 居中于画布
        svgelement.AXIS.title=paper.text(info.width/2,info.topgutter/2,info.title).attr({'text-anchor':'middle','font-size':fontsize});

        //绘制横坐标上的标识
        for(var i=0;i<info.xAxis.length;i++){
            svgelement.AXIS.push(paper.text(info.leftgutter+X*(i+.5),info.height-info.bottomgutter+14,info.xAxis[i]).attr({'fill':'#444','font-size':info.fontsize}));
        }
        //绘制纵坐标上的标识
        for(var j=0;j<info.yAxis.linenum+1;j++){
            var ytext=paper.transNumber(info.ly*j);          //如果数字位数过多每3位加一个逗号
            svgelement.AXIS.push(paper.text(info.leftgutter-9,info.height-info.bottomgutter-info.Y*j,ytext).attr({'text-anchor':'end','fill':'#444','font-size':info.fontsize}));
        }
        this.update(info.series);
    },

    /*===============================
     * 更新图表数据
     * @param series 图表系列数据数据
     ===============================*/
    update:function(series){

        var paper=this.paper,
            info=this.info;

        for(var i=0;i<series.length;i++){
            switch (series[i].type){
                case 'line':
                    this._drawLine(series[i].data,series[i].color);
                    break;
                case 'cube':
                    this._drawRect(series[i].data,series[i].color,series[i].width);
                    break;
                case 'dbcube':
                    this._drawMrect(series[i].data,series[i].color,series[i].lcolor);
                    break;
            }
        }
        this._drawAlpha();

        //如果legend没有定义或legend指定为true 则渲染legend
        if(info.legend==true || typeof info.legend == 'undefined'){this._drawLegend();}
        this._addEvent();
    },

    /*==========================
     * 绘制折线图
     * @param data 纵坐标数据
     ===========================*/
    _drawLine:function(data,color){
        color= color || "#00bde5";

        var paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;

        var path=[],            //存储折线坐标数据
            dot=paper.set();    //存储折线点数据

        for(var i=0;i<info.xAxis.length;i++){
            var y=Math.round(info.height-info.bottomgutter-info.my*data[i]),
                x=Math.round(info.leftgutter+info.X*(i+.5));
            path.push([x,y]);
            dot.push(paper.circle(x,y,3).attr({fill:"#eee",stroke:color,'stroke-width':2}));
        }

        paper.line(path).attr({stroke:color,'stroke-width':2}).toFront();
        dot.toFront();
    },
    /*=====================
     *绘制柱状图
     *@param data 纵坐标数据
     ======================*/
    _drawRect:function(data,color,width){

        var paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;

        color= color || "#ff9600";
        width= width || info.X/2;   //width的默认值是列宽的二分之一

        var rect=paper.set(); //存储柱状图
        //绘制柱状图 如果高度为0 不绘制
        for(var i=0;i<info.xAxis.length;i++){
            if(data[i]!==0){
                var x=info.leftgutter + info.X*i + (info.X-width)/2;
                var y=Math.round(info.height-info.bottomgutter-info.my*data[i]);
                var height=data[i]*info.my;

                rect.push(paper.rect(x,y,width,height).attr({stroke:"none",fill:color}));
            }
        };
        rect.toFront();
    },
    /*===================================
     *绘制双层柱状图
     *[[10,30],[20,60],[70,120],[83,140]]
     ===================================*/
    _drawMrect:function(data,color,lcolor){
        color=color || "#ccc";
        lcolor=lcolor || "#ff9600";

        var paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;

        var cubesa=paper.set(),    //存储A型柱状图
            cubesb=paper.set();    //存储B型柱状图
        for(var i=0;i<info.xAxis.length;i++){
            var ya=Math.round(info.height-info.bottomgutter-info.my*data[i][0]);
                yb=Math.round(info.height-info.bottomgutter-info.my*data[i][1]);

                var cubea=paper.rect(info.leftgutter+info.X*(i+0.25),ya,info.X/2,data[i][0]*info.my)
                               .attr({stroke:'none',fill:color});
                var cubeb=paper.rect(info.leftgutter+info.X*(i+0.25),yb,info.X/2,data[i][1]*info.my)
                               .attr({stroke:'none',fill:lcolor});
            cubesa.push(cubea);
            cubesb.push(cubeb);
        }
        cubesa.toFront();
        cubesb.toFront(); 
    },
    /*================
     *绘制辅助隐藏图形
     =================*/
    _drawAlpha:function(){
        var that=this,
            paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;

            svgelement.eveEle=paper.set();    //辅助方块图 捕捉每一列的滑过事件
            svgelement.eveLine=paper.set();   //辅助竖线图
            var blanket=paper.set(),    //辅助方块图
                line=paper.set();       //辅助竖线图

            var text=this.svgelement.AXIS.title;
            for(var i=0;i<info.xAxis.length;i++){

                var x=Math.round(info.leftgutter+info.X*(i+.5));

                svgelement.eveLine.push(paper.line([[Math.round(x),info.height-info.bottomgutter],[Math.round(x),info.topgutter]]).attr({'stroke-width':1,'stroke':'#888'}).hide());
                svgelement.eveEle.push(paper.rect(info.leftgutter + info.X * i,info.topgutter,info.X,info.height-info.bottomgutter-info.topgutter)
                                  .attr({stroke:"none",fill:"green",opacity:0}));

                var rect=svgelement.eveEle[svgelement.eveEle.length-1];

                rect.data('info',info.template(that._getTittle(i) ) );
            }
            blanket.toFront();
    },
    /*====================
    *绘制图例并居中偏下显示
    ======================*/
    _drawLegend:function(){
        var paper=this.paper,
            svgelement=this.svgelement,
            info=this.info;
        var series=info.series;
        var x=0,
            y=info.height-info.bottomgutter*(1/3);

        var legendset=paper.set();

        var svgtemp,
            texttemp,
            widthtemp;

        for(var i=0;i<series.length;i++){
            switch (series[i].type){
                case 'line':
                    svgtemp=paper.path(['m',x,y,'l',10,0]).attr({stroke:series[i].color,'stroke-width':2});

                    texttemp=paper.text(x,y,series[i].name).attr({'font-size':info.fontsize});
                    widthtemp=texttemp.getBBox().width;
                    texttemp.attr({x:x+widthtemp/2+14,y:y,fill:'#666'});

                    x=x+widthtemp+32;
                    break;
                case 'cube':
                    svgtemp=paper.rect(x,y-5,10,10).attr({fill:series[i].color,stroke:'none'});
                    texttemp=paper.text(x,y,series[i].name).attr({'font-size':info.fontsize});
                    widthtemp=texttemp.getBBox().width;
                    texttemp.attr({x:x+widthtemp/2+14,y:y,fill:'#666'});
                    x=x+widthtemp+32;
                    break;
                case 'dbcube':
                    /*MARK这个应该怎么表示呢*/        
                    break;
            }
            legendset.push(svgtemp).push(texttemp);
        }

        var transwidth=(info.width-info.leftgutter-legendset.getBBox().width)/2;
        legendset.transform("t"+(info.leftgutter+transwidth)+",0");
    },
    /*========
    *注册事件
    ==========*/
    _addEvent:function(){
        var info=this.info;
        var eveEle=this.svgelement.eveEle;
        var eveLine=this.svgelement.eveLine;
        var text=this.svgelement.AXIS.title;
        
        eveEle.forEach(function(element,index){
            element.hover(function(){
                text.attr('text',this.data('info'));
                eveLine[index].show();
            },function(){
                text.attr('text',info.title);
                eveLine[index].hide();
            })
        })
    },
    /*====
    *临时注册事件
    =====*/
    __addEvent:function(){
        var info=this.info;
        var eveEle=this.svgelement.eveEle;
        var text=this.svgelement.AXIS.title;

        eveEle.forEach()
    },
    /*===============
    *根据 获取提示信息
    =================*/
    _getTittle:function(num){
        var info=this.info,
            series=info.series;

        var tittle={};
        tittle['num']=num+1;
        for(var i=0;i<series.length;i++){
           tittle[series[i].mark]=series[i].data[num]
        }
        return tittle;
    },
    /*======
     * 销毁
     =======*/
    destory:function(){
        if(this.paper){
            this.paper.remove();
        }
    }

}

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

/**
 * chart-line
 * opts.info={
        width:600,                //宽度(em)
        toppadding:60,            //顶部边距(em)
        bottompadding:60,         //底部边距(em)
        rightpadding:200,         //右部边距(em)
        title:"Sales funnel",
        series:{
            name:'Unique users',
            angle:,                                 //角度值 默认为60度 单位度
            label:function(value){
                return '￥'+value;
            },
            data:[
                ['初期沟通(10%)',600,'#1ed2dc'],
                ['立项跟踪(30%)',332,'#277ebf'],
                ['呈报方案(50%)',250,'#a434a6'],
                ['商务谈判(80%)',150,'#ee5582'],
                ['已成交待追款(95%)',80,'#f3674c'],
                ['赢单(100%)',40,'#ff963c']
            ]
        }
    }
 */
//漏斗图像定义
var Funnel=function(){                                                 
    this._init_.apply(this,arguments);
};
Funnel.prototype={
    _init_:function(opts){
        this.opts=opts;
        this.element=$(opts.element);                                      //svg DOM元素   
        
        if(this.opts.autoRender){
            this.render();
        }
        
    },
     /*=====================================================================
     * 渲染chart
     * 主要绘制坐标轴 标识 标题 自动触发更新数据
     * 默认梯形的转折处角度为60度 像一个正三角形哈哈
     * @param info 绘制图表所需的所有信息 若不传入则取配置信息中的info
     ======================================================================*/
    render:function(info){   
        var $element=this.element;
        this.svgelement={};                                         //存储相关svg元素

        var info=this.info=info || this.opts.info;                  //绘制漏斗所需信息

        //默认字体大小
        var fontsize=info.fontsize=13;

        //转换series 防止series内出现值为0的情况 
        //不改变原series 返回新的series 所以 调用原来的data数据 用 info.series.data
        var series=this._trans(this.info.series),                         
            data=series.data,   //漏斗数据
            angle=series.angle; //漏斗转折角度

        var funnelWidth=info.width-info.rightpadding,         //三角形宽度(px)
            funnelHeight=funnelWidth*Math.tan(angle)/2;       //三角形高度(px)

        //参数中有可能会传入height 如果height低于需要的高度舍弃不管  如果height高于原高度 则让漏斗居中
        if(info.height){
            var tempPheight=info.toppadding+info.bottompadding+funnelHeight;
            
            if(info.height<tempPheight){
                info.height=tempPheight;
            }else{
                info.toppadding=info.toppadding+(info.height-tempPheight)/2;
            }

        }else{
            info.height=info.toppadding+info.bottompadding+funnelHeight;
        }

        var x=0,                  //起始x坐标
            y=info.toppadding;    //起始y坐标
        
        var paper=this.paper=Raphael($element[0],info.width,info.height)

        var ele;
        var tempWidth=funnelWidth;      //宽度暂存 暂存每个梯形的底部宽度
        for(var i=0;i<data.length;i++){

            //绘制梯形
            if(i!==data.length-1){
                var transy=(data[i][1]/series.total)*funnelHeight,
                    transx=transy/Math.tan(angle);

                ele=paper.path(['M',x,y,'L',x+tempWidth,y,'L',x+tempWidth-transx,y+transy,'L',x+transx,y+transy,'L',x,y])
                         .attr({'stroke':'#fff','fill':data[i][2]});

                //绘制图例 图例左边字符和漏斗最右侧对齐 图例右边字符和画布最右边对齐
                (function(){
                    var sx=Math.round(x+tempWidth-(transx/2))+4.5,
                        sy=Math.round(y+(transy/2))+0.5,
                        tx=funnelWidth*1.06,
                        ty=sy;
                    //每一个阶段的图示
                    var mark=paper.transNum(info.series.data[i][1],2);
                        mark=info.series.label? info.series.label(mark):mark;

                    paper.path(['M',sx,sy,'L',tx,ty]).attr({'stroke':'#888'});
                    paper.text(tx+4,ty,info.series.data[i][0]).attr({'text-anchor':'start','fill':'#888','font-size':info.fontsize});
                    paper.text(info.width-4,ty,mark).attr({'text-anchor':'end','fill':'#222','font-size':info.fontsize});
                })();

                //计算出下一个梯形的 x y 宽度坐标
                x=x+transx;
                y=y+transy;
                tempWidth=tempWidth-2*transx;

            }
            //绘制正方形
            else{
                var transy=(data[i][1]/series.total)*funnelHeight,
                ele=paper.path(['M',x,y,'L',x+tempWidth,y,'L',x+tempWidth,y+transy,'L',x,y+transy,'L',x,y])
                         .attr({'stroke':'#fff','fill':data[i][2]});

                //绘制图例
                (function(){
                    var sx=Math.round(x+tempWidth)+4.5,
                        sy=Math.round(y+transy/2)+0.5,
                        tx=funnelWidth*1.06,
                        ty=sy;
                    //每一个阶段的图示
                    var mark=paper.transNum(info.series.data[i][1],2);
                        mark=info.series.label? info.series.label(mark):mark;

                    paper.path(['M',sx,sy,'L',tx,ty]).attr({'stroke':'#888'});
                    paper.text(tx+4,ty,info.series.data[i][0]).attr({'text-anchor':'start','fill':'#888','font-size':info.fontsize});
                    paper.text(info.width,ty,mark).attr({'text-anchor':'end','fill':'#222','font-size':info.fontsize});
                })();
            }

        }
    },

    /*====================================================================
     *数据不满5%的 增加为5% 然后重新计算总值
     *这样计算有一个缺陷 会改变原来的角度 其实 只要想出一个算法 算出percent 确定最低高度是某值就可 想想这个算法
     =====================================================================*/
    _trans:function(series){

        var series=JSON.parse(JSON.stringify(series)),
            percent=0.1;      //最低百分比 默认为5%

        if(series.data.length==0){
            throw new Error('漏斗数据为空');
            return;
        };

        var total=0;   //存储数据总值

        //计算出数据总值
        for(var i=0;i<series.data.length;i++){
            total=total+series.data[i][1];
        }

        //若数据全为空 则total赋值为100 最低基准值调为平均值
        if(total==0){
            total=100;
            percent=1/series.data.length;
        }

        var basicValue=total*percent,   //设定基值
            newtotal=0;                 //重新计算总值 先初始化为0

        for(var i=0;i<series.data.length;i++){
            if(series.data[i][1]<basicValue){series.data[i][1]=basicValue};    
            newtotal=newtotal+series.data[i][1];
        };

        series.total=newtotal;

        //数字补足后 百分比均有缩小 为达到原高度5%的高度值 增长原来三角形的高度
        series.angle=Math.atan(percent / (basicValue / newtotal) * Math.sqrt(3)); 
        return series;
    },

    /*========
     * 销毁
     *========*/
    destory:function(){
        if(this.paper){
            this.paper.remove();
        }
    }
};



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

define(function(require, exports, module) {
    
    var Raphael=require('raphael'),
        helper=require('./chart-helper.js');

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
    return Line;
});

/**
*app为全局对象
*/
window.app={};

(function(Raphael,O,app){
    var $window=$(window);
    
    /**
    *漏斗图形
    * chart-funnel
    {
        element:selector || dom,      //绘制的外层元素
        info:{
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
    }
    */
    var Funnel=O.Class.extend({
        _init_:function(opts){
            this.opts=opts;     
            this.element=$(opts.element); //svg 外层DOM元素
            this.render(opts.info);

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
            var fontsize=info.fontsize=14;

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
                            tx=funnelWidth,
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
                            tx=funnelWidth,
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
         *每一格数据不满总数据10%的 增加为10% 然后重新计算总值 改变角度
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
            series.angle=Math.atan(newtotal/total * Math.sqrt(3)); 
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
    });
    
    /**
    *折线图形
    *chart-line
    {
        'element':'#chart-line',
        'info':{
            xAxis:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            yAxis:{
                max:800,
                linenum:5
            },
            title:"全年业绩都非常好",
            template:"<%=num%>月已完成￥<%=dataa%>,目标￥<%=datab%>",
            width:800,          //宽度(px)
            height:440,         //高度(px)
            topgutter:60,       //顶部边距(px)
            bottomgutter:60,    //底部边距(px)
            legend:true,       //默认显示图例 除非设为false
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
        }
    }
    */
    var Line=O.Class.extend({
        /**
         * 组件初始化
         **/
        _init_:function(opts){
            opts=opts||{};
            this.opts=opts;
            this.element=$(opts.element);  //svg DOM元素

            this.render(opts.info);
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
            var fontsize=info.fontsize=14;

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
                dot=paper.set(),    //存储折线点数据
                area=[
                    [info.leftgutter+info.X*(0.5),info.height-info.bottomgutter], //存储区域数据的左下点坐标
                ];          

            for(var i=0;i<info.xAxis.length;i++){
                var y=Math.round(info.height-info.bottomgutter-info.my*data[i]),
                    x=Math.round(info.leftgutter+info.X*(i+.5));
                path.push([x,y]);
                dot.push(paper.circle(x,y,4).attr({fill:"#fefefe",stroke:color,'stroke-width':3}));
                area.push([x,y]);
            }
            //最后area要连接右下角
            //area.push([info.leftgutter+info.X*(info.xAxis.length-.5),info.height-info.bottomgutter]);

            //paper.wave(area).attr({fill:color,'fill-opacity':0.4,'stroke':'none'}).toFront;
            paper.line(path).attr({stroke:color,'stroke-width':4}).toFront();

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
    });

    /**
    *Chart 基类
    */
    var Chart=O.Class.extend({
        //根据arr数据 返回相应的month
        transMonth:function(arr){
            var month=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
            var start=arr[0]['monthNo']-1,
                length=arr.length,
                end=start+length;
            return month.slice(start,end);
        },
        getXaxis:function(timerange){
            var month=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                start=0,
                end=120;
            switch(timerange){
                case 1:
                    break;
                case 2:
                    month=month.slice(0,6);  end=60;
                    break;
                case 3:
                    month=month.slice(6,12); start=60;
                    break;
                case 4:
                    month=month.slice(0,3); end=30;
                    break;
                case 5:
                    month=month.slice(3,6); start=30; end=60;
                    break;
                case 6:
                    month=month.slice(6,9); start=60; end=90;
                    break;
                case 7:
                    month=month.slice(9,12); start=90; end=120;
                    break; 
            }
            return {'label':month,'start':start,'end':end}
        },
        //在arr数据中找到最大值
        maxY:function(arr){
            var maxa=_.max(arr,function(sale){return sale['salesTargetAmount']});
            var maxb=_.max(arr,function(sale){return sale['winAmount']});
            return _.max([maxa['salesTargetAmount'],maxb['winAmount']]);
        },
        //转换最大值
        transMax:function(num){
            //大于1000的进行百位数上舍入
            if(num>1000){
                num=Math.ceil(num*1.1/100)*100;
            //大于100的 进行十位数上舍入
            }else if(num>100){
                num=Math.ceil(num*1.1/10)*10;
            //小于100的 进行个位数上舍入
            }else{
                num=Math.ceil(num*1.1);
            }
            return num;
        },
        //公共destory函数
        destory:function(){
            this.chart.destory();
            this.element.empty();
        },
        //不同阶段的展示数据
        colorlist:["#1ED2DC","#0BA6DA","#277EBF","#5153AA","#A434A6","#DC50AA","#EE5582","#F03C3C","#F3674C","#FF963C"],
        //
        getColor:function(num,total){
            var colorlist=this.colorlist,
                length=colorlist.length;

            var color="#ffffff"; //默认颜色

            switch(num){
                case 0:
                    color=colorlist[0];
                break;
                case total-1:
                    color=colorlist[length-1];
                break;
                default:
                    var jump=Math.floor(length/(total-1));
                    var index=num*jump;
                    if(index>length-1){index=length-1}
                    color=colorlist[index];
            }

            return color;
        }
    });

    /**
    *图表类型A,显示任务完成情况
    **/
    var Typea=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var xAxis=this.transMonth(data);
            var max=this.transMax(this.maxY(data));

            var salesSeria=[],   //存储目标数据
                winSeria=[],     //存储已完成已达标数据
                winSeriat=[];    //存储已完成未达标数据

            var salesYear=0,     //存储全年目标
                winYear=0;       //存储全年已完成

            _.each(data,function(element){
                var data0=element['salesTargetAmount'],
                    datatemp=element['winAmount'],
                    dataa,
                    datab;

                salesYear=salesYear+data0; winYear=winYear+datatemp;

                //大于等于目标值时为达标
                if(datatemp>=data0){
                    dataa=datatemp;datab=0;
                }else{
                    dataa=0;datab=datatemp;
                }

                salesSeria.push(data0);
                winSeria.push(dataa);
                winSeriat.push(datab);
            })

            var percent;
            percent=salesYear ? Math.round(winYear/salesYear*100) : 0;  
            salesYear=Raphael.fn.transNumber(salesYear); winYear=Raphael.fn.transNumber(winYear);
          
            var info={
                'xAxis':xAxis,
                'yAxis':{
                    'max':max,
                    'linenum':4
                },
                title:"全年已完成￥"+ winYear +"("+percent+"%)"+"，目标￥"+salesYear,
                template:"<%=num%>月已完成￥<%=Raphael.fn.transNumber(dataa||datac)%> (<%= datab ? Math.round((dataa||datac)/datab*100):0 %>%) ,  目标￥<%=Raphael.fn.transNumber(datab) %>",
                width:680,          //默认宽度 (px)
                height:520,         //默认高度 (px)
                topgutter:60,       //顶部边距 (px)
                bottomgutter:100,    //底部边距 (px)
                series:[
                    {
                        'name':'已完成已达标',
                        'mark':'dataa',
                        'type':'cube',
                        'data':winSeria,
                        'color':'#77cc77',
                        'width':28
                    },
                    {
                        'name':'已完成未达标',
                        'mark':'datac',
                        'type':'cube',
                        'data':winSeriat,
                        'color':'red',
                        'width':28
                    },
                    {
                        'name':'目标',
                        'mark':'datab',
                        'type':'line',
                        'data':salesSeria,
                        'color':'#1b9dde'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var data=param;

            var info=that.trans(data.salesTargetChartItems);
    
            //根据当前容器元素宽度设定宽度
            info.width=that.element.width();
            info.height=$window.height();

            that.chart=new Line({'element':that.element,'info':info});     
        }

    });

    /**
    *图表类型B,销售漏斗
    **/
    var Typeb=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.attr={
                template:'<div class="crm-chart-b-text"><div class="crm-chart-b-text-first"><p> <b>最大成交金额</b><span>￥ <%=max%></span> </p></div> <div><p><b>预测总金额</b><span>￥ <%=forecast%></span></p></div><div><p><b>目标金额</b><span>￥ <%=goal%></span></p></div></div>'
            };
            this.template=_.template(this.attr.template);
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var self=this;
            var list=[];
        
            var nametemp,numtemp,colortemp;

            var max=0;
            for(var i=0;i<data.length;i++){
                //如果数据的名字过长 手动截取 增加...符号
                if(data[i]['name'].length>9){
                    data[i]['name']=data[i]['name'].slice(0,8)+'...';
                }
                nametemp=data[i]['name']+'('+data[i]['winRate']+'%)';
                numtemp=data[i]['amount'];
                colortemp=self.getColor(i,data.length);
                max +=numtemp;

                list.push([nametemp,numtemp,colortemp]);
            };

            var info={
                width:450,                //宽度(em)
                height:267,               //
                toppadding:40,            //顶部边距(em)
                bottompadding:0,          //底部边距(em)
                rightpadding:300,         //右部边距(em)
                title:"Sales funnel",
                series:{
                    name:'Unique users',
                    label:function(val){return '￥'+val},
                    data:list
                },
                max:max
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var data=param;

            var info=that.trans(data.pipelineColumns);
            //根据当前容器元素宽度设定宽度
            info.width=that.element.width();
            info.rightpadding=info.width*0.58;

            that.chart=new Funnel({'element':that.element,'info':info});

            var text={
                goal:that.chart.paper.transNum(data.salesTargetAmount,2),
                max:that.chart.paper.transNum(info.max,2),
                forecast:that.chart.paper.transNum(data.salesForecastAmount,2)
            };
            that.element.append(that.template(text));
        }
    });

    /**
    *图表类型C,合同回款金额
    */
    var Typec=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var seria=[];
            var max=0;
            var total=0;
            _.each(data,function(val){
                var data=Math.round(val.value1);
                seria.push(data);
                total +=data;
                if(data>max){max=data};
            });
            max=this.transMax(max);
            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年已回款￥"+Raphael.fn.transNumber(total),
                template:"<%=num%>月已回款￥ <%=Raphael.fn.transNumber(payment)%>",
                width:680,          //默认宽度 (px)
                height:520,         //默认高度 (px)
                topgutter:60,       //顶部边距 (px)
                bottomgutter:100,    //底部边距 (px)
                series:[
                    {
                        'name':'回款金额',
                        'mark':'payment',
                        'type':'cube',
                        'data':seria,
                        'color':'#77abdd'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var data=param;
            var info=that.trans(data.PaymentItems);
            //根据当前容器元素宽度设定宽度
            info.width=that.element.width();
            info.height=$window.height();
            that.chart=new Line({'element':that.element,'info':info});

        }
    });
    
    /**
    *图表类型D,新增客户联系人的数量-时间分布
    */
    var Typed=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var customerSeria=[];
            var linkmanSeria=[];

            var max=0;
            var customerTotal=0;
            var contractTotal=0;

            _.each(data,function(val){
                var customerData=Math.round(val.fCustomersCount);
                var linkData=Math.round(val.contactsCount);
                customerSeria.push(customerData);
                linkmanSeria.push(linkData);

                customerTotal +=customerData;
                contractTotal +=linkData;

                //找出最大值
                if(customerData>linkData){linkData=customerData};
                if(linkData>max){max=linkData};
            });
            max=this.transMax(max);
            var info={
                'xAxis':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                'yAxis':{
                    'max':max,
                    'linenum':5
                },
                title:"全年新增客户"+customerTotal+"个，新增联系人"+contractTotal+"个",
                template:"<%=num%>月新增客户<%=customer%>，新增联系人<%=linkman%>",
                width:680,          //默认宽度 (px)
                height:520,         //默认高度 (px)
                topgutter:60,       //顶部边距 (px)
                bottomgutter:100,    //底部边距 (px)
                series:[
                    {
                        'name':'客户',
                        'mark':'customer',
                        'type':'line',
                        'data':customerSeria,
                        'color':'#3597bc'
                    },
                    {
                        'name':'联系人',
                        'mark':'linkman',
                        'type':'line',
                        'data':linkmanSeria,
                        'color':'#f99945'
                    }
                ]
            }
            return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var data=param;

            var info=that.trans(data.fCustomerContactNumChartItems);
            //console.log(info);
            //根据当前容器元素宽度设定宽度
            info.width=that.element.width();
            info.height=$window.height();
            that.chart=new Line({'element':that.element,'info':info}); 
        }
    });
    
    app.Funnel=Funnel;
    app.Line=Line;
    app.Typea=Typea;
    app.Typeb=Typeb;
    app.Typec=Typec;
    app.Typed=Typed;

})(Raphael,O,app);

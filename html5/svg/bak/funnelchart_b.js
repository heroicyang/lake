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
            data:[
                ['初期沟通(10%)','#1ed2dc'],
                ['立项跟踪(30%)','#277ebf'],
                ['呈报方案(50%)','#a434a6'],
                ['商务谈判(80%)','#ee5582'],
                ['已成交待追款(95%)','#f3674c'],
                ['赢单(100%)','#ff963c']
            ]
        }
    }
 */

define(function(require, exports, module) {
    
    var Raphael=require('raphael'),
        helper=require('./chart-helper.js');

    //漏斗图像定义
    var Funnel=function(){                                                 
        this._init_.apply(this,arguments);
    };
    Funnel.prototype={
        _init_:function(opts,num){
            this.opts=opts;
            this.element=$(opts.element);                            //svg DOM元素   
            this.render(opts.info,num);
        },
         /*=====================================================================
         * 渲染chart
         * 主要绘制坐标轴 标识 标题
         * 默认梯形的转折处角度为60度 像一个正三角形
         * @param info 绘制图表所需的所有信息
         ======================================================================*/
        render:function(info,num){    
            var $element=this.element;
            var svgelement=this.svgelement={};      //存储相关svg元素
			this.info=info;          //绘制漏斗所需信息
            
            //默认字体大小
            var fontsize=info.fontsize=13;

            //转换series 防止series内出现值为0的情况 
            //不改变原series 返回新的series 所以 调用原来的data数据 用 info.series.data
            var series=info.series,                         
                data=series.data,   //漏斗数据
                angle=Math.PI/3; 	//漏斗转折角度

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
            
            var paper=this.paper=Raphael($element[0],info.width,info.height);
            var ele;
            var tempWidth=funnelWidth;      //宽度暂存 暂存每个梯形的底部宽度

            svgelement.cube=paper.set();
            svgelement.line=paper.set();
            svgelement.labels=paper.set();
            for(var i=0;i<data.length;i++){
                //绘制梯形
                if(i!==data.length-1){
                    var transy=funnelHeight/data.length,
                        transx=transy/Math.tan(angle);

                    ele=paper.path(['M',x,y,'L',x+tempWidth,y,'L',x+tempWidth-transx,y+transy,'L',x+transx,y+transy,'L',x,y])
                             .attr({'stroke':'#fff','fill':'#bbbbbb'});
                    svgelement.cube.push(ele);
                    //绘制图例 图例左边字符和漏斗最右侧对齐 图例右边字符和画布最右边对齐
                    (function(){
                        var sx=Math.round(x+tempWidth-(transx/2))+4.5,
                            sy=Math.round(y+(transy/2))+0.5,                   
                            tx=info.width-122,
                            ty=sy;

                        var text=paper.text(tx,ty,series.data[i][0]).attr({'text-anchor':'start','fill':'#bbbbbb','font-size':info.fontsize});
                        var path=paper.path(['M',sx,sy,'L',tx-4.5,ty]).attr({'stroke':'#bbbbbb','font-size':info.fontsize});
                        svgelement.labels.push(text);
                        svgelement.line.push(path);
                    })();

                    //计算出下一个梯形的 x y 宽度坐标
                    x=x+transx;
                    y=y+transy;
                    tempWidth=tempWidth-2*transx;
                }
                //绘制正方形
                else{
                    var transy=funnelHeight/data.length,
                    ele=paper.path(['M',x,y,'L',x+tempWidth,y,'L',x+tempWidth,y+transy,'L',x,y+transy,'L',x,y])
                             .attr({'stroke':'#fff','fill':'#bbbbbb'});
                   	
                   	svgelement.cube.push(ele);
                    //绘制图例
                    (function(){
                        var sx=Math.round(x+tempWidth)+4.5,
                            sy=Math.round(y+transy/2)+0.5,
                            tx=info.width-120,
                            ty=sy;

                        var path=paper.path(['M',sx,sy,'L',tx-4.5,ty]).attr({'stroke':'#bbbbbb','font-size':info.fontsize});
                        var text=paper.text(tx,ty,info.series.data[i][0]).attr({'text-anchor':'start','fill':'#bbbbbb','font-size':info.fontsize});
                        svgelement.labels.push(text);
                        svgelement.line.push(path);
                    })();
                }

            }
            this.activeStage(num);
        },
        activeStage:function(num){
        	var svgelement=this.svgelement;
        	var info=this.info;
        	var color="#d8d8d8";
        	for(var i=0;i<svgelement.line.length;i++){
        		if(i==num){color=info.series.data[i][1]}
        		else{color="#d8d8d8"}
        		svgelement.labels[i].attr({'fill':color});
        		svgelement.line[i].attr({'stroke':color});
        		svgelement.cube[i].attr({'fill':color});
        	}
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
    return Funnel;
});

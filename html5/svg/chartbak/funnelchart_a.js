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

define(function(require, exports, module) {
    
    var Raphael=require('raphael'),
        helper=require('./chart-helper.js');

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
    return Funnel;
});

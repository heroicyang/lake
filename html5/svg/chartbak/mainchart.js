/**
 * chart-line
 */

define(function(require, exports, module) {

    //=====[[图表工具]]=====//
    var Ra=require('raphael');
    var Linechart=require('uilibs/chart/linechart');
    var Funnelchart=require('uilibs/chart/funnelchart_a');
    var Bubblechart=require('uilibs/chart/bubblechart');
    var crmStyle=require('modules/crm-chart/crm-chart.css');
    var util=require('util');

    /**
    *图表基类,提供常用的转换函数
    **/
    var Chart=function(){
        this._init_.apply(this,arguments);
    };
    //backbone的扩展函数
    Chart.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };
    Chart.prototype={
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
        //不同阶段的展示数据
        colorlist:["#1ed2dc","#277ebf","#a434a6","#ee5582","#f3674c","#ff963c"]
    };

    /**
    *图表类型A,显示任务完成情况
    **/
    var Typea=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Linechart({"element":element});
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.attr={
                path:'/Coop.HtmlHost/H/SalesStatistic/GetSalesTargetChartOfEmployee'
            };
            this.update(param);
        },
        //数据格式化
        trans:function(data){
            var xAxis=this.transMonth(data);
            var max=this.maxY(data)*1.2;

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

                if(datatemp>data0){
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
            salesYear=Ra.fn.transNumber(salesYear); winYear=Ra.fn.transNumber(winYear);
          
            var info={
                'xAxis':xAxis,
                'yAxis':{
                    'max':max,
                    'linenum':4
                },
                title:"全年已完成￥"+ winYear +"("+percent+"%)"+"，目标￥"+salesYear+"。",
                template:"{{num}}月已完成￥{{dataa||datac}} ({{ datab ? Math.round((dataa||datac)/datab*100):0 }}%) ,  目标￥{{datab}}",
                width:680,          //默认宽度 (px)
                height:340,         //默认高度 (px)
                topgutter:60,       //顶部边距 (px)
                bottomgutter:90,    //底部边距 (px)
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
            var $window=$(window);
            var path=this.attr.path;
            util.ajax({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                    var info=that.trans(data.value.salesTargetChartItems);
                    
                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据 
                    that.info=JSON.parse(JSON.stringify(info));


                    that.destory();
                    that.chart.render(info);
                    
                    //如果未绑定缩放事件 绑定缩放
                    if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            })
        },
        //清空图表 清空元素
        destory:function(){
            this.chart.destory();
            this.element.empty();
        },
        /*====================================
         *窗口缩放时重绘 
         *当窗口缩放时会非常频繁的触发此函数 所以加个100ms延迟 当缩放后100ms内无再次缩放事件 则进行重绘 
         *====================================*/
        _resize:function(){
            var that=this;
            if(that._time){
                clearTimeout(that._time);
            }
            that._time=setTimeout(function(){
                var infotemp=JSON.parse(JSON.stringify(that.info));
                infotemp.width=that.element.width();
                that.chart.destory();
                that.chart.render(infotemp);
            },100)            
        }

    });
    
    /**
    *图表类型B,销售漏斗
    **/
    var Typeb=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Funnelchart({"element":element});
            this.attr={
                path:"/Coop.HtmlHost/H/SalesStatistic/GetSalesFunnelDataOfEmployee",
                template:'<div class="crm-chart-b-text"><div class="crm-chart-b-text-first"><p> <b>最大成交金额</b><span>￥ {{max}}</span> </p></div> <div><p><b>预测总金额</b><span>￥ {{forecast}}</span></p></div><div><p><b>目标金额</b><span>￥ {{goal}}</span></p></div></div>'
            };
            this.template=_.template(this.attr.template);

            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data){
        	var list=[];
        	var colorlist=[
        		"#1ed2dc",
        		"#277ebf",
        		"#a434a6",
        		"#ee5582",
        		"#f3674c",
        		"#ff963c"
        	];

        	var nametemp,numtemp;

        	for(var i=0;i<data.length;i++){
        		nametemp=data[i]['name']+'('+data[i]['winRate']+'%)';
        		numtemp=data[i]['amount'];
        		list.push([nametemp,numtemp,colorlist[i]]);
        	};

	        var info={
	           	width:450,                //宽度(em)
                height:267,               //
                toppadding:0,             //顶部边距(em)
                bottompadding:0,          //底部边距(em)
                rightpadding:230,         //右部边距(em)
                title:"Sales funnel",
                series:{
                    name:'Unique users',
                    data:list
                }
	        }
        	return info;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            var path=this.attr.path;
            util.ajax({
                type:"GET",
                url:path,
                data:param,
                success:function(data){
                	var info=that.trans(data.value.pipelineColumns);

                    //根据当前容器元素宽度设定宽度
                    info.width=that.element.width();

                    //复制一份data 保存渲染的原始数据
                    that.info=JSON.parse(JSON.stringify(info));

                    that.destory();
                    that.chart.render(info);
                    var text={
                        goal:data.value.salesTargetAmount,
                        max:10000,
                        forecast:data.value.maybeWinAmount
                    };
                    that.element.append(that.template(text));

                    //如果未绑定缩放事件 绑定缩放
                    if(!that._resizeState_){$window.on('resize.chart',function(){ that._resize.apply(that) })};
                }
            })
        },
        //清空图表 清空元素
        destory:function(){
            this.chart.destory();
            this.element.empty();
        },
        //窗口缩放时重绘
        _resize:function(){
            var that=this;
            if(that._time){
                clearTimeout(that._time);
            }
            that._time=setTimeout(function(){
                var infotemp=JSON.parse(JSON.stringify(that.info));
                infotemp.width=that.element.width();
                that.chart.destory();
                that.chart.render(infotemp);
            },100)  
        }
    });
    
    /**
    *图表类型C,未赢单机会赢率-时间分布
    **/
    var Typec=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Bubblechart({"element":element});
            this.attr={
                path:"/Coop.HtmlHost/H/SalesStatistic/GetSalesFunnelDataOfEmployee"
            };
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data,timerange){
            var that=this;
            timerange=parseInt(timerange);
            var info={
                width:525,          //宽度(em)
                height:250,         //高度(em)
                topgutter:30,       //顶部边距(em)
                bottomgutter:30,    //底部边距(em)
                rightgutter:20,     //右边距(em)
                tip:"名字是{{name}},单数是{{num}}",
                xAxis:this.getXaxis(timerange),
                yAxis:{
                    max:100,
                    linenum:2,
                    label:function(value){
                        return value+'%';
                    }
                }
                /*,
                series:[
                    {
                        type:'num',
                        name:'bubblec',
                        data:[[5,47,12],[15,12,12],[25,176,12],[35,30,12],[45,98,12],[55,117,12],[65,60,12],[75,78,12],[85,12,12],[95,77,12]],
                        color:'#5153aa'
                    },
                    {
                        type:'num',
                        name:'bubbled',
                        data:[[105,47,12],[115,12,12],[105,176,12],[95,30,12],[85,98,12],[75,17,12],[65,60,12],[55,78,12],[45,12,12],[35,77,12]],
                        color:'#277ebf'
                    }
                ]
                */
            }; 
            /*================================================
            进行第一次数据转化 相同stage的存储在同一个数组中  
            ==================================================*/
            var list=[]; //存储第一次转化的数据
            var stage;   //阶段缓存
            for(var i=0;i<data.length;i++){
                stage=data[i]['SalesStage']['salesStageNo'];
                if(!list[stage]){
                    list[stage]={type:'num'};
                    list[stage]['name']=data[i]['SalesStage']['name'];
                    list[stage]['data']=[];
                    list[stage]['color']=that.colorlist[stage-1];
                }
                list[stage]['data'].push([data[i]['monthNo']*10-5,data[i]['SalesStage']['winRate'],parseInt(data[i]['amount'])]);
            }
            console.log(list);
          	//再次转化数据
            for(var j=1;j<list.length;j++){
            	if(!list[j]) continue;
                list[j]['data']=that._transArray(list[j]['data']);
            }
            info.series=list;
            return info;  
        },
        //对array数据进行二次转化 合并有相同x y 坐标的 返回转化后的新array
        _transArray:function(arr){
            var newarr=[];
            for(var i=0;i<arr.length;i++){
                if(!arr[i].mark){
                    arr[i][3]={amount:arr[i][2]};
                    arr[i][2]=1;
                    for(var j=i+1;j<arr.length;j++){
                        if(arr[i][0]==arr[j][0] && arr[j].mark!=true){
                            arr[i][2]+=1;
                            arr[i][3]['amount']=arr[i][3]['amount']+arr[j][2];
                            arr[j].mark=true;
                        }    
                    }
                    newarr.push(arr[i]);
                    arr[i].mark=true;  
                } 
            }
            return newarr;
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            //that.chart.render(info);
            util.ajax({
                type:"GET",
                url:"/Coop.HtmlHost/H/SalesStatistic/GetSalesOppNotWinChartOfEmployee",
                data:param,
                success:function(data){
                    that.destory();
                    var info=that.trans(data.value.salesOpportunitys,param.salesForecastTimeRange);
                    //console.log(data);
                    //console.log(info);
                    that.chart.render(info);
                }
            })
        },
        destory:function(){
            this.chart.destory();
        },
        //窗口缩放时重绘
        _resize:function(){
            
        }
    });
    /**
    *图表类型D,未赢单机会金额-时间分布
    **/
    var Typed=Chart.extend({
        _init_:function(element,param){
            this.element=$(element);
            this.chart=new Bubblechart({"element":element});
            this.attr={
                path:"/Coop.HtmlHost/H/SalesStatistic/GetSalesFunnelDataOfEmployee"
            };
            this._resizeState_=false;//状态值 判断是否已绑定缩放
            this.update(param);
        },
        //数据格式化
        trans:function(data,timerange){
            var that=this;
            timerange=parseInt(timerange);
            var info={
                width:525,          //宽度(em)
                height:250,         //高度(em)
                topgutter:30,       //顶部边距(em)
                bottomgutter:30,    //底部边距(em)
                rightgutter:20,     //右边距(em)
                tip:"名字是{{name}},单数是{{num}}",
                xAxis:this.getXaxis(timerange),
                yAxis:{
                    max:that.getMaxy(data),
                    linenum:5
                }
                /*,
                series:[
                    {
                        type:'num',
                        name:'bubblec',
                        data:[[5,47,12],[15,12,12],[25,176,12],[35,30,12],[45,98,12],[55,117,12],[65,60,12],[75,78,12],[85,12,12],[95,77,12]],
                        color:'#5153aa'
                    },
                    {
                        type:'num',
                        name:'bubbled',
                        data:[[105,47,12],[115,12,12],[105,176,12],[95,30,12],[85,98,12],[75,17,12],[65,60,12],[55,78,12],[45,12,12],[35,77,12]],
                        color:'#277ebf'
                    }
                ]
                */
            }; 
            /*================================================
            进行数据转化 相同stage的存储在同一个数组中  
            ==================================================*/
            var list=[]; //存储第一次转化的数据
            var stage;   //阶段缓存
            for(var i=0;i<data.length;i++){
                stage=data[i]['SalesStage']['salesStageNo'];
                if(!list[stage]){
                    list[stage]={type:'normal'};
                    list[stage]['name']=data[i]['SalesStage']['name'];
                    list[stage]['data']=[];
                    list[stage]['color']=that.colorlist[stage-1];
                }
                list[stage]['data'].push([data[i]['monthNo']*10-5,parseInt(data[i]['amount']),6,{mark:data[i]['name']}]);
            }
            //console.log(list);
            info.series=list;
            return info;  
        },
        getMaxy:function(arrdata){
            var max=_.max(arrdata,function(arrdata){return arrdata['amount']});
            return max['amount'];
        },
        //更新函数
        update:function(param){
            var that=this;
            var $window=$(window);
            util.ajax({
                type:"GET",
                url:"/Coop.HtmlHost/H/SalesStatistic/GetSalesOppNotWinChartOfEmployee",
                data:param,
                success:function(data){
                    that.destory();
                    var info=that.trans(data.value.salesOpportunitys,param.salesForecastTimeRange);
                    that.chart.render(info);
                }
            })
        },
        destory:function(){
            this.chart.destory();
        },
        //窗口缩放时重绘
        _resize:function(){
            
        }
    });

    exports.Typea=Typea;
    exports.Typeb=Typeb;
    exports.Typec=Typec;
    exports.Typed=Typed;
});

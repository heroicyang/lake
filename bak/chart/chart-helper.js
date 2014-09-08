/**
*raphael help
 */

define(function(require, exports, module) {

	var Raphael=require('raphael');
	/*====[[数据转换工具]]====*/
	 //根据传入的数字返回每三位加一个逗号的字符串
    Raphael.fn.transNumber=function(num,bool){
    	if(num!=0&&!num){return};

    	//默认bool是true 
    	//true则 整数四舍五入 false则下舍入
    	if(bool==undefined){bool=true};
    	
    	//数据四舍五入
    	if(bool){
    		num=Math.round(num);
    	}
    	//转换为整数字符串
        var numstr=parseInt(num).toString();
        
        var len=numstr.length;
        if(len<=3){return numstr;}

        var r=len%3;
        var str;
        if(r>0){
            str=numstr.slice(0,r)+","+numstr.slice(r,len).match(/\d{3}/g).join(",");
        }else{
            str=numstr.slice(r,len).match(/\d{3}/g).join(",");
        }
        return str;
    };
    Raphael.fn.transNum=function(num,place){
    	var num=parseFloat(num),
		 	floatnum=Math.round(num*Math.pow(10,place))/(Math.pow(10,place)),
		    stringnum=floatnum.toString();
		var pos=stringnum.indexOf('.');
		if(pos<0){
			pos=stringnum.length;
			stringnum+='.';
		}
		while(stringnum.length<= pos+2){
			stringnum+='0';
		}

		var intnum=this.transNumber(stringnum,false);
		stringnum=intnum+stringnum.slice(stringnum.indexOf('.'));
		return stringnum;
    };

	/*====[[画布方法]]====*/
	/*\
	[绘制坐标表格]
	@x y       表示表格的左上角
	@w h       表格宽 高   
	@wv hv     表格列数 行数
	@color     表格线的颜色
	@return    返回PATH对象
	\*/
	Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
	    color = color || "#000"; //默认颜色黑色
	    //画出矩形边框
	    var path = [
	        "M",
	        Math.round(x) + .5,
	        Math.round(y) + .5,
	        "L",
	        Math.round(x + w) + .5,
	        Math.round(y) + .5,
	        Math.round(x + w) + .5,
	        Math.round(y + h) + .5,
	        Math.round(x) + .5,
	        Math.round(y + h) + .5,
	        Math.round(x) + .5,
	        Math.round(y) + .5
	    ];
	    var rowHeight=h / hv,      //行高
	        columnWidth=w / wv;    //列宽
	    //画出横线
	    for(var i=1;i<hv;i++){
	        path=path.concat([
	        "M",
	        Math.round(x) + .5,
	        Math.round(y+i*rowHeight) + .5,
	        "H",
	        Math.round(x+w) + .5
	        ]);
	    }
	    //画出竖线
	    for(var j=1;j<wv;j++){
	        path=path.concat([
	        "M",
	        Math.round(x+j*columnWidth)+ .5,
	        Math.round(y)+ .5,
	        "V",
	        Math.round(y+h)+ .5
	        ]);
	    }
	    return this.path(path.join(',')).attr({stroke: color});
	};

	/*\
	[绘制简单坐标系] 
	@x y     坐标轴左下角坐标
	@w h     坐标轴宽 高
	@wv hv   坐标轴列数 行数
	@color   坐标轴颜色
	@lcolor  坐标内横线颜色
	\*/
	Raphael.fn.drawCoord=function(x, y, w, h, wv, hv, color, lcolor){

	    color = color || "#666";      //默认坐标轴颜色
	    lcolor = lcolor || "#ccc";    //默认横线颜色

	    var scale=6;   //标度长度
	    var rowHeight=h / hv,       //行高
	        columnWidth=w / wv;     //列宽

	    var path=[],    //坐标轴参数存储数组     
	        lpath=[];   //横线参数存储数组

	    //绘制x坐标轴并标识出标度
	    path=path.concat([
	    "M",
	    Math.round(x) + .5,
	    Math.round(y) + .5,
	    "L",
	    Math.round(x+w) + .5,
	    Math.round(y) + .5
	    ])

	    for(var i=0;i<=wv;i++){
	        path=path.concat([
	        "M",
	        Math.round(x+i*columnWidth) + .5,
	        Math.round(y) + .5,
	        "V",
	        Math.round(y+scale) + .5
	        ]);
	    }

	    //绘制y坐标轴并标识出标度
	    path=path.concat([
	    "M",
	    Math.round(x) + .5,
	    Math.round(y) + .5,
	    "L",
	    Math.round(x) + .5,
	    Math.round(y-h) + .5
	    ])
	    for(var j=0;j<=hv;j++){
	        path=path.concat([
	        "M",
	        Math.round(x) + .5,
	        Math.round(y-j*rowHeight) + .5,
	        "H",
	        Math.round(x-scale) + .5
	        ]);
	    }

	    //绘制坐标轴内的水平横线
	    for(i=1;i<=hv;i++){
	        lpath=lpath.concat([
	        "M",
	        Math.round(x) + .5,
	        Math.round(y-i*rowHeight) + .5,
	        "H",
	        Math.round(x+w) + .5
	        ]);
	    }

	    var rectSvg=this.rect(x,y-h,w,h).attr({fill:'#efefef',stroke:'none'}),
	        lpathSvg=this.path(lpath.join(',')).attr({stroke:lcolor}),
	        pathSvg=this.path(path.join(',')).attr({stroke:color});

	    return this.set().push(rectSvg,lpathSvg,pathSvg);
	};

	/*\
	[绘制折线段]
	\*/
	Raphael.fn.line = function(arra) {
	    var length = arra.length;
	    var path;
	    for (var i = 0; i < arra.length; i++) {
	        var x = arra[i][0];
	        var y = arra[i][1];
	        if (!i) {
	            path = ["M", x, y];
	        } else {
	            path = path.concat(["L", x, y]);
	        }
	    };
	    return this.path(path);
	}
	/*\
	[绘制圆滑曲线]
	输入的是数组参数
	\*/
	Raphael.fn.wave = function(arra) {
	    var length = arra.length;
	    var path;
	    /*\
	    获取三次贝塞尔函数的转折点
	    参数为p1 p2 p3的xy点
	    最后计算出中间p2两边的控制点
	    ?????????????????????????
	    没看懂这个函数 
	    \*/
	    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
	        var l1 = (p2x - p1x) / 2,
	            l2 = (p3x - p2x) / 2,
	            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
	            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y)),
	            a = p1y < p2y ? Math.PI - a : a,
	            b = p3y < p2y ? Math.PI - b : b;
	        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
	            dx1 = l1 * Math.sin(alpha + a),
	            dy1 = l1 * Math.cos(alpha + a),
	            dx2 = l2 * Math.sin(alpha + b),
	            dy2 = l2 * Math.cos(alpha + b);
	        return {
	            x1: p2x - dx1,
	            y1: p2y + dy1,
	            x2: p2x + dx2,
	            y2: p2y + dy2
	        };
	    };

	    var x,y,x0,y0,x2,y2,points;
	    for (var i = 0; i < arra.length; i++) {
	        if (!i) {
	            x = arra[i][0];  y = arra[i][1];  path = ["M", x, y,"C", x, y];
	        } else if(i!==arra.length-1){
	            x0=arra[i-1][0]; y0=arra[i-1][1];
	            x=arra[i][0]; y=arra[i][1];
	            x2=arra[i+1][0]; y2=arra[i+1][1];
	            var points=getAnchors(x0,y0,x,y,x2,y2);
	            path=path.concat([points.x1,points.y1, x, y,points.x2,points.y2]);
	        } else {
	            x=arra[i];
	            path=path.concat([])
	        }
	    };
	    return this.path(path);
	};

	/*\
	[绘制两点间的曲线 方式A 先水平线后竖直线]
	输入的是数组参数arr
	arr[0]=x
	arr[1]=y
	返回含有两个顶点的三次贝塞尔曲线
	\*/
	Raphael.fn.wavea = function(arr,bool,width){
	    var path;
	    var x1=arr[0][0], y1=arr[0][1], x2=arr[1][0], y2=arr[1][1];
	    var pax=x1+(x2-x1)/2, pay=y1, pbx=x2, pby=y2+(y1-y2)/2;

	    if(!bool){
	        path=["M",x1,y1,"C",pax,pay,pbx,pby,x2,y2];
	        return this.path(path)
	    }else{
	        if(!width) width=16;
	        var vector,patha;
	        var height=width*Math.sin(1/3*Math.PI);
	        if(y2<y1){
	            patha=this.path(["M",x1,y1,"C",pax,pay,pbx,pby,x2,y2+height]);
	            vector=this.vectop(
	            [x2,y2+height],
	            width);
	        }else{
	            patha=this.path(["M",x1,y1,"C",pax,pay,pbx,pby,x2,y2-height]);
	            vector=this.vecbottom(
	            [x2,y2-height],
	            width);
	        }
	        return this.set().push(patha,vector);
	    }
	}
	/*\
	[根据点坐标,绘制三角箭头]
	point 坐标点
	vector 
	\*/
	Raphael.fn.vec=function(point,line,vector){
	    var poly=["M"];
	    var x0=point[0],y0=point[1];
	    //取得60度角的正弦长度
	    var lineb=Math.sin(1/3*Math.PI)*line;
	    var p1=[],p2=[],p3=[];
	    switch(vector){
	        case "left":
	           p1[0]=x0-lineb; p1[1]=y0; p2[0]=x0; p2[1]=y0+line/2; p3[0]=x0; p3[1]=y0-line/2; 
	        break;
	        case "right":
	           p1[0]=x0+lineb; p1[1]=y0; p2[0]=x0; p2[1]=y0+line/2; p3[0]=x0; p3[1]=y0-line/2;
	        break;
	        case "top":
	           p1[0]=x0; p1[1]=y0-lineb; p2[0]=x0+line/2; p2[1]=y0; p3[0]=x0-lineb/2; p3[1]=y0;
	        break;
	        case "bottom":
	           p1[0]=x0; p1[1]=y0+lineb; p2[0]=x0+line/2; p2[1]=y0; p3[0]=x0-lineb/2; p3[1]=y0;
	        break;
	    }
	    poly=poly.concat(p1,["L"],p2,["L"],p3,["Z"]);
	    return this.path(poly);
	};
	Raphael.fn.vecleft=function(point,line){
	    return this.vec(point,line,'left');
	};
	Raphael.fn.vecright=function(point,line){
	    return this.vec(point,line,'right');
	};
	Raphael.fn.vectop=function(point,line){
	    return this.vec(point,line,'top');
	};
	Raphael.fn.vecbottom=function(point,line){
	    return this.vec(point,line,'bottom');
	};
	/*\
	[提示信息标签]
	@x @y 左上角坐标
	@text 提示信息
	\*/
	/*
	Raphael.fn.popup=function(x,y,text){
		var set=this.set();

		var text=this.text(x,y,text).attr({fill:"#444"});

		var box=text.getBBox(),
			width=box.width+12,
			height=box.height+10;

		var rect=this.rect(x,y,width,height,2).attr({fill: "#fff", stroke: "#ccc", "stroke-width": 1});
			
		text.attr('x',x+width/2).attr('y',y+height/2);

		rect.insertBefore(text);
		set.push(rect).push(text);
		return set;
	};

	Raphael.fn.popup=function(x,y,text,vector){
		var set=this.set();

		var text=this.text(x,y,text).attr({fill:"#444"});  //提示信息元素
		var	rect;         //边框信息

		var	box=text.getBBox(),   //辅助box
			width=box.width+12,   
			height=box.height+10;
		
		switch(vector){
			case 'left':
				text.attr('x',x-width/2).attr('y',y+height/2);
				rect=this.rect(x-width,y,width,height,2);
				break;
			case 'right':
				text.attr('x',x+width/2).attr('y',y+height/2);
				rect=this.rect(x,y,width,height,2);
				break;
			//默认为坐标右边显示
			default:
				text.attr('x',x+width/2).attr('y',y+height/2);
				rect=this.rect(x,y,width,height,2);
				break;
		}

		rect.attr({fill:"#fff",stroke:"#ccc",'stroke-width':1}).insertBefore(text);
		set.push(rect).push(text);
		return set;
	};
*/
	Raphael.fn.popup=function(x,y,text,vector,anchor){
		var set=this.set();

		var text=this.text(x,y,text).attr({fill:"#444",'font-size':12}); //提示信息元素 默认字体大小12px
		
		var box=text.getBBox(),
			width=box.width+12,
			height=box.height+10;

		var rect=this.rect(x,y,width,height,2).attr({fill:"#fff",stroke:"#ccc",'stroke-width':1});

		//========根据vector指明的方向 调整text vector位置
		vector=vector || 'left-top';
		vector=vector.split('-');
		var vec=[];
			vec[0]=vector[0];
			vec[1]=vector[1];

		switch(vec[0]){
			case 'left':
				text.attr('x',x-width/2);
				rect.attr('x',x-width);
			break;
			case 'right':
				text.attr('x',x+width/2);
				rect.attr('x',x);
			break;
			case 'middle':
				text.attr('x',x);
				rect.attr('x',x-width/2);
			break;
		}
		switch(vec[1]){
			case 'top':
				text.attr('y',y-height/2);
				rect.attr('y',y-height);
			break;
			case 'bottom':
				text.attr('y',y+height/2);
				rect.attr('y',y);
			break;
			case 'middle':
				if(vec[0]=='middle'){
					text.attr('y',y-height/2);
					rect.attr('y',y-height);
				}else{
					text.attr('y',y);
					rect.attr('y',y-height/2);
				}
			break;
		}

		//========确保rect在text后面
		rect.insertBefore(text);

		//========文字对齐默认是居中
		var anchor=anchor || 'middle';
		switch(anchor){
			case 'start':
				text.attr('text-anchor','start').translate(-width/2+6,0);
			break;
			default:
			break;
		}

		//========返回成组的text rect
		set.push(rect).push(text);
		set[0].data('vector',vector.join('-'));
		return set;

	}

	/*====[[元素方法]]====*/
	
	//组动画 暂只支持x y
	Raphael.st.lanimate=function(x,y,text,during){
		var textsvg=this[1],
			rectsvg=this[0];

		var text=text || textsvg.attr('text'),
			during=during || 260;

		var paper=rectsvg.paper;
		var newtext=paper.text(x,y,text).attr({fill:"#fff"}).hide(),
			box=newtext.getBBox(),
			width=box.width+12,
			height=box.height+10;

		rectsvg.animate({x:x,y:y,width:width,height:height},during);
		textsvg.attr('text',text).animate({x:x+width/2,y:y+height/2},during);		
	};

	//用于提示标签的转化
	Raphael.st.ltranslate=function(x,y,text,vector,anchor){
		var textsvg=this[1],
			rectsvg=this[0];

		//========如果text没传参 则取原text
		var text=text || textsvg.attr('text');
		textsvg.attr({'x':x,'y':y,'text':text});
		var box=textsvg.getBBox(),
			width=box.width+12,
			height=box.height+10;

		rectsvg.attr({'x':x,'y':y,'width':width,'height':height,'r':2});

		//=======如果vector没传参 则取原tip的vector
		vector=vector || this[0].data('vector');
		vector=vector.split('-');
		var vec=[];
			vec[0]=vector[0];
			vec[1]=vector[1];
		switch(vec[0]){
			case 'left':
				textsvg.attr('x',x-width/2);
				rectsvg.attr('x',x-width);
			break;
			case 'right':
				textsvg.attr('x',x+width/2);
				rectsvg.attr('x',x);
			break;
			case 'middle':
				textsvg.attr('x',x);
				rectsvg.attr('x',x-width/2);
			break;
		}
		switch(vec[1]){
			case 'top':
				textsvg.attr('y',y-height/2);
				rectsvg.attr('y',y-height);
			break;
			case 'bottom':
				textsvg.attr('y',y+height/2);
				rectsvg.attr('y',y);
			break;
			case 'middle':
				if(vec[0]=='middle'){
					textsvg.attr('y',y-height/2);
					rectsvg.attr('y',y-height);
				}else{
					textsvg.attr('y',y);
					rectsvg.attr('y',y-height/2);
				}
			break;
		}

		//========如果anchor没传参 则取原anchor类型
		var anchor=anchor || textsvg.attr('text-anchor');
		textsvg.transform("");
		switch(anchor){
			case 'start':
				textsvg.attr('text-anchor','start').translate(-width/2+6,0);
			break;
			default:
			break;
		}
		//========确保rect在text后面
		rectsvg.insertBefore(textsvg);

		return this;
	}

});

/*========================[[Raphael功能扩展 ]]=======================*/

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

    color = color || "#444";      //默认坐标轴颜色
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
            x=arra[i][0];
            y=arra[i][1];
            path=path.concat([x,y,x,y]);
        }
    };
    console.log(path);
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
}


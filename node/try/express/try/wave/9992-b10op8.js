/*        === ===
        ===     ===
      ===         ===
        ===     ===
          === ===
*/
/*========================[[Raphael功能扩展 ]]=======================*/

/*\
[绘制坐标表格]
\*/
Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
    color = color || "#000"; //默认颜色黑色
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
    return this.path(path).attr({
        stroke: color
    });
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
        var l1 = (p2x - p1x) / 2;
        var l2 = (p3x - p2x) / 2;
        var a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y));
        var b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        var a = p1y < p2y ? Math.PI - a : a;
        var b = p3y < p2y ? Math.PI - b : b;
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
}

/*=====================================[[图Tu 数据结构 ]]========================*/
var Tu={};


/*\
找到 [ {}, {}, {} ] 中key=value的 {} 的索引
@array
@key
@value
@@num 若返回-1 则表示没有找到
\*/
Tu.find=function(array,key,value){
    for(var i=0;i<array.length;i++){
        if(array[i].hasOwnProperty(key) && array[i][key]===value){
            return i;
        }
    }
    return -1;
}


/*\
函数Trans
广度遍历一维数组data存储的图
@data 结构如下
 [ 
   {id:0,prev:null,next:[1,77],......},
   {id:1,prev:[0],next:[2],......},
   {id:2,prev:[1,77],next:null,......},
   {id:77,prev:[0],next:[2],......}
 ]
按层次存储为二维数组arr
@@arr
arr[0]=[0],
arr[1]=[1,3,5,7],
arr[3]=[2,4,6,8],
arr[4]...
分别代表广序遍历的1 2 3 ......层级
\*/
Tu.trans=function(data){

    var i=0;
    var data=data;
    var arr=[[]];      //存储层序遍历结果
    var arrstack=[];   //存储状态值 索引值为id值 检测相应id是否遍历过

    arr[0][0] = data[0];
    arrstack[0]=true;
    extend();
    return arr;

    //函数 遍历数组 并将数组的子元素压入下一个数组
    function extend() {
        //[循环函数]按照广度遍历一层层往下遍历
        function circle(){
            if(one(i)){
                i=i+1;
                circle();
            }else{
                return;
            }
        }
        circle();
    }


    //根据num变量 遍历arr[num]的所有元素
    //并将子元素的子元素push入arr[num+1]
    //如果arr[num]的所有子元素均无子元素了或子元素的子元素均被遍历了 返回false
    function one(num) {
        var current=arr[num];
        var next=arr[num + 1]=[];

        //(状态值)_nul_默认为false 只要有一个元素不为空 既为true
        //(状态值)_state_默认为false 只要有一个元素未被遍历过 即为true
        //只有在元素全为空 或 部分元素不为空但是全都被遍历过的情况下 返回false
        var _nul_ =false;
        var _state_=false;

        for (var na = 0; na < current.length; na++) {
            if (current[na].next!== null && current[na].next!=='null') {
                _nul_=true;
                for (var nb = 0; nb < current[na].next.length; nb++) {
                    
                    var id=current[na].next[nb],
                        numer=Tu.find(data,'id',id);                   
                    if(arrstack[id]!==true){
                        _state_=true;
                        next.push(data[numer]); arrstack[id]=true;
                    }
                    if(numer==-1){
                        throw "id为"+current[na].id+"的数据错误"+"指向的nextid不存在"
                    }
                }
            }
        }
        return (_nul_ && _state_);
    }
}



/*\
渲染函数一
@array Tu.trans返回的层序数组
@pen   pen画布
@width 画布宽度
@@s  
    s.circles   矢量圆数组 data存储着id
    s.lines     连接线 二维数组
    s.active    激活id
\*/
Tu.render=function(data,pen,width){
    var array=Tu.trans(data);
    var width=width || 680;
    var map=[]       //存储坐标值
    var s={};s.circles=[];s.lines=[[]];s.map=map;

    //遍历array数组并生成坐标值 存入相应map[id]
    //并判断哪个mark是active的存入s.active
    for(var i=0;i<array.length-1;i++){
        var num=array[i].length;
        var wid=width/(num+1);
        var hei=80;
        for(var j=0;j<num;j++){
            var x=wid*(j+1),y=hei*(i)+60;
            map[array[i][j].id]=[x,y];
            if(array[i][j].active==true) s.active=array[i][j].id;
        }
    }

    //遍历array数组 根据map[id]坐标值 绘图至相应位置
    //绘制出几何圆形的同时 画出由此几何出发的连接线
    for(var k=0;k<array.length-1;k++){
        var nu=array[k].length;
        for(var l=0;l<nu;l++){
            var cur=array[k][l].id;
            var next=array[k][l].next;

            var xa=map[cur][0],ya=map[cur][1];
            var text=array[k][l].name;
            var circle=drawCircle(pen,[xa,ya],text).data('id',cur);
            s.circles[cur]=circle;//将生成的节点存入数组
            if(next){
                s.lines[cur]=[];
                for(var m=0;m<next.length;m++){
                    var x1=map[cur][0],y1=map[cur][1],x2=map[next[m]][0],y2=map[next[m]][1];
                    var line=drawLine(pen,[[x1,y1],[x2,y2]],32);
                    s.lines[cur][next[m]]=line;
                }
            }
        }
    }
    return s;

    //绘制节点函数
    function drawCircle(pen,points,t){
        var x=points[0],y=points[1],lang=28;
    
        var ca=pen.circle(x,y,lang).attr({stroke: "#ff6600",'stroke-width': "2px",'cursor': 'pointer','fill':"#ff6600"});
        var text=pen.text(x,y+4,t).attr({'stroke-width':'0px','fill':'#fff','font-size':'12x','font-family':'微软雅黑','cursor':'pointer','font-weight':'bold'});
        //var st=pen.set();
        //st.push(ca,text);
        return ca;
    }

    //绘制连接线
    function drawLine(pen,points,lang){
        var x1=points[0][0],y1=points[0][1],x2=points[1][0],y2=points[1][1];
        var line,avec,bline,set,width=10,l=width*Math.sin(1/3*Math.PI);;
        if(x2==x1 || y2==y1){
            if(x2==x1){
                if(y2>y1){
                    y1=y1+lang,y2=y2-lang;
                    avec=pen.vecbottom([x2,y2-l],width);
                    bline=pen.line([[x1,y1],[x2,y2-l]]);
                }else{
                    y1=y1-lang,y2=y2+lang;
                    avec=pen.vectop([x2,y2+l],width);
                    bline=pen.line([[x1,y1],[x2,y2+l]]);
                }
            }else{
                if(x2>x1){
                    x1=x1+lang,x2=x2-lang;
                    avec=pen.vecright([x2-l,y2],width);
                    bline=pen.line([[x1,y1],[x2-l,y2]]);
                }else{
                    x1=x1-lang,x2=x2+lang;
                    avec=pen.vecleft([x2+l,y2],width);
                    bline=pen.line([[x1,y1],[x2+l,y2]]);
                }
            }
            line=pen.set();
            line.push(avec,bline);
        }else{
            if(x2>x1){x1=x1+lang}
            else{x1=x1-lang};
            if(y2>y1){y2=y2-lang}
            else{y2=y2+lang};
            line = pen.wavea([[x1,y1], [x2,y2]], true,width);
        }
        line.attr({stroke: "#444",'stroke-width': "1px"});
        return line;
    }
}

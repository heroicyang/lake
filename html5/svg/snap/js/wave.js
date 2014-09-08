/*\
[绘制圆滑曲线]
输入的是数组参数
\*/
Snap.plugin(function (Snap, Element, Paper, glob) {

Paper.prototype.wave = function(arra) {
    var length = arra.length;
    var path;
    /*\
    获取三次贝塞尔函数的转折点
    参数为p1  p2 p3的xy点
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

    var x;
    var y;
    var x0;
    var y0;
    var x2;
    var y2;
    var points;
    for (var i = 0; i < arra.length; i++) {
        if (!i) {
            x = arra[i][0];
            y = arra[i][1];
            path = ["M", x, y,"C", x, y];
        } else if(i!==arra.length-1){
            x0=arra[i-1][0];
            y0=arra[i-1][1];
            x=arra[i][0];
            y=arra[i][1];
            x2=arra[i+1][0];
            y2=arra[i+1][1];
            var points=getAnchors(x0,y0,x,y,x2,y2);
            path=path.concat([points.x1,points.y1, x, y,points.x2,points.y2]);
        } else {
            x=arra[i];
            path=path.concat([])
        }
    };
    return this.path(path);
};

});

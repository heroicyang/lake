var rect=function(){
       var _left=0;
	   var _right=0;
	   var _top=0;
	   var _bottom=0;
	   this.set = function ( left, top, right, bottom ) {
		_left = left; _top = top;
		_right = right; _bottom = bottom;
	    };
	   this.getX = function () {
		return _left;
	    };
	   this.getY = function () {
		return _top;
	    };
}
var A1=new rect();
var A2=new rect();
    A1.set(2,4,15,16);
console.log(A1.getX());
console.log(A2.getX());

var a="hello world!";
var b=new String('hello world!');

/*\
????????????????????
函数是一种数据类型
还是封装好的对象
那么一开始的FUNCTION对象 又是怎么来的呢？
它也是函数生成的啊
\*/
var c=function(x){
    return x*x;
}
var d=new Function("x","return x*x;");
console.log(a);
console.log(typeof(a));
console.log(b);
console.log(typeof(b));
console.log(c);
console.log(typeof(c));
console.log(d);
console.log(typeof(d));

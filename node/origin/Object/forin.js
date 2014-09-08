function Per() {}
Per.prototype = {
    name:'name',
    cha:'cha'
}
var a=new Per();
a.dd="hello world";
/*
for(key in a){
    console.log(key);
    console.log(a[key]);
}
*/
console.log(a.forEach);

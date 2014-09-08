var url=require('url');

var txt='http://www.baidu.com';

var parse=url.parse(txt);
var format=url.format(txt);

//console.log(parse);
console.log(format);
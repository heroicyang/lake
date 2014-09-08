/*
hash 就是有损压缩 是不可逆的
*/
var crypto=require('crypto');

/*
获取crypto支持的hashes算法
*/
//var hashes=crypto.getHashes();

/*
根据传入的参数 获取一个相应算法的哈希对象
*/
var md5=crypto.createHash('md5');
md5.update('hello world!','utf8');       	 //第二个参数指定第一个数据按什么编码存储为二进制数据
var md5string=md5.digest('utf8');  //将二进制数据表述为字符串 参数表明表述为什么进展的格式
console.log(md5string);





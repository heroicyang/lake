var fs=require('fs');

/*
读取目录下的所有文件名
var files=fs.readdirSync('.');
for(fn in files){
    console.log(files[fn]);
}
*/


fs.readFile("./node.txt","binary",function(err,data){
    if(err){
        console.error(err);
    }else{
       fs.writeFile('message', data,{encoding:'binary'});
    }
})

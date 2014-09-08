var path=require('path');

var url="/patha/pathb/pathc//..//a.avi";
url=path.normalize(url);
console.log(url);

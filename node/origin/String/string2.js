var str="<b>你好</b><div><b>&nbsp;</b><span>{<b>title</b>}<span><span>{author_all}</span></span></span></div><div>你的作品很棒</div><div>&nbsp;<span>{<i>eamil</i>}</span></div>"
console.log(str.match(/[<][a-z][>]/g));

/*-加载模块-*/
var express=require('express');
var ejs=require('ejs');
var util=require('util');
var app=express();

/*-模版引擎设置-*/
ejs.open='{{';
ejs.close='}}';

/*-服务器设置-*/
app.set('port',3000);                    //设置端口
app.set('views', __dirname + '/view')    //模板路径
app.set('view engine', 'ejs');           //模板引擎

app.use(express.static(__dirname+'/meteor'));    //设置前端路径
//app.use(express.cookieParser());                 //cookie中间件？？
//app.use(express.bodyParser());                   //这是什么玩意

/*-程序参数配置-*/
app.locals({
	title:'node app',
	qq:847561457,
	email:'liguodongdao@gmail.com'
})

app.get('/',function(req,res){
	//res.render('try');
    //res.set("Set-Cookie",["type=ninja","language=javascript"]);
    res.send('hello node');
    res.cookie('rememberme','hello cookie');
})
app.get('/session',function(req,res){
    res.send('hello session');
    var cookies=req.headers.cookies;
    res.send(cookies);
})
/*-监听端口-*/
app.listen(app.get('port'));
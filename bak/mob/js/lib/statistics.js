/*
修改
refer 把路径解了 只留 index.html
mirrorid 
originrefer
url 把路径解了 #号解了
*/
(function($,root){
    //常用临时变量
	var requestPath =location.protocol+"//dc.fxiaoke.com/frontend",
		mainDomain='fxiaoke.com';
	if(window.location.href.indexOf('firstshare')>=0) {
		requestPath =location.protocol+"//dc.firstshare.cn/frontend";
		mainDomain='firstshare.cn';
	}
    //var mainDomain="192.168.10.13";

    //hostPath不加最后的斜杠 因为获得refer时 二级页可知refer为“/” 即为首页过来的
    var hostPath=location.protocol+'//'+location.host;  //本站域名

    //工具库
    var util={};

    //每次旧页面加载完毕新页面打开时 设置一个5秒的isRefresh标识 和5秒的 isDialog判断标识
    window.onbeforeunload=function(){
        var name=util.getHtmlname();
        var now= new Date();
        now.setSeconds(now.getSeconds()+5);      //当前时间加5s
        /*
        $.cookie('isDialogm',1,{
            expires: now,
            path: '/mob/',
            domain:mainDomain
        });
        */
        $.cookie('isRefreshm',name,{
            expires:now,
            path:'/mob/',
            domain:mainDomain
        })
    };
    
    /***********************
    *状态值判断 页面是否是首页
    ***********************/
    util._isIndex=function(){
        return !!util.supply(util.getUrl(hostPath,true)).match('index.html');
    };
    /*********************
    *判断值 判断是否为移动端
    ***********************/
    util.isMobile=function(){
        var ua=navigator.userAgent;

        var isMMobile=/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/i.test(ua);
        var isMobile=/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua);
        return (isMobile||isMMobile);
    };

    /*======================
    补全路径 如 www.avaer.org/root/?a=1 替换为 www.avaer.org/root/index.html?a=1
    ======================*/
    util.supply=function(string){
        if(!string) return "";
        var num=string.split('?')[0].lastIndexOf('/')+1;

        //如果路径中最后 / 后没有其他字符添加index.html
        if(!string.split('?')[0].slice(num)){
            string=string.slice(0,num)+"index.html"+string.slice(num);
        }

        return string;
    };
    /*====================
    获得页面的html名字
    ======================*/
    util.getHtmlname=function(){
        var href=location.href||"";
            //补全路径
            href=util.supply(href);
            //去除查询字符串
            href=href.split('?')[0];
            //获取真实名字
            href=href.slice(href.lastIndexOf('/')+1);
        return href;
    };
    /*=======================
    生成guid @return string
    =========================*/
    util.guid=function(){
        /*
        *生产字符串格式随机数guid
        */
        var guid = "";
        for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
        }

        /*
        *将time转换为12位以下16进制数
        *并插入guid最后几位
        */
        var nowString=Date.now().toString(16);
        if(nowString.length>=12){
            nowString=nowString.slice(-12);
        }
        guid=guid.slice(0,36-nowString.length)+nowString;

        return guid;
    };

   /*=========
    * 系统检测
    ==========*/
    util.sysDetector=function(){
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return "ios";
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return "android";
        }else{
            return "unknown";
        }
    };

    /*==========================================
    *先前有个逻辑判断是否为移动端
    *现在只需要根据系统 android ios 即可判断为iphone android或wp浏览器
    ============================================*/
    util.getSource=function(){
        var sysName=util.sysDetector(),
            source=999;

        switch(sysName){
            case "ios":
                source=204;            
                break;
            case "android":
                source=304;
                break;
            case "unknown":
                source=999;
                break;
        }
        return source;
    };

    /*============================================================
     * 获取引用页地址，如果referrer来自于传入的hostPath 则去掉域名
     * 如果bool为真 则去除查询字符串和路径
     =============================================================*/
    util.getReferrer=function(hostPath,bool){
        //hostpath若未传入则赋值为空字符串
        var hostPath=hostPath || "";

        //无referrer 则为空字符串
        var referrer=$.trim(document.referrer)||"";
            referrer=util.supply(referrer);

        //如果存在referrer且hostPath不为空字符串且和传入的hostpath参数对的上号 则去除hostpath部分
        if(hostPath&&referrer.length>0&&referrer.slice(0,hostPath.length)==hostPath){
            referrer=referrer.slice(hostPath.length);
        }

        //如果bool值为真则去除refer中的路径以及查询字符串
        if(bool){
            referrer=referrer.split('?')[0];
            referrer=referrer.slice(referrer.lastIndexOf('/')+1)
        }

        //如果referrer最后是 / 结束的加上index.html
        return referrer;
    };

    /*=====================================
     * 获取当前页地址，站内跳转去掉域名部分
     * 截取路径的话 先把?后面的删除 然后判断最后一个/出现的位置 截取之
     * 补全的话截取?后的东西后 看看最后是不是/ 是的话补上index.html
     =====================================*/
    util.getUrl=function(hostPath,bool){
        //hostpath若未传入则赋值为空字符串
        var hostpath=hostpath||"";

        var href=location.href||"";
            href=util.supply(href);

        if(hostPath&&href.length>0&&href.slice(0,hostPath.length)==hostPath){
            href=href.slice(hostPath.length);
        }

        //如果bool值为真则去除href中的路径以及查询字符串 以及最后的#号
        if(bool){
            href=href.split('?')[0];
            href=href.slice(href.lastIndexOf('/')+1)
            if(/#$/i.test(href)){href=href.slice(0,-1)}
        }
        return href;
    };
    /*====================
    *获取浏览器类型
    =====================*/
    util.getBrowser=function(){
        var ua=navigator.userAgent;
        var browser,version;
        if ( /MSIE/i.test(ua) )         {browser='Internet Explorer';version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];}
        else if ( /Chrome/i.test(ua) )  {browser='Chrome'; version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];}
        else if( /Opera/i.test(ua)  )   {browser='Opera';}
        else if( /Android/i.test(ua))   {browser='Android Webkit Browser';}
        else if( /Firefox/i.test(ua))   {browser='Firefox'; version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];}
        else if( /Safari/i.test(ua))    {browser='Safari';}
        //如果是微信内部浏览器 则返回Weixin
        else if(/MicroMessenger/i.test(ua)){browser='Weixin';}
        else{browser='unknow'}

        if ( !version ) {
        
             version = /Version\/[\.\d]+/.exec(ua);
             
             if (version) {
                 version = version[0].split('/')[1];
             } else {
                 version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
             }
         
        }

        return browser+' '+version;
    };
    /*============================================================
     *获取起始来源网址 
     *原理:url的from参数为最高优先级
           外站进入首页 或 内页 均记录为originRefer
           如果是通过输入url 来到首页或内页 均赋值为空 移除originrefer的cookies
           如果是站内跳转originrefer通过cookie获取
    --------------------------------------------------------
    

    ============================================================*/
    util.getOriginReferrer=function(){
        var origin;
        
        //用于判断是否是本站跳转 refer有http的未外站跳转
        var refer=util.getReferrer(hostPath);
        var domainReg=/(http|https):\/\/([^\/]+)/i; 

        //首先判别是否url中含有from参数
        origin=$.getParam('from');
        if(origin){
            $.cookie('originReferm',origin,{
                    expires: 1,  //以天为单位
                    path: '/mob/',      
                    domain:mainDomain
            });
            return origin;
        }
        //若url中无from参数  refefer不是来自本站的均记录为originreffer
        //比如保存某个内部页面为书签 或从某个页面跳到本站首页
        else if(refer.search('http://')!=-1||refer.search('https://')!=-1){
            
            var originReferDomain=refer.match(domainReg);  
            if(originReferDomain){
                origin=originReferDomain[0];
                if(/https/i.test(origin)){origin=origin.replace('https://','')}
                    else{origin=origin.replace('http://','')}
                $.cookie('originReferm',origin,{
                    expires: 1,  //以天为单位
                    path: '/mob/',
                    domain:mainDomain
                });    
            }
            return origin;
        }
        //若url无from参数 且refer是来自本站的 则orign读取cookie 若空则直接赋空值
        else if(util._isDialog){
            origin=$.cookie('originReferm')||"";
            return origin
        }
        //最后 无from参数 refer不是本站 不是外站 而是空的 则orign为空字符串(比如保存首页为书签 或 直接通过域名进入本站)
        //同时清除originRefer这个cookie
        else{
            $.cookie('originReferm','',{
                expires: 1,  //以天为单位
                path: '/mob/',
                domain:mainDomain
            });
            return "";
        }
    };

    /*===================================
     *获取mirrorid 若获取不到则赋值为0000
     *cookie时限为对话周期 
     *原理:url参数中的mirror 为最高优先级
           mirrorid 一般在进入首页时获取 如果是从内页跳转或首页刷新则通过cookie取得mirrorid
                    在对话期如果是凭空打url进入 子页面不传mirror参数 也会通过cookie获得mirrorid
     ====================================*/
    util.getMirrorId=function(){

        var mirrorid=$.getParam('mirror');
        var fs_mirror=$.cookie('fs_mirror');
        //如果参数中有mirror 取之并cookie之 此为最优先级
        if(mirrorid){
            $.cookie('mirrorIdm',mirrorid,{
                path:'/mob/',
                domain:mainDomain
            })
            return mirrorid;
        }
        /**
        *因为废弃了以前的路径方式
        *如果是镜像站 后台会存储一个cookie fs_mirror
        *优先级别仅低于url中的参数mirror
        */
        else if(fs_mirror){
            mirrorid=fs_mirror;
            $.cookie('mirrorIdm',mirrorid,{
                path:'/mob/',
                domain:mainDomain
            })
            return mirrorid;
        }
        //如果非对话周期               
        else if(!util._isDialog){
            mirrorid="0000";
            $.cookie('mirrorIdm',mirrorid,{
                path:'/mob/',
                domain:mainDomain
            })
            return mirrorid;
        }else{
            mirrorid=$.cookie('mirrorIdm') || "0000";
            $.cookie('mirrorIdm',mirrorid,{
                path:'/mob/',
                domain:mainDomain
            })
            return mirrorid;
        }
    };
    /****************************
    * 状态值判断 页面是否是刷新的
    *****************************/
    util._isRefresh=(function(){           
        var oldName=$.cookie('isRefreshm');
        var nowName=util.getHtmlname();
        if(oldName==nowName){return true}
        else{return false}
    })();

    /**********************************************************************************************
    *核心判断函数  判断是否在一个session
    *要求  当打开一个页面 新建一个窗口 输入相同的域名这个页面当做另一个对话周期并不算相同的一个周期
    
    *原理 根据referrer来自同一域名来判断属于一个对话期间 即使是页面右键点击
          打开新页面依然是属于一个对话期间
          -----------------------------------------------------------
          referrer不是万能的 当一个页面刷新时referrer并不会记录为本页面
          如 A->B  B refresh B  A页跳到B页 B页再刷新一下 此时B页的referrer会
          记录为A 而不是B 如果A是外站 此时本来属于一个对话期间 但会判别失效 
          此时就增加一个是否刷新的判断条件 若满足两个条件之一 均为对话周期
    ***********************************************************************************************/
    util._isDialog=(function(){
        var referrer=$.trim(document.referrer)||"";
        var isInside=referrer.slice(0,hostPath.length)==hostPath;

        if(isInside || util._isRefresh){
            return true;
        }
        else{
            return false;
        }
    })();
    /*=================
    * 获取基础数据统计
    * 适用于每个页面
    ==================*/
    util.getBaseData=function(){

        //注入guid，记录用户访问次数
        var guid=$.cookie('guidm'),
            isNew=0;      //确认是否为新浏览器 起始值为0
        if(!guid){
            $.cookie('guidm',guid=util.guid(),{
                expires: 356,  //以天为单位
                path: '/mob/',
                domain:mainDomain
            });
            isNew=1;
        }
        var maindata={
            "gid":guid,
            "isRefresh": util._isRefresh ? 1:0,
            "refer":util.getReferrer(hostPath,true),
            "url":util.getUrl(hostPath,true),
            "mirrorid":util.getMirrorId(),
            "source":util.getSource(),
            "ua":navigator.userAgent,
            "type":1,         
            "new":isNew,
            "browser":util.getBrowser(),
            "originRefer":util.getOriginReferrer()
        };
        
        /*
        //如果查询字符串中有activeid 则插入
        //一般作为邮件统计使用 暂时不用注释之
        var activeid=util.getActiveId();
        if(activeid) maindata['activeid']=activeid;
        */

        return maindata;
    };
    /*===============
    *发送统计数据
    =================*/
    util.sendBaseData=function(requestData,callback){
        var baseData= $.extend(util.getBaseData(),requestData||{});
        $.ajax({
            type: "get",
            async: true,
            url: requestPath,
            data:{
                "data":JSON.stringify(baseData)
            },
            dataType: "jsonp",
            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback:"cb",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(responseData){
                callback&&callback.call(this,responseData,requestData);
            }
        });
    };

    root.ava=root.ava||{};
    root.ava.util=util;
})(window.Zepto,window);

$(function(){
    //发送统计数据
    ava.util.sendBaseData();
    
    $('[data-stat]').click(function(e){
        var $this=$(this);
        var href=$this.attr('href');
        var data=JSON.parse($(this).attr('data-stat'));
        data.type=6;
        ava.util.sendBaseData(data);

        //如果不是打电话的超链接 100ms后跳转 同时阻止跳转事件
        if(!href.match(/^tel/)){
            e.preventDefault();
           
            if($this.attr('target').match('_blank')){
                setTimeout(function(){window.open(href)},500);
            }else{
                setTimeout(function(){location.href=href},500);
            }
           
        }
        
    });
});




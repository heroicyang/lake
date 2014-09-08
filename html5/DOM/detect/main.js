var client = function(){
    //呈现引擎 
    var engine ={ 
        ie : 0, 
        gecko : 0, 
        webkit : 0, 
        khtml : 0, 
        opera : 0, 
        
        ver : null 
    }; 
    //浏览器 
    var browser = { 
        ie : 0, 
        firefox :0, 
        safari  : 0, 
        konq :0, 
        opera : 0, 
        chrome : 0, 
 
        ver : null 
    }; 
 
    var system ={ 
        win :false, 
        max : false, 
        x11 : false, 
 
        //移动设备 
        iphone : false , 
        ipod : false, 
        ipad : false, 
        ios  : false, 
        android : false, 
        nokiaN : false, 
        winMoble : false, 
        
        //游戏系统 
        wii :false, 
        ps : false 
    }; 
 
    var ua =navigator.userAgent; 
 
    //Opera 9以后出现了两种字符串代理的方式 一种方式就是将自身标识另外一个浏览器 另外一种方式就是标志自己为firefox或者IE 
    //在后面这种情况下 用户代理字符串实际上与其他浏览器返回的相同--既没有opera的字样，也不包含opera的版本信息 
    //因此判断浏览器先从opera开始 
    if(winddow.opera){ 
        engine.ver = browser.ver = window.opera.version(); 
        egine.opera = browser.opera = parseFloat(engine.ver); 
    //第二个检测WebKit 是因为WebKit的用户代理字Gecko"和"HTMKL"的字符串 所以如果首先检测他们都有错误的结论 
    }else if (/AppleWebKit\/(\S+)/.test(ua)){ 
        engin.ver = RegExp["$1"]; 
        engine.webkit = parseFloat(engine.ver); 
 
        //确定是chrome还是Safari 
        if(/Chrome\/(\S+)/.test(ua){ 
            browser.ver = RegExp["$1"]; 
            browser.chrome = parseFloat(brower.ver); 
        }else if(/Version\/(+\S)/.test(ua)){//safari 3.0后增加了Version属性 
            browser.ver = RegExp["$1"]; 
            browser.safari = parseFloat(brower.ver); 
        }else{ 
            var safariVersion = 1; 
            if(engine.webkit<100){ 
                safariVersion = 1; 
            }else if(engine.ver<312){ 
                safariVersion = 1.2; 
            }else if(engine.ver<412){ 
                safariVersion = 1.3; 
            }else{ 
                safariVersion = 2; 
            } 
 
            browser.safari = browser.ver = safariVersion; 
        } 
    }else if(/KHTML\/(\S+)/.test(ua)||/Konqueror\/([^;]+)/.test(ua)){//Linux下浏览器 
        engine.ver = browser.ver = RegExp["$1"]; 
        engine.khtml = parseFloat(engine.ver); 
    }else if(/rv:([^\)]+\) Gocko\/\d{8}/.test(ua)){ 
         engine.ver = RegExp["$1"]; 
         engine.gecko = parseFloat(engine.ver); 
 
         //确定不是firefox 
         if(/Firefox\/(\S+)/.test(ua){ 
            browser.ver = RegExp["$1"]; 
            browser.firefox = parseFloat(browser.ver); 
         } 
    }else if (/MSIE ([^;]+)/.test(ua)){ 
        engine.ver = browser.ver = RegExp["$1"]; 
        engine.ie  = browser.ie = parseFloat(engine.ver); 
    } 
 
    //检测浏览器 
    browser.ie =engine.ie; 
    browser.opera = engine.opera; 
 
    var p = navigator.platform; 
    system.win = p.indexOf("Win")==0; 
    system.mac = p.indexOf("Mac")==0; 
    system.x11 = (p=="x11")||p.indexOf("Linux")==0; 
 
 
    if(system.win){ 
        if(/Win(?:dow)?([^do]{2}\s?(\d+\.\d+)?/.test(ua)){ 
             if(RegExp["$1"]=="NT"){ 
                 switch(RegExp["$2"]){ 
                    case "5.0" : 
                        system.win = "2000"; 
                        break; 
                    case "5.1" : 
                        system.win = "xp"; 
                    case "6.0" : 
                        system.win = "Vista"; 
                        break; 
                    case "6.1" : 
                        system.win = "7"; 
                        break; 
                    default : 
                        system.win ="NT"; 
                        break; 
                 } 
             }else if(RegExp["$1"]=="9x"){ 
                system.win = "ME"; 
             }else{ 
                system.win = RegExp["$1"]; 
             } 
        } 
    } 
 
 
    //移动设备 
    system.iphone = ua.indexOf("iPhone")>-1; 
    system.ipod = ua.indexOf("iPod")>-1; 
    system.ipad = ua.indexOf("iPad")>-1; 
    system.nokiaN = ua.indexOf("nokiaN")>-1; 
 
    //win Mobile 
    if(system.win == "CE"){ 
        system.winMobile = system.win; 
    }else if(system.win = "Ph"){ 
        if(/Windows Phone OS (\d+\_\d+)/.test(ua)){ 
            system.win = "Phone"; 
            system.winMobile parseFloat(RegExp["$1"]); 
        } 
    } 
 
    //检测ios版本 
    // 
    if(system.mac && ua.indexOf("Mobile")>-1){ 
         if(/CPU (?:iPhone)?OS (\d+\_\d+)/.test(ua){ 
             system.ios = parseFloat(RexExp.$1.replace("_","."));        
         }else { 
             system.ios = 2 ;//不能真正检查出来，所以猜测出来一个结果 
         } 
    } 
 
 
    //检查安卓版本 
    // 
    if(/Android (\d+/_\d+)/.test(ua)){ 
        system.andriod = parseFloat(RegExp.$1); 
    } 
 
    //游戏系统 
 
    system.wii = us.indexOf("Wii")>-1; 
    system.ps = /playstation/i.test(ua); 
 
    //返回对象 
    return { 
        engine : engine, 
        browser : browser, 
        system : system 
    } 
 
}
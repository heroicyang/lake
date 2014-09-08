function checkMobile(){  
    var isiPad = navigator.userAgent.match(/iPad/i) != null;  
    if(isiPad){  
        return false;  
    }  
    var isMobile=navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|x11|java|opera mobi|opera mini|ucweb|windows ce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i)!= null;  
    if(isMobile){  
        return true;  
    }  
    return false;  
}  
function _getCookie(cname){  
    var cookieStr = document.cookie.match("(?:^|;)\\s*" + cname + "=([^;]*)");  
    return cookieStr ? unescape(cookieStr[1]) : "";  
}  
var URL_MAP = [  
    ["shenghuo/", "wap/shenghuo/"],  
    ["jiankang/", "wap/jiankang/"],  
    ["yangsheng/", "wap/yangsheng/"],  
    ["diannao/", "wap/diannao/"],  
    ["yinshi/", "wap/yinshi/"],  
    ["baike/", "wap/baike/"]  
];  
function _getCookie(cname){  
  var cookieStr = document.cookie.match("(?:^|;)\\s*" + cname + "=([^;]*)");  
  return cookieStr ? unescape(cookieStr[1]) : "";  
}  
(function(){  
    if(checkMobile()){  
        if( _getCookie("visitWWW")!=="visited" ){  
            var thisHost = "http://"+location.hostname;  
            var thisHREF = document.URL, request_uri = thisHREF.substr(thisHost.length+1), reg;  
 
            if(thisHREF=="http://www.life134.com"||thisHREF=="http://www.life134.com/"||thisHREF=="http://life134.com/"){  
                window.location.href="http://www.life134.com/wap/";  
            }else{  
                for(var i=0; i<URL_MAP.length-1; i++){  
                    reg = new RegExp("^" + URL_MAP[i][0], "i");  
 
                    console.log(reg.test(request_uri))  
                    if(reg.test(request_uri)){  
                        request_uri = request_uri.replace(URL_MAP[i][0], URL_MAP[i][1]);  
                        window.location.href = "http://www.life134.com/wap/" + request_uri;  
                    }  
                }  
            }             
        }  
    }  
})(); 
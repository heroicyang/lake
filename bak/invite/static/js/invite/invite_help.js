//==========[[zepto layer插件]]============//
(function($,root){

    //框架类
	var bone={

        /*
        *AJAX
        *每发一个ajax请求 ajaxstore里push(1) 
        *请求返回后 ajaxstore里shift()一个元素
        *返回后如果 ajaxstore里是空的 取消遮罩
        */
        //存储发送的ajax请求
        '_ajaxStore':[],
        "ajax":function(opts,cusOpts){
            var self=this;
            var cusOpts= _.extend({
                "keepLoading":false  //是否保持loading遮罩
            },cusOpts||{});
            
            var beforeSend=opts.beforeSend,
                complete=opts.complete;

            var type=cusOpts.type;

            //请求发送前 将请求存入ajaxstore
            opts.beforeSend=function(){
                self._ajaxStore.push(1);
                self.showGlobalLoading();
                return beforeSend&&beforeSend.apply(this,arguments);
            }
            opts.complete=function(){
                self._ajaxStore.shift();
                if(!cusOpts.keepLoading && self._ajaxStore.length==0){
                    self.hideGlobalLoading();
                }
                return complete&&complete.apply(this,arguments);
            }
            return $.ajax(opts);
        },

        /*
        *loading遮罩 请求发送时显示
        *globalloading 仅有一个 调用多次也仅有一个 当隐藏时也全部隐藏
        */
        "loadingTemplate":"<div class='s-global-loading'><div class='-loading-content'><p>请稍候...</p></div></div>",
        //显示全局遮罩 如果已经存在则返回
        "showGlobalLoading":function(){
            var $loading=$('.s-global-loading');
            if($loading.length==0){
                $loading=$(this.loadingTemplate);
                $('body').append($loading);
            }
            $loading.show();
        },
        //隐藏全局遮罩
        "hideGlobalLoading":function(){
            $('.s-global-loading').remove();
        },

        /*
        *全局mask遮罩 
        */
        "maskTemplate":"<div class='s-global-mask'></div>",
        //显示全局mask
        "showGlobalMask":function(){
            var $mask=$('.s-global-mask');
            if($mask.length==0){
                $mask=$(this.maskTemplate);
                $('body').append($mask);
            }
            $mask.show();
        },
        //隐藏全局mask
        "hideGlobalMask":function(){
            $('.s-global-mask').remove();
        },
        
        /*
        *alert 弹窗
        */
        "alertTemplate":'<div class="s-alert"><div class="s-alert-close"></div><div class="s-alert-content"></div><div class="s-alert-button"><span>确认</span></div><style>body{overflow:hidden}</style></div>',
        "alert":function(text){
            var self=this;
            var $alert=$(this.alertTemplate);
            var $content=$alert.find('.s-alert-content').text(text);
            var $btn=$alert.find('.s-alert-button span');
            var $close=$alert.find('.s-alert-close');

            self.showGlobalMask();
            $('body').append($alert);

            function melt(){
                self.hideGlobalMask();
                $alert.remove();
            }
            $btn.on('click',melt);
            $close.on('click',melt);
        }
    }
    
    //工具类
    var util={
        //判断是否是手机浏览器访问的
        "isMobile":function(){
            var ua=navigator.userAgent;

            var isMMobile=/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/i.test(ua);
            var isMobile=/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua);
            var isAndroidPad=/Macintosh/i.test(ua);
            return ((isMobile&&!isAndroidPad)||isMMobile);
        }
    }

    root.ava=root.ava||{};
    root.ava.bone=bone;
    root.ava.util=util;
})(window.jQuery||window.Zepto,window);

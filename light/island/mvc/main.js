/**
 * Setting
 */

define(function (require, exports, module) {
    var tpl = require('./settings.html');
    var warpEl = $('.content-set');
  
    var Setting=function(){
        this._init_.apply(this,arguments);
    }
    Setting.prototype={
        el:'<div>',
        template:_.template(tpl),
        
        model:{
            defaultData:{
                name:'设置信息'
            } 
        },
        //初始化函数
        _init_:function(wrap){
            this.wrap=$(wrap);
            this.$el=$(this.el);
            this.render();
        },
        //绑定事件
        _bindEvent:function(){
            var self=this;
            var $el=this.$el;
            /*
            $('.setting-changepwd',$el).on('click',function(){
                self.destory();
            })
            */
        },
        //渲染
        render:function(){
            var text=this.template(this.model.defaultData);
            this.$el.html(text);
            this._bindEvent();
        },
        //页面出现
        show:function(){
            var $dom=this.$el;
            this.wrap.empty().html($dom);
        },
        //页面销毁
        destory:function(){
            this.wrap.empty();
            //清除和dom的链接 消除对象
            delete this.wrap;
        }
    }

    exports.init = function () {
       var setting=new Setting(warpEl);
       setting.show();
    };
});




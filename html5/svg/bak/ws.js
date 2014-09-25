/**********
 * chart demo页
 **********/
define(function(require, exports, module) {

    var Widget = require("widget");
    var viewString = require("tpls/ligd/ws.html");
	
    var Ws=Widget.extend({
        //初始化属性
        attrs:{
            a:1,
            b:2,
            c:3,
            //dom模板
            template:viewString,
            //需要插入的父元素窗口
            parentNode:null
        },
        events:{
            'click .ms-a':'msa',
            'click .ms-b':'msb',
            'click .ms-c':'msc'
        },

        /*
        *初始化
        */
        initialize:function(){
            //父类初始化函数 会进行一系列初始化操作
            Ws.superclass.initialize.apply(this,arguments);
            //A  初始化属性
            //this.initAttrs()
            //B 模板生产dom 赋值给this.element
            //this.parseElement()
            //C initProps
            //this.initProps()
            //D 事件代理 将事件代理到this.element上
            //this.delegateEvents()
            //E setup
            //this.setup()
        },
        //初始化属性
        initProps:function(){
            
        },
        //初始化最后一步
        setup:function(){
            this.render();
        },

        /*
        *将view加到window中
        */
        render:function(){
            Ws.superclass.render.apply(this,arguments);
            return this;
        },

        _onChangeA:function(e){
            console.log(e);
        },
        _onChangeB:function(e){
            console.log(e);
        },
        _onChangeC:function(e){
            console.log(e);
        },

        _onRenderA:function(e){
            console.log(e);
        },
        _onRenderB:function(e){
            console.log(e);
        },
        _onRenderC:function(e){
            console.log(e);
        },

        msa:function(){
            var a=this.get('a');
            this.set('a',a+1);
        },
        msb:function(){
            var b=this.get('b');
            this.set('b',b+1);
        },
        msc:function(){
            var c=this.get('c');
            this.set('c',c+1);
        },

        /*
        *消散
        */
        destory:function(){
            return Ws.superclass.destory.apply(this,arguments);
        }

    });
    
    module.exports=Ws;
});   

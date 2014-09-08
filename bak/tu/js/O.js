/*
*O 
*实现基本的类继承 事件处理
*/
(function(root){
    /**
    * 基类
    * Base
    */
    
    var ARRAY=[];

    function Class(){
    }
    //实现继承
    Class.extend=function(protoAttr,staticAttr){

        var Parent=this;
        var Child;

        /*
        *如果传入的protoAttr含有constructor 
        *则将构造函数变为protoAttr.constructor
        */
        if(protoAttr && _.has(protoAttr,'constructor')){
            Child=protoAttr.constructor;
        }else{
            Child=function(){this._init_.apply(this,arguments);};
        }

        /*
        *将Child.prototype的__proto__指向Parent.prototype
        *将Child.prototype的constructor指向Child自己
        */
        var Surrogate=function(){ this.constructor=Child};
        Surrogate.prototype=Parent.prototype;

        Child.prototype=new Surrogate;


        /*
        *继承父类的静态函数
        */
        _.extend(Child,Parent,staticAttr);

        if(protoAttr){_.extend(Child.prototype,protoAttr);};
        
        //child的超类指向parent.prototype
        Child.__super__=Parent.prototype;
        
        return Child;
    }
    //基类原型
    Class.prototype={
       /*
       *倘若子类都没有_init_函数
       *便会执行这个函数
       */
       _init_:function(attrs){
            this.attrs=attrs;
       },

       //调用数组对象的slice
       slice:ARRAY.slice

    }
    /**
    * 事件类
    * Event
    */
    var Event=Class.extend({
        //注册事件
        'on':function(name,callback,context){
            var self=this;

            //如果没有传入事件函数 返回调用对象方便链式调用
            if(!callback) return self;
            self._events || (self._events={});

            var events=self._events[name] || (self._events[name]=[]);
            events.push({callback:callback,context:context,ctx:context || self});
            return self;
        },
        //只触发一次事件
        'once':function(events,callback,context){
            var self=this;

            return self;
        },
        //off 注销事件
        'off':function(events,callback,context){
            var self=this;

            return self;
        },
        //trigger 触发事件
        'trigger':function(name){
            var self=this;
            if(!self._events) return self;

            var args=self.slice.call(arguments,1);

            var events=self._events[name];
            var allEvents=self._events['all'];
            if(events) self._triggerEvents(events,args);
            if(allEvents) self._triggerEvents(allEvents,arguments);

            return self;
        },
        //触发事件调用函数
        '_triggerEvents':function(events,args){
            console.log('hi i am triggerEvents');
        },
        /*
        *
        */
        '_eventsApi':function(obj,action,name,rest){
            if(!name) return true;

            if(typeof name === 'object'){
                for(var key in name){
                    obj[action].apply(obj,[key,name[key]].concat(rest));
                }
                return false;
            }

            return true;
        }
    })
    
    
    var O=root.O={}
    O.Class=Class;
    O.Event=Event;

})(window)

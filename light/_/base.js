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
var LISTEN_ID=0;
var Event=Class.extend({

    /**
    *注册事件
    *事件可以接受参数 若事件为all 第一个参数为原事件name
    *on('event',function(arg0,arg1,arg2){})
    *on('all',function(name,arg1,arg2){})
    *话说events中第二个键值context有什么用
    */
    'on':function(name,callback,context){
        var self=this;

        //如果没有传入事件函数 返回调用对象方便链式调用
        if(!callback) return self;
        self._events || (self._events={});

        var events=self._events[name] || (self._events[name]=[]);

        //ctx参数 作用域如果没传默认指向自己 
        events.push({callback:callback,context:context,ctx:context || self});
        return self;
    },

    //只触发一次事件
    'once':function(name,callback,context){
        var self=this;
        var oncefunc=function(){
            callback.apply(this,arguments);
            self.off(name,oncefunc,context);
        }
        self.on(name,oncefunc,context);
        return self;
    },

    /**
    *listento 事件
    *倾听别处的事件
    */
    'listenTo':function(obj,name,callback){
        var self=this;

        var listeningTo=self._listeningTo || (self._listeningTo={});
        var id=obj._listenId || ( obj._listenId=(LISTEN_ID++).toString() );

        listeningTo[id]=obj;

        obj.on(name,callback,self);
        return self;
    },

    /**
    *listentoonce
    */
    'listenToOnce':function(obj,name,callback){
        var self=this;

        var listeningTo=self._listeningTo || (self._listeningTo={});
        var id=obj._listenId || ( obj._listenId=(LISTEN_ID++).toString() );

        listeningTo[id]=obj;

        obj.once(name,callback,self);
        return self;
    },

    /**
    *off 注销事件
    */
    'off':function(name,callback,context){
        var self=this;
        var names;

        if(!self._events) return self;
        if(!name && !callback && !context){
            self._events=null;
            return self;
        }

        //names存储注销事件的键值 如果参数为空 则取全部键值
        names=name ? [name] : _.keys(self._events);
        
        /*
        *先把相应事件队列清空
        *然后 判断 不在排除条件的 push入队列
        *经过遍历后 如果队列为空 则直接删除此键值
        *如果是在trigger event 执行事件队列的时候 off某一个event不会立即生效
        *因为 off的时候 是生成一个新的事件队列
        *而trigger函数中 使用的依然是原有事件队列 当再次触发时便会执行新的事件队列
        */
        var i,k;
        var events;
        for(i=0;i<names.length;i++){
            name=names[i];
            if (events = self._events[name]) {
                  self._events[name] = retain = [];
                  if (callback || context) {
                    for (k = 0; k < events.length; k++) {
                      ev = events[k];
                      if ( (callback && callback !== ev.callback) || (context && context !== ev.context) ) {
                        retain.push(ev);
                      }
                    }
                  }
                  if (!retain.length) delete self._events[name];
            }
        }

        return self;
    },
    stopListening: function(obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var remove = !name && !callback;
        if (!callback && typeof name === 'object') callback = this;
        if (obj) (listeningTo = {})[obj._listenId] = obj;
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
        }
        return this;
    },

    /**
    *trigger 触发事件
    *如果事件库里有all
    *同时会触发all库里的事件
    */
    'trigger':function(name){
        var self=this;
        if(!self._events) return self;

        var args=self.slice.call(arguments,1);
        //若事件库里有all选项
        //则需要给all callback的第一个参数传name
        //其他的则无需name
        var events=self._events[name];
        var allEvents=self._events['all'];
        if(events) self._triggerEvents(events,args);
        if(allEvents) self._triggerEvents(allEvents,arguments);

        return self;
    },

    /**
    *触发事件调用函数
    *events为事件函数数组库
    *call的性能比apply强 超过三个参数调用apply 三个参数或三个参数以下调用call
    */
    '_triggerEvents':function(events,args){
        var ev,i=-1,l=events.length,a1=args[0],a2=args[1],a3=args[2];
        switch(args.length){
            case 0:
                while(++i < l){ 
                    ev=events[i];
                    ev.callback.call(ev.ctx);
                }
                return; 
            case 1:while(++i < l){ ev=events[i];ev.callback.call(ev.ctx, a1);}return; 
            case 2:while(++i < l){ ev=events[i];ev.callback.call(ev.ctx,a1,a2);}return; 
            case 3:while(++i < l){ ev=events[i];ev.callback.call(ev.ctx,a1,a2,a3);}return; 
            default:while(++i < l){ ev=events[i];ev.callback.apply(ev.ctx,args);}return;
        }
    }
})




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
* 未解决问题 _listenId的回收问题 _listeningTo[id]的回收问题
*/
var LISTEN_ID=0;
var Event=Class.extend({

    /**
    *注册事件
    *事件对象存储函数对象和环境(默认为self)
    */
    'on':function(name,callback,context){
        var self=this;

        //如果没有传入事件函数 返回调用对象方便链式调用
        if(!callback) return self;
        self._events || (self._events={});

        var events=self._events[name] || (self._events[name]=[]);

        //context参数默认为self 
        events.push({callback:callback,context:context || self});
        return self;
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

        var i=0,
            ev,
            events=self._events[name],
            allEvents=self._events['all'];

        if(events){
            for(i=0;i<events.length;i++){
                ev=events[i];
                ev.callback.apply(ev.context,args);
            }
        }
        /**
        *allevents
        *第一个参数需要获取 事件名
        */
        if(allEvents){
            for(i=0;i<allEvents.length;i++){
                ev=allEvents[i];
                ev.callback.apply(ev.context,arguments);
            }
        }

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
    /*
    *只触发一次事件
    */
    'once':function(name,callback,context){
        var self=this;
        var oncefunc=function(){
            callback.apply(this,arguments);
            self.off(name,oncefunc,context);
        }
        self.on(name,oncefunc,context);
        return self;
    },
    /*
    *listento 事件
    *倾听别处的事件
    *将事件压入倾听对象的事件队列 
    */
    'listenTo':function(obj,name,callback){
        var self=this;

        var listeningTo=self._listeningTo || (self._listeningTo={});
        var id=obj._listenId || ( obj._listenId=(LISTEN_ID++).toString() );

        listeningTo[id]=obj;

        obj.on(name,callback,self);
        return self;
    },

    /*
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
    /*
    *会清除掉 倾听对象上挂载的相应事件队列函数
    *如果 obj为空 则清除掉 所有倾听队列上的对象
    *如果只传obj参数 清除obj相应函数后 同时删除listeningTo[id]
    */
    stopListening: function(obj, name, callback) {
        var self=this;
        if(!self._listeningTo) return self;

        //获取倾听对象列表
        //如果obj为空 则取全部倾听对象队列
        var listenArray;
        if(obj && obj._listenId){
            listenArray={};
            listenArray[obj._listenId]=obj;
        }else{
            listenArray=self._listeningTo;
        }

        //清除相应队列上的事件函数
        var id,
            listenObj;
        for(id in listenArray){
            listenObj=listenArray[id];
            listenObj.off(name,callback,self);
            if(!name && !callback) delete self._listeningTo[id];
        }
        return self;
    }
})




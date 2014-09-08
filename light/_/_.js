(function(root){

  var _={};

  _.VERSION='0.00';
  
  //=========================[[判断类函数]]======================
  
  var emptyArray=[],
      slice=emptyArray.slice;
  var class2type={};

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  };
  function isFunction(value) { return type(value) == "function" }
  //function isWindow(obj)     { return obj != null && obj == obj.window }
  //function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) /*&& !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype*/
  }
  function likeArray(obj) { return typeof obj.length == 'number' }
  function isArray(obj){
    return obj instanceof Array;
  }
  
  //=========================[[正式函数]]========================


  
  //================[深度复制 浅复制]===============
  function extend(target,source,deep){
  	for(key in source){
  		if(deep && (isPlainObject(source[key]) || isArray(source[key])) ){
        console.log('do');
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
  		}else if(source[key]!==undefined){
        target[key]=source[key]
        console.log(source[key]);
  		}
  	}
  };
  
  _.extend=function(target){
    var deep,
        args=slice.call(arguments,1);
    if(typeof target=='boolean'){
      deep=target;
      target=args.shift();
    }
    args.forEach(function(arg){
      extend(target,arg,deep)
    })
    return target
  };
  
  //克隆一个Object或一个Array
  _.clone=function(obj){
    var wave;
    if(isArray(obj)){
      console.log('isArray');
      wave=_.extend(true,[],obj);
    }else if(isObject(obj)){
      console.log('isObject');
      wave=_.extend(true,{},obj);
    }
    return wave;
  }

  //=================[判断两个object不同]============
  //判断object是否含有key键值

  //判断两个object是否相同

  //比较两个object间的不同
  function diffrence(target,source,deep){
    for(key in target){
      if(target[key]!==source[key]){
        console.log(key);
      }
    }
  };
  _.diffrence=function(){

  };
  /*
  var a=[];
  var c=[2,[1,2]]
  
  //判断isobject相关函数出错
  console.log(type(c[0]))
  */
  //===================[将一个数组去重]=======================
  //===================[将一个数字数组按从小到大排序]=========

  //=================================================[[字符串类函数]]===========================

  //序列化数字
  _.numberFormat=function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
  }

  console.log(_.numberFormat(123456789,2,'*','#'));

})(this)

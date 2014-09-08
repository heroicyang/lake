var func=function( ){
  return function(){
	  return function(){
			return function(){
		        console.log('hello world');
		    }
	  }
  }
};
func()()()();
var fun=function(){
  return function(){
	  return function(){
			return function(){
		        return "hello world";
		    }
	  }
  }
};

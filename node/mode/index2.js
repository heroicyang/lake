function HumanCloning(){ 
} 
HumanCloning.prototype ={ 
name:'笨蛋的座右铭' 
} 
var clone01 = new HumanCloning(); 
console.log(clone01.name);//'笨蛋的座右铭'
console.log(clone01.constructor); 
HumanCloning.prototype={};
var clone02=new HumanCloning();
console.log(clone02.constructor);

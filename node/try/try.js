function anonymous(obj,_
/**/) {
var __t,
	__p='',
	__j=Array.prototype.join,
	print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
	__p+='hello: '+
	((__t=( name ))==null?'':__t)+
	'';
}
return __p;

}

console.log(anonymous({name:'hi node'}));

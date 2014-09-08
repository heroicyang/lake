if(typeof Object.beget !=='function'){
          Object.beget=function(o){
		  var F=function(){};
		  F.prototype=o;
		  return new F();
		}
};
function Bird(name){
   this.name=name;
}
Bird.prototype={
  constructor:Bird,
  fly:function(){
  console.log('haha i am '+this.name+'  i am fly')
  }
}
function Bluebird(name,color){
    this.name=name;
  this.color=color;
}
Bluebird.prototype=Object.beget(Bird.prototype);
var liyue=new Bluebird('liyue','blue');
liyue.fly();

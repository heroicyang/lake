function Person(name){
  this.name=name;
  this.age=23;
}
Person.prototype={
    hh:'hello world'
}
var zhang=new Person('persa');
console.log(zhang.hasOwnProperty('name'));
console.log(zhang.hasOwnProperty('age'));
console.log(zhang.hasOwnProperty('hh'));

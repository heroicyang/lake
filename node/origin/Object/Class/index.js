function Person(name, sex) {
     this.name = name;
     this.sex = sex;
 }
 // 定义Person的原型，原型中的属性可以被自定义对象引用
Person.prototype = {
     getName: function() {
         return this.name;
     },
     getSex: function() {
         return this.sex;
     }
}
 var zhang = new Person("ZhangSan", "man");
     console.log(zhang.getName()); // "ZhangSan"
 var chun = new Person("ChunHua", "woman");
     console.log(chun.getName()); // "ChunHua"

var a={}
var b={}
a.name='hello world!';
b.name='hi world!';
b.a=a;
a.b=b;
console.log('a.name:'+'  '+a.name);
console.log('b.name:'+'  '+b.name);
console.log('a.b.name:'+'  '+a.b.name);
console.log('b.a.name:'+'  '+b.a.name);
console.log('a.b.a.name:'+'  '+a.b.a.name);
console.log('b.a.b.name:'+'  '+b.a.b.name);


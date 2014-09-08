var arr=[ ['a','b','c','d'],
          'zero',
          'one',
          'two',
          'three'
	       ]
arr.say=function(){
  console.log('hello world!');
}
arr.wave=function(){
  console.log(this[0]);
}
arr.wave()
console.log(arr);


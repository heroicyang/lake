var x=0;
 
function fly(){
 	console.log(x);
 	x=x+1;
};

 var id=setInterval(fly,500);
 console.log('hello world!');
 function off(){
   clearInterval(id);
 };

var arr=[
    'zero',
    'one',
    'two',
    'three',
    function(){
    	var  name=this[2];
	    console.log(name);
	}
];
arr[4]();

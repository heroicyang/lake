function blue(arr,arrf){
 	for(x in arr){
 		arrf(arr[x]);
 	}
 }
 var lis=['hello','underscore','hi','backbone','wao','nodejs','weiwei','js']
 
 blue(lis,function(dat){
 	console.log(dat);
 })


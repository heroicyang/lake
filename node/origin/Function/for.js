function breakk(arr){
	for(var i=0;i<arr.length;i++){
		//if(arr[i]==0) break;
		if(arr[i]==0) continue;
		console.log(arr[i]);
	}
	console.log('wa we ');
}
breakk([1,2,3,4,5,6,7,8,9,0,1,2,3,4])

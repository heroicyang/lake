(function(){
	var initwidth=1080;
	/*================
	设备      真实像素 
	浏览器    真实像素
	viewport  虚拟像素 
	==================*/
	var viewPixel=devicePixelRatio || 1;  					//屏幕像素和真实物理像素比值
	//var initscale=(screen.width*viewPixel/initwidth).toFixed(2); 
	var targetDensitydpi = initwidth / screen.width * viewPixel * 160;
	
	var metastr='<meta name="viewport" content="width='+initwidth+',target-densitydpi='+targetDensitydpi+'">';
	
	//如果是iphone 不加target-densitydpi
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		metastr='<meta name="viewport" content="width='+initwidth+'">';
    }
	
	metastr=unescape(escape(metastr));
	document.write(metastr);
})()

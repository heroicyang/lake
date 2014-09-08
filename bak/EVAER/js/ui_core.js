/*==============
================*/
(function($) {
	var UI=$.UI || {};
	
	UI.version='0.0.0';

	UI.Utils={};

	//将字符串转换为Object
	UI.Utils.options=function(string){
		
		//若string是个object则直接返回string
		if ($.isPlainObject(string)) return string;
		
		//
        var start = (string ? string.indexOf("{") : -1), 
        	options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
	}

	$.UI=UI;
})(window.jQuery);

console.log('QQ');
console.log('847561457');
console.log('邮箱');
console.log('847561457@qq.com');

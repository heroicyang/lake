(function($){
	var Titan=function(ele,opts){
		this.opts=$.extent({},Titan.DEFAULTS,opts)
		this.$window=$(window)
		this.se=$(ele);
	}
	Titan.DEFAULTS={
		offset:0
	}
	Titan.prototype={
		
	}
})(jQuery);
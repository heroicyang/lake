(function($) {       
$.fn.ale = function() {
			  //获取当前对象     
			  var spirit=this;
			  //获得元素距离顶部的距离
			  var stop=this.offset().top;
			  //绑定滚动函数
			  $(document).scroll(function(){
				 if(document.body.scrollTop>=stop){
				   spirit.css({position:"fixed"});
				   }
				 else{
				   spirit.css({position:"static"});
				  }
				});   
          }
})(jQuery); 
(function($) {       
$.fn.ale = function() {
			  //��ȡ��ǰ����     
			  var spirit=this;
			  //���Ԫ�ؾ��붥���ľ���
			  var stop=this.offset().top;
			  //�󶨹�������
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
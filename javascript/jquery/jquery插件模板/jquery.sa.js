/*
�����д�淶

   1 jquery�������ǰ�ӡ�$��
   2 ʹ��bind�����¼�
   3 ˽�б��� ���� ��_��ͷ
   4 ����ע��
		{
		input �������
		energ �ڲ�����
		}

*/

/******
�������
******/
(function($){
    $.fn.saname= function(options){
        /*��������*/   
	   var _opts = $.extend({}, $.fn.saname.defaults, options);
       return this.each(function(){
	   $this = $(this);
        //������д�������
        });    
    }
	/***
	Ĭ�ϲ�������
	***/
	$.fn.saname.defaults = {
	
	};	 
})(jQuery);
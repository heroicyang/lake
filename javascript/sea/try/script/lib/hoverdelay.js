/*-------------------------------------------------
 鼠标滑过事件插件
 这个插件的作用是改变鼠标hover效果
 只有用户的鼠标hover后停留足够的时间
 才能触发hover效果
 而且鼠标滑入一定的像素值才能触发效果
 和jquery hover事件用法一样

 $('target').hoverdelay({over: functionA
	                     out:  functionB
	                   });
 或者
 $('target').hoverdelay(functionA,functionB);

 f  鼠标滑入事件函数
 g  鼠标滑出事件函数
-----------------------------------------------------*/
define(function(require){
	var $=require('jquery');
	/*=================================
          主函数 element：元素 opts:参数
       =================================*/
	function main(element, opts) {
		var Athis = $(element); //获取单个jquery对象
		var cX, //鼠标移动时的x坐标 每次移动时都会更新  
		cY, //鼠标移动时的y坐标 每次移动时都会更新
		pX, //鼠标滑入时的x坐标 仅在再次滑入时更新
		pY; //鼠标滑入时的y坐标 仅在再次滑入时更新
		var _ani_ = 0; //这是一个状态值 默认为0 当滑入事件函数执行时为1 滑出事件执行后清0
		//设定这个状态值防止 滑入函数未执行时就执行滑出函数

		var oto; //计时器的指针

		// 根据传入的event 设置cX cY

		function _track(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		/*---------------------
	         鼠标滑入时执行的函数
			----------------------*/
		function _compare(ev, Athis) {
			oto = clearTimeout(oto);
			// _compare mouse positions to see if they've crossed the threshold
			if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < opts.sensitivity) {
				$(Athis).unbind("mousemove", _track);
				_ani_ = 1;
				return opts.over.apply(Athis, [ev]); //调用鼠标滑入函数(apply方法)
			} else {
				pX = cX;
				pY = cY
				oto = setTimeout(function() {
					_compare(ev, Athis);
				}, opts.interval);
			}
		};

		/*---------------------
	         鼠标滑出时执行的函数
			------------------------*/
		function _delay(ev, Athis) {
			_ani_ = 0;
			return opts.out.apply(Athis, [ev]); //调用鼠标滑出函数(apply方法)
		};

		/*------------------------
			  fly主函数
			  根据事件类型调用不同函数
			 -------------------------*/
		function _fly(e) {
			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({}, e);
			var Athis = this;

			// 清除计时器 比如说鼠标滑入后马上滑出 则清除计时器 防止滑入事件发生
			if (oto) {
				oto = clearTimeout(oto);
			}

			// 判断如果事件是鼠标进入
			if (e.type == "mouseenter") {
				pX = ev.pageX;
				pY = ev.pageY; //设置鼠标滑入时的x y坐标
				$(Athis).bind("mousemove", _track); //设置鼠标移动时的实时x y 坐标
				if (_ani_ != 1) {
					oto = setTimeout(

					function() {
						_compare(ev, Athis);
					},
					opts.interval);
				}

				//判断如果事件是鼠标离开
			} else {
				$(Athis).unbind("mousemove", _track); //解除鼠标移动绑定
				// if hover_delay state is true, then call the mouseOut function after the specified _delay
				if (_ani_ == 1) {
					oto = setTimeout(function() {
						_delay(ev, Athis);
					}, opts.timeout);
				}
			}
		};

		/*-------绑定事件--------*/
		Athis.on('mouseenter', _fly).on('mouseleave', _fly);

	}
	/*===================
       声明原型函数
    ==================*/
	$.fn.hoverdelay = function(f, g) {
		//设置默认参数 若仅传入一个参数 则当做对象 若传入两个参数则分别
		//当做滑入事件函数 和 滑出事件函数
		var opts = $.extend({}, $.fn.hoverdelay.opts, g ? {
			over: f,
			out: g
		} : f);
		this.each(function() {
			main(this, opts)
		}); //给每个对象调用main函数
		return this; //返回调用对象
	}

	/*=============
	   默认参数
	===============*/
	$.fn.hoverdelay.opts = {
		sensitivity: 7, //鼠标滑入内部多少像素后触发效果
		interval: 40, //鼠标滑入内部多长时间后触发效果
		timeout: 40 //鼠标滑出内部多长时间后触发效果             
	}
})

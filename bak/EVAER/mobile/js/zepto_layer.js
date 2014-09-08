//==========[[zepto layer插件]]============//
(function($,document,undefined){
  
	var Layer=function(){
		this._init_.apply(this,arguments);
	}
	Layer.prototype={
		//初始化小窗口
		_init_:function(opts){
			opts=opts || {};
			var width=opts.width || 600;

			this.$el=$(this.template);
			this.$content=this.$el.find('.layer-content');
			this.$content.css('width',width);

			if(opts.content){
				this.$content.html(opts.content);
			}

			this.addEvents();
			this._isInwin_=false;
		},

		//将小窗口显示在主窗口中
		show:function(){
			if(!this._isInwin_){
				$('body').append(this.$el);
				this._isInwin_=true;
			}else{
				this.$el.show();
			}
		},

		//将各事件均注册到小窗口顶级元素上
		addEvents:function(){
			var that=this;
			that.$el.on('click',function(e){
				if(e.target==that.$el[0]){
					that.hide();
				}
			})
			//that.$el.on('event','selector',callback);
		},
		hide:function(){
			this.$el.hide();
		},
		//模板
		template:'<div id="layer" class="layer-wrapper"><div class="layer-content"><div><h1>hello world</h1></div></div><style>body{overflow:hidden}#layer{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1020;background:rgba(0, 0, 0, 0.6);}#layer .layer-content{overflow:hidden;margin-top:100px;padding: 10px;margin-left:auto;margin-right: auto;background: #ffffff;border-radius:4px;}</style></div>',
		
		//将小窗口在主窗口中移除
		destory:function(){
			this.$el.remove();
		}
	}

	$.Layer=Layer;
})(window.jQuery||window.Zepto,document);

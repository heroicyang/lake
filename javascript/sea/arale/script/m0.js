define(function(require,exports,module){
	
	var Base=require('./base');	
	var $=require('jQuery');
	//======================[[event相关]]=====================//

	//======================[[attr相关]]======================//
	var Panel=Base.extend({
		attrs:{
			x:{
				value:11,
				getter:function(val,key){
					return val+1;
				},
				setter:function(val){
					this.set('x',val);
				}
			},
			y:{value:22},
			size:{
				width:100,
				height:100
			}
		},
		initialize:function(attrs){
			Panel.superclass.initialize.call(this,attrs);
		},
		Statics:{
			a:1,
			b:2,
			c:3
		}
	})

	var Lp=Base.extend({
		initialize:function(){
			console.log('i am Lp initialize');
		}
	})
	var Mllp=Lp.extend({
		initialize:function(){
			Mllp.superclass.initialize.apply(this);
			console.log('i am Mllp initialize');
		},
		shaer:function(){
		}
	})
	
	var a=new Base();
	a.on('ea',function(data){
		console.log('this is eventa');
		console.log(data);
	})
	a.on('all',function(data,data2){
		console.log('this is eventall');
		console.log(data);
		console.log(data2);
	})
	$('.eventa').click(function(){a.trigger('ea',{'name':'eventa'})});
	$('.eventall').click(function(){a.trigger('all',{'name':'eventall'})});
	//var panel=new Panel({a:{na:11,nb:22},b:2,c:3});
	//console.log(panel);
	//console.log(panel.get('size'));
	//console.log(panel.set('a'));
});


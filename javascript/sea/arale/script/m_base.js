define(function(require,exports,module){
	
	var Base=require('./base');	
	var $=require('jQuery');
	//======================[[event相关]]=====================//

	//======================[[attr相关]]======================//
	var Panel=Base.extend({
		attrs:{
			x:12,
			y:24,
			xy:{
				getter:function(val,key){
					return this.get('x')+this.get('y');
				},
				setter:function(val,key){
					this.set('x',val[0]);
					this.set('y',val[1]);
				}
			}
		}
	})

	var panel=new Panel({x:10,y:20});
	/*
	console.log(panel.get('xy'));
	panel.set('xy',[11,22]);
	console.log(panel.get('x'));
	console.log(panel.get('y'));
	console.log(panel);
	*/
	panel.on('event',function(){
		console.log('event');
	})
	panel.trigger('event');
});


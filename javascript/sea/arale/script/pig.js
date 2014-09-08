/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 上午8:52
 * To change this template use File | Settings | File Templates.
 */
define(function(require,exports,module){
	var Class=require('./class');

	var Pig=Class.create({
		initialize:function(name){
			this.name=name;
		},
		talk:function(){
			console.log('我是'+this.name);
		}
	});

	module.exports=Pig;
	
});
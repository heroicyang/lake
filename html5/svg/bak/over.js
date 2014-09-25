/**********
 * chart demo页
 **********/
define(function(require, exports, module) {

    var Dialog = require("dialog");
    var overString = require("tpls/ligd/over.html");
	
    var Over=Dialog.extend({
        "attrs":{
			"content":overString,
			"width":455
		},
        initialize:function(){
            Over.superclass.initialize.apply(this,arguments);
            return this;
        },
		setup:function(){
            var result=Over.superclass.setup.apply(this,arguments);
            return this;
        },

		"render": function () {
            var result =Over.superclass.render.apply(this, arguments);
            return this;
        },
        //显示
        "show": function () {
            var result = Over.superclass.show.apply(this, arguments);
            return this;
        },
        //隐藏
        "hide": function () {
            var result =Over.superclass.hide.apply(this, arguments);
            return this;
        },
        "events":{
           'click .overlay-a':'overlay_a'
        },
        'overlay_a':function(){
            console.log('this is overlay-a');
        },
        "destroy":function(){
            var result=Rename.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    
    module.exports=Over;
});   

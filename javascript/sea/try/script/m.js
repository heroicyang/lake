/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 上午8:52
 * To change this template use File | Settings | File Templates.
 */
define(function(require){
    var $=require('jquery');
  	var magica=require('./lib/magic-a');
  	var magicb=require('./lib/magic-b');

  	magica('.magic-a');
  	magicb('.magic-b');
});
/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 上午8:51
 * To change this template use File | Settings | File Templates.
 */
seajs.config({
	//别名配置
    alias:{
        'jQuery':'lib/jquery-1.8.2.js'
    },

    //路径配置
    paths:{

    },

    //路径映射
    map:[],

    //预加载
    preload:[
        //'./script/seajs/seajs-text.js'
    ],

    plugins:['shim']
    
});
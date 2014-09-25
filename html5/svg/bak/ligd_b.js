/**********
 * chart demo页
 **********/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;

    var moment=require("moment");

    //Widget
    var Ws = require("tpls/ligd/ws");
    //Dialog
    var Over=require("tpls/ligd/over");
    
    //提醒
    var Remind = require('modules/fs-createremind/fs-createremind');
    var Todoremind = require('modules/fs-createremind/fs-todoremind');

    //发送工作通知
    var Noticesend = require('modules/app-notice-send/app-notice-send');
	
    exports.init = function() {              
        var tplEl = exports.tplEl,
            tplName = exports.tplName;

        /*
        *测试widget
        *overlay
        */
        var ws=new Ws({'parentNode':tplEl.find('.-module-widget')});
        var over=new Over({'trigger':tplEl.find('#-module-dialog-btn')});

        /*
        *设置提醒
        */
        var remind=new Remind();
        var remindb=new Todoremind();

        /*
        *发送工作通知
        */
        var noticesend=new Noticesend();

        var $remindBtn=tplEl.find('#-module-remind-btn');
        var $feedremindBtn=tplEl.find('#-module-remind-btnb');
        var $todoremindBtn=tplEl.find('#-module-remind-btnc');
        var $noticeBtn=tplEl.find('#-module-notice-btn');

        $remindBtn.click(function(){
            //schedule.showAddDialog(new Date());
            remind.show();
        });
        $feedremindBtn.click(function(){
            remind.show({
                employeeID:123,
                employeeName:'绿箭侠',
                feedID:1113,
                content:'绿箭侠第三季火热推出闪电侠第一季即将推出闪电侠第二季也即将推出第三季也即将推出第四季也即将推出',
                msgType:3
            });
        });
        $todoremindBtn.click(function(){
            remindb.show({"workToDoListID": 123});
        });

        
        $noticeBtn.click(function(){
            noticesend.show();
            noticesend.on('success',function(){
                console.log('success');
            })
            //console.log(noticesend);
        });

    };
});   

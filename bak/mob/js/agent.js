//==========[[zepto layer插件]]============//
(function($,document){
    var bone=ava.bone;

    //===================
    //ie 兼容input事件  监听input change事件
    if(document.all){
        $('input[type="text"]').each(function() {
            var that=this;

            if(this.attachEvent) {
                this.attachEvent('onpropertychange',function(e) {
                    if(e.propertyName!='value') return;
                    $(that).trigger('input');
                });
            }
        })
    }

    var $name=$('.-agent-info-name');
    var $mobile=$('.-agent-info-mobile');

    $('.-agent-info-btn').on('click',function(){

        var name=$name.val();
        var mobile=$mobile.val();
        
        if(name.length>20){
            bone.alert('姓名不得大于20个字符');
            return;
        }else if(name.length==0){
            bone.alert('请填写姓名');
            return;
        }

        if(mobile.length>20){
            bone.alert('手机长度不得大于20个字符');
            return;
        }else if(name.length==0){
            bone.alert('请填写手机号码');
            return;
        }
        
        bone.ajax({
            "type":"post",
            "url":'/Invite/SaveInviteInvestmentInfo',
            "data":{
                "name": $name.val(),
                "mobile":$mobile.val()
            },
            "success":function(responseData){
                if(responseData.success){
                    bone.showTip('发送成功');
                }else{
                    switch(responseData.error){
                        case '001':
                        bone.alert('请填写姓名');
                        break;
                        case '002':
                        bone.alert('请填写手机号码');
                        break;
                        default:
                        bone.alert(responseData.error);
                        break;
                    }
                }
            }
        })
    });

})(window.jQuery||window.Zepto,window.document);

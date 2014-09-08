
//==========[[zepto layer插件]]============//
(function($,document){
    //===================
    
    //ie 兼容input事件  监听input change事件
    if(document.all){
        $('input').each(function() {
            var that=this;

            if(this.attachEvent) {
                this.attachEvent('onpropertychange',function(e) {
                    if(e.propertyName!='value') return;
                    $(that).trigger('input');
                });
            }
        })
    }

    /**
    *动态设置section高度
    */
    (function(){
        //var windowHeight=window.innerHeight;
        var windowHeight=document.documentElement.clientHeight;
        var titleHeight=$('.invite-title').outerHeight();           //title 高度
        var topHeight=$('.-section-head').outerHeight();            //section-head 高度
        var bottomHeight=$('.invite-phone').outerHeight();          //底部电话栏高度
        //console.log(windowHeight);
        //console.log(titleHeight);
        //console.log(topHeight);
        var $sections=$('.invite-section');
        $sections.eq(0).css('height',windowHeight-topHeight-titleHeight);
        $sections.eq(1).css('height',windowHeight-topHeight);
        $sections.eq(2).css('min-height',windowHeight+60);
        $sections.eq(3).css('min-height',windowHeight+60-bottomHeight);
    })();

    /**
    *对于不支持fixed的ios系统 
    *采用absolute方式 将div固定在屏幕上
    */
    (function(){
        //检测移动浏览器是否支持fixed
        var div = document.createElement('div');
        div.style.cssText = 'display:none;position:fixed;z-index:100;';
        document.body.appendChild(div);

        var  supportFixed=(window.getComputedStyle(div).position == 'fixed');
        //如果不支持fixed
        if(!supportFixed){
            var $fixed=$('[data-grid="fixed"]'),
                $body=$('body');

            $fixed.css('position','absolute');
            $(window).on('scroll',function(){
                var top=$body.scrollTop();
                $fixed.css('top',top);
            });
        }

    })();

    //工具对象
    var bone=ava.bone;
    var token=$('#token').val();   //token

    var FROM;
    //===========================测试环境 生产环境转换
    if(location.host=="192.168.10.18" || location.host=="localhost"){
        XK={
            tj:{
                util:{
                    injectStatData:function(){return}
                }
            }
        };
        FROM=0;
    }else{
    
    FROM=$.getParam('from');   //来源
    
    }
    //===========================

    //获取验证短信
    var sectionA={
        phone:null,
        _timehandle:null,
        $inputPhone:$('.-section-input-phone'),
        $inputTip:$('.-invite-in-tip'),
        $btnGetMsg:$('.-section-getmsg'),
        $next:$('[data-order="2"]'),
        $time:$('.-section-getmsg span b'),
        regPhone:/^1[0-9]{10}$/,                 //手机号正则
        init:function(){
            var self=this;
            self.addEvent(); 
        },
        addEvent:function(){
            var self=this;

            self.$inputPhone.on('focusout',function(){self.checkPhone()});
            self.$inputPhone.on('focusin',function(){self.$inputTip.hide()});

            self.$btnGetMsg.on('click',function(){self._send()});
        },
        //检测手机号
        checkPhone:function(){
            var self=this;
            var value=self.$inputPhone.val();
            if(value==''){
                self.$inputTip.text('请输入手机号').show();
                return false;
            }else if(!self.regPhone.test(value)){
                self.$inputTip.text('请输入11位大陆手机号').show();
                return false;
            }else{
                return true;
            }
        },
        //发送信息
        //如果成功 sectionA和sectionB同时开始计时 一般调用计时 都是通过此函数开始
        _send:function(){
            var self=this;
            //未填写正确或按钮为false状态  直接返回
            if(!self.checkPhone() || self.$btnGetMsg.hasClass('u-btn-false')){return};
            var value=self.$inputPhone.val();
            bone.ajax({
                type:'post',
                url:'/Invite/BuildValidateCode',
                data:{
                    'mobile':value,
                    'token':token
                },
                success:function(data){
                    var errormsg;
                    if(data.success){
                        self.phone=value;
                        self._deActive();
                        sectionB.init(value);
                        self._next();
                        
                        XK.tj.util.injectStatData({
            				from:FROM,
            				contact: self.$inputPhone.val(),
                			type:101,
                			action:'fetchcode'
            			});
                        
                    }else{
                        switch(data.error){
                            case '001':
                            errormsg="手机号格式不正确";
                            break;
                            case '004':
                            errormsg="操作过频繁 请稍后再试";
                            break;
                            case '005':
                            errormsg="Token不正确";
                            break;
                            case '006':
                            errormsg="该手机号码已被占用";
                            break;
                            case '007':
                            errormsg="该账号已被占用";
                            break;
                            case '008':
                            errormsg="该手机号已被邀请";
                            break;
                            case '009':
                            errormsg="管理员审核中..";
                            break;
                            case '010':
                            errormsg="管理员已经核准该手机号";
                            break;
                            default:
                            errormsg="服务器不给力 请重试"
                            break;
                        }
                        bone.alert(errormsg);
                        //如果提示是token不正确
                        //刷新页面
                        if(data.error=='005'){
                            window.history.go(0);
                        }
                    }
                },
                error:function(){
                    bone.alert("网络不给力 稍后重试");
                }
            });
        },
        //滑入下一屏
        _next:function(){
            var self=this;
            var top=self.$next.offset().top;
            //window.scrollTo(0,top);
            $('body').animate({'scrollTop':top},400);
        },
        //开始60s计时 其实这个函数是不需要的
        //获取验证短信发送成功后这一个section deactive 
        _startTime:function(){
            var self=this;
            var num=60;
            
            self.$time.text(num);
            self.$btnGetMsg.addClass('u-btn-false');
            num=num-1;
            clearInterval(self._timehandle);
            self._timehandle=setInterval(function(){
                if(num==0){
                    clearInterval(self._timehandle);
                    self.$btnGetMsg.removeClass('u-btn-false');
                    return 
                }else{
                    self.$time.text(num);
                    num=num-1;
                }
            },1000);
        },
        //deactive
        _deActive:function(){
            this.$btnGetMsg.addClass('u-btn-false');
            this.$inputPhone.attr('disabled','disabled');
        }

    }
    //验证短信验证码
    var sectionB={
    	phone:null,
    	_timehandle:null,
        $wrapper:$('.invite-section-b'),
        $tipMsg:$('.-section-b-tip'),
        $inputMsg:$('.-section-input-msg'),
        $btnCheckMsg:$('.-section-checkmsg'),
        $err:$('.code-err'),
        $next:$('[data-order="3"]'),
        $time:$('.-section-verify-btn span b'),
        $btnResend:$('.-section-verify-btn'),    //重新发送按钮

        //检测验证码是否为空 如果是空 则弹出提示
        checkCode: function(){
    		var value = $.trim(this.$inputMsg.val());
    		if(value.length==0) {
    			this.$err.html('请输入验证码').css('visibility', 'visible');
    			return false;
    		}
    		return true;
    	},
        init:function(phone){
            var self=this;
            self.active(phone);
            self._startTime();
            self.addEvent();
        },
        //滑入下一屏
        _next:function(){
            var self=this;
            var top=self.$next.offset().top;
            //window.scrollTo(0,top);
            $('body').animate({'scrollTop':top},400);
        },
        //加载基本的按钮点击事件和input事件
        addEvent:function(){
            var self=this;

            self.$inputMsg.on('focusout',function(){
                self.checkCode();
            });
            //
            self.$inputMsg.on('focusin',function(){
                self.$err.css('visibility', 'hidden');
            });
            //
            self.$btnResend.on('click',function(){
                if(self.$btnResend.hasClass('-verify-btn-false')){
                    return;
                }else{
                    self._reSend();
                }
            });
            self.$wrapper.on('click','.-section-b-tip span',function(e){
                window.history.go(0);
            });
            //检查验证短信信息
            self.$btnCheckMsg.on('click',function(){
                self._checkMsg();
            });

        },
        //激活这一区间
        active:function(phone){
            this.phone=phone;

            var text="验证短信已发送至&nbsp;&nbsp;&nbsp;"+this.phone+"&nbsp;&nbsp;&nbsp;<span>换个号码</span>";
            this.$tipMsg.html(text);
            this.$btnCheckMsg.removeClass('u-btn-false');
            this.$inputMsg.removeAttr('disabled');
        },
        //deactive
        _deActive:function(){
            this.$btnCheckMsg.addClass('u-btn-false');
            this.$inputMsg.attr('disabled','disabled');
            this.$tipMsg.html("验证短信&nbsp;&nbsp;秒速送达");
        },
        //开始60s计时
        _startTime:function(){
        	var self=this;
        	var num=60;

        	self.$time.text(num);
        	self.$btnResend.addClass('-verify-btn-false');
        	num=num-1;
        	clearInterval(self._timehandle);
        	self._timehandle=setInterval(function(){
        		if(num==0){
        			clearInterval(self._timehandle);
        			self.$btnResend.removeClass('-verify-btn-false');
        			return
        		}else{
        			self.$time.text(num);
        			num=num-1;
        		}
        	},1000);
        },
        //发送下一步信息 转至下一步骤
        _checkMsg:function(){
        	var self=this;
        	//验证规则未通过或按钮为false状态 返回
        	if(!self.checkCode() || self.$btnCheckMsg.hasClass('u-btn-false')) return;
            var value=self.$inputMsg.val();
            bone.ajax({
                type:'post',
                url:'/Invite/CheckCode',
                data:{
                    'mobile':self.phone,
                    'token':token,
                    'validateCode':value
                },
                success:function(data){
                    var errormsg;
                    if(data.success){
                        sectionC.init(self.phone);
                        self._deActive();
                        self._next();
                    }else{
                        switch(data.error){
                            case '000':
                            errormsg="验证码错误";
                            break;
                            case '005':
                            errormsg="Token不正确";
                            break;
                            default:
                            errormsg="服务器不给力 请重试"
                            break;
                        }
                        bone.alert(errormsg);
                    }
                },
                error:function(){
                	bone.alert("网络不给力 稍后重试");
                }
            })
        },
        //重新获取验证短信
        //如果已经验证通过一次 section已被冻结 则点击无效
        _reSend:function(){
            var self=this;
            var value=self.phone;

            if(self.$btnCheckMsg.hasClass('u-btn-false')){
                return;
            }

            bone.ajax({
                type:'post',
                url:'/Invite/BuildValidateCode',
                data:{
                    'mobile':value,
                    'token':token
                },
                success:function(data){
                    var errormsg;
                    if(data.success){    
                        self._startTime();
                    
                        XK.tj.util.injectStatData({
                            from:FROM,
                            contact: value,
                            type:101,
                            action:'fetchcode'
                        });
                        
                    }else{
                        switch(data.error){
                            case '001':
                            errormsg="手机号格式不正确";
                            break;
                            case '004':
                            errormsg="操作过频繁 请稍后再试";
                            break;
                            case '005':
                            errormsg="Token不正确";
                            break;
                            case '006':
                            errormsg="该手机号码已被占用";
                            break;
                            case '007':
                            errormsg="该账号已被占用";
                            break;
                            case '008':
                            errormsg="该手机号已被邀请";
                            break;
                            case '009':
                            errormsg="管理员审核中..";
                            break;
                            case '010':
                            errormsg="管理员已经核准该手机号";
                            break;
                            default:
                            errormsg="服务器不给力 请重试"
                            break;
                        }
                        bone.alert(errormsg);
                    }
                },
                error:function(){
                    bone.alert("网络不给力 稍后重试");
                }
            });
        }

    }
    //完善资料string mobile, string name, string post, string password, string token
    var sectionC={
        $wrapper:$('.invite-section-c'),
        $inputName:$('.-section-input-name'),
        $inputPosition:$('.-section-input-position'),
        $inputPassword:$('.-section-input-password'),
        $inputRepeatPassword:$('.-section-input-repeat-password'),
        $err: $('.info-err'),
        $next:$('[data-order="4"]'),
        $btnSave:$('.-section-save'),
        checkInfo: function(){
    		var name = $.trim(this.$inputName.val()),
    			pos = $.trim(this.$inputPosition.val()),
    			pwd = $.trim(this.$inputPassword.val()),
    			rpwd = $.trim(this.$inputRepeatPassword.val());

    		if(name.length==0) {
    			this.$err.html('请输入姓名').show();
    			return false;
    		}else if(name.length<2){
                this.$err.html('姓名不能少于2个字').show();
                return false;
            }else if(name.length > 18) {
    			this.$err.html('姓名最多能输入18个字').show();
    			return false;
    		}

    		if(pos.length==0) {
    			this.$err.html('请输入职务').show();
    			return false;
    		} else if(pos.length > 50) {
    			this.$err.html('职务最多能输入50个字').show();
    			return false;
    		}

    		if(pwd.length == 0) {
    			this.$err.html('请输入密码').show();
    			return false;
    		}else if(pwd.length<6){
                this.$err.html('密码不能少于6个字符').show();
                return false;
            }else if(pwd.length>20){
                this.$err.html('密码不能多于20个字符').show();
                return false;
            }

    		if(rpwd.length == 0) {
    			this.$err.html('请输入确认密码').show();
    			return false;
    		}
    		if(rpwd != pwd) {
    			this.$err.html('两次输入的密码不匹配').show();
    			return false;
    		}
            this.$err.html('').hide();
    		return true;
    	},
        init:function(phone){
            var self=this;
            self.active();
            self.phone=phone;
            self.$inputName.on('focusout',function(){self.checkInfo()});

            self.$inputPosition.on('focusout',function(){self.checkInfo()});

            self.$inputPassword.on('focusout',function(){self.checkInfo()});
            self.$inputPassword.on('input',function(){self._x(this);});

            self.$inputRepeatPassword.on('focusout',function(){self.checkInfo()});
            self.$inputRepeatPassword.on('input',function(){self._x(this);});

            self.$btnSave.on('click',function(){self._saveInfo();});

            //点击叉号时清空 input focusout的时候清空
            self.$wrapper.on('mousedown','.i-icon-close',function(e){
                e.preventDefault();
                var $this=$(this);
                $this.parent().find('input').val('');
                $this.hide();
            });

            self.$inputPassword.on('focusout',function(){
                self.$inputPassword.parent().find('i').hide();
            }).on('focusin',function(){
                if(self.$inputPassword.val().length>0){self.$inputPassword.parent().find('i').show();}
            });
            self.$inputRepeatPassword.on('focusout',function(){
                self.$inputRepeatPassword.parent().find('i').hide();
            }).on('focusin',function(){
                if(self.$inputRepeatPassword.val().length>0){self.$inputRepeatPassword.parent().find('i').show();}
            });;
        },
        //叉号按钮显示隐藏问题
        _x:function(ele){
            var $ele=$(ele);
            if($ele.val().length>0){
                $ele.parent().find('i').show();
            }else{
                $ele.parent().find('i').hide();
            }
        },
        //存储信息
        _saveInfo:function(){
            var self=this;
            if(!self.checkInfo()) return;
            if(self.$btnSave.hasClass('u-btn-false')) return;
            var name=self.$inputName.val(),
                post=self.$inputPosition.val(),
                password=self.$inputPassword.val();
            
            bone.ajax({
                type:'post',
                url:'/Invite/SaveInvitedInfo',
                data:{
                    'mobile':self.phone,
                    'name':name,
                    'post':post,
                    'password':password,
                    'token':token
                },
                success:function(data){
                    var errormsg;
                    if(data.success){
                        //????
                        sectionD.init();
                        self._deActive();
                        self._next();
            
                        XK.tj.util.injectStatData({
                            contact: self.phone,
                            type:101,
                            action:'success'
                        });
                        //?????
                    }else{
                        switch(data.error){
                            case '001':
                            errormsg="手机号格式不正确";
                            break;
                            case '005':
                            errormsg="Token不正确";
                            break;
                            case '006':
                            errormsg="该手机号码已被占用";
                            break;
                            case '007':
                            errormsg="该账号已被占用";
                            break;
                            case '008':
                            errormsg="该手机号已被邀请";
                            break;
                            case '009':
                            errormsg="管理员审核中..";
                            break;
                             case '010':
                            errormsg="管理员已经核准该手机号";
                            break;
                            default:
                            errormsg=data.error
                            break;
                        }
                        bone.alert(errormsg);
                    }
                },
                error:function(){
                    bone.alert("网络不给力 稍后重试");
                }

            })
            
        },
        //滑入下一屏
        _next:function(){
            var self=this;
            var top=self.$next.offset().top;
            //window.scrollTo(0,top);
            $('body').animate({'scrollTop':top},400);
        },
        //active
        active:function(){
            this.$btnSave.removeClass('u-btn-false');
            this.$inputName.removeAttr('disabled');
            this.$inputPosition.removeAttr('disabled');
            this.$inputPassword.removeAttr('disabled');
            this.$inputRepeatPassword.removeAttr('disabled');
        },
        //deactive
        _deActive:function(){
            this.$btnSave.addClass('u-btn-false');
            this.$inputName.attr('disabled','disabled');
            this.$inputPosition.attr('disabled','disabled');
            this.$inputPassword.attr('disabled','disabled');
            this.$inputRepeatPassword.attr('disabled','disabled');
        }
    }

    //可以下载
    var sectionD={
        $area:$('.success-area'),
        init:function(){
            this._active();
        },
        _active:function(){
            this.$area.addClass('success-area-active');
        }
    }
    sectionA.init();
    //sectionA._deActive();
    //sectionB.init(18210816496);
    //sectionC.init(18210816496);
    //sectionD.init();

})(window.jQuery||window.Zepto,window.document);

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

    //===================弹出层组件
    var Layer=function(){
        this._init_.apply(this,arguments);
    }
    Layer.prototype={
        //模板文件
        template:$('#layer').html(),
        
        //初始化小窗口
        _init_:function(opts){
            opts=opts || {};
            //刷新到顶部
            window.scrollTo(0,0);

            //主dom元素
            this.$el=$(this.template);                                //主dom元素
            this.$content=this.$el.find('.m-layer-content');          //内容 content
            this.$text=this.$el.find('.m-layer-text');                //text

            if(opts.width){
                this.$content.css('width',opts.width);
            }
            
            if(opts.content){
                this.$text.html(opts.content);
            }

            this.addEvents();
            this.show();
        },

        //将小窗口显示在主窗口中
        show:function(){
            $('body').append(this.$el);
        },

        //将各事件均注册到小窗口顶级元素上
        addEvents:function(){
            var self=this;
            self.$el.on('click',function(e){
                if(e.target==self.$el[0]){
                    self.destory();
                }
            });
            self.$el.on('click','.m-layer-content-close',function(e){
                self.destory();
            });
            //that.$el.on('event','selector',callback);
        },

        //将小窗口在主窗口中移除
        destory:function(){
            this.$el.remove();
        }
    }

    //==============邀请人模块
    var Invite=function(){
        this._init_.apply(this,arguments);
    }
    Invite.prototype={
        template:_.template($('#invite').html()),

        //根据数据初始化
        _init_:function(data){
        	//刷新到顶部
            window.scrollTo(0,0);

            var self=this;
            data=JSON.parse(JSON.stringify(data));
            this.attr={'data':data};
            this.render();
        },
        render:function(){
            var self=this;
            var data=JSON.parse(JSON.stringify(self.attr));
            self.$el=$(self.template(data));
            self._addEvent();
        },
        //注册事件
        _addEvent:function(){
            var self=this;
            var $el=self.$el;

            //下载App
            $('.-invite-accept',$el).on('click',function(e){
                location.href="./downloadsection.html";
            })

            //继续注册
            $('.-invite-goon',$el).on('click',function(e){
                self.destory();
                self.prevBox._ignore=true;
                self.prevBox._getMsgCode();
                self.prevBox.show();
            })

        },
        //清空
        destory:function(){
            this.$el.remove();
        }
    }

    //===================注册步骤一
    function Rega(){
        this._init_.apply(this,arguments);
    }
    Rega.prototype={
        template:$('#reg-getphone').html(),
        rootUrl:'../',                 //ajax 根路径
        regPhone:/^1[0-9]{10}$/,       //手机号码验证正则
        _ignore:false,                 //是否略过渲染邀请人列表
        _init_:function(wrapper){
            this.wrapper=$(wrapper);
            this.$el=$(this.template);
            //刷新到顶部
            window.scrollTo(0,0);

            this.attr={
                "phone":0,             //手机号
                "imgkey":0,            //img key
                "imgcode":0,           //图形验证码
                "hasMsg":false,        //状态值判断是否已经收到短信
                "msgcode":0,           //短信验证码
                "code":0               //获取短信验证码时返回的code
            }

            this._addDom();
            this.render();
            //注入注册统计
            ava.util.sendBaseData({
                type:1
            });
        },
        //渲染至目标元素
        render:function(){
            var $el=this.$el;

            //初始刷新图形验证码
            this._updateImg();
            this._addEvent();
            this.wrapper.html(this.$el);
        },
        show:function(){
            this.$el.show();
        },  
        //隐藏dom元素
        hide:function(){
            this.$el.hide();
        },
        //获取dom元素
        _addDom:function(){
            var $el=this.$el;
            this.$captchaImg=$('.-captcha-img',$el);       //校验码图片 
            this.$inputPhone=$('.-input-phone',$el);       //手机号    
            this.$inputImgcode=$('.-input-imgcode',$el);   //图片验证码输入框
            this.$inputNext=$('.-input-next',$el);         //下一步
            this.$btnGetmsg=$('.-get-msg',$el);            //btn获取验证短信
            this.$btnNext=$('.-next-stage',$el);           //btn下一步
            this.$time=this.$btnGetmsg.find('b');          //倒计时 dom
        },
        //dom事件添加
        _addEvent:function(){
            var $el=this.$el;
            var self=this;

            $('.-captcha-change',$el).on('click',function(){
                self._updateImg();
            })
            
            this.$captchaImg.on('click',function(){
                self._updateImg();
            });

            //手机号码校验 focusout的时候 校验手机号 focusin的时候清除提示
            this.$inputPhone.on('focusout',function(){self._checkPhone();}).on('focusin',function(){self.$inputPhone.parent().removeClass('areg-section-line-false');});

            //图形验证码初步校验 focusout的时候 如果input有值开始检测
            this.$inputImgcode.on('focusout',function(){self._checkImgcode();}).on('focusin',function(){self.$inputImgcode.parent().parent().removeClass('areg-section-line-false');});

            //短信验证码初步校验 
            this.$inputNext.on('input',function(){self._checkMsgcode()}).on('focusout',function(){self._checkMsgcode()});
            this.$inputNext.on('focusin',function(){self.$inputNext.parent().removeClass('areg-section-line-false');});

            //获取验证短信
            //首先验证此手机号是否已被邀请 若被邀请转页面
            //若未被邀请
            $('.-get-msg',$el).on('click',function(e){
                
                if(self.$btnGetmsg.hasClass('areg-btn-false')){return}

                self.attr.phone=self.$inputPhone.val();
                self.attr.imgcode=self.$inputImgcode.val();
                //
                if(self._ignore){
                    self._getMsgCode();
                }else{
                    self._getInvite();
                }
                //注入注册统计
                ava.util.sendBaseData({
                    contact: self.$inputPhone.val(),
                    type:2
                });
            });

            //获取短信后的下一步
            $('.-next-stage',$el).on('click',function(e){
                if(self.$btnNext.hasClass('areg-btn-false')){return}
                self.attr.msgcode=self.$inputNext.val();
                self._nextStage();
                //注入注册统计
                ava.util.sendBaseData({
                    contact: self.$inputPhone.val(),
                    type:3
                });
                window.phone = self.$inputPhone.val();
            })

            //没收到验证码怎么办
            $('.-nomsg-tip',$el).on('click',function(){
                new Layer({'content':"<h4>没有收到短信验证码怎么办?</h4><p>亲爱的用户，我们的短信正常都会在数秒钟内发送到您的手机，如果您未收到短信，请参照如下常见情况进行解决：</p><p>1、您的手机安装了360安全卫士等软件，验证码短信可能被拦截进了垃圾短信箱。请打开垃圾短信箱读取短信并将纷享销客号码添加为白名单。</p><p>2、由于电信运营商通道故障造成了短信发送时间延迟，请耐心稍候片刻或点击重新获取验证码。</p><p>3、如果您尝试了上述方式后均未解决，请拨打<span>4006689050</span>人工服务热线。</p>"});
            })

        },
        //检查手机号
        _checkPhone:function(){
            var self=this;
            var value=self.$inputPhone.val();
            var text="请输入手机号";
            if(value==''){
                self.$inputPhone.parent().find('.areg-section-line-tip b').text(text);
                self.$inputPhone.parent().addClass('areg-section-line-false');
                return false;
            }else if(!self.regPhone.test(value)){
                text="请输入11位大陆手机号";
                self.$inputPhone.parent().find('.areg-section-line-tip b').text(text);
                self.$inputPhone.parent().addClass('areg-section-line-false');
                return false;
            }else{
                self.$inputPhone.parent().removeClass('areg-section-line-false');
                return true;
            }
        },
        //初步检查图形验证码
        _checkImgcode:function(info){
            var self=this;
            var text="请输入校验码";
            if(self.$inputImgcode.val().length==0 || info){
                text=info||text;
                self.$inputImgcode.parent().parent().find('.areg-section-line-tip b').text(text);
                self.$inputImgcode.parent().parent().addClass('areg-section-line-false');
                return false;
            }else{
                self.$inputImgcode.parent().parent().removeClass('areg-section-line-false');
                return true;
            }
        },
        //初步检查短信验证码
        _checkMsgcode:function(){
            var self=this;
            
            //只要已经发送短信且输入框里有字母 则按钮激活
            if(self.attr.hasMsg && self.$inputNext.val().length>0){
                self.$btnNext.removeClass('areg-btn-false');
                return true;
            }else{
                self.$btnNext.addClass('areg-btn-false');
                return false;
            }
        },
        //短信验证码提示
        _tipMsgcode:function(text){
            var self=this;
            self.$inputNext.parent().find('.areg-section-line-tip b').text(text);
            self.$inputNext.parent().addClass('areg-section-line-false');
        },
        //更新验证码
        _updateImg:function(){
            var now=new Date();
            var captchaImgKey=Math.ceil(now.getTime()/1000);
            this.attr.imgkey=captchaImgKey;
            this.$captchaImg.attr('src',this.rootUrl + 'WebReg/GetCodeImg?key='+captchaImgKey);
        },
        //获取短信一分钟倒计时
        _countTime:function(){
            var self=this;
            var num=60;
            
            self.$time.text(num);
            self.$btnGetmsg.addClass('areg-btn-false');
            num=num-1;
            clearInterval(self._timehandle);
            self._timehandle=setInterval(function(){
                if(num==0){
                    clearInterval(self._timehandle);
                    self.$btnGetmsg.removeClass('areg-btn-false');
                    return 
                }else{
                    self.$time.text(num);
                    num=num-1;
                }
            },1000);
        },
        //====获取验证短信逻辑
        _getMsgCode:function(){
            var self=this;
            var phone=self.attr.phone,
                imgcode=self.attr.imgcode,
                rootUrl=self.rootUrl,
                imgkey=self.attr.imgkey;

            var _checkA=self._checkPhone(),
                _checkB=self._checkImgcode();

            //初步验证均通过的情况下
            if(_checkA && _checkB){
                //发送请求begin
                bone.ajax({
                    url: rootUrl + 'WebReg/BuildValidateCode2',
                    //url: 'http://192.168.0.9/',
                    //url: '../data/success.json',
                    data: {
                        mobileOrEMail:phone,
                        imgcode:imgcode,
                        key:imgkey
                    },
                    "type":"post",
                    //timeout:1000,
                    error:function(){
                        self.attr.hasMsg=false;
                        self._updateImg();
                        bone.alert("网络不给力，请稍候再试");
                    },
                    success: function(responseData){
                        var errorMsg;
                        //console.log("获取验证短信");
                        //console.log(responseData);
                        //返回成功
                        if (responseData.success) {
                            //code=responseData.code; //设置返回code信息
                            //subCaptchaBtnEl.removeClass('btn-state-disabled').prop('disabled',false);
                            //waitCaptcha();
                            //????????????信息发送后是不是该加个提示啥的???????????
                            self.attr.hasMsg=true;
                            self.attr.code=responseData.code;
                            self._countTime();
                        }else {
                            self.attr.hasMsg=false;
                            self._updateImg();   //更新验证码
                            switch (responseData.error) {
                                case '001':
                                    errorMsg = "请输入有效的手机号码";
                                    bone.alert(errorMsg);
                                    break;
                                case '002':
                                    errorMsg= "验证短信发送失败，请再次获取";
                                    bone.alert(errorMsg);
                                    break;
                                case '003':
                                    errorMsg= "一个手机号可以注册5个企业，如需开通请致电400-688-9050";
                                    bone.alert(errorMsg);
                                    break;
                                case '004':
                                    errorMsg = "两次获取验证码的间隔不能少于1分钟";
                                    bone.alert(errorMsg);
                                    break;
                                case '005':
                                    errorMsg = "输入有误";
                                    self._checkImgcode(errorMsg);
                                    break;
                                default:
                                    errorMsg= responseData.error;
                                    bone.alert(errorMsg);
                                    break;
                            }
                        }
                    }

                });
                //发送请求end
            }else{
                return;
            }
        },
        //====获取邀请人??????????
        _getInvite:function(){
            var self=this;
            var phone=self.attr.phone;
            var imgcode=self.attr.imgcode;

            var _checkA=self._checkPhone(),
                _checkB=self._checkImgcode();

            if(_checkA && _checkB){
                bone.ajax({
                    url: self.rootUrl + 'WebReg/GetInviteEmployeeInfo',
                    data: {
                        mobileOrEMail: phone
                    },
                    "type":"get",
                    "cache":false,
                    success: function(responseData){
                        var employeeListData;
                        if (responseData.success) {
                            employeeListData=responseData.data;
                            if(employeeListData.length>0){ //存在邀请人列表的情况下要渲染列表并打开
                                var invite=new Invite(employeeListData);

                                invite.prevBox=self;
                                
                                self.hide();
                                self.wrapper.append(invite.$el);
                            //不存在情况下直接获取验证码  
                            }else{ 
                                self._getMsgCode();
                            }
                        }
                    },
                    "error":function(){
                        bone.alert("网络不给力，请稍候再试");
                    }
                })
            }else{
               return false;
            }
           
        },
        //====获取验证短信的下一步
        _nextStage:function(){
            var self=this;
            var phone=self.attr.phone;
            var msg=self.attr.msgcode;
            var code=self.attr.code;
            var rootUrl=self.rootUrl;
            //下一步
            bone.ajax({
                url: rootUrl + 'WebReg/ValidateCodeAndMobile',
                //url: 'http://192.168.0.9/',
                //url: '../data/success.json',
                data: {
                    mobileOrEMail:phone,
                    code: msg
                },
                "type":"post",
                //timeout:1000,
                success: function(responseData){
                    //console.log("发送验证短信回调");
                    //console.log(responseData);

                    var errorMsg;
                    if (responseData.success) {
                        self.destory();
                        var regb=new Regb(self.wrapper,{"phone":phone,"msg":msg,"code":code});
                    }else {
                        errorMsg="您输入的短信验证码有误";
                        self._tipMsgcode(errorMsg);
                    }
                },
                "error":function(){
                    bone.alert("网络不给力，请稍候再试");
                }
            });
        },
        //销毁
        destory:function(){
            this.$el.remove();
            this.wrapper.empty();
        }

    }

    /**
    *妈蛋的 我写过的最麻烦的验证规则
    **/
    //===================注册步骤二
    function Regb(){
    	this._init_.apply(this,arguments);
    }
    Regb.prototype={         
        template:$('#reg-baseinfo').html(),
        regCompanyName:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/,           //企业名称正则
        regCompanyAccount:/^[a-zA-Z][a-zA-Z0-9_\u4e00-\u9fa5]{5,19}$/,              //企业帐号正则
        rootUrl:'../',        //ajax 根路径
        _init_:function(wrapper,options){
        	//刷新到顶部
            window.scrollTo(0,0);

            this.wrapper=$(wrapper);
            this.$el=$(this.template);
            this.render();
            var pwd = String(Math.random()).substr(2,6);
            this.attr={
                "userName":'',              //用户姓名
                "companyName":'',           //企业名称
                "companyAccount":'',        //企业帐号
                "password":pwd,             //用户密码
                "coupon":'',                //优惠码
                "phone":options.phone,      //第一步得到的手机号
                "msg":options.msg,          //第一步得到的短信验证码
                "code":options.code,        //第一步获取短信验证码成功后获得的code
                "launchedData":null         //注册暂存信息  
            }
        },
        //====
        render:function(){
            this.wrapper.html(this.$el);
            this._addDom();
            this._addEvent();
            this._addMirror();
        },
        //====获取dom元素
        _addDom:function(){
            var $el=this.$el;
            this.$inputPersonName=$('.-info-person-name',$el);
            this.$inputCompanyName=$('.-info-company-name',$el);
            this.$inputCompanyAccount=$('.-info-company-account',$el);
            this.$inputCompanyCoupon=$('.-info-company-coupon',$el);
            this.$btnSend=$('.-info-btn-send',$el);
        },
        //====注册事件
        _addEvent:function(){
            var $el=this.$el;
            var self=this;

            //什么是企业名称和企业帐号
            $('.-what-tip',$el).on('click',function(){
                new Layer({'content':"<h4>什么是公司名称？</h4><p>公司名称是指您所在企业或团队的名称，最多50个字符，可包括汉字、字母、数字和下划线。</p> <p>例如：36Kr网络科技、纷享科技销售部。</p><h4>什么是公司帐号？</h4><p>公司帐号用于识别您所注册的纷享销客平台，主要用于登录平台时使用。一般为公司名称的首字母缩写，或是公司的英文名称，至少6个字符允许字母、数字和下划线，可根据您的情况自行设定。</p><p>例如：北京纷享科技帐号可设置为BJFXKJ。</p>"});
            });

            //input 检测
            this.$inputPersonName.on('input',function(){self._checkPersonName();});
            this.$inputCompanyName.on('input',function(){self._checkCompanyName();});
            this.$inputCompanyAccount.on('input',function(){self._checkCompanyAccount();});

            //focusout的时候 超出字显示tip 不超字不显示tip
            this.$inputPersonName.on('focusout',function(){
                var $tip=self.$inputPersonName.parent().find('.-info-tip');
                if($tip.find('b').hasClass('active')){
                    $tip.show();
                }else{
                    $tip.hide();
                }
            });
            //focusout的时候 超出字显示tip 不超字不显示tip
            this.$inputCompanyName.on('focusout',function(){
                var $tip=self.$inputCompanyName.parent().find('.-info-tip');
                if($tip.find('b').hasClass('active')){
                    $tip.show();
                }else{
                    $tip.hide();
                }
            });

            //发送保存信息
            this.$btnSend.on('click',function(){
                self.attr.userName=self.$inputPersonName.val();
                self.attr.companyName=self.$inputCompanyName.val();
                self.attr.companyAccount=self.$inputCompanyAccount.val();
                self.attr.coupon=self.$inputCompanyCoupon.val();
                self._saveInfo();
            });

        },
        //如果有mirrorid 则优惠码填充 并设为readonly
        _addMirror:function(){
            var self=this;
            var mirror=$.cookie('mirrorIdm');
            if(mirror && mirror!="0000"){
                self.$inputCompanyCoupon.val(mirror);
                self.$inputCompanyCoupon.attr('readonly','readonly').addClass('-info-readonly');
            }else{
                self.$inputCompanyCoupon.removeAttr('readonly').removeClass('-info-readonly').val('');
            }
        },
        //检测用户姓名 不能超过18个字
        _checkPersonName:function(){
            //=============检测A======
            var self=this;
            var value=self.$inputPersonName.val();
            var num=0;

            var $tip=self.$inputPersonName.parent().find('.-info-tip'),
                $tipb=$tip.find('b');
            //console.log(value.length);
            if(value.length>=13){
                num=18-value.length;
                $tipb.text(num);
                if(num<0){
                    $tipb.addClass('active');
                }else{
                    $tipb.removeClass('active');
                }
                $tip.show();
                return;
            }else{
                $tip.hide();
                return;
            }
        },
        //保存信息时 检测用
        _checkPersonNameA:function(){
            var self=this;
            var value=self.$inputPersonName.val();
            var text='';
            var bool=false;
            if(value.length==0){
                text="真实姓名不能为空";
            }else if(value.length>18){
                text="姓名最多可输入18个字";
            }else{
                bool=true;
            }

            //如果没有错误 返回false 如果有错误 返回错误信息
            if(bool){
                return false;
            }else{
                return text;
            }
        },
        //检测企业名称 不能超过25个字
        _checkCompanyName:function(){
            var self=this;
            var value=self.$inputCompanyName.val();
            var num=0;

            var $tip=self.$inputCompanyName.parent().find('.-info-tip'),
                $tipb=$tip.find('b');

            if(value.length>=20){
                num=25-value.length;
                $tipb.text(num);
                if(num<0){
                    $tipb.addClass('active');
                }else{
                    $tipb.removeClass('active');
                }
                $tip.show();
                return;
            }else{
                $tip.hide();
                return;
            }

        },
        //保存信息时 检测用
        _checkCompanyNameA:function(){
            var self=this;
            var value=self.$inputCompanyName.val();
            var text='';
            var bool=false;

            if(value.length==0){
                text="企业名称不能为空";
            }else if(value.length>50){
                text="企业名称输入最多为50个字符";
            }else if(!self.regCompanyName.test(value)){
                text="请输入正确格式的企业名称，可包括汉字、字母、数字和下划线";
            }else{
                bool=true;
            }

            //如果没有错误 返回false 如果有错误 返回错误信息
            if(bool){
                return false;
            }else{
                return text;
            }
        },
        //检测企业帐号 英文开头 6-20个字
        _checkCompanyAccount:function(){
            //===============检测A=======
            var self=this;    
            var value=self.$inputCompanyAccount.val();
            var num=0;

            var $tips=self.$inputCompanyAccount.parent().find('.-info-smart b'),
                $tipa=$tips.eq(0),              //提示A
                $tipb=$tips.eq(1),              //提示B
                $tipc=$tips.eq(2),              //字数倒计时提示
                $tipc_i=$tipc.find('i');        //字数倒计时之变化的数字元素

            //只要input内长度为空 则全都灰色显示
            if(value.length==0){
                $tipc.hide();
                $tipa.removeClass('active').show();
                $tipb.removeClass('active').show();
                return;
            }

            //非英文字母开头 提示
            if(!/[A-Za-z]/.test(value.slice(0,1))){
                $tipa.addClass('active');
            }else{
                $tipa.removeClass('active');
            }

            /**
            *6-20个字符
            *少于6个字符时                $tipb 正常显示    $tipc隐藏
            *大于6个字符小于15个字符      $tipb active显示  $tipc隐藏
            *大于15个字符时               $tipb 隐藏显示    $tipc显示 $tipc_i动态变化
            **/
            if(value.length<6){
                $tipc.hide();
                $tipb.addClass('active');
                $tipb.show();
              
            }else if(value.length<15){
                $tipc.hide();
                $tipb.removeClass('active');
                $tipb.show();
            }else{
                $tipb.hide();
                num=20-value.length;
                $tipc_i.text(num);
                if(num<0){
                    $tipc_i.addClass('active');
                }else{
                    $tipc_i.removeClass('active');
                }
                $tipc.show();
            }
        },
        //保存信息时 检测用
        _checkCompanyAccountA:function(){
            var self=this;
            var value=self.$inputCompanyAccount.val();
            var text='';
            var bool=false;
            
            if(value.length==0){
                text="企业帐号不能为空";
            }else if(!/[A-Za-z]/.test(value.slice(0,1))){
                text="企业帐号需以字母开头";
            }else if(value.length<6 || value.length>20){
                text="企业帐号为6-20个字符";
            }else if(!this.regCompanyAccount.test(value)){
                text="请输入正确格式的企业帐号，可包括汉字、字母、数字和下划线";
            }else{
                bool=true;
            }

            //如果没有错误 返回false 如果有错误 返回错误信息
            if(bool){
                return false;
            }else{
                return text;
            }
    
        },
        //检测优惠码
        _checkCompanyCoupon:function(){

        },
        //====步骤一 保存信息
        _saveInfo:function(){
            var self=this;
            var rootUrl=this.rootUrl;

            /*
            *首先检测各验证规则如果不符合 弹出提示 alert
            */
            if(self._checkPersonNameA()){
                bone.alert(self._checkPersonNameA());
                return;
            }else if(self._checkCompanyNameA()){
                bone.alert(self._checkCompanyNameA());
                return;
            }else if(self._checkCompanyAccountA()){
                bone.alert(self._checkCompanyAccountA());
                return;
            }


            var userName=self.attr.userName,
                companyName=self.attr.companyName,
                companyAccount=self.attr.companyAccount,
                password=self.attr.password,
                coupon=self.attr.coupon;

            var phone=self.attr.phone,
                msg=self.attr.msg,
                code=self.attr.code;

            bone.ajax({
                url: rootUrl + 'WebReg/Register2',
                data: {
                    RegistrationID: null,
                    EnterpriseName: companyName,                               //企业名称
                    EnterpriseAccount: companyAccount,                         //企业帐号
                    ManagerFullName: userName,                                 //个人姓名
                    ManagerPassword: password,                                 //个人密码
                    ManagerMobileOrEMail: phone,                                //注册时第一步的手机号*
                    //ManagerMobileOrEMail: mobileCode,
                    VendorID: coupon,                                          //优惠码
                    Province: '',                                              //哪个省
                    ValidateCode:msg,                                          //短信验证码*
                    Code: code,                                                //调用获取短信验证码时返回的code信息*
                    Source: 1,                                                 //what?
                    SourceUserID: '',                                          //what?
                    ProductID: '',                                             //what?
                    Deadline: '',                                              //what?
                    ValidateUrl: 'blank.html'                                  //占位用 what?              
                },
                "type":"post",
                //timeout:1000,
                success: function(responseData){
                    var errorMsg,
                        regReturnCode;
                    //console.log("发送基本信息回调");
                    //console.log(responseData);
                    if (responseData.success) {
                        //注册成功后的code
                        regReturnCode=decodeURIComponent(responseData.data.substr(responseData.data.indexOf("code=") + 5));
                        self._launch(regReturnCode);
                    }else {
                        switch (responseData.error) {
                            case "000":
                                errorMsg = "短信验证码已超期请刷新页面后重试";
                                break;
                            case "001":
                                errorMsg= "请输入企业名称";
                                break;
                            case "002":
                                errorMsg = "请输入有效的企业帐号";
                                break;
                            case "003":
                                errorMsg= "请填写姓名，不可含有空白@等字符";
                                break;
                            case "005":
                                errorMsg= "请输入有效的手机号码和电子邮箱";
                                break;
                            case "100":
                                errorMsg= "该手机号码已注册过";
                                break;
                            case "101":
                                errorMsg = "该企业名称已注册过";
                                break;
                            case "102":
                                errorMsg = "该企业帐号已注册过";
                                break;
                            case "103":
                                errorMsg= "优惠码无效";
                                break;
                            case "104":
                                errorMsg= "产品无效";
                                break;
                            default:
                                errorMsg= responseData.error;
                                break;
                        }
                        bone.alert(errorMsg);
                    }
                },
                "error":function(){
                    bone.alert("网络不给力，请稍候再试");
                }
            });
        },
        //====步骤二 生成
        _launch:function(regReturnCode){
            var self=this;
            var rootUrl=self.rootUrl;
            bone.ajax({
                "type":"post",
                "url":rootUrl + 'WebReg/Launch',
                "data":{
                    "code": regReturnCode
                },
                "success":function(responseData){
                    //console.log("launch回调");
                    //console.log(responseData);
                    var errorMsg;
                    if (responseData.success) {
                        self.attr.launchedData= responseData.data;
                        //进行islaunched轮询查询
                        self._tryIsLaunched(regReturnCode,function(){
                            //console.log('finally 终于成功了');
                            //console.log("用户信息");
                            //console.log(self.attr.launchedData);
                            //console.log("用户密码");
                            //console.log(self.attr.password);
                            self.destory();
                            //取消全局遮罩
                            bone.hideGlobalLoading();
                            new Regc(self.wrapper,
                                {
                                 companyAccount:self.attr.launchedData.enterpriseAccount,
                                 personAccount:self.attr.launchedData.employeeAccount,
                                 password:self.attr.password
                                }
                            );
                            ava.util.sendBaseData({
                            	contact: window.phone,
                                type:4
                            });
                        });
                    } else {
                        switch (responseData.error) {
                            case '001':
                                errorMsg = "部门太多了";
                                break;
                            case '002':
                                errorMsg= "员工太多了";
                                break;
                            case '003':
                                errorMsg= "员工信息不完整（缺少FullName或MobileOrEMail）";
                                break;
                            case '004':
                                errorMsg= "手机号码或邮箱地址不正确";
                                break;
                            case '005':
                                errorMsg= "找不到待开通的注册信息";
                                break;
                            case '101':
                                errorMsg= "企业名称已存在";
                                break;
                            case '102':
                                errorMsg= "企业帐号已存在";
                                break;
                            case '103':
                                errorMsg = "优惠码无效";
                                break;
                            case '104':
                                errorMsg = "产品无效";
                                break;
                            default:
                                errorMsg= responseData.error;
                                break;
                        }
                        bone.alert(errorMsg);
                    }
                },
                "error":function(){
                    bone.alert("网络不给力，请稍候再试");
                    return;
                }
            },{'keepLoading':true});
        },
        //====进行isLaunched轮询
        _tryIsLaunched:function(requestData,callback){
            var self=this;
            var regReturnCode=requestData;

            self._isLaunched({
                "code":regReturnCode,
                },function(responseData){
                    var tryTimeIndex=0;
                    //console.log("tryTimeIndex: "+tryTimeIndex);
                    //console.log(responseData);
                    if(responseData.success){
                        //注册成功后的回调
                        callback();
                        return;
                    }else{
                        (function(){
                            var _self=arguments.callee;
                            setTimeout(function(){
                                self._isLaunched({
                                    "code":regReturnCode
                                },function(responseData){
                                        //console.log("tryTimeIndex: "+tryTimeIndex);
                                        //console.log(responseData);
                                    if(responseData.success){
                                        callback();
                                        return;
                                    }
                                    if(tryTimeIndex>60){   //30s
                                        //提示参数错误
                                        bone.alert("等待超时，可能因为系统繁忙导致注册不成功，请稍候再试" + responseData.error);
                                        return;
                                    }
                                    tryTimeIndex++;
                                    _self();
                                });
                            },500);    //延时0.5s后查询一次
                    })();
                }
            });
        },
        //====判断是否创建成功
        _isLaunched:function(requestData,callback){
            var rootUrl=this.rootUrl;
            bone.ajax({
                "type":"post",
                "url":rootUrl +'WebReg/IsLaunched',
                "data":requestData,
                "success":callback
            },{'keepLoading':true});
        },
        destory:function(){
            this.$el.remove();
        }
    }

    //==================注册步骤三
    function Regc(){
    	this._init_.apply(this,arguments);
    }
    Regc.prototype={
        template:$('#reg-success').html(),
        _init_:function(wrapper,options){
        	//刷新到顶部
            window.scrollTo(0,0);

            var options=JSON.parse(JSON.stringify(options));
            this.wrapper=$(wrapper);
            this.$el=$(this.template);
            this.attr=options;
            this.render();
        },
        render:function(){
            this.wrapper.html(this.$el);

            var $el=this.$el;
            $('.-success-companyaccount',$el).text(this.attr.companyAccount);
            $('.-success-personaccount',$el).text(this.attr.personAccount);
            $('.-success-password',$el).text(this.attr.password);
            this._addEvent();
        },
        _addEvent:function(){
            var $el=this.$el;
            $('.-success-download',$el).on('click',function(){
                location.href="./downloadsection.html";
            })
        },
        destory:function(){
            this.$el.remove();
        }
    }


    var container=$('.areg-con');
    var rega=new Rega(container);
    //var regb=new Regb(container,{phone:1,msg:1,code:1});
    //var   regc=new Regc(container,{companyAccount:"universe",personAccount:"avaer",password:"123456"});
})(window.jQuery||window.Zepto,window.document);

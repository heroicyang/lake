<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<Coop.Web.Models.JoinEnterpriseEntity>" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<title><% =Model.Name %>邀请您加入【<% =Model.EnterpriseName %>】</title>
	<link rel="stylesheet" href="/style/common.css">
	<script src="/static/js/invite/underscore.js"></script>
	<!--<script src="/static/js/invite/zepto.js"></script>-->
	<script src="/static/js/jquery-2.0.0.min.js"></script>
	<script type="text/javascript" src="/statistics/common.js"></script>
	<script src="/static/js/invite/invite_help.js"></script>
	<script type="text/javascript">
		if(ava.util.isMobile()){
			$('head').append($('<link rel="stylesheet" href="/style/invite.css?2">'));
		}else{
			$('head').append($('<link rel="stylesheet" href="/style/invite_pc.css?2">'))
		}
	</script>
</head>
<body>
	<div class="invite-title">
		<p>
		<% =Model.Name %>邀请您加入【<% =Model.EnterpriseName %>】
		</p>
	</div>
	<!--第一步 begin-->
	<div class="invite-section invite-section-a" data-order="1">
		<div class="-section-con">
			<h3>简单三步 即刻加入</h3>
			<div class="-invite-in">
				<span class="-invite-in-icon"><i class="i-icon-phone"></i></span>
				<input type="text" checked="checked" placeholder="输入您的手机号" class="-section-input-phone -invite-in-input">
				<p class="-invite-in-tip">手机号输入有误</p>
			</div>
			<div>
				<span class="-section-getmsg u-btn">获取短信验证码 <!--<span>(<b>60</b>)</span>--> </span>
			</div>
			<script>
			(function(){
				var $self=$('.-invite-in');
				$self.on('focusin',function(){$self.addClass('-invite-in-focus')}).on('focusout',function(){$self.removeClass('-invite-in-focus')})
			})()
			</script>
		</div>
	</div>
	<!--第一步 end-->
	
	<!--第二步 begin-->
	<div class="invite-section invite-section-b" data-order="2" style="background:#ffce6c">
		<div class="-section-con">
		<div class="-section-head">
			<div class="-section-vector"></div>
			<h2>短信验证</h2>
			<h4 class="-section-b-tip">验证短信 秒速送达</h4>
		</div>
		
		<div class="code-err">验证码错误</div>
		<div class="-section-verify">
			<input type="text" placeholder="输入验证码" class="-section-input-msg f-fl" disabled="disabled">
			<span class="f-fr -section-verify-btn">重新发送 <span>(<b>60</b>)</span> </span>
		</div>
		<p><span class="u-btn u-btn-false -section-checkmsg">验证</span></p>
		</div>
	</div>
	<!--第二步 end-->
	

	<div class="info-err" data-grid="fixed">手机号码不能为空</div>


	<!--第三步 begin-->
	<div class="invite-section invite-section-c" data-order="3" style="background:#fff">
		<div class="-section-con">
		<div class="-section-head" >
			<div class="-section-vector"></div>
			<h2>完善资料</h2>
			<h4>如实填写 加速审核</h4>
		</div>
		<div class="-section-form">
			<div class="-section-line"><span>真实姓名</span> <input type="text" class="-section-input-name" disabled="disabled" placeholder="2~18个字"></div>
			<div class="-section-line"><span>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</span> <input type="text" class="-section-input-position" disabled="disabled" placeholder="50个字以内"></div>
			<div class="-section-line">
			<span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</span> <input type="password" class="-section-input-password" disabled="disabled" placeholder="6~20位">
			<i class="i-icon-close"></i>
			</div>
			<div class="-section-line">
			<span>确认密码</span> <input type="password" class="-section-input-repeat-password" disabled="disabled" placeholder="重复输入密码">
			<i class="i-icon-close"></i>
			</div>
		</div>
		<p> <span class="u-btn u-btn-false -section-save">提交</span></p>
		</div>
	</div>
	<script>
		$('.-section-line input').on('focus',function(e){$(e.currentTarget).parent().addClass('-section-line-focus').siblings().removeClass('-section-line-focus')}).on('focusout',function(e){$(e.currentTarget).parent().removeClass('-section-line-focus')});
	</script>
	<!--第三步 end-->
	
	<!--第四步 begin-->
	<div class="invite-section invite-section-d" data-order="4" style="background:#fff7ee">
		<div class="-section-con">
		<div class="success-area">
			<div class="-area-info">
				<!--<img src="/style/imgs/right.png" style="padding-top:62px;padding-bottom:12px;width:70px;height:54px;"></img>-->

				<h2>资料已提交</h2>
				<h4>请等待贵司管理员审批<br>审批通过后会短信提醒您</h4>
				<h5>现在，下载纷享销客抢鲜体验</h5>
			</div>
			<div class="-area-download">
				<h2>请尽快提交</h2>
				<h4>注册链接在邀请发出后的24小时内有效</h4>
				<a href="/mob/downloadsection.html" class="-area-download-btn">立即下载</a>
				<!--<a href="tel:4006689050"><img src="/style/imgs/phone.png" style="width:108px;height:16px;padding-bottom:30px;"></img></a>-->
			</div>
		</div>
		</div>
		<!--
		<div class="-section-success">
			<a href="#"></a>
		</div>
		-->
	</div>
	<!--第四步 end-->
	
	<!--phone begin-->
	<div class="invite-phone">
		<a href="tel:4006689050"><img src="/style/imgs/phone.png" style="width:108px;height:16px;"></img></a>
	</div>
	<!--phone end-->

	<div class="f-hide">
		<input type="hidden" id="token" value=<% =Model.Token %> />
		<input type="hidden" id="Hidden1" value=<% =Model.Name %> />
		<input type="hidden" id="Hidden2" value=<% =Model.EnterpriseName %> />
		<input type="hidden" id="Hidden3" value=<% =Model.InviteTime %> />
	</div>
	<script src="/static/js/invite/invite.js?2"></script>
</body>
</html>

        


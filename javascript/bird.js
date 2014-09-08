/**    
 * CODETANK 
 * Copyright (c) 2012, Tencent AlloyTeam, All rights reserved.
 * http://CodeTank.AlloyTeam.com/
 *
 * @version     1.0
 * @author      AlloyTeam
 *
 *  .d8888b.                888      88888888888               888   TM   
 * d88P  Y88b               888      ''''888''''               888      
 * 888    888               888          888                   888      
 * 888         .d88b.   .d88888  .d88b.  888  8888b.  88888b.  888  888 
 * 888        d88""88b d88" 888 d8P  Y8b 888     "88b 888 "88b 888 .88P 
 * 888    888 888  888 888  888 88888888 888 .d888888 888  888 888888K  
 * Y88b  d88P Y88..88P Y88b 888 Y8b.     888 888  888 888  888 888 "88b 
 *  "Y8888P"   "Y88P"   "Y88888  "Y8888  888 "Y888888 888  888 888  888 
 * 
 */

Jx().$package(function(J){
	Robot = new J.Class({extend : tank.Robot},{

		/**
		*robot主循环
		**/	
		run:function(){
            var that=this;
            this.setUI(tank.ui['green']);
            this.loop(function(){
                this.sway();
            })
		},
        sway:function(){
          this.ahead(26);  
        },
		/**
		*看到其他robot的处理程序
		**/
		onScannedRobot:function(e){
			
		},

		/**
		*被子弹击中的处理程序
		**/
		onHitByBullet:function(e){
			
		},

		/**
		*和墙碰撞的处理程序
		**/
		onHitWall:function(e){
			this.say("妈蛋 竟然撞墙了");
			thid.doNothing();
			var x=this.getX();
			var y=this.getY();
			this.log(x);
			this.log(y);
		},

		onRobotDeath:function(e){
			
		}
	});
});
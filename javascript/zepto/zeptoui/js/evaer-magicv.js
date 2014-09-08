/*==========================
>>渐隐渐现flash jquery插件 
>>左右切换flash jquery插件
============================*/
(function($){
    var Magicv=function(se){
        this.ele=se;
        var child=this.ele.children();
        this.conts=child.eq(0).children();
        this.lis=se.find('ul').children();
        this.vl=se.find('sub');
        this.vr=se.find('sup');
        this.current=0;
        this.length=this.conts.length;
        this.timer={};
        this.init();
    }
    Magicv.prototype={
        init:function(){
            var that=this;
            that.lis.eq(0).addClass('active');
            that.lis.click(function() {
                that.vecright();
            });
            //that.circle(true);
        },
        circle:function(bool){
            var that=this;
            var num=that.current>=(that.length-1) ? 0:that.current+1;
            if(bool){
                clearTimeout(that.timer);
                that.timer=setTimeout(function(){that.vecleft()},2000);
            }
            else{
                clearTimeout(that.timer);
            }
        },
        _changei:function(num){
            this.lis.eq(num).addClass('active').siblings().removeClass('active');
        },
        /*==================================
        >>主要函数
        >>num定义了将要显现的下个图片的序号
        >>bool定义了从左方出现还是从右方出现
            >>bool为ture代表从左方出现
            >>bool为false代表从右方出现
        ===================================*/
        change:function(num,bool){
            var that=this;
            that.circle(false);
            if(num==that.current){
                that.circle(true);
                return;
            }
            var vecs;
            if(bool){
                vecs='a-fadeleft';
            }else{
                vecs='a-faderight';
            }
            
        },
        vecleft:function(){
            var that=this;
            //that.circle(false);
            var next;
            if(that.current==that.length-1){
                next=0;
            }else{
                next=that.current+1;
            }
            that._changei(next);
            that.conts.removeAttr('class');
            that.conts.eq(that.current).addClass('preve').addClass('a-vleftout');
            that.conts.eq(next).addClass('active').addClass('a-vrightin');
            that.current=next;
            //that.circle(true);
        },
        vecright:function(){
            var that=this;
            //that.circle(false);
            var next;
            if(that.current==0){
                next=that.length-1;
            }else{
                next=that.current-1;
            }
            that._changei(next);
            that.conts.removeAttr('class');
            that.conts.eq(that.current).addClass('preve').addClass('a-vrightout');
            that.conts.eq(next).addClass('active').addClass('a-vleftin');
            that.current=next;
            //that.circle(true);
        }
    }

    $.fn.magicv= function () {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('magicv')
            if (!data) $this.data('magicv', (data = new Magicv($this)));
        })
    }
    $("[data-m='magicv']").magicv();
})(Zepto);

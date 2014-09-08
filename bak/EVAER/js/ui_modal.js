/*==========================
>模态框插件   
=============================*/
(function($){

    //若$.UI存在则不变 否则 赋值为空{}
    $.UI=$.UI? $.UI:{}

    //模态框
    var Modal=function(element,options){

        this.$se=$(element);    //主元素
        this.active=false;      //是否处于激活状态
        this.$dialog=this.$se.find('m-modal-dialog');
        this.options=$.extend({},Modal.defaultOptions,options)
        this.init();
    };
    Modal.prototype={
        init:function(){
            var that=this;

            //当点击到半透明背景时 如果options.bgclose==true 则关闭modal
            //同时由于点击dialog内任意元素都会触发click事件 所以需要判断target是否为this.element
            that.$se.on('click','.uk-modal-close',function(e){
                e.preventDefault();
                that.hide();
            }).on('click',function(e){
                if (e.target == that.$se[0] && that.options.bgclose) {
                    that.hide();
                };
            })

        },
        toggle:function(){
            this.active? this.$se.hide():this.$se.show();
        },
        show:function(){
            this.$se.show();
            this.active=true;
        },
        hide:function(){
            this.$se.hide();
            this.active=false;
        }   
    };
    Modal.defaultOptions={
        bgclose:true
    };

    //模态框触发元素
    var ModalTrigger=function(element,options){
        var that=this;

        this.$se=$(element);
        this.options = $.extend({
            "target":this.$se.is("a") ? $element.attr("href") : false
        }, options);
        this.modal = new Modal(this.options.target, options);

        this.$se.on("click", function(e) {
            e.preventDefault();
            that.modal.show();
        });
        this.$se.data("modaltrigger", this);
    }


    $.UI['Modal']=Modal;
    $.UI['ModalTrigger']=ModalTrigger;

    $(document).on('click','[data-ui-modal]',function(e){
        var $se = $(this);

        if (!$se.data("modaltrigger")) {
            var modaltrigger = new ModalTrigger($se, UI.Utils.options($se.attr("data-ui-modal")));
            modaltrigger.modal.show();
        }
    })
    
})(jQuery);

var myMammal={
    name:'Herb the Mammal',
	saying:'haha i am flying',
	get_name:function(){
	   console.log(this.name);
	},
	says:function(){
	   console.log(this.saying || ' ');
	}
};
myMammal.get_name();
myMammal.says();

jQuery.fn.extend(
{
maxHeight:function(){
var max=0;
this.each(function(){
max=Math.max(max,$(this).height()
}
}
});

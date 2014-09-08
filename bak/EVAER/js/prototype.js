/*====================================
> Array新增方法find
> 根据Array中的值返回该值在数组中第一次出现的索引
> 若无此值则返回false
======================================*/
Array.prototype.find = function(element) {
    var i;
    for (i = 0; i < this.length; i += 1) {
        if (this[i] === element) {
            return i;
        }
    }
    return false;
}
/*======================================
> Array新增方法remove
> 删除Array数组中的某值（第一次出现）并返回索引
> 如无此值则返回false
=======================================*/
Array.prototype.remove = function(element) {
    var i;
    for (i = 0; i < this.length; i += 1) {
        if (this[i] === element) {
            this.splice(i, 1)
            return i;
        }
    }
    return false;
}
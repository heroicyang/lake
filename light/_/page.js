/*
@total   总页数
@current 当前页数
根据总页数 和 当前页数返回页数应该咋显示
默认显示7个按键
*/
function page(total,current){
    var arr = [];
    if (total <= 7) {
        arr = _.range(1, total + 1);
    } else if (total == 8) {
        if (current <= 4) {
            arr = [1, 2, 3, 4, 5, 0, 8];
        } else {
            arr = [1, 0, 4, 5, 6, 7, 8];
        }
    } else if (total > 8) {
        if (current <= 4) {
            arr = [1, 2, 3, 4, 5, 0, total];
        } else if (current >= (total - 2)) {
            arr = [1, 0, total - 4, total - 3, total - 2, total - 1, total];
        } else {
            arr = [1, 0, current - 1, current, current + 1, 0, total];
        }
    }
    return arr;
}
var arr=page(39,38)
console.log(arr);
       
        
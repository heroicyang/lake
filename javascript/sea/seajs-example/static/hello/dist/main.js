define("hello/dist/main", ["./spinning", "jquery"], function (n) {
    var i = n("./spinning"), t = new i("#container");
    t.render()
}), define("hello/dist/spinning", ["jquery"], function (n, i, t) {
    function e(n) {
        this.container = o(n), this.icons = this.container.children(), this.spinnings = []
    }

    function s(n) {
        return Math.random() * n
    }

    var o = n("jquery");
    t.exports = e, e.prototype.render = function () {
        this._init(), this.container.css("background", "none"), this.icons.show(), this._spin()
    }, e.prototype._init = function () {
        var n = this.spinnings;
        return o(this.icons).each(function (i) {
            function t() {
                c.css("transform", "rotate(" + r + "deg)")
            }

            var e, r = s(360), c = o(this);
            c.css({top: s(40), left: 50 * i + s(10), zIndex: 1e3}).hover(function () {
                c.fadeTo(250, 1).css("zIndex", 1001).css("transform", "rotate(0deg)")
            }, function () {
                c.fadeTo(250, .6).css("zIndex", 1e3), e && clearTimeout(e), e = setTimeout(t, Math.ceil(s(1e4)))
            }), n[i] = t
        }), this
    }, e.prototype._spin = function () {
        return o(this.spinnings).each(function (n, i) {
            setTimeout(i, Math.ceil(s(3e3)))
        }), this
    }
});
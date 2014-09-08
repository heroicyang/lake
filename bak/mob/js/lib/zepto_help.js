/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return unRfc2068(decodeURIComponent(s.replace(pluses, ' ')));
    }

    function unRfc2068(value) {
        if (value.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        return value;
    }

    function fromJSON(value) {
        return config.json ? JSON.parse(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? null : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = fromJSON(cookie);
                break;
            }

            if (!key) {
                result[name] = fromJSON(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };

})(window.jQuery||window.Zepto, document);

//==========[[zepto 反param插件]]============//
(function($,document,undefined){
  $.getParam = function (key) { 
    var arr = window.location.search.slice(1).replace(/\+/g, ' ').split('&'); 
    var result = undefined; 
    for (var i = 0; i < arr.length; i++) { 
      if (arr[i].split('=')[0] === key) { 
        if (!result) { result = arr[i].split('=')[1]; } 
        else { 
          result = [result].concat(arr[i].split('=')[1]); } 
      } 
    } 
    return result; 
  } 
})(window.jQuery||window.Zepto,document);

/**
*对于不支持fixed的ios系统 
*采用absolute方式 将div固定在屏幕上
*/
$(function(){
    //检测移动浏览器是否支持fixed
    var div = document.createElement('div');
    div.style.cssText = 'display:none;position:fixed;z-index:100;';
    document.body.appendChild(div);

    var  supportFixed=(window.getComputedStyle(div).position == 'fixed');
    //如果不支持fixed
    if(!supportFixed){
        var $fixed=$('[data-grid="fixed"]'),
            $body=$('body');

        $fixed.css('position','absolute');
        $(window).on('scroll',function(){
            var top=$body.scrollTop();
            $fixed.css('top',top);
        });
    }

});

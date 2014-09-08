define('main',[],function(require,exports,module){
	var $=require('jquery');
	var data=require('./data');
	var css=require('./style.css');
	var tpl=require('./nav.html');

	console.log($);
	console.log(data);
	console.log(tpl);

	$('.author').html(data.author);
	$('.blog a').attr('href',data.blog);
});
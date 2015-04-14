// #http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


var $el = $('.flipper');
// var $f = $('.front');
var w = $(window).width();
var h = $(window).height();
var _w = $el.width();
var _h = $el.height();
preloadImage('2.jpg');

var ratioX = +parseFloat(w / _w).toFixed(2);
var ratioY = +parseFloat(h / _h).toFixed(2);
var tx = (w - _w) / 2;
var ty = (h - _h) / 2;
console.log(ratioX, ratioY);
console.log(tx, ty);

function init() {
	$clone = $el.clone();
	$el.after($clone);	
	$el.remove();
	$el = $clone;
	$f = $el.find(".front");
	$el.css({
		width: w - 10,
		height: h - 10
	});
	var str = "translate3d({0}px, {1}px, 0) rotate3d(0, 1, 0, 0deg) scale3d({2},{3},1)"	
	.format( -(w/2 - _w/2), -(h-_h)/2, (_w/w).toFixed(2), (_h/h).toFixed(2));
	console.log(str);
	// return;
	$el[0].style.WebkitTransform = str;
	$el[0].style.transform = str;
	
	setTimeout(function () {
		var str = "translate3d({0}px, {1}px, 0) rotate3d(0, 1, 0, {4}deg) scale3d({2},{3},1)"	
		.format( -(w/2 - _w/2), -(h-_h)/2, (_w/w).toFixed(2), (_h/h).toFixed(2), 180);
		$el[0].style.WebkitTransform = str;
		$el[0].style.transform = str;
	}, 0)
	
	setTimeout(function() {

		var str =
			// "translate3d(0, 0, 0) rotate3d(0, 1, 0, 900deg) scale3d(1,1,1)";
			"translate3d(" + tx + 'px, ' + ty + 'px, 0)' + " " +
			"rotate3d(0, 1, 0, 540deg)" + " " +
			"scale3d(" + ratioX + "," + ratioY + ",1)"
			// transformOrigin: "0 0"
			/*.addClass('second-flip');*/
		var str = "translate3d({0}px, {1}px, 0) rotate3d(0, 1, 0, {4}deg) scale3d({2},{3},1)"	
			.format(0, 0, 1, 1, 540);
		$el[0].style.WebkitTransform = str;
		$el[0].style.transform = str;

		// $(".flipper").addClass('second-flip');

		setTimeout(function() {
			$f.css('backgroundImage', "url(2.jpg)")
			$f.css('backgroundSize', "cover");
		}, 400)
	}, 1800)
}

setTimeout(function() {
	// body...
	init();
}, 500)

function preloadImage(url) {
	var img = new Image();
	img.src = url;
}

var $el = $('.flipper');
var $f = $('.front');
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
	$(".flipper").addClass('first-flip')
	setTimeout(function() {

		var str =
			// "translate3d(0, 0, 0) rotate3d(0, 1, 0, 900deg) scale3d(1,1,1)";
			"translate3d(" + tx + 'px, ' + ty + 'px, 0)' + " " +
			"rotate3d(0, 1, 0, 540deg)" + " " +
			"scale3d(" + ratioX + "," + ratioY + ",1)"
			// transformOrigin: "0 0"
			/*.addClass('second-flip');*/
		$el[0].style.WebkitTransform = str;
		$el[0].style.transform = str;

		// $(".flipper").addClass('second-flip');

		setTimeout(function() {
			$f.css('backgroundImage', "url(2.jpg)")
			$f.css('backgroundSize', "cover");
		}, 600)
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

;
(function() {
	// #http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}


	var w = $(window).width();
	var h = $(window).height();

	function preload(url) {
		var img = new Image();
		img.src = url;
	}


	$.fn.flip = function(opts) {
		opts = opts || {};
		var $el = this;
		var $f;
		var _w = $el.width();
		var _h = $el.height();

		var ratioX = +(_w / w).toFixed(3);
		var ratioY = +(_h / h).toFixed(3);
		var tx = -(w - _w) / 2;
		var ty = -(h - _h) / 2;

		init();

		function init() {
			if(opts.preloadImages){
				opts.preloadImages.forEach(function (url, i) {
					preload(url);
				});
			}

			var $clone = $el.clone();
			$el.after($clone);
			$el.remove();
			$el = $clone;
			$f = $el.find('.' + opts.frontClass || ".front");
			$el.css({
				width: w,
				height: h
			});
			var str = "translate3d({0}px, {1}px, 0) rotate3d(0, 1, 0, 0deg) scale3d({2},{3},1)"
				.format(tx, ty, ratioX, ratioY);
			console.log(str);

			$el[0].style.WebkitTransform = str;
			$el[0].style.transform = str;
		}

	};

	$.fn.flipStart = function() {
		// use this.el = $clone 
		// and then transform it
		var $el = this;
		setTimeout(function() {
			var str = "translate3d({0}px, {1}px, 0) rotate3d(0, 1, 0, {4}deg) scale3d({2},{3},1)"
				.format(-(w / 2 - _w / 2), -(h - _h) / 2, (_w / w).toFixed(2), (_h / h).toFixed(2), 180);
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
			}, 200)
		}, 1800)
	}

})();



setTimeout(function() {
	// body...
	$('.flipper').flip({
		preloadImages: ["2.jpg"]
	});
}, 500)

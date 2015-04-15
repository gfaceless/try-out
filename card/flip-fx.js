/**
 * 使用方法
 * var $el = $("selector").flip( {images: ["第一张图.jpg", "第二张图.jpg"]} );
 * 开始：$el.flip('start')
 * 返回动画: $el.flip('revert')
 * 可以使用callback 如$el.flip('start', function (){alert('fin!');})
 *
 * 也可以在初始化时传一些参数，具体见下面代码
 */


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
	var ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	var w = $(window).width();
	var h = $(window).height();

	// 预加载。有些玩具的性质，就是为了让演示时流畅些。
	// 还是得用imageLoaded
	function preload(urls) {
		if (!$.isArray(urls)) urls = [urls];
		urls.forEach(function(url) {
			var img = new Image();
			img.src = url;
		});
	}

	// 这里是默认参数。可以在初始化时传递参数对其覆盖，e.g. $('selector').flip({delay: 800})
	var defaults = {
		delay: 600,
		duration: 1200,
		frontClass: "front"
	}

	$.fn.flip = function(opts, cb) {
		if (arguments[0] == 'start') {
			start.call(this, cb);
			return this;
		}
		if (arguments[0] == 'revert') {
			revert.call(this, cb);
			return this;
		}
		if (this.length > 1) throw new Error("not supported yet");
		if (this.inited) return;

		opts = $.extend({}, defaults, opts);
		this.opts = opts;
		var $el = this;
		var pos = this.position();

		// maybe these should be more unique to prevent possible conflict
		var _w = this._w = $el.width();
		var _h = this._h = $el.height();
		var ratioX = this.ratioX = +(_w / w).toFixed(3);
		var ratioY = this.ratioY = +(_h / h).toFixed(3);
		var tx = this.tx = -(w - _w) / 2 + +pos.left.toFixed(3);
		var ty = this.ty = -(h - _h) / 2 + +pos.top.toFixed(3);
		console.log(tx, ty);
		init();

		function init() {

			preload(opts.images);

			var $clone = $el.clone();
			$el.after($clone);
			$el.remove();
			$el[0] = $clone[0];

			$el._$f = $el.find("." + opts.frontClass);
			if (opts.useImgTag) $el._$f = $el._$f.find("img");

			$el.css({
				width: w,
				height: h,
				left: 0,
				top: 0
			});

			$el._transform();
			$el.inited = true;
		}

		return this;
	};

	$.fn._transform = function(params) {
		var defaults = {
			tx: this.tx,
			ty: this.ty,
			ratioX: this.ratioX,
			ratioY: this.ratioY,
			deg: this.deg || 0
		}
		var a = arguments;
		if (arguments.length > 1) {
			params = {
				tx: a[0],
				ty: a[1],
				ratioX: a[2],
				ratioY: a[3],
				deg: a[4]
			}
		}
		// a better way? (lodash.defaults is unarguably the best)
		params = $.extend({}, defaults, params);

		var raw = "translate3d({0}px, {1}px, 0) " +
			(ios ? "rotateY({2}deg)" : "rotate3d(0,1,0,{2}deg)") +
			" scale3d({3},{4},1)";
		var str = raw.format(params.tx, params.ty, params.deg, params.ratioX, params.ratioY);
		console.log(str);
		this[0].style.WebkitTransform = str;
		this[0].style.transform = str;
	}

	function start(cb) {
		var $el = this;
		var opts = $el.opts;

		this.css("zIndex", 100);
		setTimeout(function() {
			$el._transform({
				deg: 180
			})
		}, 0)

		// return;
		setTimeout(function() {
			$el._transform(0, 0, 1, 1, 540);

			setTimeout(function() {
				if (!opts.useImgTag) {
					$el._$f.css('backgroundImage', "url({0})".format(opts.images[1]))
					$el._$f.css('backgroundSize', "cover");
				} else {
					$el._$f.prop('src', opts.images[1]);
				}
				setTimeout(function() {
					cb && cb();
				}, opts.duration)
			}, opts.duration / 2 - 200);

		}, opts.delay + opts.duration)
	}

	function revert(cb) {
		var $el = this;
		var opts = $el.opts;

		setTimeout(function() {
			$el._transform({
				deg: 180
			});
			setTimeout(function() {
				if (opts.useImgTag) {
					$el._$f.prop('src', opts.images[0]);
				} else {
					$el._$f.css('backgroundImage', "url({0})".format(opts.images[0]))
					$el._$f.css('backgroundSize', "");					
				}

			}, opts.duration / 2 - 200);

		}, 0)

		setTimeout(function() {
			$el._transform({
				deg: 0
			});
			$el.css("zIndex", 0);
			setTimeout(function() {
				cb && cb();
			}, opts.duration)
		}, opts.delay + opts.duration)
	}


})();

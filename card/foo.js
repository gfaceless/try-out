// NOTE: container should have style: position: absolute/relative

;(function(global) {
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
		frontClass: "front",
		container: "body"
	}

	var cache = {};

	function Flipper(opts) {
		opts = $.extend({}, defaults, opts);
		this.opts = opts;
		var $el = $('<div>');
		var $front = $("<div>");
		var $back = $("<div>");
		var $container = $(opts.container);

		var left = opts.left
		var top = opts.top

		var _w = this._w = parseInt(opts.width)
		var _h = this._h = parseInt(opts.height)
		var ratioX = this.ratioX = +(_w / w).toFixed(3);
		var ratioY = this.ratioY = +(_h / h).toFixed(3);
		var tx = this.tx = -(w - _w) / 2 + left;
		var ty = this.ty = -(h - _h) / 2 + top;

		var tf = {
			tx: tx,
			ty: ty,
			tz: 0,
			ratioX: ratioX,
			ratioY: ratioY,
			deg: 0
		}

		console.log(w, h, _w, _h, ratioX, ratioY, tx, ty);
		$el.css({
			// 找到现有style, 对border和box-shadow进行缩放
			width: w,
			height: h,
			left: 0,
			top: 0,
			position: "absolute",
			zIndex: 0,
			transition: "all 1.2s",
			transformStyle: "preserve-3d",
		})

		$front.add($back).css({
			width: "100%",
			height: "100%",
			backfaceVisibility: "hidden",
			position: "absolute",
			top: 0,
			top: 0,
			"backgroundSize": "100% 100%"
		});

		$front.css({
			"transform": "translate3d(0, 0, 0) rotate3d(0, 1, 0, 180deg) scale3d(1, 1, 1)"
		})


		$el.append($back);
		$el.append($front);

		preload(opts.images);

		$back.css('backgroundImage', "url({0})".format(opts.images[0]))
		$front.css('backgroundImage', "url({0})".format(opts.images[1]))

		this.$el = $el;
		this.$front = $front;
		this.$container = $container;
		this.tf = tf;
		this.transform(tf);

		$container.append($el);
	}


	Flipper.prototype.transform = function(params, above) {
		var d = {
			tx: 0,
			ty: 0,
			tz: 0,
			deg: 0,
			ratioX: 1,
			ratioY: 1
		};
		params = $.extend(d, this._lastTransform, params);

		if ( /*ios &&*/ above) {
			/*params.tz = 300;
			params.ratioX *= .7
			params.ratioY *= .7*/
		}

		var raw = "perspective(1000px) translate3d({0}px,{1}px,{2}px) " +
			(ios ? "rotateY({3}deg)" : "rotate3d(0,1,0,{3}deg)") +
			" scale3d({4},{5},1)";
		var str = raw.format(params.tx, params.ty, params.tz, params.deg, params.ratioX, params.ratioY);
		console.log(str);
		this.$el[0].style.WebkitTransform = str;
		this.$el[0].style.transform = str;

		this._lastTransform = params;
	}

	Flipper.prototype.changeFront = function(index) {
		index = index || 2;
		this.$front.css('backgroundImage', "url({0})".format(this.opts.images[index]))
			// $el._$f.css('backgroundSize', "cover");
	};

	Flipper.prototype.start = function(cb) {

		var flipper = this;
		var opts = this.opts;

		this.$el.css("zIndex", 100);

		this.transform({
			deg: 180,
			// tz: 100
		}, true)


		// return;
		setTimeout(function() {
			flipper.transform({
				tx: 0,
				ty: 0,
				tz: 0,
				ratioX: 1,
				ratioY: 1,
				deg: 540
			}, true);
			setTimeout(function() {
				flipper.changeFront();
				setTimeout(function() {
					cb && cb();
				}, opts.duration)
			}, opts.duration / 2 - 200);
		}, opts.delay + opts.duration)

	}
	Flipper.prototype.revert = function(cb) {
		var flipper = this;
		var $el = this.$el;
		var opts = this.opts;

		$el.css("zIndex", 0);
		
		flipper.transform($.extend(this.tf, {deg: 360}));


		setTimeout(function() {
			flipper.$el.css("transition", "none");
			flipper.transform({deg: 0});
			setTimeout(function () {
				flipper.$el.css("transition", "all " + (opts.duration+100) + "ms");
				// body...
			}, 0)

			flipper.changeFront(1);
			cb && cb();
		}, opts.duration)
		
	};
	Flipper.prototype.offAnimation = function() {
		this.$el.css("transition", "none");
	};

	global.Flipper = Flipper;

})(window);



f = new Flipper({
	width: "200px",
	height: "100px",
	left: 0,
	top: 0,
	images: ["images/back.png", "images/1.png", "images/1.jpg"]
})

f.start();
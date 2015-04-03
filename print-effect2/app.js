$.fn.printEffect = function(opts) {
	var ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	var container = this;
	var defaults = {
		// text: "摇滚运动会",
		images: ["img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg"],
		// also known as "left-margin"
		padding: 10,
		animSpan: 300,
		soundUrls: ["print.mp3"],
		/*src: "img/sprite.jpg",
		sprite: [
			[-0, -0, 50, 50],
			[-50, -0, 50, 50],
			[-100, -0, 50, 50],
			[-150, -0, 50, 50]
		],
		spriteWidth: 250,
		spriteHeight: 202,*/
		src: "img/sprite3.png",
		sprite: [
			[0, 0, 115, 114],
			[-115, 0, 102, 114],
			[-217, 0, 104, 114],
			[-321, 0, 104, 114]
		],
		//tmp, will automatically get this later
		spriteWidth: 600,
		spriteHeight: 400,
		

	};
	opts = $.extend({}, defaults, opts);
	var containerWidth = this.width();

	var totalWidth = 0;
	opts.sprite.forEach(function (item, i) {
		totalWidth += item[2];
	});
	

	var ratio =  (containerWidth - (opts.sprite.length - 1) * opts.padding) / totalWidth;
	console.log(ratio, totalWidth, containerWidth);


	var arr = [];
	opts.sprite.forEach(function (item, i) {
		var item = opts.sprite[i];
		var $div = $("<div>");
		$div.css({
			backgroundSize: opts.spriteWidth * ratio + "px " + opts.spriteHeight * ratio + "px",
			backgroundPosition: item[0] * ratio + "px " + item[1] * ratio + "px",
			marginLeft: i==0 ? 0: opts.padding,
			// minus 1 is a temp:
			width: Math.floor(item[2] * ratio) - 1,
			height: Math.floor(item[3] * ratio),
			float: "left",
			backgroundImage: "url(" + opts.src + ")",
			backgroundRepeat: "no-repeat"
		})
		arr.push($div);
		
	});
	
	console.log(arr);

	var lastId;

	function animate() {
		animate.counter = animate.counter || 0;
		setTimeout(function() {

			if (animate.counter == arr.length) {
				sound.pause(lastId);
				return;
			}
			container.append(arr[animate.counter]);
			arr[animate.counter].addClass("slam");

			// last one:
			if (animate.counter != arr.length - 1) {
				sound.play();
			} else {
				sound.play(function(id) {
					lastId = id;
					console.log(lastId)
				});
			}

			animate.counter++;
			animate();
		}, opts.animSpan);

	}

	var sound = new Howl({
		urls: opts.soundUrls,
		onload: function() {
			if (ios) {
				$(document).on('touchstart', function() {
					animate();
				})
			} else {

				animate();
			}
		}
	})
	s = sound;



}



$('.print').printEffect();

// Awesome work, dude!
// Yes, I meant Swiper and scroll in the same direction. I would like to trigger Swiper when a vanilla scroll reaches its end.
// 


















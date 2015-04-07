var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, "requestAnimationFrame")] || function(callback) {
        setTimeout(callback, 1000 / 60);
    }
})();

function dirProp(direction, hProp, vProp) {
    return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp
}


/**
 * Carousel
 * @param container
 * @param direction
 * @constructor
 */
function HammerCarousel(container, direction) {
    this.container = container;
    this.direction = direction;

    this.panes = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container[dirProp(direction, 'offsetWidth', 'offsetHeight')];

    this.currentIndex = 0;

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({
        direction: this.direction,
        threshold: 10
    }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

    this.show(this.currentIndex);
}


HammerCarousel.prototype = {
    /**
     * show a pane
     * @param {Number} showIndex
     * @param {Number} [percent] percentage visible
     * @param {Boolean} [animate]
     */
    show: function(showIndex, percent, animate) {
        showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));
        percent = percent || 0;

        var className = this.container.className;
        if (animate) {
            if (className.indexOf('animate') === -1) {
                this.container.className += ' animate';
            }
        } else {
            if (className.indexOf('animate') !== -1) {
                this.container.className = className.replace('animate', '').trim();
            }
        }

        var scale, scaleStr;

        var paneIndex, pos, translate;
        for (paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {

            pos = (this.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent);
            
            var modifier = paneIndex === this.currentIndex ? .1 : 1;
            translate = 'translate3d(0, ' + pos * modifier + 'px, 0)'
            
            scale = paneIndex === this.currentIndex ? (1 - Math.min(Math.abs(percent*0.003), 1)) : 1;
            console.log('percent and scale is', percent, scale);
            scaleStr = 'scale(' + scale + ')';
            this.panes[paneIndex].style.transform = translate + " " + scaleStr;
            this.panes[paneIndex].style.mozTransform = translate + " " + scaleStr;
            this.panes[paneIndex].style.webkitTransform = translate + " " + scaleStr;
        }

        this.currentIndex = showIndex;
    },

    /**
     * handle pan
     * @param {Object} ev
     */
    onPan: function(ev) {

        var pauseHammer;

        if (this.currentIndex === 1) {
            pauseHammer = true;
            if (myScroll.y === 0 && ev.direction === Hammer.DIRECTION_DOWN) {
                myScroll.disable();
                if (ev.type == "panstart") {
                    this.inTransition = true;
                }
                pauseHammer = false;
            }
            console.log('in onpan', myScroll.y, this.inTransition);
            if (ev.direction != Hammer.DIRECTION_DOWN && this.inTransition) {
                pauseHammer = false;
            }
            if (ev.type == 'panend') {
                this.inTransition = false;
                // very lite, just a prop changed
                myScroll.enable();
            }
        }
        if (pauseHammer) return;
        ev.preventDefault();

        var delta = dirProp(this.direction, ev.deltaX, ev.deltaY);
        var percent = (100 / this.containerSize) * delta;
        var animate = false;

        if (ev.type == 'panend' || ev.type == 'pancancel') {
            if (Math.abs(percent) > 20 && ev.type == 'panend') {
                this.currentIndex += (percent < 0) ? 1 : -1;
            }
            percent = 0;
            animate = true;
        }


        this.show(this.currentIndex, percent, animate);
    }
};

// the horizontal pane scroller
var outer = new HammerCarousel(document.querySelector(".container"), Hammer.DIRECTION_VERTICAL);
var scrollTop;
var page2 = document.querySelector('.page2')

$(function() {
    myScroll = new IScroll('.page2', {
        scrollX: false,
        scrollY: true,
        momentum: true,
        bounce: false
    });
    
})

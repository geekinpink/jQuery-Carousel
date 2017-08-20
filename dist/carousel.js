/**
 * Carousel
 * Version 1.0
 * by geek on 8/19/17
 */
(function ($) {
    if (!$) {
        return console.warn("Carousel needs jQuery");
    }

    function Carousel($el, opts) {
        this.$el = $el;
        this.opts = this._setupOpts(opts);
        this.timer = null;
        this.curIndex = 0;
        this.$boxInner = null;
        this.$arrowLeft = null;
        this.$arrowRight = null;
        this.$indicatorItems = null;
        this.$items = null;
        this.itemsCount = 0;
        this.width = this.$el.width();
        this.height = this.$el.height();

        this.init();
    }

    Carousel.prototype = {
        constructor: Carousel,

        //初始化参数
        _setupOpts: function (opts) {
            var defaultOpts = {
                effect: 1, //0为 translate 1为 fade
                autoplay: true, //是否自动播放
                delay: 2000, //播放间隔
                reverse: false, //是否逆序播放
                speed: "normal", //播放速度
                change: null,//钩子函数，索引改变，
                click: null,//钩子函数，点击事件
            };
            if (typeof opts == "object") {
                for (var key in defaultOpts) {
                    if (opts[key] != null) {
                        defaultOpts[key] = opts[key];
                    }
                }
            }
            return defaultOpts;
        },

        //初始化
        init: function () {
            var self = this;

            self.render();

            if (self.opts.autoplay) {

                self.start();

                self.initHoverEvent();
            }

            self.initArrow();
        },

        //加上需要用到的样式，生成arrow 和 indicator
        render: function () {
            var self = this, $indicator;

            self.$boxInner = self.$el.find("ul").eq(0);
            self.$items = self.$boxInner.find("li");
            self.itemsCount = self.$items.length;
            self.$items.click(function () {
                if (typeof self.opts.click == "function") {
                    self.opts.click.call(this, $(this).index());
                }
            });
            self.$el.css({
                overflow: "hidden",
                position: "relative"
            });
            if (self.opts.effect == 0) {
                //translate 效果
                //如果是 translate 效果的轮播图，需要在末尾加上一项
                self.$items.eq(0).clone().appendTo(self.$boxInner);

                self.$boxInner.css({
                    position: "absolute",
                    width: (self.itemsCount + 1) * self.width,
                    height: "100%"
                });
                self.$boxInner.find("li").css({
                    cssFloat: "left",
                    width: self.width
                })
            } else if (self.opts.effect == 1) {
                // fade 效果
                self.$el.css({
                    position: "relative"
                });
                self.$boxInner.css({
                    position:"relative",
                    width: self.width,
                    height: self.height
                });
                self.$items.css({
                    position: "absolute",
                    width:self.width,
                    height:self.height,
                    top: 0,
                    left: 0,
                    opacity: 0,
                    zIndex: 0
                });
                self.$items.eq(0).css({
                    opacity: 1,
                    zIndex: 1
                });

            }

            //arrow
            self.$arrowLeft = $("<a class='carousel-arrow left' href='javascript:;'>&lt;</a>");
            self.$arrowRight = $("<a class='carousel-arrow right' href='javascript:;'>&gt;</a>");
            self.$el.append(self.$arrowLeft).append(self.$arrowRight);

            //indicator
            $indicator = $("<ul class='carousel-indicator'></ul>");
            for (var i = 0; i < self.itemsCount; i++) {
                $indicator.append($("<li></li>"));
            }
            self.$el.append($indicator);
            self.$indicatorItems = self.$el.find(".carousel-indicator li");

            //change初始的回调
            if (typeof self.opts.change == "function") {
                self.opts.change.call(self, self.curIndex);
            }
        },


        //自动播放
        start: function () {
            var self = this;
            clearInterval(self.timer);
            self.timer = setInterval(function () {
                self.opts.reverse ? self.prev() : self.next();
            }, self.opts.delay);

        },

        //停止自动轮播
        stop: function () {
            clearInterval(this.timer);
        },

        //切换到索引为 n 的图片
        switchTo: function (n) {
            var self = this;
            if (self.opts.effect == 0) {
                self.translate(n);
            } else if (self.opts.effect == 1) {
                self.fade(n);
            }
            if (typeof self.opts.change == "function") {
                self.opts.change.call(self, self.curIndex);
            }
        },

        //translate 效果处理逻辑
        translate: function (n) {
            var self = this,
                maxIndex = self.itemsCount - 1;

            if (self.curIndex == n) {
                return;
            }

            if (n == -1) {
                self.curIndex = maxIndex;
                self.$boxInner.css({left: -(maxIndex + 1) * self.width});
                self.$boxInner.animate({left: -self.curIndex * self.width}, self.opts.speed);
            } else if (n == maxIndex + 1) {
                self.curIndex = 0;
                self.$boxInner.stop().animate({left: -(maxIndex + 1) * self.width}, self.opts.speed, function () {
                    self.$boxInner.css({left: 0});
                });
            } else {
                self.curIndex = n % self.itemsCount;
                self.$boxInner.stop().animate({left: -self.curIndex * self.width}, self.opts.speed);
            }
        },

        //fade 效果处理逻辑
        fade: function (n) {
            var self = this,
                $item = self.$items,
                maxIndex = self.itemsCount - 1;

            if (self.curIndex == n) {
                return;
            }

            if (n < 0) {
                self.curIndex = maxIndex;
            } else {
                self.curIndex = n % self.itemsCount;
            }

            $item.css({zIndex: 0})
                .eq(self.curIndex)
                .css({zIndex: 1})
                .stop()
                .animate({opacity: 1}, self.opts.speed, function () {
                    $(this).siblings().css({opacity: 0, zIndex: 0});
                });
        },

        //上一张图片
        prev: function () {
            this.switchTo(this.curIndex - 1);
        },

        //下一张图片
        next: function () {
            this.switchTo(this.curIndex + 1)
        },

        //鼠标悬停停止播放
        initHoverEvent: function () {
            var self = this;
            self.$el.hover(function () {
                self.stop();
            }, function () {
                self.start();
            });
        },

        initArrow: function () {
            var self = this;
            self.$arrowLeft.click(function () {
                self.prev();
            });

            self.$arrowRight.click(function () {
                self.next();
            });
        }

    };


    var carousel = function (opts) {
        var $this = this, carousel;
        carousel = new Carousel($this, opts);
        return $this.data("carousel", carousel);
    };


    //扩展到 jquery 上
    $.fn.extend({carousel: carousel});


})(window.jQuery);
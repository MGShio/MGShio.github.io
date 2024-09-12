(function () {
    // Variable declarations
    var a,
        b,
        c,
        d,
        e,
        f = function (a, b) {
            // Returns a function that binds `a` to `b`
            return function () {
                return a.apply(b, arguments);
            };
        },
        // Polyfill for `indexOf` method, if not present
        g =
            [].indexOf ||
            function (a) {
                for (var b = 0, c = this.length; c > b; b++) if (b in this && this[b] === a) return b;
                return -1;
            };

    // Utility functions
    b = (function () {
        function a() {}

        a.prototype.extend = function (a, b) {
            // Extends object `a` with properties from object `b`
            var c, d;
            for (c in b) (d = b[c]), null == a[c] && (a[c] = d);
            return a;
        };

        a.prototype.isMobile = function (a) {
            // Detects if the user is on a mobile device
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a);
        };

        a.prototype.addEvent = function (a, b, c) {
            // Adds an event listener for modern and older browsers
            return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : (a[b] = c);
        };

        a.prototype.removeEvent = function (a, b, c) {
            // Removes an event listener for modern and older browsers
            return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b];
        };

        a.prototype.innerHeight = function () {
            // Returns the inner height of the window
            return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight;
        };

        return a;
    })();

    // Fallback for WeakMap
    c = this.WeakMap || this.MozWeakMap || (c = (function () {
        function a() {
            this.keys = [];
            this.values = [];
        }

        a.prototype.get = function (a) {
            // Get the value associated with key `a`
            var b, c, d, e, f;
            for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) if (((c = f[b]), c === a)) return this.values[b];
        };

        a.prototype.set = function (a, b) {
            // Set the value `b` for key `a`
            var c, d, e, f, g;
            for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) if (((d = g[c]), d === a)) return void (this.values[c] = b);
            return this.keys.push(a), this.values.push(b);
        };

        return a;
    })());

    // MutationObserver fallback
    a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = (function () {
        function a() {
            // Fallback when MutationObserver is not supported
            "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser.");
            "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.");
        }
        return (a.notSupported = !0), (a.prototype.observe = function () {}), a;
    })());

    // Fallback for getComputedStyle
    d = this.getComputedStyle || function (a) {
        return (
            (this.getPropertyValue = function (b) {
                var c;
                return (
                    "float" === b && (b = "styleFloat"), // Fallback for 'float'
                    e.test(b) &&
                        b.replace(e, function (a, b) {
                            return b.toUpperCase();
                        }),
                    (null != (c = a.currentStyle) ? c[b] : void 0) || null
                );
            }),
            this
        );
    };

    // Regular expression used to match CSS properties
    e = /(\-([a-z]){1})/g;

    // WOW.js constructor function
    this.WOW = (function () {
        function e(a) {
            null == a && (a = {}),
                (this.scrollCallback = f(this.scrollCallback, this)),
                (this.scrollHandler = f(this.scrollHandler, this)),
                (this.start = f(this.start, this)),
                (this.scrolled = !0),
                (this.config = this.util().extend(a, this.defaults)),
                (this.animationNameCache = new c());
        }

        // Default settings
        e.prototype.defaults = { boxClass: "wow", animateClass: "animated", offset: 0, mobile: !0, live: !0 };

        // Initialize WOW.js
        e.prototype.init = function () {
            var a;
            return (
                (this.element = window.document.documentElement),
                "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start),
                (this.finished = [])
            );
        };

        // Start the animations and scroll event listeners
        e.prototype.start = function () {
            var b, c, d, e;
            if (!this.disabled()) {
                this.boxes = this.element.querySelectorAll("." + this.config.boxClass);
                this.all = Array.prototype.slice.call(this.boxes);

                if (this.boxes.length) {
                    if (this.disabled()) this.resetStyle();
                    else {
                        for (e = this.boxes, c = 0, d = e.length; d > c; c++) (b = e[c]), this.applyStyle(b, !0);
                    }

                    if (!this.disabled()) {
                        this.util().addEvent(window, "scroll", this.scrollHandler);
                        this.util().addEvent(window, "resize", this.scrollHandler);
                        this.interval = setInterval(this.scrollCallback, 50);
                    }

                    if (this.config.live) {
                        new a(
                            (function (a) {
                                return function (b) {
                                    var c, d, e, f, g;
                                    for (g = [], e = 0, f = b.length; f > e; e++)
                                        (d = b[e]),
                                            g.push(
                                                function () {
                                                    var a, b, e, f;
                                                    for (e = d.addedNodes || [], f = [], a = 0, b = e.length; b > a; a++) (c = e[a]), f.push(this.doSync(c));
                                                    return f;
                                                }.call(a)
                                            );
                                    return g;
                                };
                            })(this)
                        ).observe(document.body, { childList: !0, subtree: !0 });
                    }
                }
            }
        };

        // Stops WOW.js by removing event listeners
        e.prototype.stop = function () {
            return (this.stopped = !0), this.util().removeEvent(window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), clearInterval(this.interval);
        };

        // Sync newly added elements manually
        e.prototype.sync = function () {
            return a.notSupported ? this.doSync(this.element) : void 0;
        };

        // Sync method to apply WOW.js animations to new elements
        e.prototype.doSync = function (a) {
            var b, c, d, e, f;
            if (1 === a.nodeType) {
                for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) {
                    b = e[c];
                    if (g.call(this.all, b) < 0) {
                        this.boxes.push(b);
                        this.all.push(b);
                        if (!this.stopped && !this.disabled()) {
                            this.applyStyle(b, !0);
                            this.scrolled = !0;
                        }
                    }
                }
            }
        };

        // Show elements by applying animations
        e.prototype.show = function (a) {
            return this.applyStyle(a), (a.className = "" + a.className + " " + this.config.animateClass);
        };

        // Apply the necessary style to an element
        e.prototype.applyStyle = function (a, b) {
            var c, d, e;
            d = a.getAttribute("data-wow-duration");
            c = a.getAttribute("data-wow-delay");
            e = a.getAttribute("data-wow-iteration");
            this.animate(function () {
                return this.customStyle(a, b, d, c, e);
            }.bind(this));
        };

        // Animation handling (requestAnimationFrame fallback)
        e.prototype.animate = (function () {
            return "requestAnimationFrame" in window
                ? function (a) {
                      return window.requestAnimationFrame(a);
                  }
                : function (a) {
                      return a();
                  };
        })();

        // Reset the style of elements
        e.prototype.resetStyle = function () {
            var a, b, c, d, e;
            for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) (a = d[b]), e.push((a.style.visibility = "visible"));
            return e;
        };

        // Apply custom animation styles
        e.prototype.customStyle = function (a, b, c, d, e) {
            return b && this.cacheAnimationName(a),
                (a.style.visibility = b ? "hidden" : "visible"),
                c && this.vendorSet(a.style, { animationDuration: c }),
                d && this.vendorSet(a.style, { animationDelay: d }),
                e && this.vendorSet(a.style, { animationIterationCount: e }),
                this.vendorSet(a.style, { animationName: b ? "none" : this.cachedAnimationName(a) });
        };

        // Cache the animation name for optimization
        e.prototype.cacheAnimationName = function (a) {
            return this.animationNameCache.set(a, this.animationName(a));
        };

        // Get the cached animation name
        e.prototype.cachedAnimationName = function (a) {
            return this.animationNameCache.get(a);
        };

        // Determine the animation name for an element
        e.prototype.animationName = function (a) {
            var b;
            try {
                b = d(a).getPropertyValue("animation-name");
            } catch (c) {
                b = d(a).animationName;
            }
            return "none" === b ? "" : b;
        };

        // Set the vendor-specific properties for an element
        e.prototype.vendorSet = function (a, b) {
            var c, d, e, f;
            for (c in b) {
                (d = b[c]), (a["" + c] = d);
                for (e = 0, f = this.vendors.length; f > e; e++) (a["" + this.vendors[e] + c.charAt(0).toUpperCase() + c.substr(1)] = d);
            }
        };

        // Determine if the user is on a mobile device
        e.prototype.disabled = function () {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        };

        // Utility functions access
        e.prototype.util = function () {
            return this._util || (this._util = new b());
        };

        return e;
    })();
}.call(this));
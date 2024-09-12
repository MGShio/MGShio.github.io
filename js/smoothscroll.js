//https://gist.github.com/motorcitymobi/4597044

/**
 * SmoothScroll
 * This helper script created by DWUser.com. Copyright 2013 DWUser.com.
 * Dual-licensed under the GPL and MIT licenses.
 * All individual scripts remain property of their copyrighters.
 * Date: 10-Sep-2013
 * Version: 1.0.1
 */

// Check if jQuery is loaded, if not, show an alert message
if (!window["jQuery"])
  alert(
    "The jQuery library must be included before the smoothscroll.js file.  The plugin will not work properly."
  );

/**
 * SmoothScroll Plugin
 * Copyright (c) 2007 Ariel Flesler - aflesler ○ gmail • com | https://github.com/flesler
 * Licensed under MIT
 * @version 2.1.2
 * This plugin provides smooth scrolling functionality for navigation links.
 */
(function(f) {
  "use strict";
  
  // Universal Module Definition (UMD) pattern for compatibility with AMD, CommonJS, or global context
  "function" === typeof define && define.amd
    ? define(["jquery"], f) // AMD
    : "undefined" !== typeof module && module.exports
      ? (module.exports = f(require("jquery"))) // CommonJS
      : f(jQuery); // Global context
})(function($) {
  "use strict";

  // Helper function to check if an element is the window, document, html, or body
  function n(a) {
    return (
      !a.nodeName ||
      -1 !== $.inArray(a.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"])
    );
  }

  // Helper function to handle offset values for scrolling
  function h(a) {
    return $.isFunction(a) || $.isPlainObject(a) ? a : { top: a, left: a };
  }

  /**
   * Main scrollTo function that animates the scroll to a target element.
   * @param {Element|jQuery} a - The target element to scroll to.
   * @param {Number} d - The duration of the scroll animation.
   * @param {Object} b - Options for the scroll animation (e.g., axis, offset, etc.).
   */
  var p = ($.scrollTo = function(a, d, b) {
    return $(window).scrollTo(a, d, b);
  });

  // Default settings for the scrollTo plugin
  p.defaults = { axis: "xy", duration: 0, limit: !0 };

  // jQuery plugin to scroll the page or an element to a specific position or target element
  $.fn.scrollTo = function(a, d, b) {
    "object" === typeof d && ((b = d), (d = 0)); // If duration is passed as an object
    "function" === typeof b && (b = { onAfter: b }); // If a callback is passed instead of options
    "max" === a && (a = 9e9); // If 'max' is passed, scroll to the maximum possible position
    b = $.extend({}, p.defaults, b); // Extend defaults with the passed options
    d = d || b.duration; // Use the passed duration or the default
    var u = b.queue && 1 < b.axis.length; // If there is more than one axis (e.g., both x and y)
    u && (d /= 2); // If both axes are used, divide the duration by 2
    b.offset = h(b.offset); // Handle offset values
    b.over = h(b.over); // Handle over-scroll values

    // Iterate through each matched element and apply the scroll animation
    return this.each(function() {
      function k(a) {
        var k = $.extend({}, b, {
          queue: !0,
          duration: d,
          complete:
            a &&
            function() {
              a.call(q, e, b); // Call the after-scroll callback
            }
        });
        r.animate(f, k); // Perform the scroll animation
      }

      if (null !== a) {
        var l = n(this), // Check if the current element is the window or document
          q = l ? this.contentWindow || window : this, // Determine the scrollable element
          r = $(q), // jQuery object for the scrollable element
          e = a, // Target element or position
          f = {}, // Scroll positions for x and y axes
          t;

        // Determine the target position or element
        switch (typeof e) {
          case "number":
          case "string":
            if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)) {
              e = h(e); // If the target is a number or a string representing a position
              break;
            }
            e = l ? $(e) : $(e, q); // Find the target element in the DOM
          case "object":
            if (e.length === 0) return; // If the target element doesn't exist, stop
            if (e.is || e.style) t = (e = $(e)).offset(); // Get the target element's offset
        }

        // Handle the scroll for each axis
        var v = ($.isFunction(b.offset) && b.offset(q, e)) || b.offset; // Calculate the offset
        $.each(b.axis.split(""), function(a, c) {
          var d = "x" === c ? "Left" : "Top", // Determine the axis (x or y)
            m = d.toLowerCase(),
            g = "scroll" + d, // Get the scroll property (scrollLeft or scrollTop)
            h = r[g](), // Current scroll position
            n = p.max(q, c); // Maximum scrollable position

          // If scrolling to a target element, calculate the target position
          t
            ? ((f[g] = t[m] + (l ? 0 : h - r.offset()[m])),
              b.margin &&
                ((f[g] -= parseInt(e.css("margin" + d), 10) || 0), // Subtract margin
                (f[g] -= parseInt(e.css("border" + d + "Width"), 10) || 0)), // Subtract border
              (f[g] += v[m] || 0), // Add offset
              b.over[m] &&
                (f[g] += e["x" === c ? "width" : "height"]() * b.over[m])) // Handle over-scroll
            : ((d = e[m]), // Handle direct scroll to a position
              (f[g] =
                d.slice && "%" === d.slice(-1)
                  ? (parseFloat(d) / 100) * n
                  : d)); // Convert percentage to pixels if needed

          // Limit the scroll position if necessary
          b.limit &&
            /^\d+$/.test(f[g]) &&
            (f[g] = 0 >= f[g] ? 0 : Math.min(f[g], n));

          // Handle multiple axes (e.g., x and y)
          !a &&
            1 < b.axis.length &&
            (h === f[g] ? (f = {}) : u && (k(b.onAfterFirst), (f = {})));
        });
        k(b.onAfter); // Perform the scroll and call the after-scroll callback
      }
    });
  };

  // Calculate the maximum scrollable position for an element
  p.max = function(a, d) {
    var b = "x" === d ? "Width" : "Height",
      h = "scroll" + b;
    if (!n(a)) return a[h] - $(a)[b.toLowerCase()](); // Return the max scroll value for non-window elements
    var b = "client" + b,
      k = a.ownerDocument || a.document,
      l = k.documentElement,
      k = k.body;
    return Math.max(l[h], k[h]) - Math.min(l[b], k[b]); // Return the max scroll value for the document
  };

  // jQuery animation hook for scrollLeft and scrollTop properties
  $.Tween.propHooks.scrollLeft = $.Tween.propHooks.scrollTop = {
    get: function(a) {
      return $(a.elem)[a.prop](); // Get the current scroll position
    },
    set: function(a) {
      var d = this.get(a); // Get the current position
      if (a.options.interrupt && a._last && a._last !== d)
        return $(a.elem).stop(); // Stop the animation if interrupted
      var b = Math.round(a.now);
      d !== b && ($(a.elem)[a.prop](b), (a._last = this.get(a))); // Set the new scroll position
    }
  };

  return p;
});

/**
 * Another part of the SmoothScroll Plugin
 * This handles smooth scrolling for anchor links using hashes.
 * @version 2.0.0
 */
!(function(e) {
  // UMD pattern for compatibility
  "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery);
})(function(e) {
  function t(t, o, n) {
    var i = o.hash.slice(1), // Extract the hash value (without the #)
      a = document.getElementById(i) || document.getElementsByName(i)[0]; // Find the target element by ID or name
    if (a) {
      t && t.preventDefault(); // Prevent default anchor behavior
      var l = e(n.target); // Get the triggering element
      if (
        !(
          (n.lock && l.is(":animated")) || // Check if it's already animating
          (n.onBefore && !1 === n.onBefore(t, a, l)) // Call the onBefore callback
        )
      ) {
        if ((n.stop && l.stop(!0), n.hash)) {
          var r = a.id === i ? "id" : "name",
            s = e("<a> </a>")
              .attr(r, i)
              .css({
                position: "absolute",
                top: e(window).scrollTop(),
                left: e(window).scrollLeft()
              });
          (a[r] = ""),
            e("body").prepend(s), // Temporarily set the ID or name to empty
            (location.hash = o.hash), // Update the URL hash
            s.remove(), // Restore the original ID or name
            (a[r] = i);
        }
        l.scrollTo(a, n).trigger("notify.serialScroll", [a]); // Perform the scroll and notify listeners
      }
    }
  }

  // Store the base URL without the hash
  var o = location.href.replace(/#.*/, ""),
    n = (e.localScroll = function(t) {
      e("body").localScroll(t); // Initialize localScroll on the body
    });

  // Default settings for localScroll
  n.defaults = {
    duration: 1e3, // 1000ms scroll duration
    axis: "y", // Only scroll on the y-axis by default
    event: "click", // Trigger scrolling on click
    stop: !0, // Stop any ongoing animations before starting
    target: window, // Scroll the window by default
    autoscroll: !0 // Automatically scroll if a hash is present on page load
  };

  // jQuery plugin for localScroll
  e.fn.localScroll = function(i) {
    function a() {
      return (
        !!this.href && // Check if the element has an href attribute
        !!this.hash && // Check if the href contains a hash
        this.href.replace(this.hash, "") === o && // Check if the URL matches the base URL
        (!i.filter || e(this).is(i.filter)) // If a filter is provided, check if the element matches
      );
    }

    // Apply the localScroll behavior to the matched elements
    return (
      (i = e.extend({}, n.defaults, i)).autoscroll &&
        i.hash &&
        location.hash &&
        (i.target && window.scrollTo(0, 0), t(0, location, i)), // Handle auto-scrolling on page load
      i.lazy
        ? this.on(i.event, "a,area", function(e) {
            a.call(this) && t(e, this, i); // Lazy loading, bind event to anchor elements
          })
        : this.find("a,area")
            .filter(a) // Filter for anchor elements
            .bind(i.event, function(e) {
              t(e, this, i); // Bind the scroll event to anchor links
            })
            .end()
            .end()
    );
  };

  n.hash = function() {}; // Placeholder function for hash navigation
  return n;
});

// Initialize all .smoothScroll links to apply smooth scrolling
jQuery(function($) {
  $.localScroll({ filter: ".smoothScroll" }); // Only apply to links with the class 'smoothScroll'
});

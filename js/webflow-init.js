/*!
 * Webflow Initialization Script
 * Detects touch capabilities and applies appropriate CSS classes
 */
!(function (o, c) {
  var n = c.documentElement,
    t = " w-mod-";
  n.className += t + "js";
  if ("ontouchstart" in o ||
      (o.DocumentTouch && c instanceof DocumentTouch)) {
    n.className += t + "touch";
  }
})(window, document);

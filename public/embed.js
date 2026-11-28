/*! ForgeXD free on-page SEO audit widget. https://forgexd.co.za/tools/free-on-page-seo-audit-tool */
(function () {
  var ORIGIN = "https://forgexd.co.za";
  var SELECTOR = "[data-forgexd-seo-audit]";

  function mount() {
    var hosts = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      if (host.getAttribute("data-forgexd-ready")) continue;
      host.setAttribute("data-forgexd-ready", "1");
      var frame = document.createElement("iframe");
      var theme = host.getAttribute("data-theme") || "light";
      frame.src =
        ORIGIN +
        "/embed/seo-audit?theme=" +
        encodeURIComponent(theme) +
        "&page=" +
        encodeURIComponent(location.href.split("#")[0]);
      frame.title = "Free on-page SEO audit tool by ForgeXD";
      frame.loading = "lazy";
      frame.setAttribute("allow", "clipboard-write");
      frame.style.cssText = "display:block;width:100%;min-height:760px;border:0;background:transparent;";
      host.insertBefore(frame, host.firstChild);
    }
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== ORIGIN) return;
    var data = event.data;
    if (!data || data.type !== "forgexd-seo-audit:height") return;
    var frames = document.querySelectorAll(SELECTOR + " iframe");
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === event.source) {
        frames[i].style.height = Math.max(400, Number(data.height) || 0) + "px";
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

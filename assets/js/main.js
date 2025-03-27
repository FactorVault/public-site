(function ($) {
  const $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Nav.
  const $nav = $("#nav");

  if ($nav.length > 0) {
    // Links.
    const $nav_a = $nav.find("a");

    $nav_a
      .scrolly({
        speed: 1000,
        offset: function () {
          return $nav.height();
        },
      })
      .on("click", function () {
        const $this = $(this);

        // External link? Bail.
        if ($this.attr("href").charAt(0) != "#") return;

        // Deactivate all links.
        $nav_a.removeClass("active").removeClass("active-locked");

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this.addClass("active").addClass("active-locked");
      })
      .each(function () {
        const $this = $(this),
          id = $this.attr("href"),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1) return;

        // Scrollex.
        $section.scrollex({
          mode: "middle",
          initialize: function () {
            // Deactivate section.
            if (browser.canUse("transition")) $section.addClass("inactive");
          },
          enter: function () {
            // Activate section.
            $section.removeClass("inactive");

            // No locked links? Deactivate all links and activate this section's one.
            if ($nav_a.filter(".active-locked").length == 0) {
              $nav_a.removeClass("active");
              $this.addClass("active");
            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass("active-locked"))
              $this.removeClass("active-locked");
          },
        });
      });
  }

  // Scrolly.
  $(".scrolly").scrolly({
    speed: 1000,
  });

  const $downloadCta1 = $("#downloadCta1");
  const $downloadCta2 = $("#downloadCta2");

  // Hide all download buttons initially
  $downloadCta1.find("a").hide();
  $downloadCta2.find("a").hide();

  // Detect browser
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    $downloadCta1.find(".cta-chrome").show();
    $downloadCta2.find(".cta-chrome").show();
  } else if (userAgent.includes("Firefox")) {
    $downloadCta1.find(".cta-firefox").show();
    $downloadCta2.find(".cta-firefox").show();
  } else if (userAgent.includes("Edg")) {
    // Detect Edge (Chromium-based)
    $downloadCta1.find(".cta-edge").show();
    $downloadCta2.find(".cta-edge").show();
  }

  const $macShortcut = $("#macShortcut");
  const $windowsShortcut = $("#windowsShortcut");

  // Hide both shortcuts initially
  $macShortcut.hide();
  $windowsShortcut.hide();

  // Detect OS using userAgent.
  if (/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    $macShortcut.show();
  } else if (/Windows/i.test(navigator.userAgent)) {
    $windowsShortcut.show();
  }
})(jQuery);

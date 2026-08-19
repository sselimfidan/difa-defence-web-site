/* ============================================================
   Difa Defence — public site runtime (i18n + interactive map)
   ============================================================ */
(function () {
  var C = DifaStore.get();
  var LANG = DifaStore.getLang();
  var mapObj = null;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  var t = function (v) { return DifaStore.t(v, LANG); };
  var ui = function (key) { return t(window.DIFA_UI[key]); };
  var bg = function (url) { return "background-image:url('" + String(url).replace(/'/g, "%27") + "')"; };

  function logoHtml() {
    return '<a class="logo" href="#home" aria-label="' + esc(C.brand.name) + '">' +
      DifaSvg.mark("mark") +
      '<span class="logo__text">' +
        '<span class="logo__name">' + esc(C.brand.name) + '</span>' +
        '<span class="logo__tag">' + esc(t(C.brand.tagline)) + '</span>' +
      '</span></a>';
  }

  function langSwitcherHtml() {
    var opts = DifaStore.langs().map(function (code) {
      return '<button role="option" data-lang="' + code + '"' +
        (code === LANG ? ' aria-selected="true" class="is-active"' : '') + '>' +
        esc(window.DIFA_LANG_NAMES[code]) + '</button>';
    }).join("");
    return '<div class="lang" id="lang-switch">' +
      '<button class="lang__btn" id="lang-btn" aria-haspopup="listbox" aria-expanded="false">' +
        DifaSvg.globe + '<span>' + esc(LANG.toUpperCase()) + '</span>' + DifaSvg.chevron +
      '</button>' +
      '<div class="lang__menu" role="listbox" aria-label="' + esc(ui("language")) + '">' + opts + '</div>' +
    '</div>';
  }

  function render() {
    document.documentElement.lang = LANG;
    document.documentElement.dir = DifaStore.isRTL(LANG) ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", DifaStore.isRTL(LANG));
    document.title = C.brand.name + " — " + t(C.brand.tagline);

    /* header */
    $("#brand").innerHTML = logoHtml();
    $("#nav").innerHTML =
      C.nav.map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(t(n.label)) + '</a>'; }).join("") +
      langSwitcherHtml();

    /* hero */
    $("#hero-media").setAttribute("style", bg(C.hero.image));
    $("#hero-inner").innerHTML =
      (t(C.hero.eyebrow) ? '<span class="hero__eyebrow">' + esc(t(C.hero.eyebrow)) + '</span>' : '') +
      (t(C.hero.title) ? '<h1 class="hero__title">' + esc(t(C.hero.title)) + '</h1>' : '') +
      (t(C.hero.subtitle) ? '<p class="hero__subtitle">' + esc(t(C.hero.subtitle)) + '</p>' : '') +
      (t(C.hero.ctaLabel) ? '<a class="btn" href="' + esc(C.hero.ctaHref || "#about") + '">' +
          esc(t(C.hero.ctaLabel)) + DifaSvg.arrow + '</a>' : '');
    $("#scroll-cue").textContent = ui("scroll");

    /* about */
    $("#about-copy").innerHTML =
      '<p class="eyebrow">' + esc(ui("whoWeAre")) + '</p>' +
      '<h2 class="h-title">' + esc(t(C.about.title)) + '</h2>' +
      '<div class="rule"></div>' +
      '<div class="prose">' + C.about.paragraphs.map(function (p) {
        return '<p>' + esc(t(p)) + '</p>';
      }).join("") + '</div>' + DifaSvg.mark("sig");
    $("#about-media").innerHTML =
      '<img class="m-back" src="' + esc(C.about.image2) + '" alt="" loading="lazy">' +
      '<img class="m-front" src="' + esc(C.about.image1) + '" alt="" loading="lazy">';

    /* activities */
    var imgs = C.activities.images || [];
    $("#act-media").innerHTML =
      (imgs[0] ? '<img class="i1" src="' + esc(imgs[0]) + '" alt="" loading="lazy">' : '') +
      (imgs[1] ? '<img class="i2" src="' + esc(imgs[1]) + '" alt="" loading="lazy">' : '') +
      (imgs[2] ? '<img class="i3" src="' + esc(imgs[2]) + '" alt="" loading="lazy">' : '');
    $("#act-copy").innerHTML =
      '<p class="eyebrow">' + esc(ui("whatWeDo")) + '</p>' +
      '<h2 class="h-title">' + esc(t(C.activities.title)) + '</h2>' +
      '<div class="rule rule--right"></div>' +
      '<div class="prose"><p>' + esc(t(C.activities.body)) + '</p></div>' +
      DifaSvg.mark("sig");

    /* products */
    $("#products-head").innerHTML =
      '<p class="eyebrow">' + esc(ui("capabilities")) + '</p>' +
      '<h2 class="h-title">' + esc(t(C.products.title)) + '</h2>' +
      '<p>' + esc(t(C.products.subtitle)) + '</p>';
    $("#products-cards").innerHTML = (C.products.items || []).map(function (it) {
      return '<article class="card">' +
        '<div class="card__img"><img src="' + esc(it.image) + '" alt="' + esc(t(it.title)) + '" loading="lazy"></div>' +
        '<div class="card__body"><h3>' + esc(t(it.title)) + '</h3><p>' + esc(t(it.desc)) + '</p></div>' +
      '</article>';
    }).join("");

    /* contact */
    var m = C.contact.map || {};
    var mapsLink = "https://www.openstreetmap.org/?mlat=" + m.lat + "&mlon=" + m.lng + "#map=" + (m.zoom || 13) + "/" + m.lat + "/" + m.lng;
    $("#contact-copy").innerHTML =
      '<h2 class="h-title">' + esc(t(C.contact.title)) + '</h2>' +
      '<div class="rule"></div>' +
      '<div class="contact__lines">' +
        '<div class="contact__address">' + esc(t(C.contact.address)) + '</div>' +
        '<a class="contact__row" href="tel:' + esc(String(C.contact.phone).replace(/\s+/g, "")) + '">' +
          DifaSvg.phone + '<span>' + esc(C.contact.phone) + '</span></a>' +
        '<a class="contact__row" href="mailto:' + esc(C.contact.email) + '">' +
          DifaSvg.mail + '<span>' + esc(C.contact.email) + '</span></a>' +
      '</div>';
    buildMap(m, mapsLink);

    /* footer */
    $("#footer").innerHTML =
      logoHtml() +
      '<nav class="footer-nav">' + C.nav.map(function (n) {
        return '<a href="' + esc(n.href) + '">' + esc(t(n.label)) + '</a>';
      }).join("") + '</nav>' +
      '<div class="footer-note">' + esc(t(C.footer.note)) + '</div>';

    wireNav();
    wireLangSwitch();
    revealInit();
    spy();
  }

  /* ---- interactive map with graceful fallback ---- */
  function buildMap(m, mapsLink) {
    var host = $("#contact-map");
    var label = esc(t(m.label));
    if (window.L && m && m.lat != null && m.lng != null) {
      host.innerHTML = '<div id="leaflet" class="contact__map"></div>' +
        '<a class="contact__maplink" href="' + esc(mapsLink) + '" target="_blank" rel="noopener">' +
        esc(ui("openInMaps")) + ' ' + DifaSvg.arrow + '</a>';
      try { if (mapObj) { mapObj.remove(); mapObj = null; } } catch (e) {}
      mapObj = L.map("leaflet", { scrollWheelZoom: false, attributionControl: true })
        .setView([m.lat, m.lng], m.zoom || 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapObj);
      L.marker([m.lat, m.lng]).addTo(mapObj).bindPopup(label).openPopup();
      setTimeout(function () { try { mapObj.invalidateSize(); } catch (e) {} }, 200);
    } else {
      /* fallback: static image that links out */
      host.innerHTML =
        '<a class="contact__map contact__map--img" href="' + esc(mapsLink) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(C.contact.mapImage) + '" alt="' + label + '">' +
          '<span class="pin"><b>' + label + '</b></span>' +
        '</a>';
    }
  }

  /* ---- interactions ---- */
  function wireNav() {
    var toggle = $("#nav-toggle"), nav = $("#nav");
    toggle.onclick = function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open"); toggle.classList.remove("is-open");
      });
    });
  }

  function wireLangSwitch() {
    var wrap = $("#lang-switch"); if (!wrap) return;
    var btn = $("#lang-btn", wrap);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    wrap.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-lang");
        if (code === LANG) { wrap.classList.remove("is-open"); return; }
        DifaStore.setLang(code); LANG = code;
        render();
      });
    });
    document.addEventListener("click", function () { wrap.classList.remove("is-open"); });
  }

  function revealInit() {
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.14 });
      reveals.forEach(function (el) { el.classList.remove("in"); io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }
  }

  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
    var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
    function run() {
      var y = window.scrollY + window.innerHeight * 0.3, idx = 0;
      sections.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
      links.forEach(function (l, i) { l.classList.toggle("is-active", i === idx); });
    }
    window.removeEventListener("scroll", window.__difaSpy || function () {});
    window.__difaSpy = run;
    window.addEventListener("scroll", run, { passive: true });
    run();
  }

  render();
})();

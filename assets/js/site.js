/* ============================================================
   Difa Defence — public site runtime
   Renders the current content into the DOM and wires interactions.
   ============================================================ */
(function () {
  var C = DifaStore.get();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  var bg = function (url) { return "background-image:url('" + String(url).replace(/'/g, "%27") + "')"; };

  /* ---- Header / brand ---- */
  document.title = C.brand.name + " — " + C.brand.tagline;

  function logoHtml() {
    return '<a class="logo" href="#home" aria-label="' + esc(C.brand.name) + ' home">' +
      DifaSvg.mark("mark") +
      '<span class="logo__text">' +
        '<span class="logo__name">' + esc(C.brand.name) + '</span>' +
        '<span class="logo__tag">' + esc(C.brand.tagline) + '</span>' +
      '</span></a>';
  }

  $("#brand").innerHTML = logoHtml();

  var navHtml = C.nav.map(function (n) {
    return '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>';
  }).join("") + '<span class="lang">' + esc(C.brand.lang) + '</span>';
  $("#nav").innerHTML = navHtml;

  /* ---- Hero ---- */
  $("#hero-media").setAttribute("style", bg(C.hero.image));
  $("#hero-inner").innerHTML =
    (C.hero.eyebrow ? '<span class="hero__eyebrow">' + esc(C.hero.eyebrow) + '</span>' : '') +
    (C.hero.title ? '<h1 class="hero__title">' + esc(C.hero.title) + '</h1>' : '') +
    (C.hero.subtitle ? '<p class="hero__subtitle">' + esc(C.hero.subtitle) + '</p>' : '') +
    (C.hero.ctaLabel ? '<a class="btn" href="' + esc(C.hero.ctaHref || "#about") + '">' +
        esc(C.hero.ctaLabel) + DifaSvg.arrow + '</a>' : '');

  /* ---- About ---- */
  $("#about-copy").innerHTML =
    '<p class="eyebrow">Who we are</p>' +
    '<h2 class="h-title">' + esc(C.about.title) + '</h2>' +
    '<div class="rule"></div>' +
    '<div class="prose">' + C.about.paragraphs.map(function (p) {
      return '<p>' + esc(p) + '</p>';
    }).join("") + '</div>' +
    DifaSvg.mark("sig");
  $("#about-media").innerHTML =
    '<img class="m-back" src="' + esc(C.about.image2) + '" alt="Unmanned aerial system in flight" loading="lazy">' +
    '<img class="m-front" src="' + esc(C.about.image1) + '" alt="Armoured tactical vehicle" loading="lazy">';

  /* ---- Activities ---- */
  var imgs = C.activities.images || [];
  $("#act-media").innerHTML =
    (imgs[0] ? '<img class="i1" src="' + esc(imgs[0]) + '" alt="" loading="lazy">' : '') +
    (imgs[1] ? '<img class="i2" src="' + esc(imgs[1]) + '" alt="" loading="lazy">' : '') +
    (imgs[2] ? '<img class="i3" src="' + esc(imgs[2]) + '" alt="" loading="lazy">' : '');
  $("#act-copy").innerHTML =
    '<p class="eyebrow">What we do</p>' +
    '<h2 class="h-title">' + esc(C.activities.title) + '</h2>' +
    '<div class="rule rule--right"></div>' +
    '<div class="prose"><p>' + esc(C.activities.body) + '</p></div>' +
    DifaSvg.mark("sig");

  /* ---- Products ---- */
  $("#products-head").innerHTML =
    '<p class="eyebrow">Capabilities</p>' +
    '<h2 class="h-title">' + esc(C.products.title) + '</h2>' +
    '<p>' + esc(C.products.subtitle) + '</p>';
  $("#products-cards").innerHTML = (C.products.items || []).map(function (it) {
    return '<article class="card">' +
      '<div class="card__img"><img src="' + esc(it.image) + '" alt="' + esc(it.title) + '" loading="lazy"></div>' +
      '<div class="card__body"><h3>' + esc(it.title) + '</h3><p>' + esc(it.desc) + '</p></div>' +
    '</article>';
  }).join("");

  /* ---- Contact ---- */
  $("#contact-copy").innerHTML =
    '<h2 class="h-title">' + esc(C.contact.title) + '</h2>' +
    '<div class="rule"></div>' +
    '<div class="contact__lines">' +
      '<div class="contact__address">' + esc(C.contact.address) + '</div>' +
      '<a class="contact__row" href="tel:' + esc(C.contact.phone.replace(/\s+/g, "")) + '">' +
        DifaSvg.phone + '<span>' + esc(C.contact.phone) + '</span></a>' +
      '<a class="contact__row" href="mailto:' + esc(C.contact.email) + '">' +
        DifaSvg.mail + '<span>' + esc(C.contact.email) + '</span></a>' +
    '</div>';
  $("#contact-map").innerHTML =
    '<a class="contact__map" href="' + esc(C.contact.mapLink) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(C.contact.mapImage) + '" alt="Map to Difa Defence, West Bay, Doha">' +
      '<span class="pin"><b>West Bay, Doha</b></span>' +
    '</a>';

  /* ---- Footer ---- */
  $("#footer").innerHTML =
    logoHtml().replace("logo__tag", "logo__tag") +
    '<nav class="footer-nav">' + C.nav.map(function (n) {
      return '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>';
    }).join("") + '</nav>' +
    '<div class="footer-note">' + esc(C.footer.note) + '</div>';

  /* ---- Mobile nav toggle ---- */
  var toggle = $("#nav-toggle"), nav = $("#nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
    }
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Scrollspy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.3;
    var idx = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
    links.forEach(function (l, i) { l.classList.toggle("is-active", i === idx); });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
})();

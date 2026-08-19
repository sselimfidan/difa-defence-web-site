/* ============================================================
   Shared store — used by both the site and the admin panel.
   Content overrides live in localStorage on top of the defaults
   in content.js. Also handles the active display language.
   ============================================================ */
window.DifaStore = (function () {
  var KEY = "difa_content_v2";
  var LANG_KEY = "difa_lang_v1";

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) {
      return over !== undefined ? clone(over) : clone(base);
    }
    if (typeof base === "object" && base && typeof over === "object" && over) {
      var out = clone(base);
      Object.keys(over).forEach(function (k) { out[k] = merge(base[k], over[k]); });
      return out;
    }
    return over !== undefined ? over : base;
  }

  function get() {
    var base = window.DIFA_DEFAULT_CONTENT;
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(base);
      return merge(base, JSON.parse(raw));
    } catch (e) { return clone(base); }
  }
  function save(content) { localStorage.setItem(KEY, JSON.stringify(content)); }
  function reset() { localStorage.removeItem(KEY); }
  function isCustom() { return !!localStorage.getItem(KEY); }

  /* ---- language ---- */
  function langs() { return window.DIFA_LANGS || ["en"]; }
  function detectLang() {
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    var code = nav.split("-")[0];
    return langs().indexOf(code) >= 0 ? code : "en";
  }
  function getLang() {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored && langs().indexOf(stored) >= 0) return stored;
    return detectLang();
  }
  function setLang(code) {
    if (langs().indexOf(code) >= 0) localStorage.setItem(LANG_KEY, code);
  }
  function isRTL(code) { return (window.DIFA_RTL_LANGS || []).indexOf(code) >= 0; }

  /* resolve a translatable value {en,tr,ar} (or a plain string) for a lang */
  function t(val, lang) {
    lang = lang || getLang();
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return val[lang] != null ? val[lang] : (val.en != null ? val.en : "");
    }
    return val == null ? "" : val;
  }

  return {
    get: get, save: save, reset: reset, isCustom: isCustom, clone: clone,
    KEY: KEY, LANG_KEY: LANG_KEY,
    langs: langs, getLang: getLang, setLang: setLang, detectLang: detectLang,
    isRTL: isRTL, t: t
  };
})();

/* Reusable inline SVGs */
window.DifaSvg = {
  mark: function (cls) {
    return '<svg class="' + (cls || "mark") + '" viewBox="0 0 48 48" aria-hidden="true">' +
      '<path class="a" d="M6 8 L20 8 L34 24 L20 40 L6 40 L20 24 Z"/>' +
      '<path class="b" d="M20 8 L34 8 L48 24 L34 40 L20 40 L34 24 Z"/>' +
      '</svg>';
  },
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
};

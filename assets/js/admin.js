/* ============================================================
   Difa Defence — admin panel (trilingual + map editor)
   ============================================================ */
(function () {
  "use strict";

  var draft = DifaStore.get();
  var adminLang = DifaStore.getLang();           // language currently being edited
  var frame = document.getElementById("preview-frame");
  var statusEl = document.getElementById("save-status");
  var editor = document.getElementById("editor");
  var saveTimer = null;

  /* ---------- persistence + preview ---------- */
  function persist() { DifaStore.save(draft); setStatus("Saved", true); }
  function setStatus(text, saved) { statusEl.textContent = text; statusEl.classList.toggle("saved", !!saved); }
  function schedule() {
    setStatus("Editing…", false);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { persist(); reloadPreview(); }, 500);
  }
  function reloadPreview() {
    try {
      var win = frame.contentWindow; var y = win ? win.scrollY : 0;
      frame.onload = function () { try { frame.contentWindow.scrollTo(0, y); } catch (e) {} frame.onload = null; };
      frame.contentWindow.location.reload();
    } catch (e) { frame.src = frame.src; }
  }

  /* ---------- DOM helpers ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function ensureTr(obj, key) {
    if (!obj[key] || typeof obj[key] !== "object" || Array.isArray(obj[key])) {
      obj[key] = { en: obj[key] || "", tr: "", ar: "" };
    }
    return obj[key];
  }

  /* translatable text field (edits obj[key][adminLang]) */
  function tField(label, obj, key, opts) {
    opts = opts || {};
    ensureTr(obj, key);
    var input = opts.area ? el("textarea", { rows: opts.rows || 3 }) : el("input", { type: "text" });
    input.value = obj[key][adminLang] || "";
    input.addEventListener("input", function () { ensureTr(obj, key)[adminLang] = input.value; schedule(); });
    var lab = el("label", { html: label + ' <span class="lang-tag">' + adminLang.toUpperCase() + "</span>" });
    var f = el("div", { class: "field" }, [ lab, input ]);
    if (opts.hint) f.appendChild(el("div", { class: "hint", html: opts.hint }));
    return f;
  }
  /* shared (non-translatable) text field */
  function sField(label, obj, key, opts) {
    opts = opts || {};
    var input = opts.area ? el("textarea", { rows: opts.rows || 2 }) : el("input", { type: "text" });
    if (opts.numeric) input.setAttribute("inputmode", "decimal");
    input.value = obj[key] != null ? obj[key] : "";
    input.addEventListener("input", function () {
      obj[key] = opts.numeric ? (input.value === "" ? "" : parseFloat(input.value)) : input.value;
      schedule();
    });
    var f = el("div", { class: "field" }, [ el("label", { html: label }), input ]);
    if (opts.hint) f.appendChild(el("div", { class: "hint", html: opts.hint }));
    return f;
  }

  /* image field: thumb + path/URL + upload */
  function imageField(label, obj, key) {
    var thumb = el("div", { class: "imgfield__thumb" });
    function paint() {
      var v = obj[key] || ""; thumb.innerHTML = "";
      if (v) { var im = el("img"); im.src = v; thumb.appendChild(im); } else thumb.textContent = "no image";
    }
    paint();
    var input = el("input", { type: "text", placeholder: "assets/img/… veya https://…" });
    input.value = obj[key] || "";
    input.addEventListener("input", function () { obj[key] = input.value; paint(); schedule(); });
    var file = el("input", { type: "file", accept: "image/*" }); file.style.display = "none";
    file.addEventListener("change", function () {
      var f = file.files[0]; if (!f) return;
      if (f.size > 2.5 * 1024 * 1024) toast("Görsel büyük (" + Math.round(f.size / 1024) + " KB).", "err");
      var r = new FileReader();
      r.onload = function () { obj[key] = r.result; input.value = r.result; paint(); schedule(); };
      r.readAsDataURL(f);
    });
    var up = el("button", { class: "btn btn--soft btn--sm", type: "button", html: "Upload" });
    up.addEventListener("click", function () { file.click(); });
    var ctl = el("div", { class: "imgfield__ctl" }, [ input, el("div", { class: "imgfield__row" }, [ up, file ]) ]);
    return el("div", { class: "field" }, [ el("label", { html: label }), el("div", { class: "imgfield" }, [ thumb, ctl ]) ]);
  }

  function repeatable(arr, opts) {
    var host = el("div");
    function draw() {
      host.innerHTML = "";
      arr.forEach(function (item, i) {
        var head = el("div", { class: "repeat-item__head" }, [ el("span", { html: opts.label + " " + (i + 1) }) ]);
        var del = el("button", { class: "icon-btn", type: "button", title: "Sil", html: "&times;" });
        del.addEventListener("click", function () {
          if (arr.length <= (opts.min || 1)) { toast("En az " + (opts.min || 1) + " gerekli.", "err"); return; }
          arr.splice(i, 1); draw(); schedule();
        });
        head.appendChild(del);
        var body = el("div"); opts.render(item, body, i);
        host.appendChild(el("div", { class: "repeat-item" }, [ head, body ]));
      });
      var add = el("button", { class: "add-btn", type: "button", html: "+ " + opts.label + " ekle" });
      add.addEventListener("click", function () {
        if (opts.max && arr.length >= opts.max) { toast("En fazla " + opts.max + ".", "err"); return; }
        arr.push(opts.make()); draw(); schedule();
      });
      host.appendChild(add);
    }
    draw();
    return host;
  }

  function panel(num, title, build, open) {
    var body = el("div", { class: "panel__body" }); build(body);
    var head = el("div", { class: "panel__head" }, [
      el("div", { class: "num", html: num }), el("h2", { html: title }),
      el("div", { class: "chev", html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' })
    ]);
    var p = el("div", { class: "panel" + (open ? " is-open" : "") }, [ head, body ]);
    head.addEventListener("click", function () { p.classList.toggle("is-open"); });
    return p;
  }

  /* ---------- language selector (top of editor) ---------- */
  function langBar() {
    var bar = el("div", { class: "langbar" });
    bar.appendChild(el("span", { class: "langbar__label", html: "Düzenlenen dil" }));
    var group = el("div", { class: "langbar__group" });
    DifaStore.langs().forEach(function (code) {
      var b = el("button", { type: "button", html: (window.DIFA_LANG_NAMES[code] || code) });
      if (code === adminLang) b.className = "is-active";
      b.addEventListener("click", function () {
        adminLang = code;
        DifaStore.setLang(code);     // keep the preview in the same language
        build(); persist(); reloadPreview();
      });
      group.appendChild(b);
    });
    bar.appendChild(group);
    return bar;
  }

  /* ---------- build the whole editor ---------- */
  function build() {
    editor.innerHTML = "";
    editor.appendChild(langBar());

    editor.appendChild(panel("1", "Marka &amp; logo", function (b) {
      b.appendChild(sField("Şirket adı (tüm dillerde ortak)", draft.brand, "name"));
      b.appendChild(tField("Slogan", draft.brand, "tagline"));
    }, true));

    editor.appendChild(panel("2", "Menü", function (b) {
      b.appendChild(repeatable(draft.nav, {
        label: "Bağlantı", min: 1, max: 6,
        make: function () { return { label: { en: "New", tr: "Yeni", ar: "جديد" }, href: "#home" }; },
        render: function (item, host) {
          host.appendChild(tField("Etiket", item, "label"));
          host.appendChild(sField("Hedef (ortak)", item, "href", { hint: "#about, #products…" }));
        }
      }));
    }));

    editor.appendChild(panel("3", "Ana görsel (Hero)", function (b) {
      b.appendChild(tField("Üst etiket", draft.hero, "eyebrow"));
      b.appendChild(tField("Başlık", draft.hero, "title", { area: true, rows: 2 }));
      b.appendChild(tField("Alt metin", draft.hero, "subtitle", { area: true }));
      b.appendChild(tField("Buton yazısı", draft.hero, "ctaLabel"));
      b.appendChild(sField("Buton hedefi (ortak)", draft.hero, "ctaHref"));
      b.appendChild(imageField("Arka plan görseli (ortak)", draft.hero, "image"));
    }));

    editor.appendChild(panel("4", "Hakkımızda", function (b) {
      b.appendChild(tField("Bölüm başlığı", draft.about, "title"));
      b.appendChild(el("div", { class: "field" }, [ el("label", { html: "Paragraflar" }) ]));
      b.appendChild(repeatable(draft.about.paragraphs, {
        label: "Paragraf", min: 1, max: 8,
        make: function () { return { en: "New paragraph.", tr: "Yeni paragraf.", ar: "فقرة جديدة." }; },
        render: function (item, host, i) {
          var p = draft.about.paragraphs[i];
          ensureTr({ x: p }, "x"); // no-op safety
          var ta = el("textarea", { rows: 3 });
          ta.value = (p && p[adminLang]) || "";
          ta.addEventListener("input", function () {
            var o = draft.about.paragraphs[i];
            if (!o || typeof o !== "object") { o = { en: "", tr: "", ar: "" }; draft.about.paragraphs[i] = o; }
            o[adminLang] = ta.value; schedule();
          });
          host.appendChild(el("div", { class: "field" }, [
            el("label", { html: 'Metin <span class="lang-tag">' + adminLang.toUpperCase() + "</span>" }), ta
          ]));
        }
      }));
      b.appendChild(el("div", { class: "subgrid" }, [
        imageField("Ön görsel (ortak)", draft.about, "image1"),
        imageField("Arka görsel (ortak)", draft.about, "image2")
      ]));
    }));

    editor.appendChild(panel("5", "Faaliyetlerimiz", function (b) {
      b.appendChild(tField("Bölüm başlığı", draft.activities, "title"));
      b.appendChild(tField("Metin", draft.activities, "body", { area: true, rows: 6 }));
      b.appendChild(el("div", { class: "field" }, [ el("label", { html: "Görseller (ortak, 3 önerilir)" }) ]));
      b.appendChild(repeatable(draft.activities.images, {
        label: "Görsel", min: 1, max: 3,
        make: function () { return "assets/img/drone-b.jpg"; },
        render: function (item, host, i) {
          var proxy = { get v() { return draft.activities.images[i]; }, set v(x) { draft.activities.images[i] = x; } };
          host.appendChild(imageField("Görsel yolu", proxy, "v"));
        }
      }));
    }));

    editor.appendChild(panel("6", "Ürünler", function (b) {
      b.appendChild(tField("Bölüm başlığı", draft.products, "title"));
      b.appendChild(tField("Giriş metni", draft.products, "subtitle", { area: true }));
      b.appendChild(repeatable(draft.products.items, {
        label: "Kart", min: 1, max: 6,
        make: function () { return { title: { en: "New", tr: "Yeni", ar: "جديد" }, desc: { en: "", tr: "", ar: "" }, image: "assets/img/drone-a.jpg" }; },
        render: function (item, host) {
          host.appendChild(tField("Başlık", item, "title"));
          host.appendChild(tField("Açıklama", item, "desc", { area: true }));
          host.appendChild(imageField("Görsel (ortak)", item, "image"));
        }
      }));
    }));

    editor.appendChild(panel("7", "İletişim &amp; Harita", function (b) {
      b.appendChild(tField("Bölüm başlığı", draft.contact, "title"));
      b.appendChild(tField("Adres", draft.contact, "address", { area: true, hint: "Satır atlamak için Enter kullanın." }));
      b.appendChild(el("div", { class: "subgrid" }, [
        sField("Telefon (ortak)", draft.contact, "phone"),
        sField("E-posta (ortak)", draft.contact, "email")
      ]));

      // ---- interactive map editor ----
      if (!draft.contact.map) draft.contact.map = { lat: 25.3213, lng: 51.531, zoom: 13, label: { en: "", tr: "", ar: "" } };
      var m = draft.contact.map;
      b.appendChild(el("div", { class: "mapedit" }, [ el("div", { class: "mapedit__title", html: "🗺️ Harita konumu" }) ]));

      // address search -> geocode
      var q = el("input", { type: "text", placeholder: "Adres/yer yazın, sonra Bul (ör. West Bay, Doha)" });
      var find = el("button", { class: "btn btn--soft btn--sm", type: "button", html: "Haritada bul" });
      find.addEventListener("click", function () {
        var term = q.value.trim(); if (!term) { toast("Önce bir adres yazın.", "err"); return; }
        find.textContent = "Aranıyor…"; find.disabled = true;
        fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(term), {
          headers: { "Accept": "application/json" }
        }).then(function (r) { return r.json(); }).then(function (res) {
          if (res && res[0]) {
            m.lat = parseFloat(res[0].lat); m.lng = parseFloat(res[0].lon);
            latI.value = m.lat; lngI.value = m.lng;
            ensureTr(m, "label")[adminLang] = term;
            toast("Konum bulundu ve ayarlandı.", "ok"); schedule();
          } else { toast("Konum bulunamadı.", "err"); }
        }).catch(function () { toast("Arama başarısız (internet gerekli).", "err"); })
          .finally(function () { find.textContent = "Haritada bul"; find.disabled = false; });
      });
      b.appendChild(el("div", { class: "field" }, [
        el("label", { html: "Adresten konum bul" }),
        el("div", { class: "imgfield__row" }, [ q, find ])
      ]));

      var latI, lngI;
      var latF = sField("Enlem (lat)", m, "lat", { numeric: true });
      var lngF = sField("Boylam (lng)", m, "lng", { numeric: true });
      latI = latF.querySelector("input"); lngI = lngF.querySelector("input");
      b.appendChild(el("div", { class: "subgrid" }, [ latF, lngF ]));
      b.appendChild(el("div", { class: "subgrid" }, [
        sField("Yakınlaştırma (zoom 1–19)", m, "zoom", { numeric: true }),
        tField("Pin etiketi", m, "label")
      ]));
      b.appendChild(imageField("Yedek görsel (harita yüklenmezse)", draft.contact, "mapImage"));
    }));

    editor.appendChild(panel("8", "Alt bilgi (Footer)", function (b) {
      b.appendChild(tField("Alt bilgi metni", draft.footer, "note"));
    }));
  }

  /* ---------- toolbar ---------- */
  function toast(msg, kind) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.className = "toast show " + (kind || "ok");
    clearTimeout(t._t); t._t = setTimeout(function () { t.className = "toast"; }, 2600);
  }

  document.getElementById("btn-save").addEventListener("click", function () {
    persist(); reloadPreview(); toast("Değişiklikler bu tarayıcıya kaydedildi.", "ok");
  });
  document.getElementById("btn-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    var a = el("a", { href: URL.createObjectURL(blob), download: "content.json" });
    document.body.appendChild(a); a.click(); a.remove();
    toast("content.json indirildi.", "ok");
  });
  var importInput = document.getElementById("import-file");
  document.getElementById("btn-import").addEventListener("click", function () { importInput.click(); });
  importInput.addEventListener("change", function () {
    var f = importInput.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { draft = mergeDefaults(JSON.parse(r.result)); build(); persist(); reloadPreview(); toast("content.json içe aktarıldı.", "ok"); }
      catch (e) { toast("Geçerli bir JSON değil.", "err"); }
    };
    r.readAsText(f); importInput.value = "";
  });
  function mergeDefaults(obj) {
    var prev = localStorage.getItem(DifaStore.KEY);
    localStorage.setItem(DifaStore.KEY, JSON.stringify(obj));
    var merged = DifaStore.get();
    if (prev === null) localStorage.removeItem(DifaStore.KEY); else localStorage.setItem(DifaStore.KEY, prev);
    return merged;
  }
  document.getElementById("btn-reset").addEventListener("click", function () {
    if (!confirm("Tüm içerik orijinal tasarıma sıfırlansın mı? Bu tarayıcıdaki düzenlemeler silinir.")) return;
    DifaStore.reset(); draft = DifaStore.get(); build(); reloadPreview(); toast("İçerik sıfırlandı.", "ok");
  });

  document.querySelectorAll(".preview__device button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".preview__device button").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var w = btn.getAttribute("data-w");
      frame.style.maxWidth = w === "full" ? "none" : w + "px";
      frame.style.margin = w === "full" ? "0" : "0 auto";
      frame.style.height = "100%";
    });
  });

  build(); setStatus("Ready", true); persist();
})();

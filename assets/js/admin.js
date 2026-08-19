/* ============================================================
   Difa Defence — admin panel
   Edits a working copy of the content and keeps a live preview
   in sync. Everything persists to the browser (localStorage);
   Export produces a content.json you can ship to a host.
   ============================================================ */
(function () {
  "use strict";

  var draft = DifaStore.get();            // working copy
  var frame = document.getElementById("preview-frame");
  var statusEl = document.getElementById("save-status");
  var editor = document.getElementById("editor");
  var saveTimer = null;

  /* ---------- persistence + preview ---------- */
  function persist() {
    DifaStore.save(draft);
    setStatus("Saved", true);
  }
  function setStatus(text, saved) {
    statusEl.textContent = text;
    statusEl.classList.toggle("saved", !!saved);
  }
  function schedulePersistAndPreview() {
    setStatus("Editing…", false);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      persist();
      reloadPreview();
    }, 500);
  }
  function reloadPreview() {
    try {
      var win = frame.contentWindow;
      var y = win ? win.scrollY : 0;
      frame.onload = function () {
        try { frame.contentWindow.scrollTo(0, y); } catch (e) {}
        frame.onload = null;
      };
      frame.contentWindow.location.reload();
    } catch (e) {
      frame.src = frame.src;
    }
  }

  /* ---------- small DOM helpers ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  // text or textarea field bound to obj[key]
  function textField(label, obj, key, opts) {
    opts = opts || {};
    var input = opts.area
      ? el("textarea", { rows: opts.rows || 3 })
      : el("input", { type: "text" });
    input.value = obj[key] != null ? obj[key] : "";
    input.addEventListener("input", function () {
      obj[key] = input.value;
      schedulePersistAndPreview();
    });
    var f = el("div", { class: "field" }, [ el("label", { html: label }), input ]);
    if (opts.hint) f.appendChild(el("div", { class: "hint", html: opts.hint }));
    return f;
  }

  // image field: thumbnail + path/URL input + upload button
  function imageField(label, obj, key) {
    var thumb = el("div", { class: "imgfield__thumb" });
    function paint() {
      var v = obj[key] || "";
      thumb.innerHTML = "";
      if (v) { var im = el("img"); im.src = v; thumb.appendChild(im); }
      else thumb.textContent = "no image";
    }
    paint();

    var input = el("input", { type: "text", placeholder: "assets/img/… or https://…" });
    input.value = obj[key] || "";
    input.addEventListener("input", function () {
      obj[key] = input.value; paint(); schedulePersistAndPreview();
    });

    var file = el("input", { type: "file", accept: "image/*" });
    file.style.display = "none";
    file.addEventListener("change", function () {
      var f = file.files[0]; if (!f) return;
      if (f.size > 2.5 * 1024 * 1024) {
        toast("Image is large (" + Math.round(f.size / 1024) + " KB). Consider a smaller file.", "err");
      }
      var r = new FileReader();
      r.onload = function () {
        obj[key] = r.result; input.value = r.result; paint(); schedulePersistAndPreview();
      };
      r.readAsDataURL(f);
    });
    var upBtn = el("button", { class: "btn btn--soft btn--sm", type: "button", html: "Upload" });
    upBtn.addEventListener("click", function () { file.click(); });

    var ctl = el("div", { class: "imgfield__ctl" }, [
      input,
      el("div", { class: "imgfield__row" }, [ upBtn, file ])
    ]);
    var wrap = el("div", { class: "imgfield" }, [ thumb, ctl ]);
    return el("div", { class: "field" }, [ el("label", { html: label }), wrap ]);
  }

  // repeatable list editor.
  //   arr: array on the draft; make(): new blank item; render(item, idx): fields
  function repeatable(arr, opts) {
    var host = el("div");
    function draw() {
      host.innerHTML = "";
      arr.forEach(function (item, i) {
        var head = el("div", { class: "repeat-item__head" }, [
          el("span", { html: opts.label + " " + (i + 1) })
        ]);
        var del = el("button", { class: "icon-btn", type: "button", title: "Remove", html: "&times;" });
        del.addEventListener("click", function () {
          if (arr.length <= (opts.min || 1)) { toast("At least " + (opts.min || 1) + " required.", "err"); return; }
          arr.splice(i, 1); draw(); schedulePersistAndPreview();
        });
        head.appendChild(del);
        var body = el("div");
        opts.render(item, body, i);
        host.appendChild(el("div", { class: "repeat-item" }, [ head, body ]));
      });
      var add = el("button", { class: "add-btn", type: "button", html: "+ Add " + opts.label });
      add.addEventListener("click", function () {
        if (opts.max && arr.length >= opts.max) { toast("Maximum " + opts.max + ".", "err"); return; }
        arr.push(opts.make()); draw(); schedulePersistAndPreview();
      });
      host.appendChild(add);
    }
    draw();
    return host;
  }

  function panel(num, title, buildBody, open) {
    var body = el("div", { class: "panel__body" });
    buildBody(body);
    var head = el("div", { class: "panel__head" }, [
      el("div", { class: "num", html: num }),
      el("h2", { html: title }),
      el("div", { class: "chev", html:
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' })
    ]);
    var p = el("div", { class: "panel" + (open ? " is-open" : "") }, [ head, body ]);
    head.addEventListener("click", function () { p.classList.toggle("is-open"); });
    return p;
  }

  /* ---------- build the editor ---------- */
  function build() {
    editor.innerHTML = "";

    // 1. Brand
    editor.appendChild(panel("1", "Brand &amp; logo", function (b) {
      b.appendChild(textField("Company name", draft.brand, "name"));
      b.appendChild(textField("Tagline", draft.brand, "tagline"));
      b.appendChild(textField("Language badge", draft.brand, "lang", { hint: "Shown top-right, e.g. EN" }));
    }, true));

    // 2. Navigation
    editor.appendChild(panel("2", "Navigation menu", function (b) {
      b.appendChild(repeatable(draft.nav, {
        label: "Link", min: 1, max: 6,
        make: function () { return { label: "New link", href: "#home" }; },
        render: function (item, host) {
          host.appendChild(el("div", { class: "subgrid" }, [
            textField("Label", item, "label"),
            textField("Target", item, "href", { hint: "#about, #products…" })
          ]));
        }
      }));
    }));

    // 3. Hero
    editor.appendChild(panel("3", "Home / hero", function (b) {
      b.appendChild(textField("Eyebrow", draft.hero, "eyebrow"));
      b.appendChild(textField("Headline", draft.hero, "title", { area: true, rows: 2 }));
      b.appendChild(textField("Subtitle", draft.hero, "subtitle", { area: true }));
      b.appendChild(el("div", { class: "subgrid" }, [
        textField("Button label", draft.hero, "ctaLabel"),
        textField("Button target", draft.hero, "ctaHref")
      ]));
      b.appendChild(imageField("Background image", draft.hero, "image"));
    }));

    // 4. About
    editor.appendChild(panel("4", "About Us", function (b) {
      b.appendChild(textField("Section title", draft.about, "title"));
      b.appendChild(el("div", { class: "field" }, [ el("label", { html: "Paragraphs" }) ]));
      b.appendChild(repeatable(draft.about.paragraphs, {
        label: "Paragraph", min: 1, max: 8,
        make: function () { return "New paragraph."; },
        render: function (item, host, i) {
          var ta = el("textarea", { rows: 3 });
          ta.value = item;
          ta.addEventListener("input", function () {
            draft.about.paragraphs[i] = ta.value; schedulePersistAndPreview();
          });
          host.appendChild(el("div", { class: "field" }, [ ta ]));
        }
      }));
      b.appendChild(el("div", { class: "subgrid" }, [
        imageField("Front image", draft.about, "image1"),
        imageField("Back image", draft.about, "image2")
      ]));
    }));

    // 5. Activities
    editor.appendChild(panel("5", "Our Activities", function (b) {
      b.appendChild(textField("Section title", draft.activities, "title"));
      b.appendChild(textField("Body", draft.activities, "body", { area: true, rows: 6 }));
      b.appendChild(el("div", { class: "field" }, [ el("label", { html: "Images (3 recommended)" }) ]));
      b.appendChild(repeatable(draft.activities.images, {
        label: "Image", min: 1, max: 3,
        make: function () { return "assets/img/drone-b.jpg"; },
        render: function (item, host, i) {
          // wrap a primitive string in an image widget via a proxy object
          var proxy = { get v() { return draft.activities.images[i]; }, set v(x) { draft.activities.images[i] = x; } };
          host.appendChild(imageField("Image URL", proxy, "v"));
        }
      }));
    }));

    // 6. Products
    editor.appendChild(panel("6", "Products", function (b) {
      b.appendChild(textField("Section title", draft.products, "title"));
      b.appendChild(textField("Intro line", draft.products, "subtitle", { area: true }));
      b.appendChild(repeatable(draft.products.items, {
        label: "Card", min: 1, max: 6,
        make: function () { return { title: "New product", desc: "Short description.", image: "assets/img/drone-a.jpg" }; },
        render: function (item, host) {
          host.appendChild(textField("Title", item, "title"));
          host.appendChild(textField("Description", item, "desc", { area: true }));
          host.appendChild(imageField("Image", item, "image"));
        }
      }));
    }));

    // 7. Contact
    editor.appendChild(panel("7", "Contact", function (b) {
      b.appendChild(textField("Section title", draft.contact, "title"));
      b.appendChild(textField("Address", draft.contact, "address", { area: true, hint: "Use line breaks for multiple lines." }));
      b.appendChild(el("div", { class: "subgrid" }, [
        textField("Phone", draft.contact, "phone"),
        textField("Email", draft.contact, "email")
      ]));
      b.appendChild(imageField("Map image", draft.contact, "mapImage"));
      b.appendChild(textField("Map link (opens on click)", draft.contact, "mapLink"));
    }));

    // 8. Footer
    editor.appendChild(panel("8", "Footer", function (b) {
      b.appendChild(textField("Footer note", draft.footer, "note"));
    }));
  }

  /* ---------- toolbar actions ---------- */
  function toast(msg, kind) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show " + (kind || "ok");
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.className = "toast"; }, 2600);
  }

  document.getElementById("btn-save").addEventListener("click", function () {
    persist(); reloadPreview(); toast("Changes saved to this browser.", "ok");
  });

  document.getElementById("btn-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    var a = el("a", { href: URL.createObjectURL(blob), download: "content.json" });
    document.body.appendChild(a); a.click(); a.remove();
    toast("content.json downloaded. Replace the file in assets/data/ to deploy.", "ok");
  });

  var importInput = document.getElementById("import-file");
  document.getElementById("btn-import").addEventListener("click", function () { importInput.click(); });
  importInput.addEventListener("change", function () {
    var f = importInput.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var obj = JSON.parse(r.result);
        // merge over defaults so any missing keys are filled in
        draft = mergeDefaults(obj);
        build(); persist(); reloadPreview();
        toast("content.json imported.", "ok");
      } catch (e) { toast("That file isn't valid JSON.", "err"); }
    };
    r.readAsText(f);
    importInput.value = "";
  });

  function mergeDefaults(obj) {
    // reuse the store's merge by temporarily saving+reading
    var prev = localStorage.getItem(DifaStore.KEY);
    localStorage.setItem(DifaStore.KEY, JSON.stringify(obj));
    var merged = DifaStore.get();
    if (prev === null) localStorage.removeItem(DifaStore.KEY);
    else localStorage.setItem(DifaStore.KEY, prev);
    return merged;
  }

  document.getElementById("btn-reset").addEventListener("click", function () {
    if (!confirm("Reset all content back to the original design? This clears your edits in this browser.")) return;
    DifaStore.reset();
    draft = DifaStore.get();
    build(); reloadPreview();
    toast("Content reset to defaults.", "ok");
  });

  // device preview toggle
  var frameWrap = frame;
  document.querySelectorAll(".preview__device button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".preview__device button").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var w = btn.getAttribute("data-w");
      frameWrap.style.maxWidth = w === "full" ? "none" : w + "px";
      frameWrap.style.margin = w === "full" ? "0" : "0 auto";
      frameWrap.style.height = "100%";
    });
  });

  /* ---------- init ---------- */
  build();
  setStatus("Ready", true);
  // ensure the preview reflects current stored content
  persist();
})();

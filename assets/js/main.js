/* PBPC website — shared layout, language switch, search and page rendering.
   Content comes from data/content.js. You normally do not need to edit this file. */
(function () {
  "use strict";
  var D = window.PBPC || {};
  var S = D.settings || {};
  var I = window.PBPC_I18N || { en: {}, bn: {} };
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- language ---------- */
  function getLang() { try { return localStorage.getItem("pbpc-lang") || "en"; } catch (e) { return "en"; } }
  var lang = getLang();
  function setLang(l) { lang = l; try { localStorage.setItem("pbpc-lang", l); } catch (e) {} renderAll(); }
  function t(k) { return (I[lang] && I[lang][k]) || I.en[k] || k; }
  function L(obj, key) { // pick Bangla field when available
    if (lang === "bn" && obj[key + "Bn"]) return obj[key + "Bn"];
    return obj[key] || "";
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function visible(list) { return (list || []).filter(function (x) { return S.showDrafts || !x.draft; }); }
  function badge(x) { return x.draft ? '<span class="badge-sample">' + esc(t("badge.sample")) + "</span>" : ""; }
  function parseDate(d) { if (!d) return null; var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2] || 1); }
  function fmtDate(d, opts) {
    var dt = parseDate(d); if (!dt) return t("date.tba");
    try { return dt.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", opts || { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return d; }
  }
  function initials(n) { return (n || "PB").split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }
  function avatar(photo, folder, name) {
    if (photo) return '<img src="assets/photos/' + folder + "/" + esc(photo) + '" alt="' + esc(name) + '" loading="lazy">';
    return '<div class="avatar-ph" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.2"/><path d="M3.5 21c.9-4.4 4.3-7 8.5-7s7.6 2.6 8.5 7"/></svg></div>';
  }
  function applyUrl() {
    return S.applicationFormUrl || ("mailto:" + S.email + "?subject=" + encodeURIComponent("PBPC Membership Application"));
  }
  function extAttrs(url) { return /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : ""; }
  function qs(name) { var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1]) : ""; }
  var today = new Date(); today.setHours(0, 0, 0, 0);

  /* ---------- icons ---------- */
  var ic = {
    mail: '<path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.4-7 8-7s7 2.5 8 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.7-3.8 3.3-6 6.5-6s5.8 2.2 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16 14.2c2.9.2 4.9 2.2 5.5 5.3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2"/>',
    news: '<rect x="3" y="4" width="14" height="16" rx="1"/><path d="M17 8h3.5v10.5A1.5 1.5 0 0 1 19 20H5M6 8h8M6 12h8M6 16h5"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m3 17 5.5-5 4 4 3-2.5L21 18"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 3 5v14c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v14"/>',
    idcard: '<rect x="2.5" y="5" width="19" height="14" rx="1.5"/><circle cx="8.5" cy="11" r="2.3"/><path d="M5 16c.6-1.7 2-2.6 3.5-2.6s2.9.9 3.5 2.6M14.5 10h4.5M14.5 13.5h3"/>',
    network: '<circle cx="12" cy="5" r="2.3"/><circle cx="5" cy="18" r="2.3"/><circle cx="19" cy="18" r="2.3"/><path d="M12 7.3v4.2M12 11.5 5.8 16M12 11.5l6.2 4.5"/>',
    cap: '<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c1.7 1.6 3.8 2.3 6 2.3s4.3-.7 6-2.3v-4.5M22 9.5v5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m9 13.8-1.5 7.2L12 19l4.5 2-1.5-7.2"/><path d="m12 6.3.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.3 2.3 4.2-4.6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'
  };
  function icon(name, cls) { return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ic[name] || "") + "</svg>"; }
  var brand = {
    facebook: '<path fill="currentColor" d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.1L14.1 2C10.8 2 10 4.5 10 6.1v2.4H7.5V12H10v10h4V12h3.1l.4-3.5z"/>',
    youtube: '<path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8zM10 15.1V8.9l5.2 3.1z"/>',
    x: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>',
    instagram: '<path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 8c-.1-1.5-.4-2.8-1.5-3.9S17.5 2.7 16 2.6C14.5 2.5 9.5 2.5 8 2.6c-1.5.1-2.8.4-3.9 1.5S2.7 6.5 2.6 8c-.1 1.5-.1 6.5 0 8 .1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6.5.1 8 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-6.5 0-8zm-2 9.7a3.1 3.1 0 0 1-1.7 1.7c-1.2.5-4.1.4-5.4.4s-4.2.1-5.4-.4a3.1 3.1 0 0 1-1.7-1.7c-.5-1.2-.4-4.1-.4-5.4s-.1-4.2.4-5.4A3.1 3.1 0 0 1 6.6 5c1.2-.5 4.1-.4 5.4-.4s4.2-.1 5.4.4a3.1 3.1 0 0 1 1.7 1.7c.5 1.2.4 4.1.4 5.4s.1 4.2-.4 5.4z"/>'
  };
  function socialLinks(cls) {
    var out = "";
    ["facebook", "youtube", "x", "instagram"].forEach(function (k) {
      var url = (S.social || {})[k];
      if (!url) return;
      out += '<a class="' + cls + " s-" + k + '" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="' + k + '"><svg viewBox="0 0 24 24">' + brand[k] + "</svg></a>";
    });
    return out;
  }

  /* ---------- header & footer ---------- */
  var NAV = [
    ["index.html", "nav.home", "home"], ["about.html", "nav.about", "about"],
    ["leadership.html", "nav.leadership", "leadership"], ["membership.html", "nav.membership", "membership"],
    ["members.html", "nav.members", "members"], ["events.html", "nav.events", "events"],
    ["news.html", "nav.news", "news"], ["gallery.html", "nav.gallery", "gallery"],
    ["resources.html", "nav.resources", "resources"], ["contact.html", "nav.contact", "contact"]
  ];
  function renderHeader() {
    var el = $("#site-header"); if (!el) return;
    var links = NAV.map(function (n) {
      return '<li><a href="' + n[0] + '"' + (page === n[2] ? ' class="active" aria-current="page"' : "") + ">" + esc(t(n[1])) + "</a></li>";
    }).join("");
    el.innerHTML =
      '<div class="topbar"><div class="wrap topbar-in">' +
        '<div class="topbar-l"><a href="mailto:' + esc(S.email) + '">' + icon("mail") + "<span>" + esc(S.email) + "</span></a>" +
        '<span class="sep" aria-hidden="true"></span><span class="loc">' + icon("pin") + esc(S.location) + "</span></div>" +
        '<div class="topbar-r">' + socialLinks("tb-social") +
        '<button type="button" class="lang-btn" id="lang-btn" lang="' + (lang === "en" ? "bn" : "en") + '">' + esc(t("lang.switch")) + "</button>" +
        '<a class="tb-cta" href="membership.html#apply">' + esc(t("btn.become")) + "</a></div>" +
      "</div></div>" +
      '<div class="mainbar"><div class="wrap mainbar-in">' +
        '<a class="brand" href="index.html" aria-label="PBPC home"><img src="assets/img/pbpc-logo-512.png" alt="PBPC logo" width="86" height="86">' +
        '<span class="brand-txt"><span class="b1">PENNSYLVANIA BANGLADESH</span><span class="b2">PRESS CLUB</span>' +
        '<span class="b3">' + esc(t("motto.t")) + " <i>|</i> " + esc(t("motto.r")) + " <i>|</i> " + esc(t("motto.c")) + "</span></span></a>" +
        '<nav class="mainnav" id="mainnav" aria-label="Main"><ul>' + links + "</ul>" +
          '<div class="nav-mobile-extra"><a class="btn btn-red" href="membership.html#apply">' + esc(t("btn.become")) + "</a>" +
          '<button type="button" class="lang-btn dark" data-lang-toggle>' + esc(t("lang.switch")) + "</button></div></nav>" +
        '<button type="button" class="icon-btn" id="search-btn" aria-label="Search">' + icon("search") + "</button>" +
        '<button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mainnav">' + icon("menu") + "</button>" +
      "</div></div>";
  }
  function renderFooter() {
    var el = $("#site-footer"); if (!el) return;
    function li(h, k) { return '<li><a href="' + h + '">' + esc(t(k)) + "</a></li>"; }
    var social = socialLinks("ft-social");
    el.innerHTML =
      '<div class="wrap footer-grid">' +
        '<div class="ft-brand"><img src="assets/img/pbpc-logo-512.png" alt="PBPC logo" width="110" height="110" loading="lazy">' +
          '<div><div class="b1">PENNSYLVANIA BANGLADESH</div><div class="b2">PRESS CLUB</div>' +
          '<div class="b3">' + esc(t("motto.t")) + " | " + esc(t("motto.r")) + " | " + esc(t("motto.c")) + "</div>" +
          "<p>" + esc(t("footer.desc")) + "</p></div></div>" +
        '<div><h3>' + esc(t("footer.quick")) + '</h3><ul class="ft-links two">' +
          li("index.html", "nav.home") + li("about.html", "nav.about") + li("leadership.html", "nav.leadership") +
          li("membership.html", "nav.membership") + li("members.html", "nav.members") + li("events.html", "nav.events") +
          li("news.html", "nav.news") + li("gallery.html", "nav.gallery") + li("resources.html", "nav.resources") + li("contact.html", "nav.contact") +
        "</ul></div>" +
        '<div><h3>' + esc(t("footer.more")) + '</h3><ul class="ft-links">' +
          li("ethics.html", "nav.ethics") + li("verify.html", "nav.verify") + li("policies.html", "nav.policies") +
        "</ul></div>" +
        '<div><h3>' + esc(t("footer.contact")) + '</h3><ul class="ft-contact">' +
          "<li>" + icon("pin") + esc(S.location) + "</li>" +
          '<li>' + icon("mail") + '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>" +
          "<li>" + icon("globe") + esc(S.website) + "</li></ul>" +
          (social ? '<h3 class="mt">' + esc(t("footer.follow")) + '</h3><div class="ft-social-row">' + social + "</div>" : "") +
        "</div>" +
      "</div>" +
      '<div class="ft-bottom"><div class="wrap ft-bottom-in"><span>© ' + new Date().getFullYear() + " " + esc(S.name) + ". " + esc(t("footer.rights")) + "</span>" +
        '<span class="ft-legal"><a href="policies.html#privacy">Privacy Policy</a><a href="policies.html#terms">Terms</a><a href="policies.html#membership">Membership Policy</a><a href="ethics.html">Code of Ethics</a></span></div></div>';
  }

  /* ---------- cards ---------- */
  function leaderCard(p, full) {
    return '<article class="leader-card' + (p.draft ? " is-draft" : "") + '" id="' + esc(p.id) + '">' +
      '<div class="leader-photo">' + avatar(p.photo, "leaders", p.name) + "</div>" +
      '<div class="leader-body">' + badge(p) + "<h3>" + esc(L(p, "name")) + "</h3>" +
      '<p class="role">' + esc(L(p, "role")) + "</p>" +
      (full ? '<p class="org">' + esc(p.organization || "") + "</p>" + (p.bio ? '<p class="bio">' + esc(p.bio) + "</p>" : "") :
        '<a class="link-more" href="leadership.html#' + esc(p.id) + '">' + esc(t("btn.profile")) + icon("arrow") + "</a>") +
      "</div></article>";
  }
  function eventCard(e, large) {
    var dt = parseDate(e.date);
    var day = dt ? dt.getDate() : "—";
    var mon = dt ? fmtDate(e.date, { month: "short", year: "numeric" }) : t("date.tba");
    var reg = e.registrationUrl ? '<a class="btn btn-outline-navy" href="' + esc(e.registrationUrl) + '"' + extAttrs(e.registrationUrl) + ">" + esc(t("btn.register")) + "</a>" : "";
    return '<article class="event-card' + (large ? " large" : "") + '">' +
      '<div class="event-date"><span class="ed-ic">' + icon("calendar") + '</span><span class="ed-day">' + day + '</span><span class="ed-mon">' + esc(mon) + "</span></div>" +
      '<div class="event-info">' + badge(e) + "<h3>" + esc(L(e, "title")) + "</h3>" +
        '<p class="meta">' + icon("pin") + esc(e.venue || "") + "</p>" +
        '<p class="meta">' + icon("clock") + esc(e.time || "") + "</p>" +
        (large && e.description ? '<p class="desc">' + esc(e.description) + "</p>" : "") +
        '<div class="btn-row"><a class="btn btn-red btn-sm" href="events.html?id=' + esc(e.id) + '">' + esc(t("btn.details")) + icon("arrow") + "</a>" + reg + "</div>" +
      "</div>" +
      '<div class="event-img">' + (e.image ? '<img src="assets/photos/events/' + esc(e.image) + '" alt="" loading="lazy">' :
        '<div class="event-img-ph"><img src="assets/img/pbpc-logo-512.png" alt="" loading="lazy"></div>') + "</div>" +
      "</article>";
  }
  function feeCard(m) {
    var fee = m.fee ? esc(m.fee) : '<span class="tba">' + esc(t("fee.tba")) + "</span>";
    var nm = L(m, "name"), parts = nm.split(" ");
    var title = lang === "en" && parts.length > 1 ? esc(parts[0]) + ' <span>' + esc(parts.slice(1).join(" ")) + "</span>" : esc(nm);
    return '<article class="fee-card' + (m.featured ? " featured" : "") + '">' +
      "<h3>" + title + "</h3>" +
      '<div class="fee">' + fee + "</div>" +
      '<div class="period">' + esc(L(m, "period")) + "</div>" +
      '<p class="elig">' + esc(L(m, "eligibility")) + "</p>" +
      '<a class="btn ' + (m.featured ? "btn-red" : "btn-navy") + ' btn-sm" href="' + esc(applyUrl()) + '"' + extAttrs(applyUrl()) + ">" + esc(t("btn.apply")) + "</a>" +
      "</article>";
  }
  function memberCard(m) {
    return '<article class="member-card">' +
      '<div class="member-photo">' + avatar(m.photo, "members", m.name) + "</div>" +
      badge(m) + "<h3>" + esc(m.name) + "</h3>" +
      '<p class="city">' + esc(m.city) + "</p>" +
      '<p class="org">' + esc(m.designation || "") + (m.organization ? " · " + esc(m.organization) : "") + "</p>" +
      "</article>";
  }
  function newsCard(n) {
    return '<article class="news-card">' +
      '<a class="news-img" href="news.html?id=' + esc(n.id) + '" tabindex="-1" aria-hidden="true">' +
        (n.image ? '<img src="assets/photos/news/' + esc(n.image) + '" alt="" loading="lazy">' : '<div class="news-img-ph"><img src="assets/img/pbpc-logo-512.png" alt=""></div>') + "</a>" +
      '<div class="news-body">' + badge(n) + '<p class="news-meta"><span class="cat">' + esc(n.category || "") + "</span> · " + esc(fmtDate(n.date)) + "</p>" +
      '<h3><a href="news.html?id=' + esc(n.id) + '">' + esc(L(n, "title")) + "</a></h3>" +
      "<p>" + esc(n.summary || "") + "</p>" +
      '<a class="link-more" href="news.html?id=' + esc(n.id) + '">' + esc(t("btn.read")) + icon("arrow") + "</a></div></article>";
  }
  function empty(k) { return '<div class="empty">' + icon("calendar") + "<p>" + esc(t(k)) + "</p></div>"; }

  /* ---------- gallery & lightbox ---------- */
  function galleryPhotos() {
    var all = [];
    (D.gallery || []).forEach(function (a) {
      (a.photos || []).forEach(function (p) {
        all.push({ src: "assets/photos/gallery/" + a.folder + "/" + p.file, caption: p.caption || "", album: a.album, category: a.category, date: a.date });
      });
    });
    return all;
  }
  var lbList = [], lbIdx = 0;
  function galleryGrid(list, limit) {
    lbList = list;
    if (!list.length) return '<div class="gallery-empty"><img src="assets/img/pbpc-logo-512.png" alt=""><p>' + esc(t("empty.gallery")) + "</p></div>";
    return list.slice(0, limit || list.length).map(function (p, i) {
      return '<button type="button" class="g-item" data-lb="' + i + '"><img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" loading="lazy"></button>';
    }).join("");
  }
  function openLb(i) {
    lbIdx = i; var p = lbList[i]; if (!p) return;
    var lb = $("#lightbox");
    if (!lb) {
      lb = document.createElement("div"); lb.id = "lightbox"; lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
      lb.innerHTML = '<button type="button" class="lb-close" aria-label="Close">' + icon("close") + '</button><button type="button" class="lb-prev" aria-label="Previous">‹</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-next" aria-label="Next">›</button>';
      document.body.appendChild(lb);
      lb.addEventListener("click", function (e) {
        if (e.target === lb || e.target.closest(".lb-close")) closeLb();
        else if (e.target.closest(".lb-prev")) openLb((lbIdx - 1 + lbList.length) % lbList.length);
        else if (e.target.closest(".lb-next")) openLb((lbIdx + 1) % lbList.length);
      });
    }
    $("img", lb).src = p.src; $("img", lb).alt = p.caption;
    $("figcaption", lb).textContent = [p.caption, p.album, p.date ? fmtDate(p.date) : ""].filter(Boolean).join(" · ");
    lb.hidden = false; document.body.classList.add("no-scroll"); $(".lb-close", lb).focus();
  }
  function closeLb() { var lb = $("#lightbox"); if (lb) lb.hidden = true; document.body.classList.remove("no-scroll"); }

  /* ---------- search ---------- */
  var PAGES = [
    ["about.html", "About Us — history, mission, vision, values"], ["leadership.html", "Leadership — executive committee"],
    ["membership.html", "Membership — categories, fees, how to apply, FAQ"], ["members.html", "Member Directory"],
    ["events.html", "Events & Programs"], ["news.html", "News & Updates"], ["gallery.html", "Photo Gallery"],
    ["resources.html", "Resources — journalism ethics, press freedom, safety"], ["contact.html", "Contact Us"],
    ["ethics.html", "Code of Ethics"], ["verify.html", "Verify Press ID"], ["policies.html", "Privacy Policy, Terms, Membership Policy"]
  ];
  function searchIndex() {
    var idx = PAGES.map(function (p) { return { title: p[1], url: p[0], type: "Page" }; });
    visible(D.news).forEach(function (n) { idx.push({ title: n.title + " " + (n.summary || ""), label: n.title, url: "news.html?id=" + n.id, type: "News" }); });
    visible(D.events).forEach(function (e) { idx.push({ title: e.title + " " + (e.venue || ""), label: e.title, url: "events.html?id=" + e.id, type: "Event" }); });
    visible(D.leadership).forEach(function (p) { idx.push({ title: p.name + " " + p.role, label: p.name + " — " + p.role, url: "leadership.html#" + p.id, type: "Leadership" }); });
    visible(D.members).forEach(function (m) { idx.push({ title: m.name + " " + m.city + " " + (m.organization || ""), label: m.name + " — " + m.city, url: "members.html", type: "Member" }); });
    return idx;
  }
  function openSearch() {
    var m = $("#search-modal");
    if (!m) {
      m = document.createElement("div"); m.id = "search-modal"; m.className = "search-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "Search");
      m.innerHTML = '<div class="search-box"><div class="search-row">' + icon("search") + '<input id="search-input" type="search" autocomplete="off"><button type="button" class="icon-btn" id="search-close" aria-label="Close">' + icon("close") + '</button></div><ul id="search-results"></ul></div>';
      document.body.appendChild(m);
      m.addEventListener("click", function (e) { if (e.target === m || e.target.closest("#search-close")) closeSearch(); });
      $("#search-input").addEventListener("input", function () {
        var q = this.value.trim().toLowerCase(), out = $("#search-results");
        if (!q) { out.innerHTML = ""; return; }
        var r = searchIndex().filter(function (x) { return x.title.toLowerCase().indexOf(q) > -1; }).slice(0, 12);
        out.innerHTML = r.length ? r.map(function (x) { return '<li><a href="' + esc(x.url) + '"><span class="st">' + esc(x.type) + "</span>" + esc(x.label || x.title) + "</a></li>"; }).join("") :
          '<li class="none">' + esc(t("search.none")) + "</li>";
      });
    }
    $("#search-input").placeholder = t("search.placeholder");
    m.hidden = false; document.body.classList.add("no-scroll"); $("#search-input").focus();
  }
  function closeSearch() { var m = $("#search-modal"); if (m) m.hidden = true; document.body.classList.remove("no-scroll"); }

  /* ---------- page renderers ---------- */
  function fill(sel, html) { var el = $(sel); if (el) el.innerHTML = html; }
  function upcoming() {
    return visible(D.events).filter(function (e) { var d = parseDate(e.date); return !d || d >= today; })
      .sort(function (a, b) { return (parseDate(a.date) || 9e15) - (parseDate(b.date) || 9e15); });
  }
  function past() {
    return visible(D.events).filter(function (e) { var d = parseDate(e.date); return d && d < today; })
      .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  }
  function leaders() { return visible(D.leadership).sort(function (a, b) { return (a.order || 99) - (b.order || 99); }); }
  function byId(id) { return leaders().filter(function (p) { return p.id === id; })[0]; }
  /* Top row of the committee: President, Senior VP (or VP), General Secretary, Organizing Secretary */
  function topLeaders() {
    return [byId("president"), byId("senior-vp") || byId("vp"), byId("gs"), byId("org-sec")].filter(Boolean);
  }
  function newsSorted() { return visible(D.news).sort(function (a, b) { return (parseDate(b.date) || 0) - (parseDate(a.date) || 0); }); }

  function renderHome() {
    var homeL = [byId("president"), byId("gs")].filter(Boolean);
    if (!homeL.length) homeL = leaders().slice(0, 2);
    fill("#home-leaders", homeL.map(function (p) { return leaderCard(p); }).join(""));
    var up = upcoming();
    fill("#home-events", up.length ? eventCard(up[0]) : empty("empty.events"));
    fill("#home-fees", (D.membership || []).map(feeCard).join(""));
    fill("#home-members", visible(D.members).map(memberCard).join("") || empty("empty.members"));
    fill("#home-gallery", galleryGrid(galleryPhotos(), 9));
    var ns = newsSorted();
    fill("#home-news", ns.length ? ns.slice(0, 3).map(newsCard).join("") : empty("empty.news"));
  }
  function renderLeadership() {
    var top = topLeaders(), rest = leaders().filter(function (p) { return top.indexOf(p) < 0; });
    var la = $("#leaders-all"); if (la) la.className = "leader-rows";
    fill("#leaders-all", '<div class="leaders row-top">' + top.map(function (p) { return leaderCard(p, true); }).join("") + "</div>" +
      (rest.length ? '<div class="leaders row-rest">' + rest.map(function (p) { return leaderCard(p, true); }).join("") + "</div>" : ""));
    var msgs = D.messages || {}, h = "";
    Object.keys(msgs).forEach(function (k) { var m = msgs[k]; if (m && m.text) h += '<article class="message"><h3>' + esc(L(m, "title")) + "</h3><p>" + esc(m.text).replace(/\n\n/g, "</p><p>") + "</p></article>"; });
    fill("#leader-messages", h);
    var ms = $("#messages-section"); if (ms) ms.hidden = !h;
  }
  function renderMembership() {
    fill("#fees-all", (D.membership || []).map(feeCard).join(""));
    $$("[data-apply]").forEach(function (a) { a.href = applyUrl(); if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; } });
  }
  function renderMembers() {
    var all = visible(D.members);
    var cityF = $("#f-city"), roleF = $("#f-role"), q = $("#f-q");
    function opts(sel, key, allKey) {
      if (!sel) return; var cur = sel.value;
      var vals = all.map(function (m) { return m[key]; }).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      sel.innerHTML = '<option value="">' + esc(t(allKey)) + "</option>" + vals.map(function (v) { return "<option>" + esc(v) + "</option>"; }).join("");
      sel.value = cur;
    }
    opts(cityF, "city", "filter.allCities"); opts(roleF, "designation", "filter.allRoles");
    function draw() {
      var qq = (q && q.value || "").toLowerCase(), c = cityF && cityF.value, r = roleF && roleF.value;
      var list = all.filter(function (m) {
        return (!c || m.city === c) && (!r || m.designation === r) &&
          (!qq || (m.name + " " + (m.organization || "")).toLowerCase().indexOf(qq) > -1);
      });
      fill("#members-all", list.length ? list.map(memberCard).join("") : empty("empty.members"));
    }
    if (q && !q._b) { q._b = 1; [q, cityF, roleF].forEach(function (el) { el.addEventListener("input", draw); }); }
    if (q) q.placeholder = t("filter.search");
    draw();
  }
  function renderEvents() {
    var id = qs("id");
    if (id) {
      var e = visible(D.events).filter(function (x) { return x.id === id; })[0];
      if (e) {
        $("#events-list").hidden = true; $("#event-detail").hidden = false;
        fill("#event-detail-body", eventCard(e, true) + (e.description ? "" : ""));
        return;
      }
    }
    var up = upcoming(), pa = past();
    fill("#events-upcoming", up.length ? up.map(function (e) { return eventCard(e, true); }).join("") : empty("empty.events"));
    fill("#events-past", pa.length ? pa.map(function (e) { return eventCard(e, true); }).join("") : "");
    var ps = $("#past-section"); if (ps) ps.hidden = !pa.length;
  }
  function renderNews() {
    var id = qs("id"), all = newsSorted();
    if (id) {
      var n = all.filter(function (x) { return x.id === id; })[0];
      if (n) {
        $("#news-list").hidden = true; $("#news-article").hidden = false;
        var share = encodeURIComponent(location.href);
        fill("#news-article-body",
          badge(n) + '<p class="news-meta"><span class="cat">' + esc(n.category || "") + "</span> · " + esc(fmtDate(n.date)) + (n.author ? " · " + esc(n.author) : "") + "</p>" +
          "<h1>" + esc(L(n, "title")) + "</h1>" +
          (n.image ? '<img class="article-img" src="assets/photos/news/' + esc(n.image) + '" alt="">' : "") +
          '<div class="article-text"><p>' + esc(n.body || n.summary || "").replace(/\n\n/g, "</p><p>") + "</p></div>" +
          '<div class="share">Share: <a href="https://www.facebook.com/sharer/sharer.php?u=' + share + '" target="_blank" rel="noopener">Facebook</a>' +
          '<a href="https://twitter.com/intent/tweet?url=' + share + '" target="_blank" rel="noopener">X</a>' +
          '<a href="https://wa.me/?text=' + share + '" target="_blank" rel="noopener">WhatsApp</a></div>');
        document.title = n.title + " — PBPC";
        return;
      }
    }
    var cats = all.map(function (n) { return n.category; }).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var bar = $("#news-cats"), cur = bar && bar.getAttribute("data-cur") || "";
    if (bar) {
      bar.innerHTML = ['<button type="button" data-cat=""' + (!cur ? ' class="on"' : "") + ">" + esc(t("filter.all")) + "</button>"].concat(cats.map(function (c) {
        return '<button type="button" data-cat="' + esc(c) + '"' + (cur === c ? ' class="on"' : "") + ">" + esc(c) + "</button>";
      })).join("");
      bar.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; bar.setAttribute("data-cur", b.getAttribute("data-cat")); renderNews(); };
    }
    var list = all.filter(function (n) { return !cur || n.category === cur; });
    fill("#news-all", list.length ? list.map(newsCard).join("") : empty("empty.news"));
  }
  function renderGallery() {
    var all = galleryPhotos();
    var cats = all.map(function (p) { return p.category; }).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var bar = $("#gallery-cats"), cur = bar && bar.getAttribute("data-cur") || "";
    if (bar) {
      bar.innerHTML = cats.length ? ['<button type="button" data-cat=""' + (!cur ? ' class="on"' : "") + ">" + esc(t("filter.all")) + "</button>"].concat(cats.map(function (c) {
        return '<button type="button" data-cat="' + esc(c) + '"' + (cur === c ? ' class="on"' : "") + ">" + esc(c) + "</button>";
      })).join("") : "";
      bar.onclick = function (e) { var b = e.target.closest("button"); if (!b) return; bar.setAttribute("data-cur", b.getAttribute("data-cat")); renderGallery(); };
    }
    fill("#gallery-all", galleryGrid(all.filter(function (p) { return !cur || p.category === cur; })));
  }
  function initVerify() {
    var f = $("#verify-form"); if (!f || f._b) return; f._b = 1;
    function check(raw) {
      var id = (raw || "").trim().toUpperCase(), out = $("#verify-result");
      if (!id) { out.hidden = true; return; }
      var c = (D.credentials || []).filter(function (x) { return (x.id || "").toUpperCase() === id; })[0];
      var st, cls, body = "";
      if (!c) { st = "NOT FOUND"; cls = "nf"; body = "<p>No PBPC press ID with this number exists in our records. Check the number and try again.</p>"; }
      else {
        var exp = parseDate(c.expires);
        if (c.status === "revoked") { st = "REVOKED"; cls = "bad"; }
        else if (exp && exp < today) { st = "EXPIRED"; cls = "warn"; }
        else { st = "VALID"; cls = "ok"; }
        body = "<dl><dt>Press ID</dt><dd>" + esc(c.id) + "</dd><dt>Name</dt><dd>" + esc(c.name) + "</dd><dt>Designation</dt><dd>" + esc(c.designation || "") + "</dd><dt>Valid until</dt><dd>" + esc(fmtDate(c.expires)) + "</dd></dl>";
      }
      out.className = "verify-result " + cls;
      out.innerHTML = '<div class="vr-status">' + icon(cls === "ok" ? "shield" : "close") + st + "</div>" + body;
      out.hidden = false;
    }
    f.addEventListener("submit", function (e) { e.preventDefault(); check($("#v-id").value); });
    var pre = qs("id"); if (pre) { $("#v-id").value = pre; check(pre); }
  }
  function initContact() {
    var f = $("#contact-form"); if (!f || f._b) return; f._b = 1;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var st = $("#cf-status"), data = new FormData(f);
      if (data.get("_gotcha")) return;
      if (S.contactFormEndpoint) {
        st.textContent = "Sending…"; st.className = "cf-status";
        fetch(S.contactFormEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw 0; f.reset(); st.textContent = "Thank you. Your message has been sent to PBPC."; st.className = "cf-status ok"; })
          .catch(function () { st.textContent = "The message could not be sent. Please email us directly at " + S.email + "."; st.className = "cf-status bad"; });
      } else {
        var body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\nTopic: " + data.get("topic") + "\n\n" + data.get("message");
        location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("[PBPC Website] " + data.get("topic")) + "&body=" + encodeURIComponent(body);
        st.textContent = "Your email app should open with the message ready. If it does not, please write to " + S.email + ".";
        st.className = "cf-status";
      }
    });
  }

  /* ---------- i18n apply & global events ---------- */
  function applyI18n() {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("lang-bn", lang === "bn");
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $$("[data-email]").forEach(function (el) { el.textContent = S.email; if (el.tagName === "A") el.href = "mailto:" + S.email; });
    $$("[data-apply]").forEach(function (a) { a.href = applyUrl(); if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener"; } });
    $$("i[data-icon]").forEach(function (el) { if (!el.firstChild) el.outerHTML = icon(el.getAttribute("data-icon")); });
  }
  function renderAll() {
    renderHeader(); renderFooter();
    var r = { home: renderHome, leadership: renderLeadership, membership: renderMembership, members: renderMembers,
      events: renderEvents, news: renderNews, gallery: renderGallery }[page];
    if (r) r();
    applyI18n(); initVerify(); initContact();
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#lang-btn, [data-lang-toggle]")) { setLang(lang === "en" ? "bn" : "en"); return; }
    if (e.target.closest("#search-btn")) { openSearch(); return; }
    var mb = e.target.closest("#menu-btn");
    if (mb) { var open = document.body.classList.toggle("nav-open"); mb.setAttribute("aria-expanded", open); return; }
    var g = e.target.closest("[data-lb]"); if (g) { openLb(+g.getAttribute("data-lb")); return; }
    var car = e.target.closest("[data-scroll]");
    if (car) { var tr = $(car.getAttribute("data-target")); if (tr) tr.scrollBy({ left: (+car.getAttribute("data-scroll")) * tr.clientWidth * 0.8, behavior: "smooth" }); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLb(); closeSearch(); document.body.classList.remove("nav-open"); }
    var lb = $("#lightbox");
    if (lb && !lb.hidden && lbList.length) {
      if (e.key === "ArrowRight") openLb((lbIdx + 1) % lbList.length);
      if (e.key === "ArrowLeft") openLb((lbIdx - 1 + lbList.length) % lbList.length);
    }
  });

  renderAll();
})();

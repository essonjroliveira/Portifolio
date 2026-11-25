/*
 * Monta a página a partir de content.js e cuida das interações:
 * tema (sistema/claro/escuro), menu fixo com a seção ativa, detalhes dos serviços,
 * galeria com filtro, ampliar foto, "ver mais", números em contagem e entrada suave das seções.
 */
(function () {
  'use strict';

  var C = window.CONTENT, L = window.LINKS, IMG = window.IMG || '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_KEY = 'lf-theme';
  var state = { theme: read(THEME_KEY, ['system', 'light', 'dark'], 'system'), filter: 'todos' };

  function read(key, allowed, fallback) {
    try { var v = localStorage.getItem(key); if (allowed.indexOf(v) !== -1) return v; } catch (e) { /* sem armazenamento */ }
    return fallback;
  }
  function save(key, v) { try { localStorage.setItem(key, v); } catch (e) { /* ignora */ } }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; });
  }
  function wa(msg) { return 'https://wa.me/' + L.whatsNumber + '?text=' + encodeURIComponent(msg); }
  function ext(label) { return ' target="_blank" rel="noopener" aria-label="' + esc(label + ' ' + C.ui.newTab) + '"'; }
  // imagem com fundo de reserva: se não carregar, o bloco continua bonito
  function src(file) { return (window.IMG_DATA && window.IMG_DATA[file]) || IMG + file; }
  function img(file, alt, cls, extra) {
    return '<img class="' + (cls || '') + '" src="' + src(file) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" onerror="this.classList.add(\'broken\')"' + (extra || '') + '>';
  }

  /* ---------- ícones ---------- */
  var I = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5 5.6 16A7.5 7.5 0 1 1 8.2 18.5Z"/><path d="M9.3 9.2c.2 1.9 1.6 3.6 3.6 4.4l.9-.9 1.6.7-.2 1.2c-2.8.1-5.8-2.7-6-5.5l1.2-.3.7 1.6Z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="9" cy="9.5" r="2"/><path d="M5.8 17.2c.5-2.2 1.8-3.3 3.2-3.3s2.7 1.1 3.2 3.3M14.5 9h3.5M14.5 12.5h3.5"/></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r=".6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5Z"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m0 0-5-5m5 5 5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M10.5 8v5M8 10.5h5"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  };

  /* ---------- partes da página ---------- */
  function brand() {
    return '<a href="#capa" class="brand"><span class="brand-mark" aria-hidden="true"><b>LF</b>' + img('logo-luciana.jpg', '', 'brand-img') + '</span>' +
      '<span class="brand-text"><span class="brand-name">Luciana Fernandes</span><span class="brand-role">Especialista em Carreira &amp; RH</span></span></a>';
  }

  function header() {
    var themes = [['system', C.ui.system], ['light', C.ui.light], ['dark', C.ui.dark]].map(function (t) {
      return '<button type="button" data-theme-pref="' + t[0] + '" aria-pressed="' + (state.theme === t[0]) + '">' + esc(t[1]) + '</button>';
    }).join('');
    return '<a class="skip" href="#conteudo">' + esc(C.ui.skip) + '</a>' +
      '<header class="header"><div class="wrap"><div class="header-in">' + brand() +
        '<nav class="nav" aria-label="Principal">' + C.nav.map(function (n) { return '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('') + '</nav>' +
        '<div class="controls">' +
          '<div class="seg" role="group" aria-label="' + esc(C.ui.theme) + '">' + themes + '</div>' +
          '<a class="btn small ghost-line site-btn" href="' + L.site + '"' + ext(C.ui.site) + '>' + I.globe + '<span>' + esc(C.ui.site) + '</span></a>' +
          '<a class="btn small primary" href="#contato">' + esc(C.ui.contact) + '</a>' +
        '</div>' +
      '</div></div></header>';
  }

  function eyebrow(num, text) {
    return '<p class="eyebrow"><span class="num">' + num + '</span>' + esc(text) + '</p>';
  }
  function head(num, s, id) {
    return eyebrow(num, s.eyebrow) + '<h2 class="h2" id="' + id + '">' + esc(s.title) + '</h2>' + (s.lead ? '<p class="lead">' + esc(s.lead) + '</p>' : '');
  }

  function hero() {
    var h = C.hero;
    var name = h.name.split(' ');
    var last = name.pop();
    return '<section id="capa" class="hero"><div class="wrap"><div class="hero-grid">' +
      '<div class="hero-text">' +
        '<p class="badge"><span class="dot" aria-hidden="true"></span>' + esc(h.badge) + '</p>' +
        '<p class="kicker">' + esc(h.kicker) + '</p>' +
        '<h1>' + esc(name.join(' ')) + ' <em>' + esc(last) + '</em></h1>' +
        '<p class="hero-intro">' + esc(h.quote) + '</p>' +
        '<div class="hero-actions">' +
          '<a class="btn primary" href="#servicos">' + esc(h.ctaServices) + I.arrowDown + '</a>' +
          '<a class="btn" href="#contato">' + I.chat + esc(h.ctaTalk) + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="photo">' +
        '<button type="button" class="photo-btn" data-zoom="' + esc(h.photo) + '" data-alt="' + esc(h.photoAlt) + '" aria-label="' + esc(C.ui.zoom) + '">' +
          '<span class="photo-fallback" aria-hidden="true">LF</span>' + img(h.photo, h.photoAlt, 'photo-img', ' fetchpriority="high" loading="eager"') +
          '<span class="photo-hint">' + I.zoom + esc(C.ui.zoom) + '</span>' +
        '</button>' +
        // as etiquetas ficam empilhadas na parte de baixo da foto, longe do rosto
        '<div class="photo-tags">' +
          '<div class="photo-tag t2"><span class="dot" aria-hidden="true"></span><b>' + esc(h.tags[1].b) + '</b><span>' + esc(h.tags[1].t) + '</span></div>' +
          '<div class="photo-tag t1"><b>' + esc(h.tags[0].b) + '</b><span>' + esc(h.tags[0].t) + '</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div></section>';
  }

  function trajetoria() {
    var s = C.trajetoria, k = s.cert;
    return '<section id="trajetoria" class="section" aria-labelledby="t-traj"><div class="wrap reveal">' + head('01', s, 't-traj') +
      '<div class="about-grid">' +
        '<ol class="timeline">' + s.items.map(function (x) {
          return '<li><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></li>';
        }).join('') + '</ol>' +
        '<aside class="card cert-card">' +
          '<p class="cert-top"><span>' + esc(k.top[0]) + '</span><span class="seal">' + I.check + esc(k.top[1]) + '</span></p>' +
          '<small>' + esc(k.label) + '</small>' +
          '<p class="cert-name">' + esc(k.name) + '</p>' +
          '<p class="cert-role">' + esc(k.role) + '</p>' +
          '<p class="cert-quote">' + esc(k.quote) + '</p>' +
          '<ul class="chips">' + k.chips.map(function (c) { return '<li class="chip">' + esc(c) + '</li>'; }).join('') + '</ul>' +
          '<div class="ruler" aria-hidden="true"></div>' +
        '</aside>' +
      '</div></div></section>';
  }

  function figure(f, cls) {
    var final = (f.prefix || '') + f.to + (f.suffix || '');
    return '<span class="count ' + (cls || '') + '" data-to="' + f.to + '" data-prefix="' + esc(f.prefix || '') + '" data-suffix="' + esc(f.suffix || '') + '">' + esc(final) + '</span>';
  }

  function autoridade() {
    var s = C.autoridade;
    return '<section id="autoridade" class="section alt" aria-labelledby="t-aut"><div class="wrap reveal">' + head('02', s, 't-aut') +
      '<div class="authority">' +
        '<div class="card metric-main"><p class="figure big">' + figure(s.main) + '<small>' + esc(s.main.label) + '</small></p><div class="ruler" aria-hidden="true"></div></div>' +
        '<div class="facts">' + s.items.map(function (x) {
          return '<div class="card fact">' +
            (x.fig ? '<b class="fact-fig">' + figure(x.fig) + ' ' + esc(x.title) + '</b>' : '<b>' + esc(x.title) + '</b>') +
            '<span>' + esc(x.text) + '</span></div>';
        }).join('') + '</div>' +
      '</div></div></section>';
  }

  function cards(s, num, id, sid, cls) {
    return '<section id="' + sid + '" class="section' + (cls ? ' ' + cls : '') + '" aria-labelledby="' + id + '"><div class="wrap reveal">' + head(num, s, id) +
      '<div class="value-grid three">' + s.items.map(function (x, i) {
        return '<div class="card value"><span class="value-n" aria-hidden="true">' + ('0' + (i + 1)) + '</span><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p>' +
          (s.tag ? '<span class="value-tag">' + I.check + esc(s.tag) + '</span>' : '') + '</div>';
      }).join('') + '</div></div></section>';
  }

  function serviceCard(p, featured) {
    var S = C.servicos.labels;
    return '<article class="card project' + (featured ? ' featured' : '') + '">' +
      '<div class="project-media"><span class="media-fallback" aria-hidden="true">' + esc(p.category) + '</span>' + img(p.img, p.title, 'media-img') + '<div class="ruler" aria-hidden="true"></div></div>' +
      '<div class="project-body">' +
        '<span class="project-cat">' + esc(p.category) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="desc">' + esc(p.text) + '</p>' +
        '<div class="question"><small>' + esc(S.benefit) + '</small>' + esc(p.benefit) + '</div>' +
        '<div class="project-foot">' +
          '<button type="button" class="btn small" data-details="' + p.id + '" aria-haspopup="dialog">' + I.expand + esc(S.details) + '</button>' +
          '<a class="btn small primary" href="' + wa('Olá Luciana Fernandes! Gostaria de saber mais informações sobre "' + p.title + '".') + '"' + ext(S.whats + ': ' + p.title) + '>' + I.chat + esc(S.whats) + '</a>' +
        '</div>' +
      '</div></article>';
  }

  function servicos() {
    var s = C.servicos;
    return '<section id="servicos" class="section" aria-labelledby="t-serv"><div class="wrap">' +
      '<div class="reveal">' + head('04', s, 't-serv') + '</div>' +
      '<div class="projects">' + s.items.map(function (p, i) { return serviceCard(p, i === 0); }).join('') + '</div>' +
    '</div></section>';
  }

  function serviceModal(p) {
    var S = C.servicos.labels;
    return '<button type="button" class="modal-close" aria-label="' + esc(C.ui.close) + '">' + I.close + '</button>' +
      '<span class="project-cat">' + esc(p.category) + '</span>' +
      '<h3 id="modal-title">' + esc(p.title) + '</h3>' +
      '<p class="modal-lead">' + esc(p.text) + '</p>' +
      '<div class="modal-figure"><small>' + esc(S.view) + '</small><p>' + esc(p.view) + '</p><div class="ruler" aria-hidden="true"></div></div>' +
      '<h4>' + esc(S.included) + '</h4>' +
      '<ul class="included">' + p.included.map(function (x) { return '<li>' + I.check + '<div><b>' + esc(x.b) + '</b><span>' + esc(x.t) + '</span></div></li>'; }).join('') + '</ul>' +
      '<div class="question"><small>' + esc(S.impact) + '</small>' + esc(p.benefit) + '</div>' +
      '<div class="modal-foot"><p><b>' + esc(S.personal) + '</b><span>' + esc(S.limited) + '</span></p>' +
        '<a class="btn primary" href="' + wa('Olá Luciana Fernandes! Gostaria de saber mais informações sobre "' + p.title + '".') + '"' + ext(S.schedule + ': ' + p.title) + '>' + I.chat + esc(S.schedule) + '</a></div>';
  }

  function nr1() {
    var s = C.nr1;
    return '<section id="nr1" class="section alt" aria-labelledby="t-nr1"><div class="wrap reveal">' + head('06', s, 't-nr1') +
      '<div class="nr1">' +
        '<ol class="exp-list">' + s.items.map(function (x) {
          return '<li class="card exp"><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></li>';
        }).join('') + '</ol>' +
        '<aside class="card nr1-cta"><p>' + esc(s.closing) + '</p><a class="btn primary" href="#contato">' + esc(s.cta) + '</a><div class="ruler" aria-hidden="true"></div></aside>' +
      '</div></div></section>';
  }

  function sobre() {
    var s = C.sobre;
    return '<section id="sobre" class="section" aria-labelledby="t-sobre"><div class="wrap reveal">' + head('07', s, 't-sobre') +
      '<div class="about-grid">' +
        '<figure class="about-quote"><blockquote><p>' + esc(s.text) + '</p></blockquote><figcaption>' + esc(s.signature) + '</figcaption></figure>' +
        '<div class="about-side">' +
          '<a class="card link-card" href="' + L.site + '"' + ext(s.cardTitle) + '><small>' + esc(s.cardTitle) + '</small><span>' + esc(s.cardText) + '</span><b>' + I.globe + esc(s.cardCta) + '</b></a>' +
          '<p class="loc">' + I.pin + esc(s.location) + '</p>' +
        '</div>' +
      '</div></div></section>';
  }

  function galleryItems() {
    var g = C.galeria, VIS = 2, n = 0;
    return g.items.map(function (x) {
      var show = state.filter === 'todos' || state.filter === x.group;
      if (!show) return '';
      n++;
      return '<article class="card shot' + (n > VIS ? ' extra' : '') + '">' +
        '<button type="button" class="shot-media" data-zoom="' + esc(x.img) + '" data-alt="' + esc(x.title) + '" aria-label="' + esc(g.zoom + ': ' + x.title) + '">' +
          '<span class="media-fallback" aria-hidden="true">' + esc(x.n) + '</span>' + img(x.img, x.title, 'media-img') +
          '<span class="photo-hint">' + I.zoom + esc(g.zoom) + '</span>' +
        '</button>' +
        '<div class="project-body">' +
          '<span class="project-cat">' + esc(g.groups[x.group]) + ' · ' + esc(x.n) + '</span>' +
          '<h3>' + esc(x.title) + '</h3>' +
          '<p class="desc">' + esc(x.text) + '</p>' +
          '<div class="project-foot"><button type="button" class="btn small" data-shot="' + x.id + '" aria-haspopup="dialog">' + I.expand + esc(g.expand) + '</button></div>' +
        '</div></article>';
    }).join('');
  }
  function galleryCount() {
    var g = C.galeria;
    return g.items.filter(function (x) { return state.filter === 'todos' || state.filter === x.group; }).length;
  }

  function galeria() {
    var g = C.galeria;
    var hidden = Math.max(0, galleryCount() - 2);
    return '<section id="galeria" class="section" aria-labelledby="t-gal"><div class="wrap">' +
      '<div class="reveal">' + head('08', g, 't-gal') +
        '<div class="seg filters" role="group" aria-label="' + esc(g.filterLabel) + '">' + g.filters.map(function (f) {
          return '<button type="button" data-filter="' + f[0] + '" aria-pressed="' + (state.filter === f[0]) + '">' + esc(f[1]) + '</button>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="gallery collapsible">' + galleryItems() + '</div>' +
      '<button type="button" class="btn more-btn mobile-only" aria-expanded="false" data-more' + (hidden ? '' : ' hidden') + '><span>' + esc(C.ui.more) + ' (' + hidden + ')</span>' + I.chevron + '</button>' +
      '<div class="card recognition"><div><b>' + esc(g.ctaTitle) + '</b><span>' + esc(g.ctaText) + '</span></div>' +
        '<a class="btn primary" href="' + L.site + '"' + ext(g.ctaBtn) + '>' + I.globe + esc(g.ctaBtn) + '</a></div>' +
    '</div></section>';
  }

  function shotModal(x) {
    var g = C.galeria;
    return '<button type="button" class="modal-close" aria-label="' + esc(C.ui.close) + '">' + I.close + '</button>' +
      '<div class="modal-photo"><span class="media-fallback" aria-hidden="true">' + esc(x.n) + '</span>' + img(x.img, x.title, 'media-img') + '</div>' +
      '<span class="project-cat">' + esc(g.groups[x.group]) + ' · ' + esc(x.n) + '</span>' +
      '<h3 id="modal-title">' + esc(x.title) + '</h3>' +
      '<p class="modal-lead">' + esc(x.text) + '</p>' +
      '<div class="question"><small>' + esc(g.focus) + '</small>' + esc(x.focus) + '</div>';
  }

  function contato() {
    var k = C.contato;
    return '<section id="contato" class="section" aria-labelledby="t-cont"><div class="wrap reveal">' +
      '<div class="card contact">' +
        '<p class="eyebrow"><span class="num">09</span>' + esc(C.ui.contact) + '</p>' +
        '<h2 class="h2" id="t-cont">' + esc(k.title) + '</h2>' +
        '<p class="contact-text">' + esc(k.text) + '</p>' +
        '<div class="contact-main">' +
          '<a class="btn primary" href="' + wa(L.whatsMsg) + '"' + ext('WhatsApp ' + L.whatsText) + '>' + I.chat + 'WhatsApp</a>' +
          '<a class="btn ghost" href="' + L.linkedin + '"' + ext('LinkedIn') + '>' + I.profile + 'LinkedIn</a>' +
          '<a class="btn ghost" href="' + L.instagram + '"' + ext('Instagram') + '>' + I.camera + 'Instagram</a>' +
        '</div>' +
        '<ul class="contact-lines">' +
          '<li><small>WhatsApp</small>' + esc(L.whatsText) + '</li>' +
          '<li><small>LinkedIn</small>' + esc(L.linkedinText) + '</li>' +
          '<li><small>Instagram</small>' + esc(L.instagramText) + '</li>' +
          '<li><small>E-mail</small><a href="mailto:' + L.email + '">' + esc(L.email) + '</a></li>' +
        '</ul>' +
        '<a class="portal" href="' + L.site + '"' + ext(k.portalLabel) + '><small>' + esc(k.portalLabel) + '</small><span>' + esc(k.portalText) + '</span><b>' + I.globe + esc(k.portalCta) + '</b></a>' +
        '<p class="contact-loc">' + I.pin + esc(k.location) + '</p>' +
      '</div>' +
    '</div></section>';
  }

  function footer() {
    var f = C.footer;
    return '<footer class="footer"><div class="wrap">' +
      '<div class="foot-brand">' + brand() + '</div>' +
      '<p class="foot-links"><a href="' + L.site + '"' + ext(L.siteText) + '>' + esc(L.siteText) + '</a><a href="mailto:' + L.email + '">' + esc(L.email) + '</a></p>' +
      '<p class="foot-copy"><span>' + esc(f.copy) + '</span><a href="#capa">' + esc(C.ui.top) + '</a></p>' +
    '</div></footer>' +
    '<a class="float-whats" href="' + wa(L.whatsMsg) + '"' + ext('WhatsApp') + '>' + I.chat + '<span>WhatsApp</span></a>';
  }

  /* ---------- montagem ---------- */
  var app = document.getElementById('app');

  function render() {
    document.title = C.meta.title;
    app.innerHTML = header() + '<main id="conteudo">' + hero() + trajetoria() + autoridade() +
      cards(C.expertise, '03', 't-exp', 'expertise') + servicos() + cards(C.corporativo, '05', 't-corp', 'corporativo', 'alt') +
      nr1() + sobre() + galeria() + contato() + '</main>' + footer() +
      '<dialog class="card modal" id="modal" aria-labelledby="modal-title"></dialog>' +
      '<dialog class="lightbox" id="lightbox" aria-label="Foto ampliada"></dialog>';
    bind();
  }

  function applyTheme() {
    if (state.theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', state.theme);
  }

  /* ---------- interações ---------- */
  function openDialog(d, html, opener) {
    d.innerHTML = html;
    var x = d.querySelector('.modal-close'); if (x) x.addEventListener('click', function () { d.close(); });
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    document.body.classList.add('modal-open');
    d._opener = opener;
  }

  function bind() {
    var head = app.querySelector('.header');
    var modal = document.getElementById('modal'), lightbox = document.getElementById('lightbox');

    app.querySelectorAll('[data-theme-pref]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.theme = b.dataset.themePref; save(THEME_KEY, state.theme); applyTheme();
        app.querySelectorAll('[data-theme-pref]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.themePref === state.theme)); });
      });
    });

    [modal, lightbox].forEach(function (d) {
      d.addEventListener('click', function (e) { if (e.target === d || d === lightbox) d.close(); });
      d.addEventListener('close', function () { document.body.classList.remove('modal-open'); if (d._opener) d._opener.focus(); });
    });

    app.addEventListener('click', function (e) {
      var t = e.target.closest('[data-details],[data-shot],[data-zoom],[data-filter],[data-more]');
      if (!t) return;
      if (t.dataset.details) {
        var p = C.servicos.items.filter(function (x) { return x.id === t.dataset.details; })[0];
        openDialog(modal, serviceModal(p), t);
      } else if (t.dataset.shot) {
        var s = C.galeria.items.filter(function (x) { return x.id === t.dataset.shot; })[0];
        openDialog(modal, shotModal(s), t);
      } else if (t.dataset.zoom) {
        openDialog(lightbox, '<button type="button" class="modal-close" aria-label="' + esc(C.ui.close) + '">' + I.close + '</button>' +
          '<span class="media-fallback" aria-hidden="true">' + esc(t.dataset.alt) + '</span>' +
          '<img src="' + src(t.dataset.zoom) + '" alt="' + esc(t.dataset.alt) + '" onerror="this.classList.add(\'broken\')">', t);
      } else if (t.dataset.filter) {
        state.filter = t.dataset.filter;
        app.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.filter === state.filter)); });
        var gal = app.querySelector('.gallery');
        gal.classList.remove('open');
        gal.innerHTML = galleryItems();
        if (!reduce) gal.querySelectorAll('.shot').forEach(function (el, i) { el.style.animationDelay = (i * 70) + 'ms'; el.classList.add('pop'); });
        var more = app.querySelector('#galeria [data-more]'), hidden = Math.max(0, galleryCount() - 2);
        more.hidden = !hidden; more.classList.remove('open'); more.setAttribute('aria-expanded', 'false');
        more.querySelector('span').textContent = C.ui.more + ' (' + hidden + ')';
      } else if (t.hasAttribute('data-more')) {
        var box = app.querySelector('.gallery'), open = !box.classList.contains('open');
        box.classList.toggle('open', open); t.classList.toggle('open', open); t.setAttribute('aria-expanded', String(open));
        t.querySelector('span').textContent = open ? C.ui.less : C.ui.more + ' (' + Math.max(0, galleryCount() - 2) + ')';
        if (!open) document.getElementById('galeria').scrollIntoView({ block: 'start' });
      }
    });

    var onScroll = function () {
      head.classList.toggle('scrolled', window.scrollY > 8);
      document.body.classList.toggle('past-hero', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    reveal(); activeNav(); counters();
  }

  // entrada suave só para o que ainda está abaixo da tela
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (!en.isIntersecting) return; en.target.classList.add('in'); obs.unobserve(en.target); });
    }, { threshold: 0.08 });
    app.querySelectorAll('.reveal, .project, .shot').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('pre'); io.observe(el);
    });
  }

  // destaca no menu a seção visível e desliza o menu no celular
  function activeNav() {
    if (!('IntersectionObserver' in window)) return;
    var nav = app.querySelector('.nav'), links = nav.querySelectorAll('a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id === 'nr1' ? 'corporativo' : en.target.id; // NR-1 faz parte da atuação corporativa
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          if (on && nav.scrollWidth > nav.clientWidth) {
            nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    app.querySelectorAll('main > section').forEach(function (s) { io.observe(s); });
  }

  function counters() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (!en.isIntersecting) return; countUp(en.target); obs.unobserve(en.target); });
    }, { threshold: 0.6 });
    app.querySelectorAll('.count').forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    if (reduce || el._done) return;
    el._done = true;
    var to = parseFloat(el.dataset.to), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var final = el.textContent, dur = 1200, t0 = null;
    el.setAttribute('aria-label', final);
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? pre + Math.round(to * e) + suf : final;
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  applyTheme();
  render();
})();

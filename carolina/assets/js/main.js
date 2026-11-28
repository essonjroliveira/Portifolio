/*
 * Monta a página a partir de content.js e cuida das interações:
 * tema (sistema/claro/escuro), menu fixo com a seção atual destacada,
 * números em contagem, entrada suave das seções e o certificado em tela cheia.
 */
(function () {
  'use strict';

  var LINKS = window.LINKS, PHOTOS = window.PHOTOS || {}, c = window.CONTENT;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_KEY = 'carolina-theme';
  var theme = 'system';
  try { var t = localStorage.getItem(THEME_KEY); if (t === 'light' || t === 'dark') theme = t; } catch (e) { /* sem armazenamento */ }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ---------- ícones (traço simples, cor do texto) ---------- */
  var I = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5 5.6 16A7.5 7.5 0 1 1 8.2 18.5Z"/><path d="M9.3 9.2c.2 1.9 1.6 3.6 3.6 4.4l.9-.9 1.6.7-.2 1.2c-2.8.1-5.8-2.7-6-5.5l1.2-.3.7 1.6Z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="9" cy="9.5" r="2"/><path d="M5.8 17.2c.5-2.2 1.8-3.3 3.2-3.3s2.7 1.1 3.2 3.3M14.5 9h3.5M14.5 12.5h3.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m0 0-5-5m5 5 5-5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3.5 9h17M12 9v11M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 11l5.6-2Z"/><path d="M18.5 3v3M17 4.5h3"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    star: '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z"/></svg>',
  };
  function stars(n) { var s = ''; for (var i = 0; i < n; i++) s += I.star; return '<span class="stars">' + s + '</span>'; }

  function ext(label) { return ' target="_blank" rel="noopener" aria-label="' + esc(label + ' ' + c.ui.newTab) + '"'; }
  function book(cls, label) { return '<a class="btn ' + (cls || '') + '" href="' + LINKS.whatsapp + '"' + ext(label + ', WhatsApp') + '>' + I.chat + esc(label) + '</a>'; }

  // foto real quando houver (webp com jpg de reserva); até lá, um espaço reservado com as iniciais
  var SIZES = { 'photo-img': [600, 900, '(max-width: 860px) 260px, 380px', 900, 1125], 'contact-img': [320, 640, null, 160, 160] };
  function photo(name, alt, cls) {
    if (!name) return '<div class="' + cls + ' photo-ph" role="img" aria-label="' + esc(c.ui.photoSoon) + '"><span>CA</span><small>' + esc(c.ui.photoSoon) + '</small></div>';
    var z = SIZES[cls], b = 'assets/img/' + name + '-', lazy = cls === 'contact-img' ? ' loading="lazy"' : '';
    var set = function (ext) { return z[2] ? b + z[0] + ext + ' ' + z[0] + 'w, ' + b + z[1] + ext + ' ' + z[1] + 'w' : b + z[0] + ext + ' 1x, ' + b + z[1] + ext + ' 2x'; };
    var sizes = z[2] ? ' sizes="' + z[2] + '"' : '';
    return '<picture><source type="image/webp" srcset="' + set('.webp') + '"' + sizes + '>' +
      '<img class="' + cls + '" src="' + b + z[1] + '.jpg" srcset="' + set('.jpg') + '"' + sizes + ' width="' + z[3] + '" height="' + z[4] + '" alt="' + esc(alt) + '" decoding="async"' + lazy + '></picture>';
  }

  /* ---------- partes da página ---------- */
  var NAV = [['#aulas', 'lessons'], ['#trilha', 'path'], ['#para-quem', 'audience'], ['#sobre', 'about'], ['#pratica', 'cases'], ['#avaliacoes', 'reviews'], ['#valores', 'price'], ['#contato', 'contact']];

  function header() {
    var themes = [['system', c.ui.system], ['light', c.ui.light], ['dark', c.ui.dark]].map(function (x) {
      return '<button type="button" data-theme-pref="' + x[0] + '" aria-pressed="' + (theme === x[0]) + '">' + esc(x[1]) + '</button>';
    }).join('');
    return '<a class="skip" href="#conteudo">' + esc(c.ui.skip) + '</a>' +
      '<header class="header"><div class="wrap"><div class="header-in">' +
        '<a href="#inicio" class="brand"><span class="brand-mark" aria-hidden="true">CA</span><span class="brand-name">Carolina Abreu</span></a>' +
        '<nav class="nav" aria-label="Principal">' + NAV.map(function (l) { return '<a href="' + l[0] + '">' + esc(c.nav[l[1]]) + '</a>'; }).join('') + '</nav>' +
        '<div class="controls"><div class="seg" role="group" aria-label="' + esc(c.ui.theme) + '">' + themes + '</div></div>' +
      '</div></div></header>';
  }

  function titleWithAccent(t) {
    var m = t.match(/^(.*\s)(\S+)([.!?])$/);
    return m ? esc(m[1]) + '<em>' + esc(m[2]) + '</em>' + esc(m[3]) : esc(t);
  }

  function sectionHead(num, title, lead, id) {
    return '<p class="eyebrow">' + num + '</p><h2 class="h2" id="' + id + '">' + esc(title) + '</h2>' + (lead ? '<p class="lead">' + esc(lead) + '</p>' : '');
  }

  function hero() {
    var h = c.hero;
    return '<section id="inicio" class="hero"><div class="wrap">' +
      '<div class="hero-grid">' +
        '<div class="hero-text"><p class="eyebrow kicker"><span class="kg">' + esc(h.kicker) + '</span></p>' +
          '<h1>' + titleWithAccent(h.title) + '</h1>' +
          '<p class="hero-intro">' + esc(h.intro) + '</p>' +
          '<div class="hero-actions">' + book('primary', h.ctaBook) +
            '<a class="btn" href="#aulas">' + I.arrow + esc(h.ctaLessons) + '</a></div>' +
        '</div>' +
        '<div class="photo">' + photo(PHOTOS.hero, h.photoAlt, 'photo-img') +
          '<div class="photo-tags">' +
            '<div class="photo-tag t3"><span class="dot live" aria-hidden="true"></span>' + I.gift + esc(h.tags[0]) + '</div>' +
            '<div class="photo-tag t2">' + I.spark + esc(h.tags[1]) + '</div>' +
            '<div class="photo-tag t1">' + stars(5) + esc(h.tags[2]) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="highlights">' + h.highlights.map(function (x) {
        return '<div class="card highlight"><i aria-hidden="true"></i><b>' + esc(x.title) + '</b><span>' + esc(x.text) + '</span></div>';
      }).join('') + '</div>' +
    '</div></section>';
  }

  function lessons() {
    var L = c.lessons;
    return '<section id="aulas" class="section" aria-labelledby="t-aulas"><div class="wrap reveal">' +
      sectionHead('01', L.title, L.lead, 't-aulas') +
      '<div class="lesson-grid">' + L.items.map(function (x) {
        return '<div class="card lesson"><i aria-hidden="true"></i><h3>' + esc(x.tool) + '</h3><p>' + esc(x.text) + '</p>' +
          '<ul class="chips">' + x.chips.map(function (k) { return '<li class="chip">' + esc(k) + '</li>'; }).join('') + '</ul></div>';
      }).join('') +
        '<div class="card lesson lesson-cta">' + I.bulb + '<h3>' + esc(L.cta.title) + '</h3><p>' + esc(L.cta.text) + '</p>' + book('primary small', L.cta.button) + '</div>' +
      '</div></div></section>';
  }

  function path() {
    var p = c.path;
    return '<section id="trilha" class="section" aria-labelledby="t-trilha"><div class="wrap reveal">' +
      sectionHead('02', p.title, p.lead, 't-trilha') +
      '<ol class="ai-path">' + p.steps.map(function (x, i) {
        return '<li class="done"><span class="ai-dot num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<div class="card ai-step"><div class="ai-step-head"><small>Módulo ' + (i + 1) + '</small>' +
            '<em class="status lvl-' + Math.min(i, 3) + '">' + esc(x.level) + '</em></div>' +
            '<h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></div></li>';
      }).join('') + '</ol>' +
    '</div></section>';
  }

  function audience() {
    var a = c.audience;
    return '<section id="para-quem" class="section" aria-labelledby="t-quem"><div class="wrap reveal">' +
      sectionHead('03', a.title, a.lead, 't-quem') +
      '<div class="audience-grid">' + a.items.map(function (x) {
        return '<div class="card value"><i aria-hidden="true"></i><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></div>';
      }).join('') + '</div></div></section>';
  }

  function certificate(r) {
    var has = !!PHOTOS.certificate;
    var b = 'assets/img/' + PHOTOS.certificate;
    var thumb = has ? '<picture><source type="image/webp" srcset="' + b + '-thumb.webp"><img src="' + b + '-thumb.jpg" width="480" height="345" alt="' + esc(r.alt) + '" loading="lazy" decoding="async"></picture>'
      : '<span class="cert-ph">' + I.spark + '<small>' + esc(r.soon) + '</small></span>';
    return '<div class="recognition card">' +
      '<div class="recog-text"><div class="recog-head"><b>' + esc(r.title) + '</b><span>' + esc(r.date) + '</span></div>' +
        '<p>' + esc(r.text) + '</p>' +
        (has ? '<button type="button" class="btn small" data-cert aria-haspopup="dialog">' + I.expand + esc(r.view) + '</button>' : '') +
      '</div>' +
      (has ? '<button type="button" class="recog-thumb" data-cert aria-haspopup="dialog" aria-label="' + esc(r.view) + '">' + thumb + '</button>'
           : '<div class="recog-thumb is-ph">' + thumb + '</div>') +
    '</div>';
  }

  function about() {
    var a = c.about;
    return '<section id="sobre" class="section" aria-labelledby="t-sobre"><div class="wrap reveal">' +
      sectionHead('04', a.title, '', 't-sobre') +
      '<div class="about-grid">' +
        '<div class="about-text">' + a.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
        '<div class="facts">' + a.facts.map(function (f) {
          var m = String(f.value).match(/^(\d+)(.*)$/);
          var num = m ? '<span class="count" data-to="' + m[1] + '" data-suffix="' + esc(m[2]) + '">' + esc(f.value) + '</span>' : esc(f.value);
          return '<div class="card fact"><b>' + num + '</b><span>' + esc(f.label) + '</span></div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="card certs"><div class="cert-group"><h3>' + esc(a.credentialsTitle) + '</h3><ul class="cert-list">' +
        a.credentials.map(function (x) { return '<li><b>' + esc(x.name) + '</b><span>' + esc(x.issuer) + '</span></li>'; }).join('') +
      '</ul></div></div>' +
      certificate(a.certificate) +
    '</div>' +
    '<dialog class="card modal letter" id="cert-modal" aria-labelledby="cert-title"></dialog>' +
    '</section>';
  }

  function cases() {
    var C = c.cases;
    return '<section id="pratica" class="section" aria-labelledby="t-pratica"><div class="wrap">' +
      '<div class="reveal">' + sectionHead('05', C.title, C.lead, 't-pratica') + '</div>' +
      '<div class="projects">' + C.items.map(function (p, i) {
        return '<article class="card project featured' + (i % 2 ? ' flip' : '') + '">' +
          '<div class="project-media"><p class="figure big"><span class="fig-text">' + esc(p.media.big) + '</span><small>' + esc(p.media.label) + '</small></p><div class="ruler" aria-hidden="true"></div></div>' +
          '<div class="project-body">' +
            '<span class="project-cat">' + esc(p.category) + '</span><h3>' + esc(p.title) + '</h3>' +
            '<div class="question"><small>' + esc(C.context) + '</small>' + esc(p.context) + '</div>' +
            '<p class="desc"><b>' + esc(C.result) + ':</b> ' + esc(p.result) + '</p>' +
            '<div class="ai-box"><small>' + I.bulb + esc(C.lesson) + '</small><p>' + esc(p.lesson) + '</p></div>' +
            '<ul class="chips">' + p.tags.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>' +
          '</div></article>';
      }).join('') + '</div>' +
    '</div></section>';
  }

  function reviewCard(x, extra, rec) {
    return '<figure class="card review' + (extra ? ' extra' : '') + (rec ? ' rec' : '') + '">' +
      '<div class="review-head"><span class="avatar" aria-hidden="true">' + esc(x.name.charAt(0)) + '</span>' +
        '<figcaption><b>' + esc(x.name) + '</b><small>' + esc(x.topic) + '</small></figcaption>' +
        (rec ? '' : '<span class="review-stars" aria-label="5 estrelas">' + stars(5) + '</span>') + '</div>' +
      '<blockquote>' + esc(x.text) + '</blockquote></figure>';
  }

  function reviews() {
    var R = c.reviews, VIS = 6, hidden = R.items.length - VIS;
    return '<section id="avaliacoes" class="section" aria-labelledby="t-aval"><div class="wrap reveal">' +
      sectionHead('06', R.title, R.lead, 't-aval') +
      '<div class="reviews-top card">' +
        '<div class="score"><span class="score-stars">' + stars(5) + '</span><b>' + esc(R.score) + '</b><span>' + esc(R.scoreText) + '</span></div>' +
        '<div class="badge"><div class="badge-mark" aria-hidden="true">' + I.spark + '</div>' +
          '<div><b>' + esc(R.badgeTitle) + '</b><p>' + esc(R.badgeText) + '</p></div></div>' +
      '</div>' +
      '<div class="review-grid collapsible always">' + R.items.map(function (x, i) { return reviewCard(x, i >= VIS); }).join('') + '</div>' +
      (hidden > 0 ? '<button type="button" class="btn more-btn always" aria-expanded="false" data-more="' + hidden + '"><span>' + esc(R.more) + ' (' + hidden + ')</span>' + I.chevron + '</button>' : '') +
      '<div class="recs"><h3 class="h3">' + esc(c.recommendations.title) + '</h3><p class="recs-lead">' + esc(c.recommendations.lead) + '</p>' +
        '<div class="review-grid">' + c.recommendations.items.map(function (x) { return reviewCard(x, false, true); }).join('') + '</div></div>' +
    '</div></section>';
  }

  function price() {
    var P = c.price;
    return '<section id="valores" class="section" aria-labelledby="t-valor"><div class="wrap reveal">' +
      sectionHead('07', P.title, P.lead, 't-valor') +
      '<div class="price card">' +
        '<div class="price-main"><span class="price-free">' + I.gift + esc(P.free) + '</span>' +
          '<p class="price-value"><b>' + esc(P.value) + '</b><span>' + esc(P.unit) + '</span></p>' +
          '<p class="price-note">' + esc(P.note) + '</p>' + book('primary', P.button) + '</div>' +
        '<ul class="price-list">' + P.include.map(function (x) { return '<li>' + I.check + esc(x) + '</li>'; }).join('') + '</ul>' +
      '</div>' +
    '</div></section>';
  }

  function contact() {
    var k = c.contact;
    return '<section id="contato" class="section" aria-labelledby="t-cont"><div class="wrap reveal">' +
      '<div class="card contact">' +
        '<div class="contact-photo">' + photo(PHOTOS.contact, k.photoAlt, 'contact-img') +
          '<span class="contact-open"><span class="dot live" aria-hidden="true"></span>' + esc(k.tag) + '</span></div>' +
        '<p class="eyebrow">08</p><h2 class="h2" id="t-cont">' + esc(k.title) + '</h2>' +
        '<p class="contact-text">' + esc(k.text) + '</p>' +
        '<div class="contact-actions"><div class="contact-main">' +
          book('primary', k.whats) +
          '<a class="btn ghost" href="' + LINKS.linkedin + '"' + ext('LinkedIn') + '>' + I.profile + 'LinkedIn</a>' +
          '<a class="btn ghost" href="mailto:' + LINKS.email + '">' + I.mail + esc(k.email) + '</a>' +
        '</div></div>' +
        '<p class="contact-lines"><span>WhatsApp ' + esc(LINKS.whatsappText) + '</span><span>' + esc(LINKS.email) + '</span><span>' + esc(LINKS.linkedinText) + '</span></p>' +
        '<p class="contact-loc">' + I.pin + esc(k.location) + '</p>' +
      '</div>' +
    '</div></section>';
  }

  function footer() {
    return '<footer class="footer"><div class="wrap"><span>© ' + new Date().getFullYear() + ' ' + esc(c.footer) + '</span>' +
      '<a href="#inicio">' + esc(c.ui.top) + '</a></div></footer>';
  }

  /* ---------- montagem ---------- */
  var app = document.getElementById('app');
  document.title = c.meta.title;
  app.innerHTML = header() + '<main id="conteudo">' + hero() + lessons() + path() + audience() + about() + cases() + reviews() + price() + contact() + '</main>' + footer();

  function applyTheme() {
    var root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme);
  }
  applyTheme();

  app.querySelectorAll('[data-theme-pref]').forEach(function (b) {
    b.addEventListener('click', function () {
      theme = b.dataset.themePref; applyTheme();
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignora */ }
      app.querySelectorAll('[data-theme-pref]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.themePref === theme)); });
    });
  });

  // "Ver mais avaliações"
  app.querySelectorAll('[data-more]').forEach(function (btn) {
    var box = btn.previousElementSibling, label = btn.querySelector('span'), n = btn.dataset.more;
    btn.addEventListener('click', function () {
      var open = !box.classList.contains('open');
      box.classList.toggle('open', open); btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? c.reviews.less : c.reviews.more + ' (' + n + ')';
      if (!open) btn.closest('section').scrollIntoView({ block: 'start' });
    });
  });

  // certificado em tela cheia (quando a imagem existir)
  var modal = document.getElementById('cert-modal');
  app.querySelectorAll('[data-cert]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = c.about.certificate;
      modal.innerHTML = '<button type="button" class="modal-close" aria-label="' + esc(c.ui.close) + '">' + I.close + '</button>' +
        '<h3 id="cert-title">' + esc(r.title) + '</h3><p class="modal-date">' + esc(r.date) + '</p>' +
        '<picture><source type="image/webp" srcset="assets/img/' + PHOTOS.certificate + '.webp"><img class="letter-img" src="assets/img/' + PHOTOS.certificate + '.jpg" width="1600" height="1151" alt="' + esc(r.alt) + '"></picture>';
      modal.querySelector('.modal-close').addEventListener('click', function () { modal.close(); });
      if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
      document.body.classList.add('modal-open');
      modal._opener = b;
    });
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', function () { document.body.classList.remove('modal-open'); if (modal._opener) modal._opener.focus(); });

  // cabeçalho com borda depois de rolar
  var head = app.querySelector('.header');
  var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if ('IntersectionObserver' in window) {
    // entrada suave só para o que ainda está abaixo da tela
    if (!reduce) {
      var rv = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
      }, { threshold: 0.08 });
      app.querySelectorAll('.reveal').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add('pre'); rv.observe(el);
      });
    }
    // números em contagem
    var cu = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.querySelectorAll('.count').forEach(countUp); obs.unobserve(en.target); } });
    }, { threshold: 0.4 });
    app.querySelectorAll('.fact').forEach(function (el) { cu.observe(el); });
    // destaca no menu a seção visível
    var nav = app.querySelector('.nav'), links = nav.querySelectorAll('a');
    var an = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          if (on && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(function (l) { var s = document.getElementById(l[0].slice(1)); if (s) an.observe(s); });
  }

  function countUp(el) {
    if (reduce || el._done) return;
    el._done = true;
    var to = parseFloat(el.dataset.to), suf = el.dataset.suffix || '';
    var final = el.textContent, dur = 1100, t0 = null;
    el.setAttribute('aria-label', final);
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? Math.round(to * e) + suf : final;
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();

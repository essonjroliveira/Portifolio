/*
 * Monta a página a partir de content.js e cuida das interações:
 * idioma (PT/EN), tema (sistema/claro/escuro), menu fixo, "ver mais",
 * detalhes dos projetos, números em contagem e entrada suave das seções.
 */
(function () {
  'use strict';

  var LINKS = window.LINKS;
  var CONTENT = window.CONTENT;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG_KEY = 'portfolio-lang';
  var THEME_KEY = 'portfolio-theme';

  var state = {
    lang: read(LANG_KEY, ['pt', 'en'], 'pt'),
    theme: read(THEME_KEY, ['system', 'light', 'dark'], 'system'),
    allProjects: false,
  };

  function read(key, allowed, fallback) {
    try {
      var v = localStorage.getItem(key);
      if (allowed.indexOf(v) !== -1) return v;
    } catch (e) { /* sem armazenamento */ }
    return fallback;
  }
  function save(key, v) { try { localStorage.setItem(key, v); } catch (e) { /* ignora */ } }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ---------- ícones (traço simples, cor do texto) ---------- */
  var I = {
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5 5.6 16A7.5 7.5 0 1 1 8.2 18.5Z"/><path d="M9.3 9.2c.2 1.9 1.6 3.6 3.6 4.4l.9-.9 1.6.7-.2 1.2c-2.8.1-5.8-2.7-6-5.5l1.2-.3.7 1.6Z"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="9" cy="9.5" r="2"/><path d="M5.8 17.2c.5-2.2 1.8-3.3 3.2-3.3s2.7 1.1 3.2 3.3M14.5 9h3.5M14.5 12.5h3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  };

  function ext(c, label) { return ' target="_blank" rel="noopener" aria-label="' + esc(label + ' ' + c.ui.newTab) + '"'; }

  /* ---------- partes da página ---------- */
  function navLinks(c) {
    return [
      ['#sobre', c.nav.about], ['#competencias', c.nav.skills], ['#projetos', c.nav.projects], ['#ia', c.nav.ai],
      ['#experiencia', c.nav.experience], ['#formacao', c.nav.education], ['#certificacoes', c.nav.certs], ['#contato', c.nav.contact],
    ].map(function (l) { return '<a href="' + l[0] + '">' + esc(l[1]) + '</a>'; }).join('');
  }

  function controls(c) {
    var langs = [['pt', 'PT'], ['en', 'EN']].map(function (l) {
      return '<button type="button" data-lang="' + l[0] + '" aria-pressed="' + (state.lang === l[0]) + '">' + l[1] + '</button>';
    }).join('');
    var themes = [['system', c.nav.system], ['light', c.nav.light], ['dark', c.nav.dark]].map(function (t) {
      return '<button type="button" data-theme-pref="' + t[0] + '" aria-pressed="' + (state.theme === t[0]) + '">' + esc(t[1]) + '</button>';
    }).join('');
    return '<div class="controls">' +
      '<div class="seg" role="group" aria-label="' + esc(c.nav.language) + '">' + langs + '</div>' +
      '<div class="seg" role="group" aria-label="' + esc(c.nav.theme) + '">' + themes + '</div>' +
      '</div>';
  }

  function header(c) {
    return '<a class="skip" href="#conteudo">' + esc(c.ui.skip) + '</a>' +
      '<header class="header" id="topo"><div class="wrap"><div class="header-in">' +
        '<a href="#inicio" class="brand"><span class="brand-mark" aria-hidden="true">EJ</span><span class="brand-name">Edson Junior de Oliveira</span></a>' +
        '<nav class="nav" aria-label="Principal">' + navLinks(c) + '</nav>' +
        controls(c) +
      '</div></div></header>';
  }

  function titleWithAccent(t) {
    var m = t.match(/^(.*\s)(\S+)([.!?])$/);
    if (!m) return esc(t);
    return esc(m[1]) + '<em>' + esc(m[2]) + '</em>' + esc(m[3]);
  }

  function kicker(t) {
    var parts = t.split(' | ');
    return '<p class="eyebrow kicker">' + parts.map(function (p) { return '<span class="kg">' + esc(p) + '</span>'; }).join('<span class="ksep" aria-hidden="true">|</span>') + '</p>';
  }

  function hero(c) {
    var h = c.hero;
    return '<section id="inicio" class="hero"><div class="wrap">' +
      '<div class="hero-grid">' +
        '<div class="hero-text">' + kicker(h.kicker) +
          '<h1>' + titleWithAccent(h.title) + '</h1>' +
          '<p class="hero-intro">' + esc(h.intro) + '</p>' +
          '<div class="hero-actions">' +
            '<a class="btn primary" href="' + cvLink() + '" download>' + I.download + esc(h.ctaCv) + '</a>' +
            '<a class="btn" href="' + LINKS.whatsapp + '"' + ext(c, h.ctaWhats + ' ' + LINKS.whatsappText) + '>' + I.chat + esc(h.ctaWhats) + '</a>' +
            '<a class="btn" href="' + LINKS.linkedin + '"' + ext(c, 'LinkedIn') + '>' + I.profile + esc(h.ctaLinkedin) + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="photo">' +
          '<picture>' +
            '<source type="image/webp" srcset="assets/img/edson-oliveira-600.webp 600w, assets/img/edson-oliveira-900.webp 900w" sizes="(max-width: 860px) 260px, 380px">' +
            '<img src="assets/img/edson-oliveira-900.jpg" srcset="assets/img/edson-oliveira-600.jpg 600w, assets/img/edson-oliveira-900.jpg 900w" sizes="(max-width: 860px) 260px, 380px" width="900" height="1201" alt="' + esc(h.photoAlt) + '">' +
          '</picture>' +
          '<div class="photo-tag"><span class="dot" aria-hidden="true"></span>' + esc(h.status) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="highlights">' + h.highlights.map(function (x) {
        return '<div class="card highlight"><i aria-hidden="true"></i><b>' + esc(x.title) + '</b><span>' + esc(x.text) + '</span></div>';
      }).join('') + '</div>' +
    '</div></section>';
  }

  function sectionHead(num, title, lead, id) {
    return '<p class="eyebrow">' + num + '</p><h2 class="h2" id="' + id + '">' + esc(title) + '</h2>' + (lead ? '<p class="lead">' + esc(lead) + '</p>' : '');
  }

  function about(c) {
    var a = c.about;
    return '<section id="sobre" class="section" aria-labelledby="t-sobre"><div class="wrap reveal">' +
      sectionHead('01', a.title, '', 't-sobre') +
      '<div class="about-grid">' +
        '<div class="about-text">' + a.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
        '<div class="facts">' + a.facts.map(function (f) {
          // o número do início ("11+ anos") faz a mesma contagem dos números dos projetos
          var m = String(f.value).match(/^(\d+)(.*)$/);
          var num = m ? '<span class="count" data-to="' + m[1] + '" data-from="0" data-suffix="' + esc(m[2]) + '">' + esc(f.value) + '</span>' : esc(f.value);
          return '<div class="card fact"><b>' + num + '</b><span>' + esc(f.label) + '</span></div>';
        }).join('') + '</div>' +
      '</div></div></section>';
  }

  function value(c) {
    var v = c.value;
    return '<section id="valor" class="section" aria-labelledby="t-valor"><div class="wrap reveal">' +
      sectionHead('02', v.title, v.lead, 't-valor') +
      '<div class="value-grid">' + v.items.map(function (x) {
        return '<div class="card value"><i aria-hidden="true"></i><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></div>';
      }).join('') + '</div></div></section>';
  }

  function moreBtn(c, hidden, cls) {
    return '<button type="button" class="btn more-btn ' + (cls || '') + '" aria-expanded="false" data-more="' + hidden + '">' +
      '<span>' + esc(c.ui.more) + ' (' + hidden + ')</span>' + I.chevron + '</button>';
  }

  function skills(c) {
    var s = c.skills, VIS = 2, hidden = Math.max(0, s.groups.length - VIS);
    return '<section id="competencias" class="section" aria-labelledby="t-comp"><div class="wrap reveal">' +
      sectionHead('03', s.title, s.lead, 't-comp') +
      '<div class="card skills collapsible">' + s.groups.map(function (g, i) {
        return '<div class="skill-row' + (i >= VIS ? ' extra' : '') + '">' +
          '<h3>' + esc(g.title) + '</h3>' +
          '<div><ul class="chips">' + g.items.map(function (it) { return '<li class="chip">' + esc(it) + '</li>'; }).join('') + '</ul>' +
          '<p class="skill-note"><b>' + esc(g.note.label) + ':</b> ' + esc(g.note.text) + '</p></div>' +
        '</div>';
      }).join('') + '</div>' +
      (hidden ? moreBtn(c, hidden, 'mobile-only') : '') +
    '</div></section>';
  }

  function figure(f, big) {
    var final = (f.prefix || '') + f.to + (f.suffix || '');
    var start = f.from !== undefined ? f.from : 0;
    return '<p class="figure' + (big ? ' big' : '') + '">' +
      (f.before ? '<span class="fig-before">' + esc(f.before) + '</span> ' : '') +
      '<span class="count" data-to="' + f.to + '" data-from="' + start + '" data-prefix="' + esc(f.prefix || '') + '" data-suffix="' + esc(f.suffix || '') + '">' + esc(final) + '</span>' +
      '<small>' + esc(f.label) + '</small></p>';
  }

  function projectCard(c, p, featured) {
    var P = c.projects;
    return '<article class="card project' + (featured ? ' featured' : '') + '">' +
      '<div class="project-media">' + figure(p.figure, featured) + '<div class="ruler" aria-hidden="true"></div></div>' +
      '<div class="project-body">' +
        '<span class="project-cat">' + esc(p.category) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<div class="question"><small>' + esc(P.context) + '</small>' + esc(p.context) + '</div>' +
        '<p class="desc"><b>' + esc(P.result) + ':</b> ' + esc(p.result) + '</p>' +
        (p.ai ? aiBox(P.ai, p.ai) : '') +
        '<ul class="chips">' + p.tags.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="project-foot"><button type="button" class="btn small" data-details="' + p.id + '" aria-haspopup="dialog">' + esc(P.details) + '</button></div>' +
      '</div></article>';
  }

  // quadro "Com IA, hoje eu faria": proposta de aplicação, não um resultado obtido
  var SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 11l5.6-2Z"/><path d="M18.5 3v3M17 4.5h3"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  function aiBox(label, text) {
    return '<div class="ai-box"><small>' + SPARK + esc(label) + '</small><p>' + esc(text) + '</p></div>';
  }

  function aiPath(c) {
    var a = c.ai;
    return '<section id="ia" class="section" aria-labelledby="t-ia"><div class="wrap reveal">' +
      sectionHead('05', a.title, a.lead, 't-ia') +
      '<ol class="ai-path">' + a.steps.map(function (x) {
        return '<li class="' + (x.done ? 'done' : 'next') + '">' +
          '<span class="ai-dot" aria-hidden="true">' + (x.done ? CHECK : SPARK) + '</span>' +
          '<div class="card ai-step"><div class="ai-step-head"><small>' + esc(x.when) + '</small>' +
            '<em class="status ' + (x.done ? 'done' : 'upcoming') + '">' + esc(x.done ? a.done : a.next) + '</em></div>' +
            '<h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></div>' +
        '</li>';
      }).join('') + '</ol>' +
    '</div></section>';
  }

  function projectsGrid(c) {
    var items = c.projects.items, VIS = 3;
    var list = state.allProjects ? items : items.slice(0, VIS);
    return list.map(function (p, i) {
      var featured = i === 0 || (i === list.length - 1 && (list.length - 1) % 2 === 1);
      return projectCard(c, p, featured);
    }).join('');
  }

  function projects(c) {
    var P = c.projects, hidden = P.items.length - 3;
    return '<section id="projetos" class="section" aria-labelledby="t-proj"><div class="wrap">' +
      '<div class="reveal">' + sectionHead('04', P.title, P.lead, 't-proj') + '</div>' +
      '<div class="projects">' + projectsGrid(c) + '</div>' +
      (hidden > 0 ? '<div class="more-projects"><button type="button" class="btn more-projects-btn" aria-expanded="' + state.allProjects + '">' +
        '<span>' + esc(state.allProjects ? P.less : P.more + ' (' + hidden + ')') + '</span>' + I.chevron + '</button></div>' : '') +
      '<p class="recognition card"><b>' + esc(P.recognition.title) + '</b><span>' + esc(P.recognition.date) + '</span></p>' +
    '</div>' +
    '<dialog class="card modal" id="project-modal" aria-labelledby="modal-title"></dialog>' +
    '</section>';
  }

  function modalContent(c, p) {
    var P = c.projects;
    return '<button type="button" class="modal-close" aria-label="' + esc(P.close) + '">' + I.close + '</button>' +
      '<span class="project-cat">' + esc(p.category) + '</span>' +
      '<h3 id="modal-title">' + esc(p.title) + '</h3>' +
      '<div class="modal-figure">' + figure(p.figure, true) + '</div>' +
      '<div class="question"><small>' + esc(P.context) + '</small>' + esc(p.context) + '</div>' +
      '<h4>' + esc(P.action) + '</h4><p>' + esc(p.action) + '</p>' +
      '<h4>' + esc(P.result) + '</h4><p>' + esc(p.result) + '</p>' +
      (p.ai ? aiBox(P.ai, p.ai) : '') +
      '<ul class="chips">' + p.tags.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  function experience(c) {
    var e = c.experience, VIS = 3, hidden = Math.max(0, e.items.length - VIS);
    return '<section id="experiencia" class="section" aria-labelledby="t-exp"><div class="wrap reveal">' +
      sectionHead('06', e.title, e.lead, 't-exp') +
      '<ol class="exp-list collapsible always">' + e.items.map(function (x, i) {
        return '<li class="card exp' + (i >= VIS ? ' extra' : '') + '">' +
          '<div class="exp-head"><h3>' + esc(x.role) + (x.sub ? '<span class="role-sub">' + esc(x.sub) + '</span>' : '') + '</h3><small>' + esc(x.period) + '</small></div>' +
          '<p class="exp-meta">' + esc(x.company) + ' · ' + esc(x.place) + '</p>' +
          '<ul>' + x.bullets.map(function (b) { return '<li>' + (typeof b === 'string' ? esc(b) : '<b>' + esc(b.b) + ':</b> ' + esc(b.t)) + '</li>'; }).join('') + '</ul>' +
        '</li>';
      }).join('') + '</ol>' +
      (hidden ? moreBtn(c, hidden, 'always') : '') +
    '</div></section>';
  }

  function education(c) {
    var e = c.education;
    return '<section id="formacao" class="section" aria-labelledby="t-form"><div class="wrap reveal">' +
      sectionHead('07', e.title, '', 't-form') +
      '<div class="card degrees">' + e.degrees.map(function (d) {
        return '<div class="degree"><b>' + esc(d.course) + '</b><span>' + esc(d.school) + '</span>' +
          (d.period ? '<small>' + esc(d.period) + '</small>' : '') +
          '<em class="status' + (d.done ? ' done' : d.upcoming ? ' upcoming' : '') + '">' + esc(d.status) + '</em></div>';
      }).join('') + '</div>' +
      '<div class="card lang"><h3>' + esc(e.languagesTitle) + '</h3><p>' + esc(e.languages) + '</p></div>' +
    '</div></section>';
  }

  // currículo no idioma da página
  function cvLink() { return state.lang === 'en' ? LINKS.curriculoEn : LINKS.curriculo; }

  function certList(items) {
    return '<ul class="cert-list">' + items.map(function (x) {
      return '<li><b>' + esc(x.name) + '</b><span>' + esc(x.issuer) + (x.date ? ' · ' + esc(x.date) : '') + '</span></li>';
    }).join('') + '</ul>';
  }

  // certificações em destaque sempre visíveis; cursos complementares recolhidos
  function certs(c) {
    var s = c.certs, k = s.courses;
    var total = k.groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    return '<section id="certificacoes" class="section" aria-labelledby="t-cert"><div class="wrap reveal">' +
      sectionHead('08', s.title, s.lead, 't-cert') +
      '<div class="card certs">' + s.groups.map(function (g) {
        return '<div class="cert-group"><h3>' + esc(g.title) + '<span>' + g.items.length + '</span></h3>' + certList(g.items) + '</div>';
      }).join('') + '</div>' +
      '<details class="card courses"><summary><span>' + esc(k.title) + '<em>' + total + '</em></span>' + I.chevron + '</summary>' +
        '<div class="courses-body">' + k.groups.map(function (g) {
          return '<div class="cert-group"><h3>' + esc(g.title) + '</h3>' + certList(g.items) + '</div>';
        }).join('') + '</div>' +
      '</details>' +
    '</div></section>';
  }

  function contact(c) {
    var k = c.contact;
    return '<section id="contato" class="section" aria-labelledby="t-cont"><div class="wrap reveal">' +
      '<div class="card contact">' +
        '<p class="eyebrow">09</p><h2 class="h2" id="t-cont">' + esc(k.title) + '</h2>' +
        '<p class="contact-text">' + esc(k.text) + '</p>' +
        '<div class="contact-actions"><div class="contact-main">' +
          '<a class="btn primary" href="' + LINKS.whatsapp + '"' + ext(c, k.whats + ' ' + LINKS.whatsappText) + '>' + I.chat + esc(k.whats) + '</a>' +
          '<a class="btn ghost" href="' + LINKS.linkedin + '"' + ext(c, 'LinkedIn') + '>' + I.profile + 'LinkedIn</a>' +
          '<a class="btn ghost" href="mailto:' + LINKS.email + '">' + I.mail + esc(k.email) + '</a>' +
          '<a class="btn ghost" href="' + cvLink() + '" download>' + I.download + esc(k.cv) + '</a>' +
        '</div></div>' +
        '<p class="contact-lines"><span>WhatsApp ' + esc(LINKS.whatsappText) + '</span><span>' + esc(LINKS.linkedinText) + '</span><span>' + esc(LINKS.email) + '</span></p>' +
        '<div class="contact-avail"><h3>' + esc(k.availabilityTitle) + '</h3><ul class="chips">' +
          k.availability.map(function (a) { return '<li class="chip">' + esc(a) + '</li>'; }).join('') +
        '</ul><p class="contact-loc">' + I.pin + esc(k.location) + '</p></div>' +
      '</div>' +
    '</div></section>';
  }

  function footer(c) {
    return '<footer class="footer"><div class="wrap"><span>© ' + new Date().getFullYear() + ' ' + esc(c.footer) + '</span>' +
      '<a href="#inicio">' + esc(c.ui.top) + '</a></div></footer>';
  }

  /* ---------- montagem ---------- */
  var app = document.getElementById('app');

  function render() {
    var c = CONTENT[state.lang];
    var y = window.scrollY;
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    document.title = c.meta.title;
    app.innerHTML = header(c) + '<main id="conteudo">' + hero(c) + about(c) + value(c) + skills(c) + projects(c) + aiPath(c) +
      experience(c) + education(c) + certs(c) + contact(c) + '</main>' + footer(c);
    bind(c);
    if (y) window.scrollTo(0, y);
  }

  function applyTheme() {
    var root = document.documentElement;
    if (state.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', state.theme);
  }

  /* ---------- interações ---------- */
  function bind(c) {
    var head = app.querySelector('.header');
    app.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (state.lang === b.dataset.lang) return;
        state.lang = b.dataset.lang; save(LANG_KEY, state.lang); render();
        var again = app.querySelector('.header-in [data-lang="' + state.lang + '"]');
        if (again && again.offsetParent) again.focus();
      });
    });
    app.querySelectorAll('[data-theme-pref]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.theme = b.dataset.themePref; save(THEME_KEY, state.theme); applyTheme();
        app.querySelectorAll('[data-theme-pref]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.themePref === state.theme)); });
      });
    });

    // "Ver mais" de competências, experiência e certificações
    app.querySelectorAll('[data-more]').forEach(function (btn) {
      var box = btn.previousElementSibling;
      if (box && !box.classList.contains('collapsible')) box = box.querySelector('.collapsible');
      var label = btn.querySelector('span');
      var n = btn.dataset.more;
      btn.addEventListener('click', function () {
        var open = !box.classList.contains('open');
        box.classList.toggle('open', open);
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        label.textContent = open ? c.ui.less : c.ui.more + ' (' + n + ')';
        if (!open) btn.closest('section').scrollIntoView({ block: 'start' });
      });
    });

    // "Ver mais projetos"
    var moreProj = app.querySelector('.more-projects-btn');
    if (moreProj) moreProj.addEventListener('click', function () {
      state.allProjects = !state.allProjects;
      var sec = document.getElementById('projetos');
      app.querySelector('.projects').innerHTML = projectsGrid(c);
      moreProj.setAttribute('aria-expanded', String(state.allProjects));
      moreProj.classList.toggle('open', state.allProjects);
      moreProj.querySelector('span').textContent = state.allProjects ? c.projects.less : c.projects.more + ' (' + (c.projects.items.length - 3) + ')';
      bindProjects(c);
      if (!state.allProjects) sec.scrollIntoView({ block: 'start' });
    });
    bindProjects(c);

    // cabeçalho com borda depois de rolar
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    window.onscroll = onScroll; onScroll();

    reveal();
    activeNav();
  }

  function bindProjects(c) {
    var modal = document.getElementById('project-modal');
    app.querySelectorAll('[data-details]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = c.projects.items.filter(function (x) { return x.id === b.dataset.details; })[0];
        modal.innerHTML = modalContent(c, p);
        modal.querySelector('.modal-close').addEventListener('click', function () { modal.close(); });
        if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
        document.body.classList.add('modal-open');
        modal.querySelectorAll('.count').forEach(countUp);
        modal._opener = b;
      });
    });
    if (!modal._bound) {
      modal._bound = true;
      modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
      modal.addEventListener('close', function () {
        document.body.classList.remove('modal-open');
        if (modal._opener) modal._opener.focus();
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.querySelectorAll('.count').forEach(countUp);
          obs.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      app.querySelectorAll('.project, .fact').forEach(function (el) { io.observe(el); });
    }
  }

  // entrada suave só para o que ainda está abaixo da tela
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in'); obs.unobserve(en.target);
      });
    }, { threshold: 0.08 });
    app.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('pre'); io.observe(el);
    });
  }

  // destaca no menu a seção visível
  function activeNav() {
    if (!('IntersectionObserver' in window)) return;
    var nav = app.querySelector('.nav');
    var links = nav.querySelectorAll('a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          // no celular o menu desliza para mostrar a seção atual
          if (on && nav.scrollWidth > nav.clientWidth) {
            nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['sobre', 'competencias', 'projetos', 'ia', 'experiencia', 'formacao', 'certificacoes', 'contato'].forEach(function (id) {
      var s = document.getElementById(id); if (s) io.observe(s);
    });
  }

  function countUp(el) {
    if (reduce || el._done) return;
    el._done = true;
    var to = parseFloat(el.dataset.to), from = parseFloat(el.dataset.from) || 0;
    var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var final = el.textContent, dur = 1100, t0 = null;
    el.setAttribute('aria-label', final);
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? pre + Math.round(from + (to - from) * e) + suf : final;
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  applyTheme();
  render();
})();

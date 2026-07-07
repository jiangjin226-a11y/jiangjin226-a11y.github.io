/* ============================================================
   蒋红梅 · 个人主页 — Noth.in 风格动态特效
   ============================================================ */
'use strict';

(function() {
  if (window.innerWidth <= 768) return;

  // ─── 1. CUSTOM CURSOR ───
  (function() {
    var C = document.createElement('div');
    C.id = 'customCursor';
    document.body.appendChild(C);
    var T = document.createElement('div');
    T.id = 'cursorTrail';
    document.body.appendChild(T);
    document.documentElement.classList.add('custom-cursor-active');

    var mx = 0, my = 0, cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });

    (function anim() {
      cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
      C.style.left = cx + 'px'; C.style.top = cy + 'px';
      tx += (mx - tx) * 0.06; ty += (my - ty) * 0.06;
      T.style.left = tx + 'px'; T.style.top = ty + 'px';
      requestAnimationFrame(anim);
    })();

    var sel = 'a,button,.nav-link,.btn,.skill-card,.work-card,.eval-card,.tag,.tool-tag,.course-badge,.stat-item,.contact-item,.scroll-top,.theme-toggle,.philosophy-card';
    document.addEventListener('mouseover', function(e) {
      var r = e.target.closest(sel); if (r) C.classList.add('hover');
    });
    document.addEventListener('mouseout', function(e) {
      var r = e.target.closest(sel); if (r) C.classList.remove('hover');
    });
    document.addEventListener('mouseleave', function() { C.style.opacity = '0'; T.style.opacity = '0'; });
    document.addEventListener('mouseenter', function() { C.style.opacity = '1'; T.style.opacity = '0.4'; });
  })();

  // ─── 2. PAGE LOADER ───
  (function() {
    if (sessionStorage.getItem('_nl')) return;
    sessionStorage.setItem('_nl', '1');
    var L = document.createElement('div');
    L.id = 'pageLoader';
    L.innerHTML = '<div class="loader-inner"><div class="loader-name">蒋红梅</div><div class="loader-sub">Art &amp; Technology</div><div class="loader-bar" id="loaderBar"></div></div>';
    document.body.insertBefore(L, document.body.firstChild);
    requestAnimationFrame(function() { var b = document.getElementById('loaderBar'); if (b) b.style.width = '80px'; });
    setTimeout(function() {
      L.classList.add('loaded');
      setTimeout(function() { if (L.parentNode) L.parentNode.removeChild(L); }, 900);
    }, 1600);
  })();

  // ─── 3. NOISE OVERLAY ───
  (function() {
    var G = document.createElement('canvas');
    G.id = 'grainOverlay';
    document.body.appendChild(G);
    var X = G.getContext('2d'), W, H;
    function R() {
      W = G.width = window.innerWidth;
      H = G.height = window.innerHeight;
      var d = X.createImageData(W, H);
      for (var i = 0; i < d.data.length; i += 4) {
        var v = Math.random() * 255;
        d.data[i] = v; d.data[i+1] = v; d.data[i+2] = v; d.data[i+3] = 255;
      }
      X.putImageData(d, 0, 0);
    }
    R();
    window.addEventListener('resize', R);
  })();

  // ─── 4. PARALLAX DECORATIVE ───
  (function() {
    var imgs = [
      { u: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80&auto=format&fit=crop', c: '_1', s: 0.08 },
      { u: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80&auto=format&fit=crop', c: '_2', s: -0.05 },
      { u: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80&auto=format&fit=crop', c: '_3', s: 0.12 }
    ];
    var els = [];
    imgs.forEach(function(o) {
      var el = document.createElement('div');
      el.className = 'parallax-decor ' + o.c;
      var img = document.createElement('img');
      img.src = o.u; img.alt = ''; img.loading = 'lazy';
      el.appendChild(img);
      document.body.appendChild(el);
      els.push({ el: el, sp: o.s });
    });
    function U() {
      var sy = window.scrollY;
      els.forEach(function(e) { e.el.style.transform = 'translateY(' + (sy * e.sp) + 'px)'; });
      requestAnimationFrame(U);
    }
    U();
  })();

  // ─── 5. TEXT LINE REVEAL ───
  (function() {
    var sel = '.section-title,.hero-name,.hero-role,.about-text p,.philosophy-card h3,.eval-card p,.edu-header h3,.tl-content h3,.work-card h3,.skill-name,.footer p';
    document.querySelectorAll(sel).forEach(function(el) {
      if (el.classList.contains('reveal-line')) return;
      el.classList.add('reveal-line');
      var inner = document.createElement('span');
      inner.className = 'reveal-inner';
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    });
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-line').forEach(function(e) { e.classList.add('visible'); });
      return;
    }
    var o = new IntersectionObserver(function(entries) {
      entries.forEach(function(n) {
        if (n.isIntersecting) { n.target.classList.add('visible'); o.unobserve(n.target); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-line').forEach(function(e) { o.observe(e); });
  })();

  // ─── 6. CARD STAGGER ENTRANCE ───
  (function() {
    var grps = [
      { c: '.skills-grid', s: '.skill-card' },
      { c: '.works-grid', s: '.work-card' },
      { c: '.eval-grid', s: '.eval-card' },
      { c: '.about-stats', s: '.stat-item' },
      { c: '.timeline', s: '.tl-item' }
    ];
    grps.forEach(function(g) {
      var con = document.querySelector(g.c);
      if (!con) return;
      var items = con.querySelectorAll(g.s);
      if (!items.length) return;
      items.forEach(function(it) {
        it.style.opacity = ''; it.style.transform = '';
        it.classList.remove('visible'); it.classList.add('card-enter');
      });
      if (!('IntersectionObserver' in window)) {
        items.forEach(function(e) { e.classList.add('visible'); });
        return;
      }
      var done = false;
      var o = new IntersectionObserver(function(entries) {
        entries.forEach(function(n) {
          if (n.isIntersecting && !done) {
            done = true;
            items.forEach(function(it, i) {
              setTimeout(function() { it.classList.add('visible'); }, 80 + i * 80);
            });
            o.unobserve(n.target);
          }
        });
      }, { threshold: 0.1 });
      o.observe(con);
    });
  })();

  // ─── 7. LINK UNDERLINE ───
  (function() {
    document.querySelectorAll('.nav-link, .contact-item a, .footer a').forEach(function(l) {
      l.classList.add('link-underline');
    });
  })();

  console.log('✦ Noth.in 风格动态特效已加载');
})();

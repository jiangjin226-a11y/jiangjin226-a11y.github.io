/* ============================================================
   蒋红梅 · Noth.in 入场特效系统
   完整克隆 noth.in 的加载器、行揭示、延迟入场效果
   ============================================================ */
'use strict';

(function() {
  var isMobile = window.innerWidth <= 768;

  // ═══════════════════════════════════════════════
  // 1. LOADER — 完全克隆 noth.in 风格
  // ═══════════════════════════════════════════════
  (function() {
    var played = sessionStorage.getItem('nothinLoader');
    if (played) {
      // 直接显示页面内容 — 跳过加载器
      document.documentElement.classList.remove('nothin-cursor-active');
      return;
    }

    // 创建加载器
    var loader = document.createElement('div');
    loader.id = 'nothinLoader';

    // 加载器内部结构
    var inner = document.createElement('div');
    inner.className = 'loader-nothin';

    // 浮动装饰图（类似 noth.in 的循环图片）
    var decorImgs = [
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&q=80&auto=format&fit=crop'
    ];

    decorImgs.forEach(function(url, i) {
      var el = document.createElement('div');
      el.className = 'loader-float _' + (i + 1);
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      el.appendChild(img);
      inner.appendChild(el);
    });

    // 名称揭示
    var nameEl = document.createElement('div');
    nameEl.className = 'loader-name-reveal';
    nameEl.textContent = '蒋红梅';
    inner.appendChild(nameEl);

    var subEl = document.createElement('div');
    subEl.className = 'loader-sub-reveal';
    subEl.textContent = 'Art & Technology';
    inner.appendChild(subEl);

    // 进度条
    var track = document.createElement('div');
    track.className = 'loader-progress-track';
    var fill = document.createElement('div');
    fill.className = 'loader-progress-fill';
    track.appendChild(fill);
    inner.appendChild(track);

    // 计数器
    var counter = document.createElement('div');
    counter.className = 'loader-counter';
    counter.textContent = '000';

    var innerWrapper = document.createElement('div');
    innerWrapper.className = 'loader-nothin-inner';
    innerWrapper.appendChild(inner);
    innerWrapper.appendChild(counter);

    loader.appendChild(innerWrapper);

    // 插入加载器（注意 jellyfish canvas 的 z-index）
    document.body.insertBefore(loader, document.body.firstChild);

    // 进度动画
    var progress = 0;
    var progressTimer = setInterval(function() {
      progress += Math.random() * 4 + 2;
      if (progress >= 100) progress = 100;
      fill.style.width = progress + '%';
      var display = String(Math.floor(progress)).padStart(3, '0');
      counter.textContent = display;
      if (progress >= 100) {
        clearInterval(progressTimer);
        // 加载完成，过渡到页面
        setTimeout(function() {
          loader.classList.add('loaded');
          sessionStorage.setItem('nothinLoader', '1');
          // 启用入场动画
          setTimeout(function() {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
            // 触发页面入场
            initEntrance();
          }, 1500);
        }, 800);
      }
    }, 130 + Math.random() * 50);
  })();

  // 如果已播放过，直接入场
  function initEntrance() {
    document.documentElement.classList.remove('nothin-cursor-active');
    // 触发英雄区入场
    var heroes = document.querySelectorAll('[data-enter]');
    heroes.forEach(function(el, i) {
      var delay = parseFloat(el.getAttribute('data-enter-delay')) || i * 0.15;
      setTimeout(function() {
        el.classList.add('entered');
      }, delay * 1000);
    });

    // 触发行揭示（无滚动版的初始可见行）
    var lines = document.querySelectorAll('[data-line]:not([data-line-scroll])');
    lines.forEach(function(el, i) {
      var delay = parseFloat(el.getAttribute('data-delay')) || 0.2 + i * 0.1;
      setTimeout(function() {
        el.classList.add('entered');
      }, delay * 1000);
    });
  }

  // 如果跳过加载器，立即入场
  if (sessionStorage.getItem('nothinLoader')) {
    // 延迟一帧确保 DOM 就绪
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        initEntrance();
      });
    });
  }

  // ═══════════════════════════════════════════════
  // 2. 自定义光标
  // ═══════════════════════════════════════════════
  if (!isMobile) {
    (function() {
      var C = document.createElement('div');
      C.id = 'nothinCursor';
      document.body.appendChild(C);
      document.documentElement.classList.add('nothin-cursor-active');

      var mx = 0, my = 0, cx = 0, cy = 0;
      document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });

      (function anim() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        C.style.left = cx + 'px';
        C.style.top = cy + 'px';
        requestAnimationFrame(anim);
      })();

      var sel = 'a,button,.nav-link,.btn,.skill-card,.work-card,.eval-card,.tag,.tool-tag,.course-badge,.stat-item,.contact-item,.scroll-top,.theme-toggle,.philosophy-card,.work-item';

      document.addEventListener('mouseover', function(e) {
        var t = e.target.closest(sel);
        if (t) { C.classList.add('hover'); C.classList.remove('hover-dot'); }
      });
      document.addEventListener('mouseout', function(e) {
        var t = e.target.closest(sel);
        if (t) { C.classList.remove('hover'); C.classList.remove('hover-dot'); }
      });

      document.addEventListener('mouseleave', function() { C.style.opacity = '0'; });
      document.addEventListener('mouseenter', function() { C.style.opacity = '1'; });
    })();

    // ─── 噪声纹理覆盖 ───
    (function() {
      var grain = document.createElement('canvas');
      grain.id = 'nothinNoise';
      document.body.appendChild(grain);
      var ctx = grain.getContext('2d');
      var W, H;
      function resize() {
        W = grain.width = window.innerWidth;
        H = grain.height = window.innerHeight;
        var d = ctx.createImageData(W, H);
        for (var i = 0; i < d.data.length; i += 4) {
          var v = Math.random() * 255;
          d.data[i] = v; d.data[i+1] = v; d.data[i+2] = v; d.data[i+3] = 255;
        }
        ctx.putImageData(d, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);
    })();

    // ─── 视差装饰 ───
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
  }

  // ═══════════════════════════════════════════════
  // 3. 滚动触发入场
  // ═══════════════════════════════════════════════
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-enter], [data-line], [data-zoom]').forEach(function(el) {
      el.classList.add('entered');
    });
  } else {
    // data-enter 滚动入场
    var enterObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.getAttribute('data-enter-delay')) || 0;
          setTimeout(function() {
            el.classList.add('entered');
          }, delay * 1000);
          enterObs.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-enter]').forEach(function(el) {
      enterObs.observe(el);
    });

    // data-line 行揭示（滚动版）
    var lineObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.getAttribute('data-delay')) || 0;
          setTimeout(function() {
            el.classList.add('entered');
          }, delay * 1000);
          lineObs.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-line][data-line-scroll]').forEach(function(el) {
      lineObs.observe(el);
    });

    // data-zoom 缩放入场
    var zoomObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('entered');
          zoomObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-zoom]').forEach(function(el) {
      zoomObs.observe(el);
    });
  }

  // ═══════════════════════════════════════════════
  // 4. 卡片交错入场
  // ═══════════════════════════════════════════════
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
        it.classList.add('card-nothin');
      });
      if (!('IntersectionObserver' in window)) {
        items.forEach(function(e) { e.classList.add('entered'); });
        return;
      }
      var done = false;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(n) {
          if (n.isIntersecting && !done) {
            done = true;
            items.forEach(function(it, i) {
              setTimeout(function() { it.classList.add('entered'); }, 100 + i * 80);
            });
            obs.unobserve(n.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(con);
    });
  })();

  // ═══════════════════════════════════════════════
  // 5. 行揭示包装器 — 将文本内容包裹在 line-inner 中
  // ═══════════════════════════════════════════════
  (function() {
    document.querySelectorAll('[data-line]').forEach(function(el) {
      if (el.querySelector('.line-inner')) return;
      var inner = document.createElement('span');
      inner.className = 'line-inner';
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    });
  })();

  // ═══════════════════════════════════════════════
  // 6. 链接下划线
  // ═══════════════════════════════════════════════
  (function() {
    document.querySelectorAll('.nav-link, .contact-item a, .footer a').forEach(function(l) {
      l.classList.add('link-nothin');
    });
  })();

  console.log('✦ Noth.in 入场特效系统已加载');
})();

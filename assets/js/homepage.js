/* ============================================================
   蒋红梅 · 个人主页 — 动态交互脚本
   功能：导航高亮、滚动进度、暗色模式、打字效果、
         3D卡片倾斜、点击展开、气泡提示等
   ============================================================ */

'use strict';

// ─── Utility: debounce ───
function debounce(fn, wait) {
  var t;
  return function() {
    var ctx = this, args = arguments;
    clearTimeout(t);
    t = setTimeout(function() { fn.apply(ctx, args); }, wait);
  };
}

// ═══════════════════════════════════════════════
// 1. NAV: active link on scroll
// ═══════════════════════════════════════════════
(function() {
  var links = document.querySelectorAll('.nav-link');
  var sections = [];
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var el = document.getElementById(href.slice(1));
      if (el) sections.push({ el: el, link: link });
    }
  });
  if (!sections.length) return;

  var navHeight = 80;
  function updateActive() {
    var scrollY = window.scrollY + navHeight;
    var current = sections[0];
    sections.forEach(function(s) {
      var top = s.el.offsetTop;
      var bottom = top + s.el.offsetHeight;
      if (scrollY >= top && scrollY < bottom) current = s;
    });
    sections.forEach(function(s) { s.link.classList.remove('active'); });
    current.link.classList.add('active');
  }

  window.addEventListener('scroll', debounce(updateActive, 50));
  window.addEventListener('load', updateActive);
})();

// ═══════════════════════════════════════════════
// 2. SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════
(function() {
  var bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

// ═══════════════════════════════════════════════
// 3. DARK MODE TOGGLE
// ═══════════════════════════════════════════════
(function() {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var icon = btn.querySelector('.theme-icon');

  // Restore saved preference
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.textContent = '☀';
  }

  btn.addEventListener('click', function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icon.textContent = '☾';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icon.textContent = '☀';
    }
  });
})();

// ═══════════════════════════════════════════════
// 4. HERO TYPING SUBTITLE
// ═══════════════════════════════════════════════
(function() {
  var el = document.getElementById('heroSub');
  if (!el) return;
  var text = '长沙师范学院 美术与设计学院';
  var index = 0;
  el.textContent = '';
  function type() {
    if (index < text.length) {
      el.textContent += text[index];
      index++;
      setTimeout(type, 50 + Math.random() * 40);
    }
  }
  // Start typing after hero animation settles
  setTimeout(type, 600);
})();

// ═══════════════════════════════════════════════
// 5. SKILL CARDS: CLICK TO EXPAND DETAIL
// ═══════════════════════════════════════════════
(function() {
  var cards = document.querySelectorAll('.skill-card');
  cards.forEach(function(card) {
    var detail = card.getAttribute('data-detail');
    var detailEl = card.querySelector('.skill-detail');
    if (detail && detailEl) detailEl.textContent = detail;

    card.addEventListener('click', function(e) {
      // Don't toggle if clicking the back hint (it closes)
      if (e.target.classList.contains('skill-back-hint')) {
        card.classList.remove('expanded');
        return;
      }
      card.classList.toggle('expanded');
    });
  });

  // Close expanded cards when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.skill-card')) {
      cards.forEach(function(c) { c.classList.remove('expanded'); });
    }
  });
})();

// ═══════════════════════════════════════════════
// 6. COURSE BADGES: HOVER TOOLTIP
// ═══════════════════════════════════════════════
(function() {
  var badges = document.querySelectorAll('.course-badge');
  badges.forEach(function(badge) {
    var desc = badge.getAttribute('data-desc');
    if (!desc) return;

    var tip = document.createElement('span');
    tip.className = 'course-badge-desc';
    tip.textContent = desc;
    badge.appendChild(tip);

    badge.addEventListener('mouseenter', function() {
      badge.classList.add('active');
    });
    badge.addEventListener('mouseleave', function() {
      badge.classList.remove('active');
    });
  });
})();

// ═══════════════════════════════════════════════
// 7. 3D TILT ON PHILOSOPHY CARDS (mouse follow)
// ═══════════════════════════════════════════════
(function() {
  var cards = document.querySelectorAll('.philosophy-card');
  if (!cards.length || window.innerWidth <= 768) return;

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform =
        'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      card.style.boxShadow =
        '0 12px 40px rgba(61,64,91,0.14), ' +
        (rotateX > 0 ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : 'inset 0 -1px 0 rgba(0,0,0,0.04)');
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      card.style.boxShadow = '';
    });
  });
})();

// ═══════════════════════════════════════════════
// 8. TIMELINE: animate line height on scroll
// ═══════════════════════════════════════════════
(function() {
  var timeline = document.querySelector('.timeline');
  if (!timeline) return;

  var line = document.createElement('div');
  line.className = 'timeline-line-progress';
  timeline.style.position = 'relative';
  timeline.prepend(line);

  function updateLine() {
    var rect = timeline.getBoundingClientRect();
    var total = timeline.scrollHeight;
    var visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    var pct = total > 0 ? (visible / (window.innerHeight * 0.6)) : 0;
    line.style.height = Math.min(pct * total * 0.85, total - 16) + 'px';
  }

  window.addEventListener('scroll', debounce(updateLine, 20));
  window.addEventListener('resize', debounce(updateLine, 50));
  updateLine();
})();

// ═══════════════════════════════════════════════
// 9. DISABLED - handled by effects.js
(function() {})();

// 10. SKILL BAR ANIMATE ON SCROLL
// ═══════════════════════════════════════════════
(function() {
  var fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    fills.forEach(function(f) { f.style.width = f.dataset.width + '%'; });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.style.width = entry.target.dataset.width + '%';
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function(f) { observer.observe(f); });
})();

// ═══════════════════════════════════════════════
// 11. COUNTER ANIMATION (stats)
// ═══════════════════════════════════════════════
(function() {
  var counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function animate(el) {
    var target = parseInt(el.dataset.target) || 0;
    if (target === 0) return;
    var current = 0;
    var step = Math.max(1, Math.ceil(target / 40));
    var timer = setInterval(function() {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 25);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function(c) { observer.observe(c); });
})();

// ═══════════════════════════════════════════════
// 12. DISABLED - handled by effects.js
(function() {})();

// 13. SCROLL TO TOP
// ═══════════════════════════════════════════════
(function() {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ═══════════════════════════════════════════════
// 14. MOBILE NAV TOGGLE
// ═══════════════════════════════════════════════
(function() {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
    // Animate hamburger
    var spans = toggle.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      links.classList.remove('open');
      var spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      var spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
})();

// ═══════════════════════════════════════════════
// 15. NAV SHADOW ON SCROLL
// ═══════════════════════════════════════════════
(function() {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(61,64,91,0.06)' : 'none';
  });
})();

// ═══════════════════════════════════════════════
// 16. HERO: parallax mouse-follow (desktop only)
// ═══════════════════════════════════════════════
(function() {
  var hero = document.querySelector('.hero');
  var content = hero.querySelector('.hero-content');
  var avatar = document.getElementById('heroAvatar');
  if (!hero || !content || window.innerWidth <= 768) return;

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    content.style.transform = 'translate(' + (x * 12) + 'px, ' + (y * 8) + 'px)';
    if (avatar) {
      avatar.style.transform = 'translate(' + (x * 6) + 'px, ' + (y * 4) + 'px)';
    }
  });

  hero.addEventListener('mouseleave', function() {
    content.style.transform = '';
    if (avatar) avatar.style.transform = '';
  });
})();

// ═══════════════════════════════════════════════
// 17. TOOL TAGS: subtle random animation delay
// ═══════════════════════════════════════════════
(function() {
  var tags = document.querySelectorAll('.tool-tag');
  tags.forEach(function(tag, i) {
    tag.style.animationDelay = (i * 0.15) + 's';
  });
})();

// ═══════════════════════════════════════════════
// 18. SMOOTH SCROLL FOR NAV (offset fix)
// ═══════════════════════════════════════════════
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

// ═══════════════════════════════════════════════
// 19. REMOVE DUPLICATE TOOL TAGS
// ═══════════════════════════════════════════════
(function() {
  var cloud = document.querySelector('.tools-cloud');
  if (!cloud) return;
  var seen = {};
  cloud.querySelectorAll('.tool-tag').forEach(function(t) {
    var text = t.textContent.trim();
    if (seen[text]) { t.remove(); }
    else { seen[text] = true; }
  });
})();

console.log('✦ 蒋红梅 · 个人主页已加载 | 动态交互就绪');

// ═══════════════════════════════════════════════
// 20. FLOWING PARTICLE NEBULA
// ═══════════════════════════════════════════════
(function() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, animId, time = 0;
  var mouseX = -1, mouseY = -1;

  var particles = [];
  var NUM = 200;

  function resize() {
    var hero = canvas.parentElement;
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function init() {
    particles = [];
    for (var i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        r: 0.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.6,
        baseAlpha: 0.2 + Math.random() * 0.6,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    time = t * 0.0006;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var mult = isDark ? 1.0 : 0.5;

    // ── Flow field: each particle follows a curl-like vector field ──
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Flow field angle based on position + time
      var angle = Math.sin(p.x * 0.004 + time * 2 + p.phase) * 3
                + Math.cos(p.y * 0.004 + time * 1.5 + p.phase * 0.5) * 2
                + Math.sin((p.x + p.y) * 0.003 + time) * 1.5;

      var spd = p.speed * 0.3 * mult;
      p.vx += Math.cos(angle) * spd * 0.04;
      p.vy += Math.sin(angle) * spd * 0.04;

      // Damping
      p.vx *= 0.97;
      p.vy *= 0.97;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -30) p.x = W + 30;
      if (p.x > W + 30) p.x = -30;
      if (p.y < -30) p.y = H + 30;
      if (p.y > H + 30) p.y = -30;

      // Mouse: gentle attract
      if (mouseX > 0 && mouseY > 0) {
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var force = (120 - dist) / 120 * 0.03;
          p.vx += (dx / (dist + 1)) * force;
          p.vy += (dy / (dist + 1)) * force;
        }
      }
    }

    // ── Draw connections (nearest neighbors) ──
    ctx.lineWidth = 0.4;
    for (var j = 0; j < particles.length; j += 2) {
      var a = particles[j];
      for (var k = j + 2; k < particles.length; k += 2) {
        var b = particles[k];
        var dx2 = a.x - b.x;
        var dy2 = a.y - b.y;
        var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < 100) {
          var ca = (1 - d2 / 100) * 0.12 * mult;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + ca + ')';
          ctx.stroke();
        }
      }
    }

    // ── Draw particles ──
    for (var pi = 0; pi < particles.length; pi++) {
      var pt = particles[pi];
      var a = pt.baseAlpha * mult * (0.7 + 0.3 * Math.sin(time * 3 + pt.phase));

      // Brighter near mouse
      if (mouseX > 0 && mouseY > 0) {
        var dmx = pt.x - mouseX;
        var dmy = pt.y - mouseY;
        var dmDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dmDist < 120) a += (1 - dmDist / 120) * 0.3;
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + Math.min(a, 1) + ')';
      ctx.fill();

      // Glow
      if (pt.r > 1.2) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (a * 0.1) + ')';
        ctx.fill();
      }
    }

    // ── Occasional bright pulse (like a nebula flash) ──
    var pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
    if (pulse > 0.98) {
      var px = Math.sin(time * 0.7) * W * 0.3 + W * 0.5;
      var py = Math.cos(time * 0.6) * H * 0.3 + H * 0.5;
      var grad = ctx.createRadialGradient(px, py, 0, px, py, 120);
      grad.addColorStop(0, 'rgba(255,255,255,' + (0.03 * mult) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  init();

  document.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', function() { mouseX = -1; mouseY = -1; });

  window.addEventListener('resize', function() { resize(); init(); });

  draw(0);

  document.addEventListener('visibilitychange', function() {
    if (document.hidden && animId) { cancelAnimationFrame(animId); animId = null; }
    else if (!document.hidden && !animId) { draw(performance.now()); }
  });
})();

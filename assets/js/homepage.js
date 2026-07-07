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
// 9. INTERSECTION OBSERVER: card stagger + fade
// ═══════════════════════════════════════════════
(function() {
  var staggerGroups = [
    { container: '.skills-grid', items: '.skill-card' },
    { container: '.timeline', items: '.tl-item' },
    { container: '.works-grid', items: '.work-card' },
    { container: '.eval-grid', items: '.eval-card' },
    { container: '.about-stats', items: '.stat-item' },
  ];

  staggerGroups.forEach(function(group) {
    var container = document.querySelector(group.container);
    if (!container) return;
    var items = container.querySelectorAll(group.items);
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function(el) { el.classList.add('visible'); });
      return;
    }

    var triggered = false;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          items.forEach(function(item, i) {
            setTimeout(function() {
              item.classList.add('visible');
            }, i * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    observer.observe(container);
  });
})();

// ═══════════════════════════════════════════════
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
// 12. SECTION TITLES: fade in on scroll
// ═══════════════════════════════════════════════
(function() {
  var titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  titles.forEach(function(t) {
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
    t.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if (!('IntersectionObserver' in window)) {
    titles.forEach(function(t) {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  titles.forEach(function(t) { observer.observe(t); });
})();

// ═══════════════════════════════════════════════
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
// 20. STARFIELD: dynamic starry sky background
// ═══════════════════════════════════════════════
(function() {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H;
  var stars = [];
  var NUM_STARS = 180;
  var mouseX = -9999, mouseY = -9999;
  var animId;

  // Shooting star
  var shooting = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0 };

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createStars(count) {
    stars = [];
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var baseAlpha = isDark ? 0.7 : 0.35;
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.3 + Math.random() * 1.8,
        baseAlpha: baseAlpha * (0.3 + Math.random() * 0.7),
        alpha: 0,
        speed: 0.003 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.08,
        color: getStarColor(),
      });
    }
  }

  function getStarColor() {
    var t = Math.random();
    // Mostly white with some warm/cool variation
    if (t < 0.6) return '255,255,255';     // pure white
    if (t < 0.8) return '255,230,210';     // warm
    if (t < 0.93) return '210,230,255';    // cool blue
    return '255,200,150';                  // golden
  }

  function spawnShootingStar() {
    if (shooting.active) return;
    var angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6; // ~ -45deg
    var speed = 4 + Math.random() * 3;
    shooting.active = true;
    shooting.x = Math.random() * W * 0.8 + W * 0.1;
    shooting.y = 0;
    shooting.vx = Math.cos(angle) * speed;
    shooting.vy = Math.sin(angle) * speed;
    shooting.maxLife = 60 + Math.random() * 40;
    shooting.life = 0;
  }

  function getThemeStarAlpha() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 0.7 : 0.35;
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, W, H);

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var targetBase = isDark ? 0.7 : 0.35;

    // Update & draw stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Twinkle
      s.alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(timestamp * s.speed + s.phase));
      // Slowly adjust baseAlpha to theme changes
      s.baseAlpha += (targetBase * (0.3 + Math.random() * 0.7 * 0) - s.baseAlpha) * 0.001;

      // Drift
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;

      // Mouse interaction: subtle repulsion
      var dx = s.x - mouseX;
      var dy = s.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        var force = (120 - dist) / 120 * 0.3;
        s.x += (dx / dist) * force;
        s.y += (dy / dist) * force;
        // Brighten near mouse
        var glow = (120 - dist) / 120 * 0.5;
        ctx.globalAlpha = Math.min(s.alpha + glow, 1);
      } else {
        ctx.globalAlpha = s.alpha;
      }

      // Draw star
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + s.color + ',' + ctx.globalAlpha + ')';

      // Glow for larger stars
      if (s.r > 1.2) {
        ctx.shadowBlur = s.r * 3;
        ctx.shadowColor = 'rgba(' + s.color + ',0.3)';
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw star connections (subtle, only nearby pairs)
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(200,180,160,0.02)';
    ctx.lineWidth = 0.5;
    for (var j = 0; j < stars.length; j += 3) {
      var a = stars[j];
      for (var k = j + 1; k < stars.length; k += 3) {
        var b = stars[k];
        var dx2 = a.x - b.x;
        var dy2 = a.y - b.y;
        var d2 = dx2 * dx2 + dy2 * dy2;
        if (d2 < 10000) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / 100) * (isDark ? 0.12 : 0.06);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Shooting star
    if (shooting.active) {
      shooting.life++;
      if (shooting.life > shooting.maxLife) {
        shooting.active = false;
      } else {
        var p = shooting.life / shooting.maxLife;
        var alpha = Math.sin(p * Math.PI) * 0.8;
        // Head
        ctx.beginPath();
        ctx.arc(shooting.x, shooting.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,240,220,' + alpha + ')';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255,200,150,0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
        // Trail
        var trailLen = 20;
        for (var t = 1; t < trailLen; t++) {
          var tp = t / trailLen;
          var tx = shooting.x - shooting.vx * tp * 1.5;
          var ty = shooting.y - shooting.vy * tp * 1.5;
          var ta = alpha * (1 - tp);
          ctx.beginPath();
          ctx.arc(tx, ty, 1.2 * (1 - tp), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,220,200,' + ta * 0.5 + ')';
          ctx.fill();
        }
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Init
  resize();
  createStars(NUM_STARS);

  // Spawn shooting star periodically
  setInterval(function() {
    if (!shooting.active) spawnShootingStar();
  }, 4000 + Math.random() * 3000);

  // Mouse tracking
  document.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Resize handler
  window.addEventListener('resize', function() {
    resize();
    createStars(NUM_STARS);
  });

  // Theme change: recreate stars with new colors
  var themeObserver = new MutationObserver(function() {
    createStars(NUM_STARS);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Start animation
  draw(0);

  // Pause when not visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!document.hidden && !animId) {
      draw(performance.now());
    }
  });
})();

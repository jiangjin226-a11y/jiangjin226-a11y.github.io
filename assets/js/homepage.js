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

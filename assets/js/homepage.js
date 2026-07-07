/* ============================================================
   蒋红梅 · 个人主页 — 原创脚本
   功能：导航交互、滚动动画、数字递增、暗色模式
   ============================================================ */

'use strict';

// ─── Mobile nav toggle ───
(function() {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  links.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      links.classList.remove('open');
    });
  });
})();

// ─── Scroll shadow on nav ───
(function() {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(61,64,91,0.06)' : 'none';
  });
})();

// ─── Scroll-to-top button ───
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

// ─── Intersection Observer: fade-up elements ───
(function() {
  var els = document.querySelectorAll('.tl-item, .skill-card, .work-card, .eval-card, .fade-up');

  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Stagger: add visible with slight delay based on index
        var parent = entry.target.parentElement;
        var siblings = parent.querySelectorAll(':scope > ' + entry.target.tagName + '.' + entry.target.className.split(' ').filter(function(c) { return c !== 'visible'; }).join('.'));
        // Actually, just show it; stagger will be handled by sibling traversal
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el) { observer.observe(el); });
})();

// ─── Timeline stagger: observe parent then stagger children ───
(function() {
  var timeline = document.querySelector('.timeline');
  if (!timeline || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.tl-item').forEach(function(el, i) {
      setTimeout(function() { el.classList.add('visible'); }, i * 150);
    });
    return;
  }

  var triggered = false;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        var items = entry.target.querySelectorAll('.tl-item');
        items.forEach(function(item, i) {
          setTimeout(function() {
            item.classList.add('visible');
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(timeline);
})();

// ─── Skill bars: animate fill width on scroll ───
(function() {
  var fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    fills.forEach(function(f) {
      f.style.width = f.dataset.width + '%';
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function(f) { observer.observe(f); });
})();

// ─── Counter animation (stats numbers) ───
(function() {
  var counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.dataset.target) || 0;
    if (target === 0) return;
    var current = 0;
    var step = Math.ceil(target / 40);
    var timer = setInterval(function() {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 30);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { observer.observe(c); });
})();

// ─── Smooth reveal for section-title (extra polish) ───
(function() {
  var titles = document.querySelectorAll('.section-title');
  if (!titles.length || !('IntersectionObserver' in window)) {
    titles.forEach(function(t) { t.style.opacity = '1'; });
    return;
  }
  titles.forEach(function(t) {
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
    t.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  titles.forEach(function(t) { observer.observe(t); });
})();

// ─── Keyboard accessibility: close nav on Escape ───
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var links = document.getElementById('navLinks');
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
    }
  }
});

// ─── Remove duplicate "Figma" in tools list ───
(function() {
  var cloud = document.querySelector('.tools-cloud');
  if (!cloud) return;
  var tags = cloud.querySelectorAll('.tool-tag');
  var seen = {};
  tags.forEach(function(t) {
    var text = t.textContent.trim();
    if (seen[text]) {
      t.remove();
    } else {
      seen[text] = true;
    }
  });
})();

console.log('蒋红梅 · 个人主页已加载 ✦');

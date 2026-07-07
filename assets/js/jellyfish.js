/* ============================================================
   蒋红梅 · 个人主页 — 背景水母动画特效
   ============================================================ */
'use strict';

(function() {
  // ─── Canvas 创建 ───
  var canvas = document.createElement('canvas');
  canvas.id = 'jellyfishCanvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var W, H, jellies = [], animId, time = 0;
  var mouse = { x: -10000, y: -10000 };

  // ─── 尺寸 ───
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ─── 水母对象 ───
  function createJelly() {
    var size = 30 + Math.random() * 60;
    return {
      x: Math.random() * W,
      y: H + 50 + Math.random() * 200,
      size: size,
      speedY: -(0.15 + Math.random() * 0.35),
      phase: Math.random() * Math.PI * 2,
      freq: 0.0015 + Math.random() * 0.0025,
      amp: 12 + Math.random() * 30,
      tentacles: 4 + Math.floor(Math.random() * 4),
      tentacleLen: 0.6 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
      alpha: 0.15 + Math.random() * 0.2,
      hue: Math.random() > 0.4 ? 0 : 210,
      drift: (Math.random() - 0.5) * 0.15,
    };
  }

  var COUNT = 10;

  function init() {
    jellies = [];
    for (var i = 0; i < COUNT; i++) {
      var j = createJelly();
      j.y = Math.random() * H;
      jellies.push(j);
    }
  }

  // ─── 绘制单只水母 ───
  function drawJelly(j) {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var mult = isDark ? 1.5 : 0.8;
    var a = Math.min(j.alpha * mult, 0.55);

    var s = j.size;
    var sway = Math.sin(time * j.freq + j.phase) * j.amp;
    var px = j.x + sway;
    var py = j.y;

    // 呼吸脉冲
    var pulse = 1 + 0.10 * Math.sin(time * j.pulseSpeed + j.pulsePhase);
    var bellW = s * pulse * 0.48;
    var bellH = s * 0.6 * pulse;

    var baseColor = j.hue === 0 ? '255,255,255' : '180,210,255';

    // ── 辉光 ──
    var grad = ctx.createRadialGradient(px, py - bellH * 0.3, 0, px, py - bellH * 0.3, s * 2.0);
    grad.addColorStop(0, 'rgba(' + baseColor + ',' + (a * 0.3) + ')');
    grad.addColorStop(1, 'rgba(' + baseColor + ',0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py - bellH * 0.3, s * 2.0, 0, Math.PI * 2);
    ctx.fill();

    // ── 触须 ──
    ctx.lineWidth = 0.8;
    var tentCount = j.tentacles;
    for (var t = 0; t < tentCount; t++) {
      var ratio = tentCount > 1 ? (t / (tentCount - 1)) * 2 - 1 : 0;
      var baseX = px + ratio * bellW * 0.75;
      var baseY = py + bellH * 0.3;
      var len = s * j.tentacleLen * (0.5 + 0.5 * Math.sin(time * 0.001 + t * 1.3 + j.phase));

      ctx.beginPath();
      ctx.moveTo(baseX, baseY);

      var segs = 10;
      for (var si = 1; si <= segs; si++) {
        var tr = si / segs;
        var wx = baseX + Math.sin(time * 0.0025 + t * 1.5 + j.phase + tr * 4) * (5 + tr * 8);
        var wy = baseY + len * tr;
        ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = 'rgba(' + baseColor + ',' + (a * 0.4) + ')';
      ctx.stroke();

      // 触须末端光点
      var lx = baseX + Math.sin(time * 0.0025 + t * 1.5 + j.phase + 4) * 13;
      var ly = baseY + len;
      ctx.beginPath();
      ctx.arc(lx, ly, 1.0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + baseColor + ',' + (a * 0.35) + ')';
      ctx.fill();
    }

    // ── 伞盖（主体） ──
    ctx.beginPath();
    ctx.moveTo(px - bellW, py + bellH * 0.1);
    ctx.quadraticCurveTo(px - bellW * 1.12, py - bellH * 0.35, px, py - bellH * 0.95);
    ctx.quadraticCurveTo(px + bellW * 1.12, py - bellH * 0.35, px + bellW, py + bellH * 0.1);
    ctx.closePath();

    var bellGrad = ctx.createLinearGradient(px, py + bellH * 0.1, px, py - bellH * 0.95);
    bellGrad.addColorStop(0, 'rgba(' + baseColor + ',' + (a * 0.08) + ')');
    bellGrad.addColorStop(0.5, 'rgba(' + baseColor + ',' + (a * 0.2) + ')');
    bellGrad.addColorStop(1, 'rgba(' + baseColor + ',' + (a * 0.08) + ')');
    ctx.fillStyle = bellGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(' + baseColor + ',' + (a * 0.12) + ')';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // ── 内部器官光晕 ──
    ctx.beginPath();
    ctx.ellipse(px, py - bellH * 0.55, bellW * 0.18, bellH * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + baseColor + ',' + (a * 0.25) + ')';
    ctx.fill();

    // ── 伞盖边缘发光 ──
    ctx.beginPath();
    ctx.moveTo(px - bellW, py + bellH * 0.1);
    ctx.quadraticCurveTo(px - bellW * 0.7, py + bellH * 0.25, px, py + bellH * 0.2);
    ctx.quadraticCurveTo(px + bellW * 0.7, py + bellH * 0.25, px + bellW, py + bellH * 0.1);
    ctx.strokeStyle = 'rgba(' + baseColor + ',' + (a * 0.08) + ')';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // ─── 主循环 ───
  function draw(ts) {
    time = (ts || 0) * 0.001;
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < jellies.length; i++) {
      var j = jellies[i];
      var sz = j.size;

      j.y += j.speedY;
      j.x += j.drift;

      if (j.y + sz * 2 < -80) {
        jellies[i] = createJelly();
        jellies[i].y = H + 80;
        continue;
      }
      if (j.x < -100) j.x = W + 100;
      if (j.x > W + 100) j.x = -100;

      // 鼠标排斥
      var dx = j.x - mouse.x;
      var dy = j.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        var force = (180 - dist) / 180 * 0.6;
        j.x += (dx / (dist + 1)) * force;
        j.y += (dy / (dist + 1)) * force;
      }

      drawJelly(j);
    }

    animId = requestAnimationFrame(draw);
  }

  // ─── 初始化 ───
  resize();
  init();

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', function() {
    mouse.x = -10000;
    mouse.y = -10000;
  });
  window.addEventListener('resize', function() { resize(); });

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      // 亮度在下个 draw 循环自动适配
    });
  }

  draw(0);

  document.addEventListener('visibilitychange', function() {
    if (document.hidden && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!document.hidden && !animId) {
      draw(performance.now());
    }
  });

  console.log('✦ 水母特效已加载');
})();

/* ============================================================
   STORM STUDIO — tempestade procedural + coreografia de scroll
   ============================================================ */

(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  document.body.classList.add("loaded");

  // índice de cada palavra do título para o stagger da entrada
  document.querySelectorAll(".hero-title .word").forEach((w, i) => w.style.setProperty("--wi", i));

  /* ---------- storm canvas ---------- */
  const canvas = document.getElementById("storm");
  const hero = document.getElementById("hero");
  let storm = null;
  if (canvas && hero) storm = makeStorm(canvas, hero, reduced);

  /* ---------- coreografia de scroll ---------- */
  const nav = document.getElementById("nav");
  const bar = document.getElementById("scrollProgress");
  const heroInner = document.getElementById("heroInner");
  const orbs = Array.from(document.querySelectorAll(".orb"));
  const timeline = document.getElementById("processTimeline");
  const steps = timeline ? Array.from(timeline.querySelectorAll(".step")) : [];
  const processSec = document.getElementById("processo");

  let pTarget = reduced ? 1 : 0;
  let pCur = pTarget;

  function applyTimeline() {
    if (!timeline) return;
    timeline.style.setProperty("--p", pCur.toFixed(3));
    const n = steps.length;
    steps.forEach((s, i) => s.classList.toggle("active", pCur >= (n > 1 ? i / (n - 1) : 0) - 0.05));
  }

  if (!reduced && timeline) {
    // suavização com atraso: a linha "persegue" o scroll (trailing)
    (function tlLoop() {
      pCur += (pTarget - pCur) * 0.06;
      applyTimeline();
      requestAnimationFrame(tlLoop);
    })();
  } else {
    applyTimeline();
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);

    if (timeline && processSec) {
      // ancora o progresso na posição da SEÇÃO (não da timeline curta),
      // para a animação durar uma boa faixa de scroll e completar em vista
      const sr = processSec.getBoundingClientRect();
      pTarget = reduced ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.58 - sr.top) / (sr.height * 0.62)));
    }

    if (reduced) return;

    // hero esvanece e sobe conforme sai da viewport
    const hp = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
    if (heroInner) {
      heroInner.style.opacity = (1 - hp * 0.9).toFixed(3);
      heroInner.style.transform = `translateY(${(-40 * hp).toFixed(1)}px)`;
    }

    // orbs com parallax: cada um deriva num ritmo próprio
    for (const orb of orbs) {
      const r = orb.parentElement.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const speed = parseFloat(orb.dataset.speed || "0.4");
      orb.style.transform = `translateY(${((p - 0.5) * -340 * speed).toFixed(1)}px)`;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveals ---------- */
  const revObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revObs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .section-head").forEach((el) => revObs.observe(el));

  /* ---------- glow do cursor + spotlight dos cards ---------- */
  if (fine && !reduced) {
    document.body.classList.add("has-pointer");
    const glow = document.getElementById("cursorGlow");
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      if (glow) glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- briefing rápido -> mailto ---------- */
  const form = document.getElementById("briefForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const g = (n) => (form.querySelector(`[name="${n}"]`) || {}).value || "";
      const subject = `Projeto com a Storm Studio — ${g("tipo")}`;
      const body = `Nome: ${g("nome")}\nPreciso de: ${g("tipo")}\n\n${g("msg")}`;
      window.location.href = `mailto:Andersonrocha.rs@live.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ============================================================
     canvas: partículas + raios procedurais
     ============================================================ */
  function makeStorm(canvas, hero, reduced) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, particles = [], bolts = [], flash = 0, raf = null, heroVisible = true;
    let nextAuto = performance.now() + 2500;
    const mouse = { x: -9999, y: -9999 };

    function seed() {
      const n = Math.min(130, Math.floor((W * H) / 16000));
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.18,
        hue: Math.random() < 0.7 ? "34, 211, 238" : "139, 92, 246",
        a: Math.random() * 0.5 + 0.15, tw: Math.random() * 6.28,
      }));
    }
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.hue}, ${p.a * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
    }
    function resize() {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
      if (reduced) drawStatic();
    }
    function makeBolt(x, targetY, o = {}) {
      const segs = [], branches = [];
      let cx = x, cy = o.startY ?? 0;
      segs.push([cx, cy]);
      const wander = o.wander ?? 38, sMin = o.stepMin ?? 18, sMax = o.stepMax ?? 46;
      while (cy < targetY) {
        cx += (Math.random() - 0.5) * wander * 2;
        cy += sMin + Math.random() * (sMax - sMin);
        segs.push([cx, cy]);
        if (!o.isBranch && Math.random() < 0.18 && segs.length > 2) {
          branches.push(makeBolt(cx, Math.min(cy + 60 + Math.random() * 120, targetY), {
            startY: cy, wander: wander * 0.8, stepMin: 12, stepMax: 30, isBranch: true,
          }));
        }
      }
      return {
        segs, branches, life: 1, decay: 0.045 + Math.random() * 0.03,
        width: o.isBranch ? 1 : 1.6 + Math.random() * 0.8,
        color: Math.random() < 0.75 ? "34, 211, 238" : "167, 139, 250",
      };
    }
    function strike(x, y) {
      if (reduced) return;
      bolts.push(makeBolt(x, y ?? H * (0.55 + Math.random() * 0.3)));
      flash = Math.min(1, flash + 0.85);
    }
    function strokePath(segs) {
      ctx.beginPath();
      ctx.moveTo(segs[0][0], segs[0][1]);
      for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i][0], segs[i][1]);
      ctx.stroke();
    }
    function drawBolt(b) {
      // intensidade contida: o raio é cenário, passa atrás do conteúdo
      const alpha = b.life * (0.42 + Math.random() * 0.22);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = `rgba(${b.color}, ${alpha})`;
      ctx.shadowBlur = 22;
      ctx.strokeStyle = `rgba(${b.color}, ${alpha * 0.55})`;
      ctx.lineWidth = b.width * 2.6;
      ctx.lineJoin = "round";
      strokePath(b.segs);
      ctx.shadowBlur = 8;
      ctx.strokeStyle = `rgba(224, 242, 255, ${alpha})`;
      ctx.lineWidth = b.width;
      strokePath(b.segs);
      ctx.restore();
      b.branches.forEach((br) => { br.life = b.life * 0.8; drawBolt(br); });
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!heroVisible || document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const tw = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.fillStyle = `rgba(${p.hue}, ${tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140) {
          ctx.strokeStyle = `rgba(${p.hue}, ${(1 - d / 140) * 0.28})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      bolts = bolts.filter((b) => b.life > 0);
      for (const b of bolts) { drawBolt(b); b.life -= b.decay; }
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(180, 225, 255, ${flash * 0.06})`;
        ctx.fillRect(0, 0, W, H);
        flash *= 0.86;
      }
      if (now > nextAuto) {
        strike(W * (0.1 + Math.random() * 0.8));
        nextAuto = now + 4000 + Math.random() * 6000;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      raf = requestAnimationFrame(frame);
      new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0 }).observe(hero);
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      });
      hero.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
      hero.addEventListener("click", (e) => {
        if (e.target.closest("a, button, input, select, textarea, .hero-terminal")) return;
        const r = hero.getBoundingClientRect();
        strike(e.clientX - r.left, e.clientY - r.top);
      });
    } else {
      drawStatic();
    }

    return { stop() { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); }, strike };
  }
})();

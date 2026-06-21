/* ============================================================
   STORM STUDIO v2 — scroll cinematográfico
   storm global reativo à velocidade + GSAP/ScrollTrigger + Lenis
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* estado de scroll compartilhado entre os sistemas */
const scrollState = { velocity: 0, progress: 0, y: 0 };

/* ---------- intro: raio de abertura ---------- */

const intro = document.getElementById("intro");

function finishIntro() {
  if (intro) intro.classList.add("done");
  document.body.classList.add("loaded");
}

if (reducedMotion) {
  finishIntro();
} else {
  setTimeout(finishIntro, 1050);
}

document.querySelectorAll(".hero-title .word").forEach((w, i) => {
  w.style.setProperty("--wi", i);
});

/* ============================================================
   STORM — canvas fixo full-page, partículas + raios procedurais
   reage à carga (charge) que sobe com a velocidade do scroll
   ============================================================ */

const StormField = (() => {
  const canvas = document.getElementById("storm");
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0, DPR = 1;
  let particles = [];
  let bolts = [];
  let flash = 0;
  let charge = 0;          // 0..1, suavizado
  let chargeTarget = 0;
  let lastForcedStrike = 0;
  let nextAutoStrike = 800;
  let rafId = null;

  const mouse = { x: -9999, y: -9999 };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    const count = Math.min(150, Math.floor((W * H) / 15000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      hue: Math.random() < 0.7 ? "34, 211, 238" : "139, 92, 246",
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  /* --- geração de um raio: caminho irregular com ramificações --- */
  function makeBolt(x, targetY, opts = {}) {
    const segs = [];
    const branches = [];
    let cx = x;
    let cy = opts.startY ?? 0;
    segs.push([cx, cy]);

    const wander = opts.wander ?? 38;
    const stepMin = opts.stepMin ?? 18;
    const stepMax = opts.stepMax ?? 46;

    while (cy < targetY) {
      cx += (Math.random() - 0.5) * wander * 2;
      cy += stepMin + Math.random() * (stepMax - stepMin);
      segs.push([cx, cy]);

      if (!opts.isBranch && Math.random() < 0.18 && segs.length > 2) {
        branches.push(
          makeBolt(cx, Math.min(cy + 60 + Math.random() * 120, targetY), {
            startY: cy,
            wander: wander * 0.8,
            stepMin: 12,
            stepMax: 30,
            isBranch: true,
          })
        );
      }
    }

    return {
      segs,
      branches,
      life: 1,
      decay: 0.04 + Math.random() * 0.03,
      width: opts.isBranch ? 1 : 1.6 + Math.random() * 0.9,
      color: Math.random() < 0.75 ? "34, 211, 238" : "167, 139, 250",
      intensity: opts.intensity ?? 1,
    };
  }

  function strike(x, y, opts = {}) {
    if (reducedMotion) return;
    const targetY = y ?? H * (0.55 + Math.random() * 0.35);
    bolts.push(makeBolt(x, targetY, { intensity: opts.intensity ?? 1, wander: opts.wander ?? 38 }));
    flash = Math.min(1.2, flash + (opts.flash ?? 0.85));
  }

  /* descarga forte e central — usada nos clímaxes (manifesto, contato) */
  function discharge(intensity = 1.4) {
    const now = performance.now();
    if (now - lastForcedStrike < 520) return;
    lastForcedStrike = now;
    strike(W * (0.35 + Math.random() * 0.3), H * (0.7 + Math.random() * 0.2), {
      intensity,
      flash: 1.0,
      wander: 30,
    });
  }

  function setChargeTarget(v) { chargeTarget = Math.max(0, Math.min(1, v)); }

  function drawBolt(b) {
    const alpha = b.life * (0.42 + Math.random() * 0.22) * b.intensity;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = `rgba(${b.color}, ${alpha})`;
    ctx.shadowBlur = 22 * b.intensity;
    ctx.strokeStyle = `rgba(${b.color}, ${alpha * 0.55})`;
    ctx.lineWidth = b.width * 2.6;
    ctx.lineJoin = "round";
    strokePath(b.segs);

    ctx.shadowBlur = 8;
    ctx.strokeStyle = `rgba(224, 242, 255, ${alpha})`;
    ctx.lineWidth = b.width;
    strokePath(b.segs);
    ctx.restore();

    b.branches.forEach((br) => {
      br.life = b.life * 0.8;
      br.intensity = b.intensity;
      drawBolt(br);
    });
  }

  function strokePath(segs) {
    ctx.beginPath();
    ctx.moveTo(segs[0][0], segs[0][1]);
    for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i][0], segs[i][1]);
    ctx.stroke();
  }

  let cssVarTick = 0;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (document.hidden) return;

    // suaviza a carga em direção ao alvo (vindo da velocidade do scroll)
    charge += (chargeTarget - charge) * 0.06;
    chargeTarget *= 0.94; // decai sozinho quando o scroll para

    // publica a carga p/ o CSS (throttle a cada ~4 frames)
    if (++cssVarTick % 4 === 0) {
      document.documentElement.style.setProperty("--storm-charge", charge.toFixed(3));
    }

    ctx.clearRect(0, 0, W, H);

    const streak = charge * 16;
    for (const p of particles) {
      p.x += p.vx + (Math.random() - 0.5) * charge * 0.4;
      p.y += p.vy;
      p.tw += 0.02;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const twinkle = p.a * (0.6 + 0.4 * Math.sin(p.tw)) * (1 + charge * 0.6);
      ctx.strokeStyle = ctx.fillStyle = `rgba(${p.hue}, ${Math.min(1, twinkle)})`;

      if (streak > 1.5) {
        // partícula vira risco vertical conforme a carga sobe (sensação de velocidade)
        ctx.lineWidth = p.r;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - streak * (0.6 + p.r * 0.3));
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(${p.hue}, ${(1 - dist / 150) * 0.28})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    bolts = bolts.filter((b) => b.life > 0);
    for (const b of bolts) {
      drawBolt(b);
      b.life -= b.decay;
    }

    if (flash > 0.01) {
      ctx.fillStyle = `rgba(180, 225, 255, ${flash * 0.05})`;
      ctx.fillRect(0, 0, W, H);
      flash *= 0.86;
    }

    // raios automáticos: mais frequentes quando a tempestade está carregada
    if (now > nextAutoStrike) {
      const charged = charge > 0.45;
      strike(W * (0.1 + Math.random() * 0.8), null, { intensity: charged ? 1.1 : 0.85 });
      const base = charged ? 900 : 4200;
      nextAutoStrike = now + base + Math.random() * (charged ? 1400 : 6000);
    }
  }

  function renderStatic() {
    resize();
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.fillStyle = `rgba(${p.hue}, ${p.a * 0.7})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    if (reducedMotion) { renderStatic(); return; }
    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(frame);

    // mouse move global p/ as linhas das partículas
    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
  }

  return { init, strike, discharge, setChargeTarget };
})();

StormField.init();

/* clique no hero invoca um raio (preserva o easter-egg da v1) */
const heroEl = document.getElementById("hero");
if (heroEl && !reducedMotion) {
  heroEl.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    StormField.strike(e.clientX, e.clientY, { flash: 0.9 });
    document.getElementById("heroHint")?.classList.add("spent");
  });
}

/* ============================================================
   MOTION STACK — Lenis + GSAP ScrollTrigger
   ============================================================ */

const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
const hasLenis = typeof window.Lenis !== "undefined";

if (hasGSAP && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  initCinematic();
} else {
  // sem GSAP (CDN bloqueado) ou movimento reduzido: tudo visível, scroll nativo
  document.documentElement.classList.remove("motion");
  initFallback();
}

/* ------------------------------------------------------------
   versão cinematográfica
   ------------------------------------------------------------ */
function initCinematic() {
  let lenis = null;

  /* ---- Lenis smooth scroll sincronizado com o ticker do GSAP ---- */
  if (hasLenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // toque usa scroll nativo (mais previsível no mobile)
    });

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      scrollState.velocity = e.velocity || 0;
      scrollState.y = e.scroll || window.scrollY;
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    window.lenis = lenis; // exposto p/ debug e navegação por âncora
  }

  /* âncoras do nav usam o scroll suave do Lenis */
  if (lenis) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });
  } else {
    // velocidade a partir do scroll nativo
    let lastY = window.scrollY, lastT = performance.now();
    window.addEventListener("scroll", () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      scrollState.velocity = ((window.scrollY - lastY) / dt) * 16;
      scrollState.y = window.scrollY;
      lastY = window.scrollY;
      lastT = now;
    }, { passive: true });
  }

  /* ---- progresso, nav, e carga da tempestade pela velocidade ---- */
  const nav = document.getElementById("nav");
  const progressBar = document.getElementById("scrollProgress");

  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      scrollState.progress = self.progress;
      gsap.set(progressBar, { scaleX: self.progress });
      nav.classList.toggle("scrolled", self.scroll() > 30);
    },
  });

  // converte a velocidade do scroll em carga da tempestade (a cada frame)
  gsap.ticker.add(() => {
    const v = Math.abs(scrollState.velocity);
    StormField.setChargeTarget(Math.min(1, v / 28));
  });

  /* ---- HERO: câmera entra no storm ao rolar ---- */
  gsap.to("#heroInner", {
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    y: -90, scale: 1.06, opacity: 0, filter: "blur(7px)", ease: "none",
  });

  /* ---- orbs com parallax ---- */
  gsap.utils.toArray(".orb").forEach((orb) => {
    const speed = parseFloat(orb.dataset.speed || "0.4");
    gsap.fromTo(orb, { yPercent: -18 * speed * 4 }, {
      yPercent: 18 * speed * 4, ease: "none",
      scrollTrigger: { trigger: orb.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---- reveals genéricos (section-head, contato) ---- */
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 90)),
  });

  /* ---- SERVIÇOS: itens entram + spine se desenha ---- */
  ScrollTrigger.batch(".service", {
    start: "top 86%",
    onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 110)),
  });

  const spine = document.querySelector(".service-spine i");
  const serviceList = document.getElementById("serviceList");
  if (spine && serviceList) {
    gsap.fromTo(spine, { scaleY: 0 }, {
      scaleY: 1, ease: "none", transformOrigin: "50% 0%",
      scrollTrigger: { trigger: serviceList, start: "top 80%", end: "bottom 70%", scrub: 0.5 },
    });
  }

  /* ---- LAB: cards entram de profundidade ---- */
  gsap.utils.toArray(".card").forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60, rotateX: -12, scale: 0.94 },
      {
        opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%" },
        onComplete: () => {
          card.classList.add("in");
          // devolve o transform ao CSS (var --rx/--ry) p/ o tilt 3D assumir
          gsap.set(card, { clearProps: "transform" });
        },
        delay: i * 0.05,
      }
    );
  });
  setupCardTilt();

  /* ---- MARQUEE: velocidade modulada pelo scroll ---- */
  setupMarquee();

  /* ---- CONTATO: clímax da tempestade ---- */
  ScrollTrigger.create({
    trigger: ".contact",
    start: "top 70%",
    onEnter: () => StormField.discharge(1.5),
    onEnterBack: () => StormField.discharge(1.2),
  });

  /* ---- pins (manifesto + processo): só no desktop ---- */
  const mm = gsap.matchMedia();

  mm.add("(min-width: 981px)", () => {
    setupManifestoPinned();
    setupProcessPinned();
  });

  mm.add("(max-width: 980px)", () => {
    setupManifestoSimple();
    setupProcessSimple();
  });

  // garante medidas corretas após fontes/layout
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/* ---- manifesto: versão pinada (palavras acendem no scrub) ---- */
function setupManifestoPinned() {
  const words = gsap.utils.toArray(".manifesto-line .mword");
  if (!words.length) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top top",
      end: "+=130%",
      pin: true,
      scrub: 0.6,
    },
  });
  tl.to(words, { opacity: 1, filter: "blur(0px)", stagger: 0.5, ease: "none" })
    .call(() => StormField.discharge(1.4), null, ">-0.25");
  return () => tl.scrollTrigger && tl.scrollTrigger.kill();
}

/* ---- manifesto: versão mobile (fade simples sem pin) ---- */
function setupManifestoSimple() {
  const words = gsap.utils.toArray(".manifesto-line .mword");
  if (!words.length) return;
  gsap.to(words, {
    opacity: 1, filter: "blur(0px)", stagger: 0.04, ease: "power1.out", duration: 0.5,
    scrollTrigger: { trigger: ".manifesto", start: "top 70%", once: true },
  });
}

/* ---- processo: circuito pinado, desenhado pelo scroll + pulso ---- */
function setupProcessPinned() {
  const path = document.getElementById("circuitPath");
  const pulse = document.getElementById("circuitPulse");
  const steps = gsap.utils.toArray(".step");
  if (!path) return;

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(pulse, { strokeDasharray: `${Math.min(70, len * 0.06)} ${len}`, strokeDashoffset: 0 });
  gsap.set(steps, { opacity: 0, y: 28, scale: 0.96 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".process",
      start: "top top",
      end: "+=170%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        steps.forEach((s, i) => s.classList.toggle("lit", p > (i + 0.6) / 4));
      },
    },
  });

  tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0)
    .to(pulse, { strokeDashoffset: -len, ease: "none" }, 0)
    .to(steps, { opacity: 1, y: 0, scale: 1, stagger: 0.18, ease: "power2.out" }, 0.05);
}

/* ---- processo: versão mobile (desenha no scroll, sem pin) ---- */
function setupProcessSimple() {
  const path = document.getElementById("circuitPath");
  const steps = gsap.utils.toArray(".step");
  if (path) {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".process", start: "top 75%", end: "bottom bottom", scrub: 0.5 },
    });
  }
  ScrollTrigger.batch(".step", {
    start: "top 88%",
    onEnter: (els) => els.forEach((el, i) => setTimeout(() => {
      el.classList.add("in"); el.classList.add("lit");
    }, i * 120)),
  });
  // garante visibilidade (sem o set inicial do pin)
  gsap.set(steps, { clearProps: "opacity,transform" });
}

/* ---- marquee de duas linhas, velocidade modulada pelo scroll ---- */
function setupMarquee() {
  document.querySelectorAll(".marquee-row").forEach((row) => {
    const track = row.querySelector(".marquee-track");
    const dir = parseFloat(row.dataset.marquee || "1");
    // duplica o conteúdo p/ loop contínuo via xPercent -50
    track.innerHTML += track.innerHTML;

    const loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 24, ease: "none" });
    loop.timeScale(dir);

    let current = dir;
    gsap.ticker.add(() => {
      // velocidade do scroll empurra a esteira; sempre mantém um drift base
      const v = scrollState.velocity * 0.12;
      const target = dir + v;
      current += (target - current) * 0.08;
      loop.timeScale(current);
    });
  });
}

/* ---- tilt 3D + glare nos cards (apenas ponteiro fino) ---- */
function setupCardTilt() {
  if (!finePointer) return;
  document.querySelectorAll(".card").forEach((card) => {
    const setRX = gsap.quickTo(card, "--ry", { duration: 0.4, ease: "power2.out" });
    const setRY = gsap.quickTo(card, "--rx", { duration: 0.4, ease: "power2.out" });
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      setRX(`${(px - 0.5) * 12}deg`);   // rotateY
      setRY(`${-(py - 0.5) * 10}deg`);  // rotateX
    });
    card.addEventListener("pointerleave", () => { setRX("0deg"); setRY("0deg"); });
  });
}

/* ------------------------------------------------------------
   fallback sem GSAP (CDN indisponível) ou movimento reduzido
   ------------------------------------------------------------ */
function initFallback() {
  const nav = document.getElementById("nav");
  const progressBar = document.getElementById("scrollProgress");

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${p})`;
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveals via IntersectionObserver (mostra tudo de forma robusta)
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal, .service, .card, .step").forEach((el) => io.observe(el));

  // desenha o circuito conforme o scroll, mesmo sem GSAP
  const path = document.getElementById("circuitPath");
  const processSvg = document.getElementById("processSvg");
  if (path && processSvg) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = reducedMotion ? 0 : len;
    if (!reducedMotion) {
      window.addEventListener("scroll", () => {
        const rect = processSvg.getBoundingClientRect();
        const vh = window.innerHeight;
        const prog = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.85)));
        path.style.strokeDashoffset = len * (1 - prog);
      }, { passive: true });
    }
  }
}

/* ============================================================
   PONTEIRO — glow que segue o cursor
   ============================================================ */

if (finePointer && !reducedMotion) {
  document.body.classList.add("has-pointer");
  const glow = document.getElementById("cursorGlow");
  let gx = innerWidth / 2, gy = innerHeight / 2;
  let tx = gx, ty = gy;

  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });

  (function glowLoop() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    if (glow) glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(glowLoop);
  })();
}

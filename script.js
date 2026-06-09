/* ============================================================
   STORM STUDIO — tempestade procedural + coreografia de scroll
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- intro: raio de abertura ---------- */

const intro = document.getElementById("intro");

function finishIntro() {
  intro.classList.add("done");
  document.body.classList.add("loaded");
}

if (reducedMotion) {
  finishIntro();
} else {
  // bolt draw (0.15s + 0.55s) + flash (0.62s + ~0.3s úteis)
  setTimeout(finishIntro, 1050);
}

/* índice de cada palavra do título para o stagger */
document.querySelectorAll(".hero-title .word").forEach((w, i) => {
  w.style.setProperty("--wi", i);
});

/* ============================================================
   CANVAS — partículas + raios procedurais
   ============================================================ */

const canvas = document.getElementById("storm");
const ctx = canvas.getContext("2d");
const hero = document.getElementById("hero");

let W = 0, H = 0, DPR = 1;
let particles = [];
let bolts = [];
let flash = 0;
let nextAutoStrike = performance.now() + 2500;
let heroVisible = true;
let rafId = null;

const mouse = { x: -9999, y: -9999 };

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = hero.clientWidth;
  H = hero.clientHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  seedParticles();
}

function seedParticles() {
  const count = Math.min(130, Math.floor((W * H) / 16000));
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
    decay: 0.045 + Math.random() * 0.03,
    width: opts.isBranch ? 1 : 1.6 + Math.random() * 0.8,
    color: Math.random() < 0.75 ? "34, 211, 238" : "167, 139, 250",
  };
}

function strike(x, y) {
  if (reducedMotion) return;
  bolts.push(makeBolt(x, y ?? H * (0.55 + Math.random() * 0.3)));
  flash = Math.min(1, flash + 0.85);
}

function drawBolt(b) {
  // intensidade contida: o raio é cenário, passa atrás do conteúdo
  const alpha = b.life * (0.42 + Math.random() * 0.22);

  // passada de glow
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = `rgba(${b.color}, ${alpha})`;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = `rgba(${b.color}, ${alpha * 0.55})`;
  ctx.lineWidth = b.width * 2.6;
  ctx.lineJoin = "round";
  strokePath(b.segs);

  // núcleo branco
  ctx.shadowBlur = 8;
  ctx.strokeStyle = `rgba(224, 242, 255, ${alpha})`;
  ctx.lineWidth = b.width;
  strokePath(b.segs);
  ctx.restore();

  b.branches.forEach((br) => {
    br.life = b.life * 0.8;
    drawBolt(br);
  });
}

function strokePath(segs) {
  ctx.beginPath();
  ctx.moveTo(segs[0][0], segs[0][1]);
  for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i][0], segs[i][1]);
  ctx.stroke();
}

/* --- loop principal --- */

function frame(now) {
  rafId = requestAnimationFrame(frame);
  if (!heroVisible || document.hidden) return;

  ctx.clearRect(0, 0, W, H);

  // partículas: deriva + brilho pulsante + linhas perto do mouse
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.tw += 0.02;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10) p.y = H + 10;
    if (p.y > H + 10) p.y = -10;

    const twinkle = p.a * (0.6 + 0.4 * Math.sin(p.tw));
    ctx.fillStyle = `rgba(${p.hue}, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 140) {
      ctx.strokeStyle = `rgba(${p.hue}, ${(1 - dist / 140) * 0.28})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }

  // raios
  bolts = bolts.filter((b) => b.life > 0);
  for (const b of bolts) {
    drawBolt(b);
    b.life -= b.decay;
  }

  // flash global
  if (flash > 0.01) {
    ctx.fillStyle = `rgba(180, 225, 255, ${flash * 0.06})`;
    ctx.fillRect(0, 0, W, H);
    flash *= 0.86;
  }

  // raio automático esporádico
  if (now > nextAutoStrike) {
    strike(W * (0.1 + Math.random() * 0.8));
    nextAutoStrike = now + 4000 + Math.random() * 6000;
  }
}

if (!reducedMotion) {
  resize();
  window.addEventListener("resize", resize);
  rafId = requestAnimationFrame(frame);

  new IntersectionObserver(
    ([entry]) => { heroVisible = entry.isIntersecting; },
    { threshold: 0 }
  ).observe(hero);

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener("pointerleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // clique no hero invoca um raio (ignora cliques em links/botões)
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    const rect = hero.getBoundingClientRect();
    strike(e.clientX - rect.left, e.clientY - rect.top);
    document.getElementById("heroHint")?.classList.add("spent");
  });
} else {
  // fundo estático digno para quem prefere menos movimento
  resize();
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    ctx.fillStyle = `rgba(${p.hue}, ${p.a * 0.7})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ============================================================
   SCROLL — progresso, nav, reveals, pathtrace do processo
   ============================================================ */

const nav = document.getElementById("nav");
const progressBar = document.getElementById("scrollProgress");
const circuitPath = document.getElementById("circuitPath");
const processSvg = document.getElementById("processSvg");
const heroInner = document.getElementById("heroInner");
const orbs = Array.from(document.querySelectorAll(".orb"));

let pathLength = 0;
if (circuitPath) {
  pathLength = circuitPath.getTotalLength();
  circuitPath.style.strokeDasharray = pathLength;
  circuitPath.style.strokeDashoffset = reducedMotion ? 0 : pathLength;
}

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

  nav.classList.toggle("scrolled", window.scrollY > 30);

  if (!reducedMotion) {
    // hero esvanece e sobe conforme o scroll sai dele
    const hp = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
    heroInner.style.opacity = (1 - hp * 0.9).toFixed(3);
    heroInner.style.transform = `translateY(${(-48 * hp).toFixed(1)}px)`;

    // orbs com parallax: cada um deriva num ritmo próprio
    for (const orb of orbs) {
      const r = orb.parentElement.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const speed = parseFloat(orb.dataset.speed || "0.4");
      orb.style.transform = `translateY(${((p - 0.5) * -340 * speed).toFixed(1)}px)`;
    }
  }

  // pathtrace: o circuito se desenha conforme a seção entra na viewport
  if (circuitPath && !reducedMotion && processSvg) {
    const rect = processSvg.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.85)));
    circuitPath.style.strokeDashoffset = pathLength * (1 - progress);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* reveals */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============================================================
   PONTEIRO — glow que segue o cursor + brilho dos cards
   ============================================================ */

if (finePointer && !reducedMotion) {
  document.body.classList.add("has-pointer");
  const glow = document.getElementById("cursorGlow");
  let gx = innerWidth / 2, gy = innerHeight / 2;
  let tx = gx, ty = gy;

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  (function glowLoop() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(glowLoop);
  })();

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

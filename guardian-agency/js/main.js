/* Site interactions: nav, config fill, tilt cards, counters, reveal, bank calculator */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const C = window.CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- fill config values into the page ---- */
  $$("[data-config]").forEach(el => {
    const key = el.dataset.config;
    if (!(key in C)) return;
    if (key.endsWith("Href")) el.setAttribute("href", C[key]);
    else el.textContent = C[key];
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---- nav ---- */
  const nav = $("#nav");
  const burger = $("#burger");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ---- 3D tilt on hover ---- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach(el => {
      const max = 7;
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---- count-up numbers ---- */
  const counters = $$("[data-count]");
  const runCounter = el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      if (en.target.dataset.count !== undefined) runCounter(en.target);
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  counters.forEach(el => io.observe(el));

  /* ---- reveal-on-scroll, only for blocks that start below the fold ---- */
  if (!reduceMotion) {
    const vh = window.innerHeight;
    $$(".card, .step, .compare-col, .faq details, .section-head, .about-grid > *, .split-copy").forEach(el => {
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add("js-reveal");
        io.observe(el);
      }
    });
  }

  /* ---- "your policy as a bank" calculator + chart ---- */
  const contrib = $("#contrib"), years = $("#years");
  const canvas = $("#bankChart");
  if (contrib && years && canvas) {
    const ctx = canvas.getContext("2d");
    const rate = (C.illustration && C.illustration.creditedRate) || 0.06;
    const ltv = (C.illustration && C.illustration.loanToValue) || 0.9;
    const money = n => "$" + Math.round(n).toLocaleString("en-US");

    function project(monthly, yrs) {
      // Simple illustrative model: early-year policy costs, then compounding at the credited rate.
      const inSeries = [], cashSeries = [];
      let cash = 0;
      for (let y = 1; y <= yrs; y++) {
        const annual = monthly * 12;
        const costDrag = y <= 3 ? 0.45 : y <= 7 ? 0.15 : 0.06; // first years fund the policy, later years mostly grow
        cash = (cash + annual * (1 - costDrag)) * (1 + rate);
        inSeries.push(annual * y);
        cashSeries.push(cash);
      }
      return { inSeries, cashSeries };
    }

    function draw(inSeries, cashSeries) {
      const w = canvas.width, h = canvas.height, pad = { l: 12, r: 12, t: 16, b: 26 };
      ctx.clearRect(0, 0, w, h);
      const max = Math.max(cashSeries[cashSeries.length - 1], inSeries[inSeries.length - 1]) * 1.05;
      const n = cashSeries.length;
      const X = i => pad.l + (i / (n - 1)) * (w - pad.l - pad.r);
      const Y = v => h - pad.b - (v / max) * (h - pad.t - pad.b);

      // faint grid
      ctx.strokeStyle = "#E4EFF9"; ctx.lineWidth = 1;
      for (let g = 1; g <= 3; g++) { const y = pad.t + (g / 4) * (h - pad.t - pad.b); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke(); }

      // cash value area
      const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
      grad.addColorStop(0, "rgba(30,94,235,.35)"); grad.addColorStop(1, "rgba(205,232,250,.05)");
      ctx.beginPath(); ctx.moveTo(X(0), Y(0));
      cashSeries.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
      ctx.lineTo(X(n - 1), Y(0)); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

      // cash value line
      ctx.beginPath(); cashSeries.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)));
      ctx.strokeStyle = "#1E5EEB"; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.stroke();

      // contributions line (dashed navy)
      ctx.beginPath(); inSeries.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)));
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#0A2A5E"; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);

      // endpoint markers
      const end = n - 1;
      ctx.fillStyle = "#F5B840"; ctx.beginPath(); ctx.arc(X(end), Y(cashSeries[end]), 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();

      // axis labels
      ctx.fillStyle = "#5A6B87"; ctx.font = "600 11px 'DM Sans', Arial, sans-serif";
      ctx.textAlign = "left"; ctx.fillText("Year 1", pad.l, h - 8);
      ctx.textAlign = "right"; ctx.fillText("Year " + n, w - pad.r, h - 8);
      ctx.textAlign = "left"; ctx.fillText("— cash value", pad.l, pad.t - 2 + 8);
      ctx.fillText("- - what you paid in", pad.l + 88, pad.t - 2 + 8);
    }

    function update() {
      const m = +contrib.value, y = +years.value;
      $("#contribOut").textContent = money(m);
      $("#yearsOut").textContent = y + " yrs";
      const { inSeries, cashSeries } = project(m, y);
      const cash = cashSeries[cashSeries.length - 1];
      $("#statIn").textContent = money(m * 12 * y);
      $("#statCash").textContent = money(cash);
      $("#statLoan").textContent = money(cash * ltv);
      draw(inSeries, cashSeries);
      // share with the quiz so its results can reuse the same model
      window.GUARDIAN_PROJECT = project;
    }
    contrib.addEventListener("input", update);
    years.addEventListener("input", update);
    update();
  }
})();

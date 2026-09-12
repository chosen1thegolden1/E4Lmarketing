/* Quiz funnel: 10 steps -> estimate -> packet + calendar */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const C = window.CONFIG || {};
  const app = $("#quizApp");
  if (!app) return;

  const total = +app.dataset.total || 10;
  const steps = $$(".qstep", app);
  const bar = $("#quizBar"), count = $("#quizStep");
  const result = $("#quizResult");
  const answers = {};
  let current = 1;

  /* back button */
  const back = document.createElement("button");
  back.type = "button"; back.className = "quiz-back"; back.textContent = "← Back"; back.hidden = true;
  app.prepend(back);
  back.addEventListener("click", () => go(current - 1));

  /* populate states */
  const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const stateSel = $("#state");
  states.forEach(s => { const o = document.createElement("option"); o.value = s; o.textContent = s; stateSel.appendChild(o); });

  function go(n) {
    current = Math.max(1, Math.min(total, n));
    steps.forEach(s => s.classList.toggle("is-active", +s.dataset.step === current));
    bar.style.width = (current / total * 100) + "%";
    count.textContent = current;
    back.hidden = current === 1;
    // keep the card in view on mobile
    if (window.innerWidth < 900) app.scrollIntoView({ behavior: "smooth", block: "start" });
    const focusable = $(".qstep.is-active .choice, .qstep.is-active input, .qstep.is-active select", app);
    if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 50);
  }

  /* single-click choices */
  $$(".choice", app).forEach(btn => {
    btn.addEventListener("click", () => {
      const step = btn.closest(".qstep");
      $$(".choice", step).forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      answers[step.dataset.key] = btn.dataset.value;
      setTimeout(() => go(current + 1), 220);
    });
  });

  /* continue buttons with a required field */
  $$(".next", app).forEach(btn => {
    btn.addEventListener("click", () => {
      const field = $(btn.dataset.requires);
      if (!field.value) { field.classList.add("is-invalid"); field.focus(); return; }
      field.classList.remove("is-invalid");
      answers[btn.closest(".qstep").dataset.key] = field.value;
      go(current + 1);
    });
  });

  /* live age line under DOB */
  const dob = $("#dob"), ageLine = $("#ageLine");
  const today = new Date();
  dob.max = today.toISOString().slice(0, 10);
  dob.addEventListener("input", () => {
    const a = ageFrom(dob.value);
    if (a === null) { ageLine.textContent = ""; return; }
    if (a < 18) ageLine.textContent = "Policies are for adults 18+, but a parent can insure a child. We'll cover that on the call.";
    else if (a < 35) ageLine.textContent = `You're ${a}. This is the cheapest life insurance will ever be for you.`;
    else if (a < 50) ageLine.textContent = `You're ${a}. Prime years for locking in rates and building cash value.`;
    else if (a < 65) ageLine.textContent = `You're ${a}. Plenty of great options, and we'll show you every one.`;
    else ageLine.textContent = `You're ${a}. Final-expense and Medicare planning are our specialties for this stage.`;
  });
  dob.addEventListener("keydown", e => { if (e.key === "Enter") $(".next", dob.closest(".qstep")).click(); });

  function ageFrom(iso) {
    if (!iso) return null;
    const d = new Date(iso); if (isNaN(d)) return null;
    let a = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
    return a;
  }

  /* ---- estimate model (illustrative term-life pricing) ---- */
  function estimate(a) {
    const age = ageFrom(a.dob) ?? 40;
    let per100k = age < 30 ? 2.4 : age < 40 ? 2.9 : age < 50 ? 5.2 : age < 60 ? 12 : age < 70 ? 34 : 75; // rough 20-yr term, standard non-tobacco, per $100K/month
    if (a.gender === "Male") per100k *= 1.25;
    if (a.tobacco === "Yes") per100k *= 2.6;
    else if (a.tobacco === "Quit over a year ago") per100k *= 1.3;
    const health = { "Excellent": 0.85, "Good": 1, "Fair": 1.4, "Managing a condition": 1.95 }[a.health] || 1;
    per100k *= health;
    const coverage = a.coverage === "unsure" || !a.coverage ? 250000 : +a.coverage;
    const mid = per100k * (coverage / 100000) + 7; // policy fee
    return { age, coverage, low: Math.round(mid * 0.82), high: Math.round(mid * 1.22) };
  }

  const money = n => "$" + Math.round(n).toLocaleString("en-US");

  /* ---- submit ---- */
  $("#quizSubmit").addEventListener("click", async () => {
    const fields = ["#firstName", "#lastName", "#email", "#phone"].map(s => $(s));
    let ok = true;
    fields.forEach(f => { const bad = !f.value.trim() || (f.type === "email" && !/.+@.+\..+/.test(f.value)); f.classList.toggle("is-invalid", bad); if (bad) ok = false; });
    const consent = $("#consent");
    if (!consent.checked) { consent.focus(); ok = false; }
    if (!ok) return;

    Object.assign(answers, {
      firstName: $("#firstName").value.trim(), lastName: $("#lastName").value.trim(),
      email: $("#email").value.trim(), phone: $("#phone").value.trim(), bestTime: $("#bestTime").value,
      submittedAt: new Date().toISOString(), source: "guardian-agency-quiz"
    });
    const est = estimate(answers);
    Object.assign(answers, { estimatedLow: est.low, estimatedHigh: est.high, coverageUsed: est.coverage, age: est.age });

    try { localStorage.setItem("guardianQuizLead", JSON.stringify(answers)); } catch (e) {}
    if (C.leadWebhookUrl) {
      try { await fetch(C.leadWebhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) }); }
      catch (e) { console.warn("Lead webhook failed", e); }
    } else {
      console.info("Quiz lead (set CONFIG.leadWebhookUrl to send this somewhere):", answers);
    }
    showResult(est);
  });

  function showResult(est) {
    steps.forEach(s => s.classList.remove("is-active"));
    back.hidden = true;
    bar.style.width = "100%"; count.textContent = total;
    result.hidden = false;

    const name = answers.firstName ? `${answers.firstName}, ` : "";
    const titles = {
      young: `${name}you're in a strong position.`,
      mid: `${name}you have solid options.`,
      senior: `${name}we can absolutely help.`
    };
    $("#resultTitle").textContent = est.age < 45 ? titles.young : est.age < 65 ? titles.mid : titles.senior;
    $("#rangeLow").textContent = money(est.low);
    $("#rangeHigh").textContent = money(est.high);
    const covText = answers.coverage === "unsure" ? "a $250,000 starting point" : money(est.coverage);
    $("#resultSub").textContent = `Estimated for ${covText} of 20-year term coverage. Your final rate is set by the carrier after a short application.`;

    /* own-bank block */
    const ibc = $("#resultIbc"), line = $("#ibcLine");
    const wants = /Yes|Curious/.test(answers.ibc || "") || /borrow/.test(answers.goal || "");
    if (wants && typeof window.GUARDIAN_PROJECT === "function") {
      const budgetMid = { "$50–$100": 75, "$100–$250": 175, "$250–$500": 375, "$500+": 750 }[answers.budget] || 300;
      const monthly = Math.max(150, budgetMid);
      const yrs = Math.max(10, Math.min(30, 65 - est.age));
      const { cashSeries } = window.GUARDIAN_PROJECT(monthly, yrs);
      const cash = cashSeries[cashSeries.length - 1];
      line.textContent = `Funding around ${money(monthly)}/month into a properly structured IUL or whole life policy could illustrate roughly ${money(cash)} in cash value over ${yrs} years, with the death benefit in place the whole time. ${C.agentName || "Your agent"} will bring a real carrier illustration to your call.`;
      ibc.hidden = false;
    } else {
      ibc.hidden = true;
    }

    /* packet + calendar */
    const packet = $("#packetLink");
    if (C.brochureUrl) packet.href = C.brochureUrl;
    packet.addEventListener("click", e => {
      // until the PDF exists, explain instead of 404ing
      fetch(packet.href, { method: "HEAD" }).then(r => { if (!r.ok) throw 0; }).catch(() => {
        e.preventDefault();
        alert("Your Guardian Packet PDF isn't attached yet. Drop guardian-packet.pdf into /assets (built in the next phase) and this button will download it.");
      });
    }, { once: true });

    if (C.calendarUrl) {
      const frame = $("#calendarFrame");
      frame.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = C.calendarUrl; iframe.title = "Book a call";
      iframe.loading = "lazy";
      frame.appendChild(iframe);
    }

    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#quizRestart").addEventListener("click", () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    $$(".choice.is-selected", app).forEach(b => b.classList.remove("is-selected"));
    $$("input, select", app).forEach(f => { if (f.type === "checkbox") f.checked = false; else f.value = ""; f.classList.remove("is-invalid"); });
    ageLine.textContent = "";
    result.hidden = true;
    go(1);
  });

  go(1);
})();

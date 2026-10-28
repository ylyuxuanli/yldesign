(function () {
  const D = window.DECK;
  const $ = (id) => document.getElementById(id);
  const ACCESS_PW = 'yldesign', ACCESS_KEY = 'deck_access', PRES_KEY = 'deck_presenter';
  const AGENDA_MIN = 0.5;
  const lens = (id) => D.lenses.find((l) => l.id === id) || D.lenses[0];
  const lensName = (id) => lens(id).name;
  const lensPlural = (id) => lens(id).plural;
  const fmtMin = (m) => (m < 1 ? '<1' : Math.round(m)) + ' min';
  const fmtClock = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  // ---------- Settings, read from and written to the URL ----------
  const q = new URLSearchParams(location.search);
  const allProjects = D.projects.map((p) => p.id);
  const fullMin = D.projects.reduce((a, p) => a + p.slides.reduce((b, s) => b + s.min, 0), 0) + AGENDA_MIN;
  const tMax = Math.ceil(fullMin / 5) * 5;
  const cfg = {
    lens: D.lenses.some((l) => l.id === q.get('for')) ? q.get('for') : 'all',
    t: Math.min(tMax, Math.max(5, parseInt(q.get('t'), 10) || 20)),
    projects: (q.get('p') || allProjects.join(',')).split(',').filter((id) => allProjects.includes(id)),
    mode: q.get('mode') === 'slides' ? 'slides' : 'read'
  };
  if (!cfg.projects.length) cfg.projects = allProjects.slice();
  const locked = q.get('lock') === '1';
  const audience = q.get('audience') === '1';

  function query(c, extra) {
    const p = new URLSearchParams();
    if (c.lens !== 'all') p.set('for', c.lens);
    p.set('t', c.t);
    if (c.projects.length !== allProjects.length) p.set('p', c.projects.join(','));
    if (c.mode === 'slides') p.set('mode', 'slides');
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }
  function syncUrl() {
    history.replaceState(null, '', location.pathname + '?' + query(cfg, locked ? { lock: 1 } : null) + location.hash);
  }

  // ---------- Picking slides for the audience and time ----------
  // Core slides first, then the ones this audience cares about, until the time runs out.
  function pick() {
    const chosen = D.projects.filter((p) => cfg.projects.includes(p.id));
    const flat = [];
    chosen.forEach((p) => p.slides.forEach((s) => flat.push({ ...s, project: p })));
    const hasAgenda = chosen.some((p) => p.id !== 'intro');
    let budget = cfg.t - (hasAgenda ? AGENDA_MIN : 0);
    const score = (s, i) => (s.must ? 100 : 0) + (4 - s.pri) * 2 +
      (cfg.lens !== 'all' && (s.lens || []).includes(cfg.lens) ? 2.5 : 0) - i * 0.001;
    const ranked = flat.map((s, i) => ({ s, i, sc: score(s, i) })).sort((a, b) => b.sc - a.sc);
    const keep = new Set();
    ranked.forEach(({ s, i }) => { if (s.must || s.min <= budget) { keep.add(i); budget -= s.min; } });
    const slides = flat.filter((_, i) => keep.has(i));
    const seq = [];
    slides.forEach((s, i) => {
      if (hasAgenda && s.project.id !== 'intro' && (i === 0 || slides[i - 1].project.id === 'intro')) seq.push({ id: 'agenda', min: AGENDA_MIN, agenda: true, project: { id: 'agenda' } });
      seq.push(s);
    });
    const per = chosen.map((p) => ({ p, min: slides.filter((s) => s.project === p).reduce((a, s) => a + s.min, 0) }));
    return { seq, total: flat.length, shown: slides.length, used: seq.reduce((a, s) => a + s.min, 0), per };
  }
  let plan = pick();

  // ---------- Controls ----------
  function chip(label, on, onClick) {
    const b = document.createElement('button');
    b.className = 'chip' + (on ? ' on' : '');
    b.textContent = label;
    b.onclick = onClick;
    return b;
  }
  function renderControls() {
    const lc = $('lensChips'); lc.innerHTML = '';
    D.lenses.forEach((l) => lc.appendChild(chip(l.name, cfg.lens === l.id, () => { cfg.lens = l.id; update(); })));
    const pc = $('projChips'); pc.innerHTML = '';
    D.projects.forEach((p) => pc.appendChild(chip(p.short, cfg.projects.includes(p.id), () => {
      const on = cfg.projects.includes(p.id);
      if (on && cfg.projects.length === 1) return;
      cfg.projects = on ? cfg.projects.filter((x) => x !== p.id) : allProjects.filter((x) => x === p.id || cfg.projects.includes(x));
      update();
    })));
    const r = $('timeRange'); r.max = tMax; r.value = cfg.t;
    $('timeMax').textContent = tMax + ' min';
    $('timeVal').textContent = cfg.t + ' min';
    document.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('on', b.dataset.mode === cfg.mode));
    $('controls').classList.toggle('locked', locked);
  }
  $('timeRange').addEventListener('input', (e) => { cfg.t = +e.target.value; update(); });
  document.querySelectorAll('.seg-btn').forEach((b) => b.onclick = () => {
    cfg.mode = b.dataset.mode; syncUrl(); renderControls();
    if (cfg.mode === 'slides') openStage(0);
  });

  // ---------- Reading view ----------
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderRead() {
    $('introSub').textContent = cfg.lens === 'all'
      ? 'A walk through my recent work. Pick who you are and how much time you have, and this page reshapes itself.'
      : 'Tailored for ' + lensPlural(cfg.lens) + '. Change it anytime below.';
    const skipped = plan.total - plan.shown;
    $('summary').innerHTML = '<b>' + plan.shown + ' slides</b>, about <b>' + Math.round(plan.used) + ' min</b>' +
      (cfg.lens !== 'all' ? ' · for <b>' + lensPlural(cfg.lens) + '</b>' : '') +
      (skipped ? ' · ' + skipped + ' left out to fit the time' : ' · the full version');

    const root = $('read'); root.innerHTML = '';
    const real = plan.per.filter((x) => x.min > 0);
    if (real.length > 1) {
      const ag = el('nav', 'agenda');
      real.forEach((x, i) => {
        const a = el('a', null, '<span><span class="n">0' + (i + 1) + '</span>' + esc(x.p.name) + '</span><span class="m">' + fmtMin(x.min) + '</span>');
        a.href = '#' + x.p.id;
        ag.appendChild(a);
      });
      root.appendChild(ag);
    }
    plan.per.forEach((x) => {
      const slides = plan.seq.filter((s) => s.project === x.p);
      if (!slides.length) return;
      const sec = el('section', 'proj'); sec.id = x.p.id;
      const head = el('div', 'proj-head');
      head.appendChild(el('div', 'proj-kicker', x.p.id === 'intro' ? 'Intro' : 'Case study · ' + fmtMin(x.min)));
      head.appendChild(el('h2', 'proj-name', esc(x.p.name)));
      if (x.p.tagline) head.appendChild(el('p', 'proj-tag', esc(x.p.tagline)));
      if (x.p.focus) head.appendChild(el('div', 'focus', (cfg.lens === 'all' ? '<b>In short:</b> ' : '<b>For ' + esc(lensPlural(cfg.lens)) + ':</b> ') + esc(x.p.focus[cfg.lens] || x.p.focus.all)));
      sec.appendChild(head);
      slides.forEach((s) => {
        if (s.must && s.id.endsWith('-title')) return; // the section header already covers title slides
        const c = el('article', 'card');
        const t = el('div', 'card-text');
        t.appendChild(el('div', 'card-label', esc(s.label)));
        t.appendChild(el('h3', 'card-title', esc(s.title)));
        t.appendChild(el('p', 'card-body', esc(s.body)));
        if (cfg.lens !== 'all' && (s.lens || []).includes(cfg.lens)) t.appendChild(el('span', 'card-tag', 'Relevant for ' + lensPlural(cfg.lens)));
        const img = el('img', 'card-img');
        img.loading = 'lazy'; img.src = 'slides/' + s.id + '.jpg'; img.alt = s.title;
        img.onclick = () => { cfg.mode = 'slides'; renderControls(); syncUrl(); openStage(plan.seq.indexOf(s)); };
        c.appendChild(t); c.appendChild(img);
        sec.appendChild(c);
      });
      root.appendChild(sec);
    });
  }

  function update() {
    plan = pick(); syncUrl(); renderControls(); renderRead();
  }

  // ---------- Slides ----------
  function slideNode(s) {
    const wrap = el('div', 'slide');
    if (!s) return wrap;
    if (s.agenda) {
      const a = el('div', 'slide-agenda');
      a.appendChild(el('div', 'sa-k', 'Agenda'));
      plan.per.filter((x) => x.p.id !== 'intro' && x.min > 0).forEach((x, i) =>
        a.appendChild(el('div', 'sa-row', '<span><b>0' + (i + 1) + '</b>' + esc(x.p.name) + '</span><span>' + fmtMin(x.min) + '</span>')));
      if (cfg.lens !== 'all') a.appendChild(el('div', 'sa-for', 'Tailored for ' + esc(lensPlural(cfg.lens))));
      wrap.appendChild(a);
    } else {
      const img = el('img'); img.src = 'slides/' + s.id + '.jpg'; img.alt = s.title;
      wrap.appendChild(img);
    }
    return wrap;
  }
  function preload(i) { [i + 1, i + 2].forEach((j) => { const s = plan.seq[j]; if (s && !s.agenda) new Image().src = 'slides/' + s.id + '.jpg'; }); }

  let cur = 0;
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('yl-deck') : null;

  function openStage(i) {
    cur = Math.max(0, Math.min(plan.seq.length - 1, i || 0));
    $('stage').hidden = false;
    document.body.style.overflow = 'hidden';
    drawStage();
  }
  function closeStage() {
    if (audience) return;
    $('stage').hidden = true;
    document.body.style.overflow = '';
    if (document.fullscreenElement) document.exitFullscreen();
    cfg.mode = 'read'; syncUrl(); renderControls();
  }
  function drawStage() {
    const s = plan.seq[cur];
    const box = $('stageSlide'); box.innerHTML = ''; box.appendChild(slideNode(s));
    $('stageCount').textContent = (cur + 1) + ' / ' + plan.seq.length;
    $('stageProg').style.width = ((cur + 1) / plan.seq.length * 100) + '%';
    preload(cur);
  }
  function go(d) {
    const n = Math.max(0, Math.min(plan.seq.length - 1, cur + d));
    if (n === cur) return;
    cur = n;
    if (!$('presenter').hidden) drawPresenter(); else drawStage();
  }
  $('stageExit').onclick = closeStage;
  $('stagePrev').onclick = () => go(-1);
  $('stageNext').onclick = () => go(1);
  $('stageFull').onclick = toggleFull;
  $('stageSlide').onclick = (e) => go(e.clientX < window.innerWidth / 3 ? -1 : 1);
  function toggleFull() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }

  // ---------- Presenter (private) ----------
  let notes = null, timer = { start: 0, acc: 0, running: false }, tick = null;

  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function decrypt(pw) {
    const E = window.DECK_NOTES_ENC;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(E.salt), iterations: E.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(E.iv) }, key, b64(E.data));
    return JSON.parse(new TextDecoder().decode(out));
  }
  async function unlock(pw, silent) {
    try {
      notes = await decrypt(pw);
      try { sessionStorage.setItem(PRES_KEY, pw); } catch (e) {}
      $('presModal').hidden = true;
      openPresenter();
    } catch (e) {
      if (!silent) { $('presError').classList.add('show'); $('presInput').classList.add('error'); $('presInput').value = ''; }
    }
  }
  function askPresenter() {
    let saved = null;
    try { saved = sessionStorage.getItem(PRES_KEY); } catch (e) {}
    if (saved) { unlock(saved, true); return; }
    $('presModal').hidden = false; $('presError').classList.remove('show'); $('presInput').focus();
  }
  $('presBtn').onclick = () => unlock($('presInput').value);
  $('presInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock($('presInput').value); });

  function openPresenter() {
    if (!$('stage').hidden) { $('stage').hidden = true; }
    $('presenter').hidden = false;
    document.body.style.overflow = 'hidden';
    $('prBudget').textContent = cfg.t + ':00';
    drawPresenter();
    if (!tick) tick = setInterval(drawTimer, 500);
  }
  function closePresenter() {
    $('presenter').hidden = true;
    document.body.style.overflow = '';
    cfg.mode = 'read'; renderControls(); syncUrl();
  }
  const elapsed = () => (timer.acc + (timer.running ? Date.now() - timer.start : 0)) / 1000;
  function drawTimer() {
    const e = elapsed();
    $('prElapsed').textContent = fmtClock(e);
    const before = plan.seq.slice(0, cur).reduce((a, s) => a + s.min, 0) * 60;
    const end = before + (plan.seq[cur] ? plan.seq[cur].min * 60 : 0);
    const pace = $('prPace');
    if (!timer.running && e === 0) { pace.textContent = 'Not started'; pace.className = 'pr-pace'; return; }
    if (e < before - 30) { pace.textContent = 'Ahead by ' + fmtClock(before - e); pace.className = 'pr-pace ahead'; }
    else if (e > end + 30) { pace.textContent = 'Behind by ' + fmtClock(e - end); pace.className = 'pr-pace behind'; }
    else { pace.textContent = 'On track'; pace.className = 'pr-pace ontrack'; }
  }
  function drawPresenter() {
    const s = plan.seq[cur], nx = plan.seq[cur + 1];
    $('prCurrent').innerHTML = ''; $('prCurrent').appendChild(slideNode(s));
    $('prNextSlide').innerHTML = ''; $('prNextSlide').appendChild(nx ? slideNode(nx) : el('div', 'slide', '<span style="color:#666;font-size:13px">End</span>'));
    $('prCount').textContent = (cur + 1) + ' / ' + plan.seq.length;
    const until = plan.seq.slice(0, cur + 1).reduce((a, x) => a + x.min, 0) * 60;
    $('prSlideTime').textContent = 'About ' + fmtClock(s.min * 60) + ' here · move on by ' + fmtClock(until);
    const n = (notes && notes[s.id]) || {};
    const box = $('prNotes');
    box.innerHTML = n.base ? esc(n.base) : '<span class="none">No notes for this slide.</span>';
    const extra = n.lens && n.lens[cfg.lens];
    if (extra) box.appendChild(el('span', 'lens-note', '<b>' + esc(lensName(cfg.lens)) + ':</b> ' + esc(extra)));
    drawTimer(); preload(cur);
    if (bc) bc.postMessage({ type: 'go', i: cur, q: query({ ...cfg, mode: 'slides' }) });
  }
  $('prPrev').onclick = () => go(-1);
  $('prNext').onclick = () => go(1);
  $('prExit').onclick = closePresenter;
  $('prStart').onclick = () => {
    if (timer.running) { timer.acc += Date.now() - timer.start; timer.running = false; $('prStart').textContent = 'Resume timer'; }
    else { timer.start = Date.now(); timer.running = true; $('prStart').textContent = 'Pause timer'; }
    drawTimer();
  };
  $('prReset').onclick = () => { timer = { start: 0, acc: 0, running: false }; $('prStart').textContent = 'Start timer'; drawTimer(); };
  $('prAudience').onclick = () => {
    window.open(location.pathname + '?' + query({ ...cfg, mode: 'slides' }, { audience: 1, at: cur }), 'yl-deck-audience', 'width=1280,height=760');
  };

  // The audience window follows the presenter
  if (audience && bc) {
    bc.onmessage = (e) => {
      if (e.data.type !== 'go') return;
      const p = new URLSearchParams(e.data.q);
      cfg.lens = p.get('for') || 'all'; cfg.t = +p.get('t'); cfg.projects = (p.get('p') || allProjects.join(',')).split(',');
      plan = pick(); cur = e.data.i; drawStage();
    };
  }

  // ---------- Share ----------
  function shareUrl() {
    const extra = {};
    if (!$('shareAdjust').checked) extra.lock = 1;
    return location.origin + location.pathname + '?' + query({ ...cfg, mode: $('shareSlides').checked ? 'slides' : 'read' }, extra);
  }
  function drawShare() {
    $('shareUrl').value = shareUrl();
    $('shareDesc').textContent = 'Opens with ' + plan.shown + ' slides, about ' + Math.round(plan.used) + ' min' +
      (cfg.lens !== 'all' ? ', tailored for ' + lensPlural(cfg.lens) : '') + '. They will need the site password.';
  }
  $('shareBtn').onclick = () => { drawShare(); $('shareModal').hidden = false; };
  $('shareAdjust').onchange = drawShare; $('shareSlides').onchange = drawShare;
  $('shareCopy').onclick = async () => {
    try { await navigator.clipboard.writeText($('shareUrl').value); } catch (e) { $('shareUrl').select(); document.execCommand('copy'); }
    $('shareCopy').textContent = 'Copied'; setTimeout(() => $('shareCopy').textContent = 'Copy', 1500);
  };
  document.querySelectorAll('[data-close]').forEach((b) => b.onclick = () => { b.closest('.modal').hidden = true; });

  // ---------- Keys ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const inPres = !$('presenter').hidden, inStage = !$('stage').hidden;
    if (e.key === 'P' && e.shiftKey) { e.preventDefault(); if (inPres) closePresenter(); else askPresenter(); return; }
    if (!inPres && !inStage) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'f') toggleFull();
    else if (e.key === 'Escape' && inStage && !document.fullscreenElement) closeStage();
  });

  // ---------- Access gate, then start ----------
  function start() {
    renderControls(); renderRead();
    if (audience) { $('stage').classList.add('audience'); openStage(+q.get('at') || 0); }
    else if (location.hash === '#presenter') { history.replaceState(null, '', location.pathname + location.search); askPresenter(); }
    else if (cfg.mode === 'slides') openStage(0);
  }
  const overlay = $('pwOverlay');
  let ok = false;
  try { ok = sessionStorage.getItem(ACCESS_KEY) === 'true'; } catch (e) {}
  function pass() { try { sessionStorage.setItem(ACCESS_KEY, 'true'); } catch (e) {} overlay.classList.add('hidden'); setTimeout(() => overlay.remove(), 400); start(); }
  if (ok) { overlay.remove(); start(); }
  else {
    const tryPw = () => {
      if ($('pwInput').value === ACCESS_PW) pass();
      else { $('pwInput').classList.add('error'); $('pwError').classList.add('show'); $('pwInput').value = ''; setTimeout(() => $('pwInput').classList.remove('error'), 600); }
    };
    $('pwBtn').onclick = tryPw;
    $('pwInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') tryPw(); });
  }
})();

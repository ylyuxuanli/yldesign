(function () {
  const D = window.DECK;
  const $ = (id) => document.getElementById(id);
  const ACCESS_PW = 'yldesign', ACCESS_KEY = 'deck_access', PRES_KEY = 'deck_presenter';
  // Minutes for the slides this page builds itself
  const MIN = { welcome: 0.5, setup: 0, agenda: 0.5, lens: 0.25, end: 0.25 };

  const lens = (id) => D.lenses.find((l) => l.id === id) || D.lenses[0];
  const fmtMin = (m) => (m < 1 ? '<1' : Math.round(m)) + ' min';
  const fmtClock = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  // ---------- Settings, kept in the URL ----------
  const q = new URLSearchParams(location.search);
  const allProjects = D.projects.map((p) => p.id);
  const cfg = {
    lens: D.lenses.some((l) => l.id === q.get('for')) ? q.get('for') : 'all',
    t: q.get('t') === 'all' ? 'all' : (parseInt(q.get('t'), 10) || 20),
    projects: (q.get('p') || allProjects.join(',')).split(',').filter((id) => allProjects.includes(id))
  };
  if (!cfg.projects.length) cfg.projects = allProjects.slice();
  const preset = q.has('for') || q.has('t');
  const locked = q.get('lock') === '1';
  const audience = q.get('audience') === '1';
  let showCaptions = !audience;

  function query(c, extra) {
    const p = new URLSearchParams();
    if (c.lens !== 'all') p.set('for', c.lens);
    p.set('t', c.t);
    if (c.projects.length !== allProjects.length) p.set('p', c.projects.join(','));
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }
  let settled = preset; // false until the viewer answers the questions
  function syncUrl() {
    if (audience) return;
    history.replaceState(null, '', location.pathname + (settled ? '?' + query(cfg, locked ? { lock: 1 } : null) : ''));
  }

  // ---------- Building the deck for this audience and time ----------
  // Core slides first, then the ones this audience cares about, until the time runs out.
  function build() {
    const chosen = D.projects.filter((p) => cfg.projects.includes(p.id));
    const flat = [];
    chosen.forEach((p) => p.slides.forEach((s) => flat.push({ ...s, project: p })));
    const cases = chosen.filter((p) => p.id !== 'intro');
    const lensOn = cfg.lens !== 'all';
    let budget = cfg.t === 'all' ? Infinity
      : cfg.t - MIN.welcome - MIN.agenda - (lensOn ? cases.length * MIN.lens : 0);
    const score = (s, i) => (s.must ? 100 : 0) + (4 - s.pri) * 2 +
      (lensOn && (s.lens || []).includes(cfg.lens) ? 2.5 : 0) - i * 0.001;
    const keep = new Set();
    flat.map((s, i) => ({ s, i, sc: score(s, i) })).sort((a, b) => b.sc - a.sc)
      .forEach(({ s, i }) => { if (s.must || s.min <= budget) { keep.add(i); budget -= s.min; } });
    const picked = flat.filter((_, i) => keep.has(i));

    const seq = [{ type: 'welcome', id: 'welcome', min: MIN.welcome }];
    if (!locked) seq.push({ type: 'setup', id: 'setup', min: MIN.setup });
    seq.push({ type: 'agenda', id: 'agenda', min: MIN.agenda });
    picked.forEach((s) => {
      seq.push({ ...s, type: 'content' });
      if (lensOn && s.must && s.project.id !== 'intro') seq.push({ type: 'lens', id: 'lens', min: MIN.lens, project: s.project });
    });
    seq.push({ type: 'end', id: 'end', min: MIN.end });

    const per = chosen.map((p) => ({ p, min: seq.filter((s) => s.project === p).reduce((a, s) => a + s.min, 0) }))
      .filter((x) => x.min > 0);
    return { seq, picked, total: flat.length, used: seq.reduce((a, s) => a + s.min, 0), per };
  }
  let plan = build();
  let cur = 0;
  const indexOf = (type) => plan.seq.findIndex((s) => s.type === type);
  const firstOf = (p) => plan.seq.findIndex((s) => s.project === p);

  // ---------- Slides ----------
  function chip(label, on, onClick, small) {
    const b = el('button', 'chip' + (on ? ' on' : '') + (small ? ' small' : ''));
    b.textContent = label;
    b.onclick = onClick;
    return b;
  }
  function timeLabel() { return cfg.t === 'all' ? 'about ' + Math.round(plan.used) + ' min' : cfg.t + ' min'; }
  function forWhom() { return cfg.lens === 'all' ? 'everyone' : lens(cfg.lens).plural; }

  function slideNode(s, live) {
    let n;
    if (!s) return el('div', 'slide hs');
    if (s.type === 'content') return window.renderSlide(s, cfg.lens);
    if (s.type === 'welcome') {
      n = el('div', 'slide hs hs-welcome');
      const t = el('div', 'w-text');
      t.appendChild(el('div', 'dots', '<span></span><span></span><span></span>'));
      t.appendChild(el('div', 'hs-k', 'Portfolio review'));
      t.appendChild(el('h1', 'hs-h', 'Hi, I\'m Yuxuan.<br/>Thanks for <em>stopping by.</em>'));
      t.appendChild(el('p', 'hs-p', settled
        ? 'I put together a version of my work for ' + esc(forWhom()) + ', about ' + esc(timeLabel()) + '.'
        : 'I\'m a product designer who makes complex things simple. Tell me a little about you, and this deck will shape itself around what you care about.'));
      const row = el('div', 'cta-row');
      const go = el('button', 'cta', settled ? 'Start →' : 'Let\'s go →');
      go.onclick = () => goTo(settled ? indexOf('agenda') : indexOf('setup'));
      row.appendChild(go);
      if (settled && !locked) { const ch = el('button', 'link-btn', 'Change role or time'); ch.onclick = () => goTo(indexOf('setup')); row.appendChild(ch); }
      t.appendChild(row);
      n.appendChild(t);
      n.appendChild(el('div', 'w-photo'));
      return n;
    }
    if (s.type === 'setup') {
      n = el('div', 'slide hs');
      n.appendChild(el('div', 'hs-k', 'Two quick questions'));
      n.appendChild(el('h2', 'hs-h', 'Who\'s joining today?'));
      const q1 = el('div', 'q'); q1.appendChild(el('div', 'q-label', 'Your role'));
      const c1 = el('div', 'chips');
      D.lenses.forEach((l) => c1.appendChild(chip(l.name, cfg.lens === l.id, () => { cfg.lens = l.id; rebuild(); })));
      q1.appendChild(c1); n.appendChild(q1);
      const q2 = el('div', 'q'); q2.appendChild(el('div', 'q-label', 'How much time do we have?'));
      const c2 = el('div', 'chips');
      D.times.forEach((m) => c2.appendChild(chip(m + ' min', cfg.t === m, () => { cfg.t = m; rebuild(); })));
      c2.appendChild(chip('No rush, show me everything', cfg.t === 'all', () => { cfg.t = 'all'; rebuild(); }));
      q2.appendChild(c2); n.appendChild(q2);
      const q3 = el('div', 'q'); q3.appendChild(el('div', 'q-label', 'Include'));
      const c3 = el('div', 'chips');
      D.projects.forEach((p) => c3.appendChild(chip(p.short, cfg.projects.includes(p.id), () => {
        const on = cfg.projects.includes(p.id);
        if (on && cfg.projects.length === 1) return;
        cfg.projects = on ? cfg.projects.filter((x) => x !== p.id) : allProjects.filter((x) => x === p.id || cfg.projects.includes(x));
        rebuild();
      }, true)));
      q3.appendChild(c3);
      q3.appendChild(el('div', 'hint', plan.picked.length + ' of ' + plan.total + ' slides fit, about ' + Math.round(plan.used) + ' min.'));
      n.appendChild(q3);
      const go = el('button', 'cta', 'Build my deck →');
      go.onclick = () => goTo(indexOf('agenda'));
      n.appendChild(go);
      return n;
    }
    if (s.type === 'agenda') {
      n = el('div', 'slide hs');
      n.appendChild(el('div', 'hs-k', 'Agenda · ' + esc(timeLabel()) + (cfg.lens !== 'all' ? ' · for ' + esc(forWhom()) : '')));
      n.appendChild(el('h2', 'hs-h', 'Here\'s our plan'));
      const ag = el('div', 'ag');
      plan.per.forEach((x, i) => {
        const r = el('div', 'ag-row');
        r.appendChild(el('div', 'ag-n', '0' + (i + 1)));
        const mid = el('div', null, '<div class="ag-name">' + esc(x.p.name) + '</div>');
        if (x.p.focus && cfg.lens !== 'all') mid.appendChild(el('div', 'ag-why', esc(x.p.focus[cfg.lens])));
        r.appendChild(mid);
        r.appendChild(el('div', 'ag-m', fmtMin(x.min)));
        r.onclick = () => goTo(firstOf(x.p));
        ag.appendChild(r);
      });
      n.appendChild(ag);
      return n;
    }
    if (s.type === 'lens') {
      const p = s.project;
      n = el('div', 'slide hs');
      n.appendChild(el('div', 'hs-k', 'For ' + esc(forWhom())));
      n.appendChild(el('h2', 'hs-h', 'What to <em>look for</em>'));
      n.appendChild(el('p', 'hs-p', esc(p.focus[cfg.lens] || p.focus.all)));
      const rel = plan.picked.filter((x) => x.project === p && (x.lens || []).includes(cfg.lens)).slice(0, 4);
      if (rel.length) {
        const list = el('div', 'lens-list');
        rel.forEach((x) => list.appendChild(el('div', 'lens-item', '<span>' + esc(x.label.toUpperCase()) + '</span>' + esc(x.title))));
        n.appendChild(list);
      }
      return n;
    }
    if (s.type === 'end') {
      n = el('div', 'slide hs');
      n.appendChild(el('div', 'dots', '<span></span><span></span><span></span>'));
      n.appendChild(el('h2', 'hs-h', 'Thank you!<br/>Always <em>open to a chat.</em>'));
      n.appendChild(el('div', 'end-links',
        '<a href="mailto:yl.yuxuanli@gmail.com">yl.yuxuanli@gmail.com ↗</a>' +
        '<a href="https://linkedin.com/in/yuxuan-yl" target="_blank">LinkedIn ↗</a>' +
        '<a href="../imgs/yuxuan_resume.pdf" target="_blank">Resume ↗</a>' +
        '<a href="../index.html">yldesign.me ↗</a>'));
      if (live && !audience) {
        const row = el('div', 'cta-row');
        if (!locked) { const b = el('button', 'cta', 'See another version'); b.onclick = () => goTo(indexOf('setup')); row.appendChild(b); }
        const sh = el('button', 'link-btn', 'Share this version'); sh.onclick = openShare; row.appendChild(sh);
        n.appendChild(row);
      }
      return n;
    }
  }

  function fill(frame, s, live) {
    frame.innerHTML = '';
    frame.appendChild(slideNode(s, live));
  }

  // ---------- Viewer ----------
  function draw() {
    const s = plan.seq[cur];
    fill($('frame'), s, true);
    $('app').classList.toggle('dark', s.layout === 'title');
    $('count').textContent = (cur + 1) + ' / ' + plan.seq.length;
    $('progBar').style.width = ((cur + 1) / plan.seq.length * 100) + '%';
    $('prevBtn').disabled = cur === 0;
    $('nextBtn').disabled = cur === plan.seq.length - 1;

    const cap = $('caption'); cap.innerHTML = '';
    const why = s.why && s.why[cfg.lens];
    if (why) cap.appendChild(el('div', 'why', '<b>For ' + esc(forWhom()) + ':</b> ' + esc(why)));
    cap.classList.toggle('off', !showCaptions);
    $('capBtn').classList.toggle('off', !showCaptions);

    const pill = $('settingsPill');
    pill.hidden = !settled;
    pill.innerHTML = 'For <b>' + esc(forWhom()) + '</b> · ' + esc(timeLabel()) + (locked ? '' : '<span class="edit">Edit</span>');
    pill.disabled = locked;
    if (!$('presenter').hidden) drawPresenter();
  }
  function goTo(i) {
    if (plan.seq[cur] && plan.seq[cur].type === 'setup' && i > cur && !settled) { settled = true; syncUrl(); }
    cur = Math.max(0, Math.min(plan.seq.length - 1, i));
    draw();
  }
  function go(d) { goTo(cur + d); }
  // Settings changed on the setup slide: rebuild and stay on it
  function rebuild() {
    plan = build();
    cur = Math.max(0, indexOf('setup'));
    if (settled) syncUrl();
    draw();
  }

  $('prevBtn').onclick = () => go(-1);
  $('nextBtn').onclick = () => go(1);
  $('settingsPill').onclick = () => { if (!locked) goTo(indexOf('setup')); };
  $('capBtn').onclick = () => { showCaptions = !showCaptions; draw(); };
  $('fullBtn').onclick = toggleFull;
  function toggleFull() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }

  // Swipe on phones
  let tx = null;
  $('stage').addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  $('stage').addEventListener('touchend', (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });

  // ---------- Presenter (private) ----------
  let notes = null, timer = { start: 0, acc: 0, running: false }, tick = null;
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('yl-deck') : null;

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
      if (silent) { $('presModal').hidden = false; return; }
      $('presError').classList.add('show'); $('presInput').classList.add('error'); $('presInput').value = '';
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
    $('presenter').hidden = false;
    drawPresenter();
    if (!tick) tick = setInterval(drawTimer, 500);
  }
  function closePresenter() { $('presenter').hidden = true; draw(); }
  const elapsed = () => (timer.acc + (timer.running ? Date.now() - timer.start : 0)) / 1000;
  function drawTimer() {
    $('prBudget').textContent = cfg.t === 'all' ? fmtClock(plan.used * 60) : cfg.t + ':00';
    const e = elapsed();
    $('prElapsed').textContent = fmtClock(e);
    const before = plan.seq.slice(0, cur).reduce((a, s) => a + s.min, 0) * 60;
    const end = before + plan.seq[cur].min * 60;
    const pace = $('prPace');
    if (!timer.running && e === 0) { pace.textContent = 'Not started'; pace.className = 'pr-pace'; }
    else if (e < before - 30) { pace.textContent = 'Ahead by ' + fmtClock(before - e); pace.className = 'pr-pace ahead'; }
    else if (e > end + 30) { pace.textContent = 'Behind by ' + fmtClock(e - end); pace.className = 'pr-pace behind'; }
    else { pace.textContent = 'On track'; pace.className = 'pr-pace ontrack'; }
  }
  function drawPresenter() {
    const s = plan.seq[cur];
    fill($('prFrame'), s, true);
    fill($('prNextFrame'), plan.seq[cur + 1], false);
    $('prCount').textContent = (cur + 1) + ' / ' + plan.seq.length;
    const until = plan.seq.slice(0, cur + 1).reduce((a, x) => a + x.min, 0) * 60;
    $('prSlideTime').textContent = s.min ? 'About ' + fmtClock(s.min * 60) + ' here · move on by ' + fmtClock(until) : 'Not timed';
    const n = (notes && notes[s.type === 'content' ? s.id : s.type]) || {};
    const box = $('prNotes');
    box.innerHTML = n.base ? esc(n.base) : '<span class="none">No notes for this slide.</span>';
    const extra = (n.lens && n.lens[cfg.lens]) || (s.why && s.why[cfg.lens]);
    if (extra) box.appendChild(el('span', 'lens-note', '<b>' + esc(lens(cfg.lens).name) + ':</b> ' + esc(extra)));
    drawTimer();
    if (bc) bc.postMessage({ type: 'go', i: cur, q: query(cfg), settled });
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
    window.open(location.pathname + '?' + query(cfg, { audience: 1, at: cur }), 'yl-deck-audience', 'width=1280,height=760');
  };

  // The audience window follows the presenter, settings included
  if (audience && bc) {
    bc.onmessage = (e) => {
      if (e.data.type !== 'go') return;
      const p = new URLSearchParams(e.data.q);
      cfg.lens = p.get('for') || 'all';
      cfg.t = p.get('t') === 'all' ? 'all' : +p.get('t');
      cfg.projects = (p.get('p') || allProjects.join(',')).split(',');
      settled = e.data.settled;
      plan = build(); goTo(e.data.i);
    };
  }

  // ---------- Share ----------
  function shareUrl() {
    const extra = {};
    if (!$('shareAdjust').checked) extra.lock = 1;
    const qs = $('shareSkip').checked || extra.lock ? '?' + query(cfg, extra) : '';
    return location.origin + location.pathname + qs;
  }
  function drawShare() {
    $('shareUrl').value = shareUrl();
    $('shareDesc').textContent = 'For ' + forWhom() + ', ' + timeLabel() + ', ' + plan.picked.length + ' slides. They will need the site password.';
  }
  function openShare() { drawShare(); $('shareModal').hidden = false; }
  $('shareBtn').onclick = openShare;
  $('shareAdjust').onchange = drawShare; $('shareSkip').onchange = drawShare;
  $('shareCopy').onclick = async () => {
    try { await navigator.clipboard.writeText($('shareUrl').value); } catch (e) { $('shareUrl').select(); document.execCommand('copy'); }
    $('shareCopy').textContent = 'Copied'; setTimeout(() => { $('shareCopy').textContent = 'Copy'; }, 1500);
  };
  document.querySelectorAll('[data-close]').forEach((b) => { b.onclick = () => { b.closest('.modal').hidden = true; }; });

  // ---------- Keys ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || document.querySelector('.modal:not([hidden])')) return;
    if (e.key === 'P' && e.shiftKey) { e.preventDefault(); if ($('presenter').hidden) askPresenter(); else closePresenter(); return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'f') toggleFull();
    else if (e.key === 'c') { showCaptions = !showCaptions; draw(); }
  });

  // ---------- Access gate, then start ----------
  function start() {
    if (audience) { document.body.classList.add('audience'); goTo(+q.get('at') || 0); return; }
    const wantsPresenter = location.hash === '#presenter';
    syncUrl();
    goTo(0);
    if (wantsPresenter) askPresenter();
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

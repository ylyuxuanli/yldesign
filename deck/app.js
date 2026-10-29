(function () {
  const D = window.DECK;
  const $ = (id) => document.getElementById(id);
  const ACCESS_PW = 'yldesign', ACCESS_KEY = 'deck_access', PRES_KEY = 'deck_presenter';
  // Minutes for the slides this page builds itself
  const MIN = { welcome: 0.5, setup: 0, agenda: 0.5, end: 0.25 };
  // When she presents, time is the whole session: 5 min of intro, then each project plus 5 min of Q&A
  const SESSION = { lengths: [45, 60], intro: 5, qa: 5 };
  const dur = (s) => s.min + (s.qa || 0);

  const lens = (id) => D.lenses.find((l) => l.id === id) || D.lenses[0];
  const fmtMin = (m) => (m < 1 ? '<1' : Math.round(m)) + ' min';
  const fmtClock = (s) => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  // ---------- Settings, kept in the URL ----------
  const q = new URLSearchParams(location.search);
  const allSkills = D.skills.map((x) => x.id);
  const projIds = D.projects.filter((p) => p.id !== 'intro').map((p) => p.id);
  // mode 'present' is Yuxuan's own setup: no questions, her project order, and
  // slides marked `read` are left out because she tells those parts herself
  function readCfg(p) {
    return {
      lens: D.lenses.some((l) => l.id === p.get('for')) ? p.get('for') : 'all',
      t: p.get('t') === 'all' ? 'all' : (parseInt(p.get('t'), 10) || (p.get('m') === 'present' ? 45 : 20)),
      skills: (p.get('s') || '').split(',').filter((id) => allSkills.includes(id)),
      mode: p.get('m') === 'present' ? 'present' : 'read',
      proj: (p.get('p') || '').split(',').filter((id) => projIds.includes(id))
    };
  }
  const cfg = readCfg(q);
  const presenting = () => cfg.mode === 'present';
  const preset = q.has('for') || q.has('t') || presenting();
  const locked = q.get('lock') === '1';
  const audience = q.get('audience') === '1';

  function query(c, extra) {
    const p = new URLSearchParams();
    if (c.mode === 'present') { p.set('m', 'present'); if (c.proj.length) p.set('p', c.proj.join(',')); }
    else { if (c.lens !== 'all') p.set('for', c.lens); if (c.skills.length) p.set('s', c.skills.join(',')); }
    p.set('t', c.t);
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }
  let settled = preset; // false until the viewer answers the questions
  function syncUrl() {
    if (audience) return;
    history.replaceState(null, '', location.pathname + (settled ? '?' + query(cfg, locked ? { lock: 1 } : null) : ''));
  }

  // ---------- Building the deck for this audience and time ----------
  // Projects are ordered by how well they match the skills asked for. Each project
  // comes in whole (its core slides) or not at all, so a short deck never ends on a
  // lone cover. Leftover time goes to the slides this audience cares about most.
  function build() {
    const lensOn = cfg.lens !== 'all' && !presenting();
    const hits = (s) => (s.skills || []).filter((k) => cfg.skills.includes(k)).length;
    const score = (s) => (s.must ? 100 : 0) + (4 - s.pri) * 2 +
      (lensOn && (s.lens || []).includes(cfg.lens) ? 2.5 : 0) + (hits(s) ? 2 + hits(s) : 0);
    const intro = D.projects.filter((p) => p.id === 'intro');
    const cases = presenting() && cfg.proj.length
      ? cfg.proj.map((id) => D.projects.find((p) => p.id === id))
      : D.projects.filter((p) => p.id !== 'intro')
        .map((p, i) => ({ p, i, fit: p.slides.reduce((a, s) => a + hits(s), 0) }))
        .sort((a, b) => b.fit - a.fit || a.i - b.i).map((x) => x.p);
    const order = intro.concat(cases);
    const flat = [];
    order.forEach((p) => p.slides.forEach((s) => {
      if (!(s.read && presenting())) flat.push({ ...s, project: p, sc: score(s) - flat.length * 0.001 });
    }));
    const qa = presenting() ? SESSION.qa : 0;
    let budget = cfg.t === 'all' ? Infinity : presenting() ? cfg.t - SESSION.intro : cfg.t - MIN.welcome - MIN.agenda;
    const keep = new Set();
    const take = (s) => { keep.add(s); budget -= s.min; };
    const byScore = (list) => list.slice().sort((a, b) => b.sc - a.sc);
    const core = (p) => flat.filter((s) => s.project === p && (s.must || s.pri === 1));

    const shown = new Set(intro);
    if (presenting()) {
      // She presents every slide of the projects she picked, and adjusts by talking. The pacing
      // is stretched so intro, projects and Q&A fill the session exactly.
      flat.forEach((s) => keep.add(s));
      cases.forEach((p) => shown.add(p));
      const T = SESSION.lengths.includes(cfg.t) ? cfg.t : SESSION.lengths[0];
      cases.forEach((p) => {
        const mine = flat.filter((s) => s.project === p), sum = mine.reduce((a, s) => a + s.min, 0);
        const k = ((p.talk && p.talk[T]) || sum) / sum;
        mine.forEach((s) => { s.min *= k; });
      });
    } else {
      intro.forEach((p) => core(p).forEach(take));
      cases.forEach((p, n) => {
        const c = core(p), need = c.reduce((a, s) => a + s.min, 0);
        if (need + qa <= budget) { c.forEach(take); shown.add(p); budget -= qa; }
        else if (n === 0) { // Not even one full case fits: show the best of the first one
          shown.add(p); budget -= qa;
          byScore(c).forEach((s) => { if (s.must || s.min <= budget) take(s); });
        }
      });
      // Grouped slides (like work experience) come in together or not at all
      const units = [], groups = new Set();
      const rest = flat.filter((s) => shown.has(s.project) && !keep.has(s));
      byScore(rest).forEach((s) => {
        if (!s.group) { units.push([s]); return; }
        if (groups.has(s.group)) return;
        groups.add(s.group);
        units.push(rest.filter((x) => x.group === s.group));
      });
      units.forEach((u) => { if (u.reduce((a, s) => a + s.min, 0) <= budget) u.forEach(take); });
    }
    const picked = flat.filter((s) => keep.has(s));

    const seq = [{ type: 'welcome', id: 'welcome', min: MIN.welcome }];
    if (!locked && !presenting()) seq.push({ type: 'setup', id: 'setup', min: MIN.setup });
    const content = (s) => seq.push({ ...s, type: 'content' });
    if (presenting()) { // stretch the intro's pacing to its 5 minutes, welcome included
      const mine = picked.filter((s) => s.project.id === 'intro');
      const k = (SESSION.intro - MIN.welcome) / mine.reduce((a, s) => a + s.min, 0);
      mine.forEach((s) => content({ ...s, min: s.min * k }));
    }
    seq.push({ type: 'agenda', id: 'agenda', min: MIN.agenda });
    picked.filter((s) => !presenting() || s.project.id !== 'intro').forEach(content);
    seq.push({ type: 'end', id: 'end', min: MIN.end });
    // Q&A time sits on each project's last slide, so the presenter pace accounts for it
    if (qa) cases.filter((p) => shown.has(p)).forEach((p) => {
      const last = seq.map((x) => x.project).lastIndexOf(p);
      if (last > -1) seq[last].qa = qa;
    });

    const per = order.filter((p) => shown.has(p) && !(presenting() && p.id === 'intro'))
      .map((p) => {
        const mine = picked.filter((s) => s.project === p);
        const skills = allSkills.filter((k) => cfg.skills.includes(k) && mine.some((s) => (s.skills || []).includes(k)));
        return { p, skills, min: mine.reduce((a, s) => a + s.min, 0) };
      })
      .filter((x) => x.min > 0);
    const skipped = cases.filter((p) => !shown.has(p));
    return { seq, picked, total: flat.length, used: seq.reduce((a, s) => a + dur(s), 0), per, skipped };
  }
  let plan = build();
  let cur = 0;
  const indexOf = (type) => plan.seq.findIndex((s) => s.type === type);
  const firstOf = (p) => plan.seq.findIndex((s) => s.project === p);

  // ---------- Slides ----------
  function chip(label, on, onClick, small, multi) {
    const b = el('button', 'chip' + (on ? ' on' : '') + (small ? ' small' : '') + (multi ? ' multi' : ''));
    b.setAttribute(multi ? 'aria-checked' : 'aria-pressed', on);
    if (multi) b.setAttribute('role', 'checkbox');
    b.textContent = label;
    b.onclick = onClick;
    return b;
  }
  function timeLabel() { return cfg.t === 'all' ? 'about ' + Math.round(plan.used) + ' min' : cfg.t + ' min'; }
  function forWhom() { return cfg.lens === 'all' ? 'everyone' : lens(cfg.lens).plural; }

  function slideNode(s, live) {
    let n;
    if (!s) return el('div', 'slide hs');
    if (s.type === 'content') return window.renderSlide(s, presenting() ? 'all' : cfg.lens);
    if (s.type === 'welcome') {
      n = el('div', 'slide hs hs-welcome');
      const t = el('div', 'w-text');
      t.appendChild(el('div', 'dots', '<span></span><span></span><span></span>'));
      t.appendChild(el('h1', 'hs-h', 'Hi, I\'m Yuxuan.'));
      t.appendChild(el('p', 'hs-p', 'Product designer'));
      const row = el('div', 'cta-row');
      const go = el('button', 'cta', settled ? 'Start →' : 'Let\'s go →');
      go.onclick = () => goTo(presenting() ? 1 : settled ? indexOf('agenda') : indexOf('setup'));
      row.appendChild(go);
      if (settled && !locked && !presenting()) { const ch = el('button', 'link-btn', 'Change role or time'); ch.onclick = () => goTo(indexOf('setup')); row.appendChild(ch); }
      t.appendChild(row);
      n.appendChild(t);
      n.appendChild(el('div', 'w-photo'));
      return n;
    }
    if (s.type === 'setup') {
      n = el('div', 'slide hs');
      n.appendChild(el('h2', 'hs-h', 'Let\'s tailor this for you'));
      n.appendChild(el('p', 'hs-p', 'Tell me a little about you, and this deck will shape itself around what you care about.'));
      const q1 = el('div', 'q'); q1.appendChild(el('div', 'q-label', 'Your role'));
      const c1 = el('div', 'chips');
      D.lenses.forEach((l) => c1.appendChild(chip(l.name, cfg.lens === l.id, () => { cfg.lens = l.id; rebuild(); })));
      q1.appendChild(c1); n.appendChild(q1);
      const q2 = el('div', 'q'); q2.appendChild(el('div', 'q-label', 'Time'));
      const c2 = el('div', 'chips');
      D.times.forEach((m) => c2.appendChild(chip(m + ' min', cfg.t === m, () => { cfg.t = m; rebuild(); })));
      c2.appendChild(chip('All', cfg.t === 'all', () => { cfg.t = 'all'; rebuild(); }));
      q2.appendChild(c2); n.appendChild(q2);
      const q3 = el('div', 'q'); q3.appendChild(el('div', 'q-label', 'Interested in'));
      const c3 = el('div', 'chips');
      D.skills.forEach((k) => c3.appendChild(chip(k.name, cfg.skills.includes(k.id), () => {
        cfg.skills = cfg.skills.includes(k.id) ? cfg.skills.filter((x) => x !== k.id) : allSkills.filter((x) => x === k.id || cfg.skills.includes(x));
        rebuild();
      }, true, true)));
      q3.appendChild(c3);
      n.appendChild(q3);
      const go = el('button', 'cta', 'Show me →');
      go.onclick = () => goTo(indexOf('agenda'));
      n.appendChild(go);
      return n;
    }
    if (s.type === 'agenda') {
      n = el('div', 'slide hs');
      n.appendChild(el('h2', 'hs-h', 'Here\'s our plan'));
      const ag = el('div', 'ag');
      plan.per.forEach((x, i) => {
        const r = el('div', 'ag-row');
        r.appendChild(el('div', 'ag-n', '0' + (i + 1)));
        const mid = el('div', null, '<div class="ag-name">' + esc(x.p.name) + '</div>');
        if (x.p.focus) mid.appendChild(el('div', 'ag-why', esc((!presenting() && x.p.focus[cfg.lens]) || x.p.focus.all)));
        r.appendChild(mid);
        r.appendChild(el('div', 'ag-m', fmtMin(x.min)));
        r.onclick = () => goTo(firstOf(x.p));
        ag.appendChild(r);
      });
      n.appendChild(ag);
      return n;
    }
    if (s.type === 'end') {
      n = el('div', 'slide hs');
      n.appendChild(el('div', 'dots', '<span></span><span></span><span></span>'));
      n.appendChild(el('h2', 'hs-h', 'Thank you!<br/>Always open to a chat.'));
      n.appendChild(el('p', 'hs-p', 'The thread through all my work: I design the system around the screens. Who does what, when AI should act, and when a human should step in.'));
      n.appendChild(el('div', 'end-links',
        '<a href="mailto:yl.yuxuanli@gmail.com">yl.yuxuanli@gmail.com</a>' +
        '<a href="https://linkedin.com/in/yuxuan-yl" target="_blank">LinkedIn</a>' +
        '<a href="../imgs/yuxuan_resume.pdf" target="_blank">Resume</a>' +
        '<a href="../index.html">yldesign.me</a>'));
      if (live && !audience && !presenting()) {
        const row = el('div', 'cta-row');
        if (!locked) { const b = el('button', 'link-btn', 'See another version'); b.onclick = () => goTo(indexOf('setup')); row.appendChild(b); }
        const sh = el('button', 'link-btn', 'Share this version'); sh.onclick = openShare; row.appendChild(sh);
        n.appendChild(row);
      }
      return n;
    }
  }

  function fill(frame, s, live) {
    frame.innerHTML = '';
    const n = slideNode(s, live);
    // Small section label in the top-left corner, as in the PDF deck
    if (s && s.section) n.appendChild(el('div', 'sec-label' + (s.leftTheme ? ' on-dark' : ''), esc(s.section)));
    frame.appendChild(n);
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
      markOwner();
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
    if (!presenting()) { // presenter view always means her presenting version
      Object.assign(cfg, { mode: 'present', lens: 'all', skills: [], proj: [], t: SESSION.lengths.includes(cfg.t) ? cfg.t : SESSION.lengths[0] });
      settled = true; plan = build(); syncUrl(); cur = 0; draw();
    }
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
    const before = plan.seq.slice(0, cur).reduce((a, s) => a + dur(s), 0) * 60;
    const end = before + dur(plan.seq[cur]) * 60;
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
    const until = plan.seq.slice(0, cur + 1).reduce((a, x) => a + dur(x), 0) * 60;
    $('prSlideTime').textContent = s.min ? 'About ' + fmtClock(s.min * 60) + ' here' + (s.qa ? ', then ' + s.qa + ' min Q&A' : '') + ' · move on by ' + fmtClock(until) : 'Not timed';
    const n = (notes && notes[s.type === 'content' ? s.id : s.type]) || {};
    const box = $('prNotes');
    box.innerHTML = n.base ? esc(n.base) : '<span class="none">No notes for this slide.</span>';
    const extra = !presenting() && n.lens && n.lens[cfg.lens];
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
      Object.assign(cfg, readCfg(new URLSearchParams(e.data.q)));
      settled = e.data.settled;
      plan = build(); goTo(e.data.i);
    };
  }

  // ---------- Share ----------
  function shareUrl() {
    const extra = {};
    if (!$('shareAdjust').checked) extra.lock = 1;
    const c = { ...cfg, mode: 'read' };
    const qs = $('shareSkip').checked || extra.lock ? '?' + query(c, extra) : '';
    return location.origin + location.pathname + qs;
  }
  function drawShare() {
    $('shareUrl').value = shareUrl();
    $('shareDesc').textContent = 'For ' + (presenting() ? 'everyone' : forWhom()) + ', ' + timeLabel() + ', ' + plan.picked.length + ' slides. They will need the site password.';
  }
  function openShare() { drawShare(); $('shareModal').hidden = false; }

  // ---------- Menu: this version, jump to, share, full screen ----------
  function toggleToc(open) {
    const toc = $('toc');
    open = open == null ? toc.hidden : open;
    toc.hidden = !open;
    $('menuBtn').setAttribute('aria-expanded', open);
    if (!open) return;
    toc.innerHTML = '';
    const item = (label, fn, extra) => {
      const b = el('button', null, esc(label) + (extra ? '<span>' + esc(extra) + '</span>' : ''));
      b.onclick = () => { toggleToc(false); fn(); };
      toc.appendChild(b);
    };
    if (presenting()) {
      toc.appendChild(el('div', 'toc-k', 'Presenting · ' + esc(timeLabel())));
      item('Presenting setup', openSetup, 'S');
      toc.appendChild(el('hr'));
    } else if (settled) {
      toc.appendChild(el('div', 'toc-k', 'For ' + esc(forWhom()) + ' · ' + esc(timeLabel())));
      if (!locked) item('Change role or time', () => goTo(indexOf('setup')));
      toc.appendChild(el('hr'));
    }
    item('Start over', () => goTo(0));
    item('Agenda', () => goTo(indexOf('agenda')));
    plan.per.forEach((x) => item(x.p.short, () => goTo(firstOf(x.p)), fmtMin(x.min)));
    toc.appendChild(el('hr'));
    item('Share this version', openShare);
    item('Full screen', toggleFull, 'F');
    const home = el('a', null, 'yldesign.me'); home.href = '../index.html'; toc.appendChild(home);
  }
  $('menuBtn').onclick = (e) => { e.stopPropagation(); toggleToc(); };
  document.addEventListener('click', (e) => { if (!$('toc').hidden && !$('toc').contains(e.target)) toggleToc(false); });
  $('shareAdjust').onchange = drawShare; $('shareSkip').onchange = drawShare;
  $('shareCopy').onclick = async () => {
    try { await navigator.clipboard.writeText($('shareUrl').value); } catch (e) { $('shareUrl').select(); document.execCommand('copy'); }
    $('shareCopy').textContent = 'Copied'; setTimeout(() => { $('shareCopy').textContent = 'Copy'; }, 1500);
  };
  document.querySelectorAll('[data-close]').forEach((b) => { b.onclick = () => { b.closest('.modal').hidden = true; }; });

  // ---------- Setup side panel (only for Yuxuan: opens by itself once she's used presenter mode) ----------
  const OWNER_KEY = 'deck_owner';
  const isOwner = () => { try { return localStorage.getItem(OWNER_KEY) === '1'; } catch (e) { return false; } };
  const markOwner = () => { try { localStorage.setItem(OWNER_KEY, '1'); } catch (e) {} };
  function apply() {
    if (presenting()) { cfg.lens = 'all'; cfg.skills = []; settled = true; }
    plan = build(); syncUrl(); cur = 0; draw(); drawSetup();
  }
  function drawSetup() {
    const box = $('setupBody');
    box.innerHTML = '';
    const pres = presenting();
    const q1 = el('div', 'q'); q1.appendChild(el('div', 'q-label', 'Who\'s driving'));
    const c1 = el('div', 'chips');
    c1.appendChild(chip('I\'m presenting', pres, () => {
      cfg.mode = 'present';
      if (!SESSION.lengths.includes(cfg.t)) cfg.t = SESSION.lengths[0];
      apply();
    }, true));
    c1.appendChild(chip('They pick their role', !pres, () => { cfg.mode = 'read'; cfg.proj = []; settled = false; apply(); }, true));
    q1.appendChild(c1); box.appendChild(q1);
    if (!pres) return;
    const q2 = el('div', 'q'); q2.appendChild(el('div', 'q-label', 'Session'));
    const c2 = el('div', 'chips');
    SESSION.lengths.forEach((m) => c2.appendChild(chip(m + ' min', cfg.t === m, () => { cfg.t = m; apply(); }, true)));
    q2.appendChild(c2); box.appendChild(q2);
    const q3 = el('div', 'q'); q3.appendChild(el('div', 'q-label', 'Projects, drag to reorder'));
    const list = el('div', 'set-list');
    const on = cfg.proj.length ? cfg.proj : projIds;
    let order = on.concat(projIds.filter((id) => !on.includes(id))), dragId = null;
    const mins = Object.fromEntries(plan.per.map((x) => [x.p.id, x.min]));
    order.forEach((id) => {
      const p = D.projects.find((x) => x.id === id), checked = on.includes(id);
      const r = el('div', 'set-row' + (checked ? '' : ' off'));
      r.draggable = true;
      r.appendChild(el('span', 'set-grip', '⠿'));
      const cb = el('label', 'check', '<input type="checkbox"' + (checked ? ' checked' : '') + '/> ' + esc(p.short || p.name));
      cb.querySelector('input').onchange = () => {
        const next = checked ? on.filter((x) => x !== id) : order.filter((x) => x === id || on.includes(x));
        if (!next.length) { drawSetup(); return; }
        cfg.proj = next; apply();
      };
      r.appendChild(cb);
      r.appendChild(el('span', 'set-min', checked && mins[id] ? fmtMin(mins[id]) : ''));
      r.addEventListener('dragstart', (e) => { dragId = id; r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
      r.addEventListener('dragend', () => { dragId = null; cfg.proj = order.filter((x) => on.includes(x)); apply(); });
      r.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!dragId || dragId === id) return;
        const a = order.filter((x) => x !== dragId);
        const rect = r.getBoundingClientRect(), after = e.clientY > rect.top + rect.height / 2;
        a.splice(a.indexOf(id) + (after ? 1 : 0), 0, dragId);
        if (a.join() === order.join()) return;
        order = a;
        const moving = [...list.children].find((x) => x.classList.contains('dragging'));
        if (after) r.after(moving); else r.before(moving);
      });
      list.appendChild(r);
    });
    q3.appendChild(list); box.appendChild(q3);
    box.appendChild(el('p', 'set-note', 'Intro 5 min, then each project with 5 min of Q&A.'));
  }
  function openSetup(open) {
    open = open == null ? $('side').hidden : open;
    if (open) { markOwner(); drawSetup(); }
    $('side').hidden = !open;
    $('app').classList.toggle('with-side', open);
  }
  $('sideClose').onclick = () => openSetup(false);
  $('prSetup').onclick = () => { closePresenter(); openSetup(true); };

  // ---------- Keys ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('toc').hidden) { toggleToc(false); return; }
    if (e.target.tagName === 'INPUT' || document.querySelector('.modal:not([hidden])')) return;
    if (e.key === 'S' && e.shiftKey) { e.preventDefault(); openSetup(); return; }
    if (e.key === 'P' && e.shiftKey) { e.preventDefault(); if ($('presenter').hidden) askPresenter(); else closePresenter(); return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'f') toggleFull();
  });

  // ---------- Access gate, then start ----------
  function start() {
    if (audience) { document.body.classList.add('audience'); goTo(+q.get('at') || 0); return; }
    const wantsPresenter = location.hash === '#presenter';
    const wantsSetup = location.hash === '#setup';
    syncUrl();
    goTo(0);
    if (wantsPresenter) askPresenter();
    else if (wantsSetup || (isOwner() && !preset)) openSetup(true);
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

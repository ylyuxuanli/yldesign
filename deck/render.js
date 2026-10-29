// Draws content slides from DECK data. See content.js for the fields each layout uses.
// Content strings are written by the site owner and may contain simple HTML (<em>, <b>).
(function () {
  let lens = 'all';
  // Text can be a string or { all, pm, design, ... }: pick the viewer's version
  const T = (x) => (x && typeof x === 'object' && !Array.isArray(x) && 'all' in x) ? (x[lens] != null ? x[lens] : x.all) : x;
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function add(parent, child) { if (child) parent.appendChild(child); return parent; }

  const ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>';
  function media(m, cls) {
    const box = el('div', 'c-media' + (cls ? ' ' + cls : '') + (m.grow ? ' grow' : '') + (m.fit ? ' ' + m.fit : ''));
    if (m.video) {
      const v = el('video'); v.src = m.video; if (m.poster) v.poster = m.poster;
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.setAttribute('aria-label', m.cap || m.ph || '');
      box.appendChild(v);
    } else if (m.src) {
      const img = el('img'); img.src = m.src; img.alt = m.cap || m.ph || '';
      if (m.pos) img.style.objectPosition = m.pos;
      box.appendChild(img);
    } else {
      box.classList.add('ph');
      box.appendChild(el('div', 'ph-in', ICON + '<span>' + T(m.ph) + '</span>'));
    }
    if (m.cap) box.appendChild(el('div', 'c-cap', T(m.cap)));
    return box;
  }

  const B = {
    k: (b) => el('div', 'c-k', T(b.k)),
    h: (b) => el('h2', 'c-h' + (b.size === 'xl' ? ' xl' : ''), T(b.h)),
    p: (b) => el('p', 'c-p', T(b.p)),
    sub: (b) => el('p', 'c-sub', T(b.sub)),
    note: (b) => el('div', 'c-note', T(b.note)),
    link(b) {
      const a = el('a', 'c-link', T(b.link.text) + ' ↗');
      a.href = b.link.href; a.target = '_blank'; a.rel = 'noopener';
      return a;
    },
    quote: (b) => el('blockquote', 'c-quote', '<span>' + T(b.quote) + '</span>' + (b.by ? '<cite>' + T(b.by) + '</cite>' : '')),

    list(b) {
      const w = el('div', 'c-list' + (b.muted ? ' muted' : ''));
      if (b.title) w.appendChild(el('div', 'c-lt', T(b.title)));
      const ul = el('ul');
      T(b.list).forEach((i) => ul.appendChild(el('li', null, T(i))));
      w.appendChild(ul);
      return w;
    },
    // People and tools in a vertical chain; a dashed link means help that only comes later
    flow(b) {
      const w = el('div', 'c-flow');
      b.flow.forEach((x, i) => {
        if (i) w.appendChild(el('span', 'c-fl' + (x.dashed ? ' dash' : '')));
        w.appendChild(el('div', 'c-fn', '<img src="' + x.img + '" alt=""/><span>' + T(x.t) + '</span>'));
      });
      return w;
    },
    lines(b) {
      const ul = el('ul', 'c-gl');
      T(b.lines).forEach((i) => ul.appendChild(el('li', null, T(i))));
      return ul;
    },
    groups(b) {
      const w = el('div', 'c-groups');
      b.groups.forEach((g) => w.appendChild(el('div', 'c-g', '<div class="c-gh">' + T(g.h) + '</div><div class="c-gp">' + T(g.p) + '</div>' +
        (g.list ? '<ul class="c-gl">' + T(g.list).map((i) => '<li>' + T(i) + '</li>').join('') + '</ul>' : ''))));
      return w;
    },
    stats(b) {
      const w = el('div', 'c-stats' + (b.row ? ' row' : '') + (b.small ? ' small' : ''));
      b.stats.forEach((s) => w.appendChild(el('div', 'c-stat',
        (s.k ? '<div class="c-sk">' + T(s.k) + '</div>' : '') + '<div class="c-sv">' + T(s.v) + '</div><div class="c-sl">' + T(s.l) + '</div>')));
      return w;
    },
    rows(b) {
      const w = el('div', 'c-rows');
      T(b.rows).forEach((x) => w.appendChild(el('div', 'c-row', '<div class="c-rh">' + T(x.h) + '</div><div class="c-rp">' + T(x.p) + '</div>')));
      return w;
    },
    numbered(b) {
      const w = el('div', 'c-num');
      T(b.numbered).forEach((x, i) => w.appendChild(el('div', 'c-ni', '<span class="c-n">' + (i + 1) + '</span><div><div class="c-nh">' + T(x.h) + '</div><div class="c-np">' + T(x.p) + '</div></div>')));
      return w;
    },
    steps(b) {
      const w = el('div', 'c-steps');
      b.steps.forEach((x, i) => w.appendChild(el('div', 'c-step', '<span class="c-dot">' + (i + 1) + '</span><div><div class="c-nh">' + T(x.h) + '</div><div class="c-np">' + T(x.p) + '</div></div>')));
      return w;
    },
    timeline(b) {
      const w = el('div', 'c-tl');
      b.timeline.forEach((x) => w.appendChild(el('div', 'c-tli', '<span class="c-tld"></span><div class="c-nh">' + T(x.h) + '</div><div class="c-np">' + T(x.p) + '</div>')));
      return w;
    },
    chain(b) {
      const w = el('div', 'c-chain' + (b.vertical ? ' vertical' : '') + (b.dim ? ' dim' : ''));
      b.chain.forEach((t, i) => {
        if (i) w.appendChild(el('span', 'c-arrow', b.vertical ? '↓' : '→'));
        const on = b.on === i, off = b.on != null && !on;
        w.appendChild(el('div', 'c-node' + (on ? ' on' : '') + (off ? ' off' : ''),
          (b.nums ? '<span class="c-n">' + (i + 1) + '</span>' : '') + T(t)));
      });
      return w;
    },
    orbit(b) {
      const w = el('div', 'c-orbit');
      w.appendChild(el('div', 'c-ring'));
      w.appendChild(el('div', 'c-center', T(b.orbit.center)));
      const n = b.orbit.nodes.length;
      b.orbit.nodes.forEach((t, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const d = el('div', 'c-sat' + (t === 'AI' ? ' ai' : ''), t === 'AI' ? 'AI' : '👤');
        d.style.left = (50 + 42 * Math.cos(a)) + '%';
        d.style.top = (50 + 42 * Math.sin(a)) + '%';
        d.title = t;
        w.appendChild(d);
      });
      w.appendChild(el('div', 'c-legend', '<span>👤 Expert</span><span><b>AI</b> Intuit AI</span>'));
      return w;
    },
    levels(b) {
      const w = el('div', 'c-levels');
      b.levels.forEach((x) => w.appendChild(el('div', 'c-lv l' + x.n, '<div class="c-lvn">Level ' + x.n + '</div><div class="c-lvt">' + T(x.t) + '</div>')));
      return w;
    },
    jtbd(b) {
      const w = el('div', 'c-jtbd');
      w.appendChild(el('div', 'c-jr head', '<span>JTBD examples</span><span>Level</span>'));
      b.jtbd.forEach(([t, n]) => w.appendChild(el('div', 'c-jr', '<span>' + T(t) + '</span><span class="lvl l' + n + '">Level ' + n + '</span>')));
      return w;
    },
    system(b) {
      const s = b.system;
      const w = el('div', 'c-sys');
      s.steps.forEach((t, i) => w.appendChild(el('div', 'c-sys-h', '<span class="c-n">' + (i + 1) + '</span>' + T(t))));
      w.appendChild(el('div', 'c-sys-scan',
        '<div class="c-lt">Scan and understand books</div><ul>' + s.scan.map((x) => '<li>' + T(x) + '</li>').join('') + '</ul>' +
        '<div class="c-lt">Evaluate each issue</div><ul>' + s.evaluate.map((x) => '<li>' + T(x) + '</li>').join('') + '</ul>'));
      const routes = el('div', 'c-sys-col');
      const outs = el('div', 'c-sys-col');
      s.routes.forEach((r) => {
        routes.appendChild(el('div', 'c-route l' + r.n, '<span class="c-lvn">Level ' + r.n + '</span>' + T(r.t)));
        outs.appendChild(el('div', 'c-out', '<div class="c-nh">' + T(r.out) + '</div><div class="c-np">' + T(r.sub) + '</div>'));
      });
      w.appendChild(routes); w.appendChild(outs);
      w.appendChild(el('div', 'c-sys-loop', '<span>↺ ' + T(s.loop) + '</span><b>' + T(s.footer) + '</b>'));
      return w;
    },
    media: (b) => media(b.media),
    mediaGrid(b) {
      const w = el('div', 'c-mgrid'); w.style.setProperty('--cols', b.cols || 3);
      b.mediaGrid.forEach((m) => w.appendChild(media(m)));
      return w;
    },
    mediaRow(b) {
      const w = el('div', 'c-mgrid row'); w.style.setProperty('--cols', b.mediaRow.length);
      b.mediaRow.forEach((m) => w.appendChild(media(m)));
      return w;
    },
    gallery(b) {
      const w = el('div', 'c-gallery');
      b.gallery.forEach((m) => w.appendChild(media(m, 'tall')));
      return w;
    },
    chips(b) {
      const w = el('div', 'c-chips');
      b.chips.forEach((t) => w.appendChild(el('span', null, T(t))));
      return w;
    },
    cards(b) {
      const w = el('div', 'c-cards' + (b.mid ? ' mid' : ''));
      T(b.cards).forEach((c) => w.appendChild(el('div', 'c-card', (c.k ? '<div class="c-k" style="color:' + c.color + '">' + T(c.k) + '</div>' : c.color ? '<span class="sq" style="background:' + c.color + '"></span>' : c.icon ? '<div class="c-icon">' + c.icon + '</div>' : '') + (c.h ? '<div class="c-nh">' + T(c.h) + '</div>' : '') + '<div class="c-cp">' + T(c.p) + '</div>')));
      return w;
    },
    pick(b) {
      const w = el('div', 'c-pick');
      b.pick.forEach((t, i) => w.appendChild(el('div', i === b.on ? 'on' : null, T(t))));
      return w;
    },
    risks(b) {
      const r = b.risks;
      const w = el('div', 'c-risks');
      w.appendChild(el('div', 'c-rr head', '<span></span><span>' + T(r.cols[0]) + '</span><span>' + T(r.cols[1]) + '</span>'));
      r.rows.forEach(([a, q, x]) => w.appendChild(el('div', 'c-rr', '<span class="c-rk">' + T(a) + '</span><span>' + T(q) + '</span><span class="bad">' + T(x) + '</span>')));
      return w;
    },
    matrix(b) {
      const m = b.matrix;
      const w = el('div', 'c-matrix'); w.style.setProperty('--cols', m.cols.length);
      w.appendChild(el('div', 'c-mx head', '<span></span>' + m.cols.map((c) => '<span>' + T(c) + '</span>').join('')));
      m.rows.forEach((r) => w.appendChild(el('div', 'c-mx' + (r.strong ? ' strong' : ''),
        '<span class="c-mxh"><b>' + T(r.h) + '</b><small>' + T(r.sub) + '</small></span>' +
        r.cells.map((v) => '<span class="bar v' + String(v).replace('.', '') + '"></span>').join(''))));
      return w;
    },
    branch(b) {
      const x = b.branch;
      const w = el('div', 'c-branch');
      w.appendChild(el('div', 'c-node on', T(x.from)));
      w.appendChild(el('span', 'c-arrow', '→'));
      const to = el('div', 'c-branch-to');
      x.to.forEach((t) => to.appendChild(el('div', 'c-node', T(t))));
      w.appendChild(to);
      if (x.note) w.appendChild(el('div', 'c-branch-note', T(x.note)));
      return w;
    },
    table(b) {
      const x = b.table;
      const w = el('div', 'c-table'); w.style.setProperty('--cols', x.cols.length);
      const cell = (v, i) => '<span class="' + (i === x.hi ? 'hi' : '') + (v === true ? ' yes' : v === false ? ' no' : '') + '">' +
        (v === true ? '✓' : v === false ? '✕' : T(v)) + '</span>';
      if (x.imgs) {
        w.classList.add('has-imgs');
        const r = el('div', 'c-tr imgs', '<span></span>');
        x.imgs.forEach((m) => r.appendChild(media(m, 'contain')));
        w.appendChild(r);
      }
      w.appendChild(el('div', 'c-tr head', '<span></span>' + x.cols.map((c, i) => cell(c, i)).join('')));
      x.rows.forEach((r) => w.appendChild(el('div', 'c-tr', '<span class="c-trh">' + T(r.h) + '</span>' + r.cells.map(cell).join(''))));
      return w;
    },
    journey(b) {
      const w = el('div', 'c-journey'); w.style.setProperty('--cols', b.journey.length);
      b.journey.forEach((x) => {
        const on = (x.on || []).includes(lens);
        w.appendChild(el('div', 'c-stop' + (x.side ? ' side' : '') + (on ? ' on' : ''),
          '<div class="c-when">' + T(x.when) + '</div><div class="c-nh">' + T(x.h) + '</div><div class="c-np">' + T(x.p) + '</div>' +
          (x.at ? '<div class="c-at">' + T(x.at) + '</div>' : '')));
      });
      return w;
    },
    // A big map with a few callouts pinned on it. x/y are % of the image; up/down picks the card side.
    pins(b) {
      const x = b.pins;
      const w = el('div', 'c-pins');
      const map = el('div', 'c-pins-map');
      const img = el('img'); img.src = x.src; img.alt = T(x.alt || '');
      map.appendChild(img);
      x.at.forEach((p) => {
        const d = el('div', 'c-pin ' + (p.up ? 'up' : 'down'),
          '<i></i><b></b><div class="c-pin-card"><div class="c-nh">' + T(p.h) + '</div><div class="c-np">' + T(p.p) + '</div></div>');
        d.style.left = p.x + '%'; d.style.top = p.y + '%';
        map.appendChild(d);
      });
      w.appendChild(map);
      return w;
    },
    swap(b) {
      const x = b.swap;
      const w = el('div', 'c-swap');
      w.appendChild(el('div', 'c-sw head', '<span>' + T(x.cols[0]) + '</span><span></span><span>' + T(x.cols[1]) + '</span>'));
      x.rows.forEach(([a, c]) => w.appendChild(el('div', 'c-sw', '<span class="was">' + T(a) + '</span><span class="c-arrow">→</span><span>' + T(c) + '</span>')));
      return w;
    }
  };

  function blocks(list, parent) {
    (list || []).forEach((b) => {
      const kind = Object.keys(B).find((k) => k in b);
      if (kind) add(parent, B[kind](b));
    });
    return parent;
  }

  const LAYOUT = {
    statement(s, n) {
      n.classList.add('l-statement');
      n.appendChild(el('div', 'c-dots', '<span></span><span></span><span></span>'));
      n.appendChild(el('h2', 'c-statement', T(s.text)));
      if (s.sub) n.appendChild(el('p', 'c-p', T(s.sub)));
    },
    values(s, n) {
      n.classList.add('l-values');
      const head = el('div', 'c-vhead');
      if (s.h) head.appendChild(el('h2', 'c-h', T(s.h)));
      if (s.p) head.appendChild(el('p', 'c-p', T(s.p)));
      if (s.h || s.p) n.appendChild(head);
      const w = el('div', 'c-values');
      s.items.forEach((v) => {
        const d = el('div', 'c-value', '<span class="sq"></span><div class="c-vn">' + T(v.name) + '</div>' + (v.text ? '<div class="c-np">' + T(v.text) + '</div>' : ''));
        d.querySelector('.sq').style.background = v.color;
        w.appendChild(d);
      });
      n.appendChild(w);
    },
    title(s, n) {
      n.classList.add('l-title', s.media.length > 1 || s.wide ? 'stacked' : 'side');
      if (s.wide) n.classList.add('wide');
      const t = el('div', 'c-title-text', '<h1 class="c-th">' + T(s.h) + '</h1><p class="c-ts">' + T(s.sub) + '</p>');
      n.appendChild(t);
      const m = el('div', 'c-title-media');
      s.media.forEach((x) => m.appendChild(media(x)));
      if (s.checklist) {
        const c = el('div', 'c-check');
        c.appendChild(el('div', 'c-check-k', T(s.h)));
        s.checklist.forEach(([t, done]) => c.appendChild(el('div', 'c-ci' + (done ? ' done' : ''), '<span></span>' + T(t))));
        m.appendChild(c);
      }
      n.appendChild(m);
    },
    split(s, n) {
      n.classList.add('l-split');
      n.style.setProperty('--left', (s.ratio || 42) + '%');
      if (s.top) n.classList.add('top');
      const L = blocks(s.left, el('div', 'c-col left' + (s.leftTheme ? ' themed' : '') + (s.zone === 'left' ? ' zone' : '')));
      const onlyFill = s.right.length === 1 && s.right[0].media && s.right[0].media.fill;
      const R = blocks(s.right, el('div', 'c-col right' + (onlyFill ? ' fill' : '') + (s.zone === 'right' ? ' zone' : '')));
      n.appendChild(L); n.appendChild(R);
    },
    full(s, n) {
      n.classList.add('l-full');
      if (s.center) n.classList.add('center');
      blocks(s.blocks, n);
    }
  };

  window.renderSlide = function (s, viewerLens) {
    lens = viewerLens || 'all';
    const n = el('div', 'slide cs theme-' + (s.project.theme || 'site'));
    (LAYOUT[s.layout] || LAYOUT.full)(s, n);
    return n;
  };
})();

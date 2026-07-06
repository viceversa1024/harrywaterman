/* O*NET for AI R&D tracker — vanilla JS, no deps */

const CAT_COLORS = ['#009af1', '#e62c11', '#00a5a6', '#6a3ecb', '#ea8d00', '#1d7a22']; // validated fixed order
let DATA = null;
let view = 'current';
const expanded = new Set();

const $ = (sel, el = document) => el.querySelector(sel);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

fetch('data/taxonomy.json')
  .then(r => r.json())
  .then(d => { DATA = d; init(); })
  .catch(e => { $('#app').textContent = 'Failed to load data/taxonomy.json — ' + e; });

function init() {
  renderRubric();
  document.querySelectorAll('.view-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      view = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn);
      });
      render();
    }));
  $('#foot').innerHTML =
    `${snapshots().length} snapshot${snapshots().length === 1 ? '' : 's'} · latest ${esc(latestDate())} · data: data/taxonomy.json`;
  render();
}

/* ---------- data helpers ---------- */

function latest(task) { return task.ratings[task.ratings.length - 1]; }
function latestDate() { return snapshots()[snapshots().length - 1] || ''; }

function snapshots() {
  const set = new Set();
  for (const c of DATA.categories)
    for (const s of c.subcategories)
      for (const t of s.tasks)
        for (const r of t.ratings) set.add(r.date);
  return [...set].sort();
}

function ratingAt(task, date) {
  let val = null;
  for (const r of task.ratings) if (r.date <= date) val = r.rating;
  return val;
}

function meanAt(tasks, date) {
  const vals = tasks.map(t => ratingAt(t, date)).filter(v => v !== null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function catTasks(cat) { return cat.subcategories.flatMap(s => s.tasks); }

/* ---------- rubric ---------- */

function renderRubric() {
  const ex = DATA.rubricExample;
  $('#rubric-body').innerHTML =
    `<p style="margin-top:8px;color:var(--charcoal-700)">${esc(DATA.meta.ratingNote)}</p>` +
    DATA.rubric.map(r =>
      `<div class="rubric-row">${chip(r.level)}<span><b>${esc(r.name)}</b></span><span class="desc">${esc(r.desc)}</span></div>`
    ).join('') +
    `<div class="rubric-example"><p>${esc(ex.intro)}</p>` +
    Object.entries(ex.levels).map(([l, txt]) => `<p><span class="lvl">${l}</span> — ${esc(txt)}</p>`).join('') +
    `</div>`;
}

function chip(rating, display, extraClass = '') {
  const cls = 'r' + Math.round(rating);
  const label = display || (Number.isInteger(rating) ? rating : rating.toFixed(1));
  const name = DATA.rubric[Math.round(rating)]?.name || '';
  return `<span class="chip ${cls} ${extraClass}" data-tip="${rating} — ${esc(name)}">${label}</span>`;
}

/* ---------- current view ---------- */

function render() {
  $('#app').innerHTML = view === 'current' ? renderCurrent() : renderTimeline();
  if (view === 'current') bindRows();
  bindTooltips();
}

function renderCurrent() {
  return DATA.categories.map(cat => {
    const mean = meanAt(catTasks(cat), latestDate());
    return `<section class="category">
      <div class="cat-head">
        <span class="num">${cat.id}</span><h2>${esc(cat.name)}</h2>
        <span class="blurb">${esc(cat.blurb)}</span>
        <span class="chip mean" data-tip="mean of ${catTasks(cat).length} tasks">${mean.toFixed(1)}</span>
      </div>
      ${cat.note ? `<p class="cat-note">${esc(cat.note)}</p>` : ''}
      ${cat.subcategories.map(renderSubcat).join('')}
    </section>`;
  }).join('');
}

function renderSubcat(sub) {
  return `<div class="subcat">
    <div class="subcat-head">
      <span class="num">${sub.id}</span><h3>${esc(sub.name)}</h3>
      <span class="desc">— ${esc(sub.desc)}</span>
    </div>
    <table><tbody>
      ${sub.tasks.map(t => {
        const r = latest(t);
        return `<tr class="task" data-id="${t.id}" tabindex="0" aria-expanded="${expanded.has(t.id)}">
          <td class="tid">${t.id}</td>
          <td class="tname">${esc(t.name)}</td>
          <td class="trating">${chip(r.rating, r.display)}</td>
        </tr>
        ${expanded.has(t.id) ? renderDetail(t, sub) : ''}`;
      }).join('')}
    </tbody></table>
  </div>`;
}

function renderDetail(t, sub) {
  const history = t.ratings.slice().reverse().map(r =>
    `<div class="history-row">
      <span class="date">${esc(r.date)}</span>${chip(r.rating, r.display)}
      <span class="src">${esc(r.source || '')}</span>
      ${r.rationale ? `<span class="rationale">${esc(r.rationale)}</span>` : ''}
    </div>
    ${(r.evidence || []).map(e =>
      `<div class="history-row evidence">${e.url ? `<a href="${esc(e.url)}">${esc(e.note || e.url)}</a>` : esc(e.note)}</div>`
    ).join('')}`
  ).join('');
  return `<tr class="detail"><td colspan="3"><div class="detail-box">
    <div>${esc(t.example)}</div>
    <div class="io"><b>Inputs</b> ${esc(sub.inputs)} · <b>Outputs</b> ${esc(sub.outputs)}</div>
    <div class="history">${history}</div>
  </div></td></tr>`;
}

function bindRows() {
  document.querySelectorAll('tr.task').forEach(row => {
    const toggle = () => {
      const id = row.dataset.id;
      expanded.has(id) ? expanded.delete(id) : expanded.add(id);
      render();
    };
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
}

/* ---------- timeline view ---------- */

function renderTimeline() {
  const dates = snapshots();
  const note = dates.length === 1 ? `1 snapshot (${dates[0]}) — historical backfill pending` : `${dates.length} snapshots`;
  const legend = DATA.categories.map((c, i) =>
    `<span><span class="key" style="background:${CAT_COLORS[i]}"></span>${c.id} ${esc(c.name)}</span>`).join('');
  return `<div class="chart-block">
      <h2>Category means over time</h2>
      <p class="chart-note">${esc(note)}</p>
      <div class="legend">${legend}</div>
      ${lineChart(dates, DATA.categories.map((c, i) => ({
        label: `${c.id} ${c.name}`,
        color: CAT_COLORS[i],
        values: dates.map(d => meanAt(catTasks(c), d)),
      })), 920, 300)}
    </div>
    <div class="chart-block">
      <h2>Subcategory means</h2>
      <div class="small-multiples">
        ${DATA.categories.flatMap((c, i) => c.subcategories.map(s =>
          `<div class="sm-cell">
            <div class="sm-title"><span class="num">${s.id}</span> ${esc(s.name)}</div>
            ${lineChart(dates, [{
              label: s.id, color: CAT_COLORS[i],
              values: dates.map(d => meanAt(s.tasks, d)),
            }], 210, 80, true)}
          </div>`)).join('')}
      </div>
    </div>`;
}

function lineChart(dates, series, w, h, mini = false) {
  const pad = mini ? { t: 6, r: 8, b: 16, l: 22 } : { t: 10, r: 16, b: 24, l: 30 };
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const x = i => pad.l + (dates.length === 1 ? iw / 2 : (i / (dates.length - 1)) * iw);
  const y = v => pad.t + ih - (v / 5) * ih;

  const yTicks = mini ? [0, 5] : [0, 1, 2, 3, 4, 5];
  const grid = yTicks.map(v =>
    `<line class="gridline" x1="${pad.l}" y1="${y(v)}" x2="${w - pad.r}" y2="${y(v)}"/>
     <text x="${pad.l - 6}" y="${y(v) + 3.5}" text-anchor="end">${v}</text>`).join('');

  const xLabels = dates.map((d, i) => {
    if (mini && dates.length > 3 && i % 2 === 1) return '';
    const anchor = i === 0 ? 'start' : i === dates.length - 1 ? 'end' : 'middle';
    const lx = dates.length === 1 ? x(i) : (i === 0 ? pad.l : i === dates.length - 1 ? w - pad.r : x(i));
    return `<text x="${lx}" y="${h - 6}" text-anchor="${dates.length === 1 ? 'middle' : anchor}">${d}</text>`;
  }).join('');

  const marks = series.map(s => {
    const pts = s.values.map((v, i) => v === null ? null : [x(i), y(v), v, i]).filter(Boolean);
    // step line between snapshots
    let path = '';
    if (pts.length > 1) {
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let k = 1; k < pts.length; k++) d += ` H${pts[k][0]} V${pts[k][1]}`;
      path = `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2"/>`;
    }
    const dots = pts.map(([px, py, v, i]) =>
      `<circle cx="${px}" cy="${py}" r="${mini ? 3 : 4}" fill="${s.color}" stroke="#fff" stroke-width="2"
        data-tip="${esc(s.label)} · ${dates[i]} · ${v.toFixed(1)}"/>`).join('');
    return path + dots;
  }).join('');

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="max-width:100%">
    <g class="axis">${grid}</g>${xLabels}${marks}</svg>`;
}

/* ---------- tooltip ---------- */

function bindTooltips() {
  const tip = $('#tooltip');
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.addEventListener('mouseenter', () => { tip.textContent = el.dataset.tip; tip.hidden = false; });
    el.addEventListener('mousemove', e => {
      tip.style.left = Math.min(e.clientX + 12, window.innerWidth - tip.offsetWidth - 8) + 'px';
      tip.style.top = (e.clientY + 14) + 'px';
    });
    el.addEventListener('mouseleave', () => { tip.hidden = true; });
  });
}

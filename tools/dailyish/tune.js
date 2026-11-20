/* Dailyish: tuning. Quick questions whose answers change the plan right away,
   with no AI. Each tuner is a pure function: (plan, answer, ctx) → new plan.
   diffPlans() describes any change (tuner, AI or manual) in plain language. */
'use strict';

const clone = (o) => JSON.parse(JSON.stringify(o));
const stripEasy = (s) => String(s || '').replace(/\s*\(Easy to change\.?\)\s*$/i, '');
const clampInt = (n, lo, hi) => Math.min(hi, Math.max(lo, Math.round(n)));

function retrigger(trigger, anchor) {
  const t = stripEasy(trigger);
  const i = t.indexOf(',');
  const rest = i >= 0 ? t.slice(i + 1).trim() : 'I open today\'s card.';
  return `${anchor}, ${rest}`.slice(0, 200);
}
function setCompassLine(compass, label, text) {
  const lines = String(compass || '').split('\n').filter(l => l.trim());
  const re = new RegExp('^' + label + ':', 'i');
  const line = `${label}: ${text}`;
  const i = lines.findIndex(l => re.test(l));
  if (i >= 0) lines[i] = line; else if (label === 'WHY') lines.unshift(line); else lines.push(line);
  return lines.join('\n').slice(0, 3000);
}
function addIfThen(p, rule) {
  const list = (p.ritual.if_then || []).filter(r => r.if.toLowerCase() !== rule.if.toLowerCase());
  list.unshift(rule);
  p.ritual.if_then = list.slice(0, 8);
}
const controllableMeasures = (p) => p.lanes.flatMap(l => l.measures.filter(m => !m.outcome));
function scaleTargets(p, base, f) {
  for (const m of controllableMeasures(p)) {
    const b = base[m.key] != null ? base[m.key] : m.target_per_week;
    if (b === 0) continue;
    m.target_per_week = m.count === 'days' ? clampInt(b * f, 1, 7) : clampInt(b * f, 1, 50);
  }
}

/* type: 'choice' (one tap) or 'text'. ask() may tailor the wording to the plan. */
const TUNERS = [
  { id: 'when', type: 'choice', q: 'When is your most reliable time of day?',
    choices: [
      ['Early morning', 'After my morning drink'], ['Lunchtime', 'After lunch'],
      ['After work', 'When I get home from work'], ['Evening', 'After dinner'], ['Before bed', 'When I get into bed'],
    ],
    apply(p, anchor) {
      const old = stripEasy(p.ritual.trigger);
      p.ritual.trigger = retrigger(p.ritual.trigger, anchor);
      if (p.compass && old) p.compass = p.compass.split(old).join(p.ritual.trigger);
      return p;
    } },
  { id: 'dose', type: 'choice', q: 'On a normal day, how much time can this really get?',
    choices: [['5 minutes', 0.6], ['15 minutes', 0.8], ['30 minutes', 1], ['An hour or more', 1.25]],
    apply(p, f, ctx) { scaleTargets(p, ctx.base, f); return p; } },
  { id: 'stop', type: 'choice', q: 'What usually makes you stop?',
    choices: [
      ['Missing a day, then guilt', 'guilt'], ['Life gets busy', 'busy'], ['Getting bored', 'bored'],
      ['Starting too big', 'big'], ['Losing sight of why', 'why'],
    ],
    apply(p, k) {
      const R = {
        guilt: [{ if: 'I miss a day', then: 'today is a minimum day; one miss is normal, only avoid missing twice' }, 'consistency', 'A missed day turns into quitting.'],
        busy: [{ if: 'the week gets busy', then: 'minimum day only, and it still counts' }, 'time', 'Busy weeks push it out.'],
        bored: [{ if: 'it starts to feel boring', then: 'change one thing: the place, the format, or a small new challenge' }, 'other', 'Boredom.'],
        big: [{ if: 'I feel like doing more', then: 'stop while it still feels easy and save it for tomorrow' }, 'energy', 'Starting too big, then burning out.'],
        why: [{ if: 'I wonder why I bother', then: 'read my why on the Plan page, then do the minimum day' }, 'direction', 'Losing sight of why.'],
      }[k];
      addIfThen(p, R[0]);
      p.blocker = { type: R[1], note: R[2] };
      if (k === 'big') for (const m of controllableMeasures(p)) if (m.target_per_week > 1) m.target_per_week = Math.max(1, Math.round(m.target_per_week * 0.75));
      return p;
    } },
  { id: 'why', type: 'text', q: 'Why does this matter to you? One sentence.', placeholder: 'e.g. I want energy for my kids in the evening',
    apply(p, text) { p.why = text.slice(0, 600); p.compass = setCompassLine(p.compass, 'WHY', text.slice(0, 300)); return p; } },
  { id: 'minimum', type: 'text', q: 'On your worst day, what is the smallest version you would still do?', placeholder: (p) => p.ritual.minimum_day,
    apply(p, text) { p.ritual.minimum_day = text.slice(0, 200); return p; } },
  { id: 'helps', type: 'text', q: 'When did you last stick with something for a month or more, and what made it work?', placeholder: 'e.g. running with a friend: someone was waiting for me',
    apply(p, text) {
      p.stickiness = Object.assign({}, p.stickiness);
      p.stickiness.helps = [text.slice(0, 200), ...(p.stickiness.helps || [])].slice(0, 12);
      p.compass = setCompassLine(p.compass, 'WHAT HELPS ME', text.slice(0, 300));
      return p;
    } },
];

/** Applies one tuner to a copy of the plan. ctx.base = original weekly targets by measure key. */
function applyTuner(plan, id, answer, ctx) {
  const t = TUNERS.find(x => x.id === id);
  if (!t) throw new Error('Unknown question');
  const p = clone(plan);
  t.apply(p, answer, ctx || { base: {} });
  return p;
}

/** Plain-language list of what changed between two plans. */
function diffPlans(a, b) {
  const out = [];
  const q = (s) => `“${String(s).length > 90 ? String(s).slice(0, 89) + '…' : s}”`;
  const field = (label, x, y) => { if ((x || '') !== (y || '')) out.push(y ? (x ? `${label}: ${q(x)} → ${q(y)}` : `${label}: added ${q(y)}`) : `${label}: removed`); };
  const ga = a.goal || {}, gb = b.goal || {};
  field('Goal', ga.statement, gb.statement);
  field('Near target', ga.near_target, gb.near_target);
  field('Bigger marker', ga.marker, gb.marker);
  if (ga.horizon_months !== gb.horizon_months) out.push(`Horizon: ${ga.horizon_months} → ${gb.horizon_months} months`);
  field('Path', (a.path || {}).primary, (b.path || {}).primary);
  field('Fallback', (a.path || {}).fallback, (b.path || {}).fallback);
  const blk = (x) => x && x.type ? `${x.type}${x.note ? ': ' + x.note : ''}` : '';
  field('What gets in the way', blk(a.blocker), blk(b.blocker));
  field('Title', (a.meta || {}).title, (b.meta || {}).title);
  field('Keep if nothing else', a.surviving_habit, b.surviving_habit);
  field('Cue', stripEasy(a.ritual.trigger), stripEasy(b.ritual.trigger));
  field('Minimum day', a.ritual.minimum_day, b.ritual.minimum_day);
  field('Warm-up', a.ritual.warmup, b.ritual.warmup);
  field('Why', a.why, b.why);
  field('First action', a.first_action && a.first_action.text, b.first_action && b.first_action.text);
  const ma = new Map(a.lanes.flatMap(l => l.measures.map(m => [m.key, m])));
  const mb = new Map(b.lanes.flatMap(l => l.measures.map(m => [m.key, m])));
  const unit = (m, n) => m.count === 'days' ? `${n} day${n === 1 ? '' : 's'}` : `${n}×`;
  for (const [k, m] of mb) {
    const o = ma.get(k);
    if (!o) out.push(`New measure: ${m.label}${m.outcome ? '' : `, ${unit(m, m.target_per_week)} a week`}`);
    else {
      if (o.target_per_week !== m.target_per_week && !m.outcome) out.push(`${m.label}: ${unit(o, o.target_per_week)} → ${unit(m, m.target_per_week)} a week`);
      if (o.label !== m.label) out.push(`Renamed: ${q(o.label)} → ${q(m.label)}`);
    }
  }
  for (const [k, m] of ma) if (!mb.has(k)) out.push(`Removed measure: ${m.label}`);
  const la = new Map(a.lanes.map(l => [l.key, l])), lb = new Map(b.lanes.map(l => [l.key, l]));
  for (const [k, l] of lb) { if (!la.has(k)) out.push(`New lane: ${l.name}`); else if (la.get(k).name !== l.name) out.push(`Lane renamed: ${la.get(k).name} → ${l.name}`); }
  for (const [k, l] of la) if (!lb.has(k)) out.push(`Removed lane: ${l.name}`);
  if (a.ritual.weekly_win.min_hits !== b.ritual.weekly_win.min_hits) out.push(`Weekly win: ${a.ritual.weekly_win.min_hits} → ${b.ritual.weekly_win.min_hits} targets`);
  const ifs = new Set((a.ritual.if_then || []).map(r => r.if + '|' + r.then));
  for (const r of b.ritual.if_then || []) if (!ifs.has(r.if + '|' + r.then)) out.push(`New rule: if ${r.if}, ${r.then}`);
  const cpa = JSON.stringify(a.checkpoints || []), cpb = JSON.stringify(b.checkpoints || []);
  if (cpa !== cpb) out.push('Check-ins adjusted');
  const stickChanged = JSON.stringify(a.stickiness || {}) !== JSON.stringify(b.stickiness || {});
  if ((a.compass || '') !== (b.compass || '') && !stickChanged && !out.some(l => l.startsWith('Why') || l.startsWith('Cue'))) out.push('Compass updated');
  if (stickChanged) {
    const sa = a.stickiness || {}, sb = b.stickiness || {};
    const added = (k) => (sb[k] || []).filter(x => !(sa[k] || []).includes(x));
    for (const x of added('helps')) out.push(`What helps you stick: ${q(x)}`);
    for (const x of added('kills')) out.push(`What stops you: ${q(x)}`);
    for (const x of added('constraints')) out.push(`Constraint: ${q(x)}`);
    if (!added('helps').length && !added('kills').length && !added('constraints').length) out.push('Noted your history with this');
  }
  if (JSON.stringify((a.path || {}).guardrails || []) !== JSON.stringify((b.path || {}).guardrails || [])) for (const g of ((b.path || {}).guardrails || []).filter(x => !((a.path || {}).guardrails || []).includes(x))) out.push(`Guardrail: ${q(g)}`);
  return out;
}

if (typeof module !== 'undefined') module.exports = { TUNERS, applyTuner, diffPlans, retrigger };

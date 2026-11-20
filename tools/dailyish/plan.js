/* Dailyish: plan validation + normalisation (no dependencies).
   validate() implements the JSON Schema keywords plan.schema.json uses, plus
   semantic checks the schema can't express. normalise() repairs common AI slips
   (fractions, out-of-range numbers, long strings, stray fields) BEFORE validation. */
'use strict';

function resolveRef(root, ref) {
  return ref.replace(/^#\//, '').split('/').reduce((o, k) => o[k], root);
}
function typeOk(v, t) {
  if (t === 'integer') return Number.isInteger(v);
  if (t === 'number') return typeof v === 'number' && isFinite(v);
  if (t === 'array') return Array.isArray(v);
  if (t === 'object') return v !== null && typeof v === 'object' && !Array.isArray(v);
  return typeof v === t;
}

/** Returns a list of "path: problem" strings; empty means valid. */
function validateSchema(root, schema, v, path = '$', errs = []) {
  if (schema.$ref) return validateSchema(root, resolveRef(root, schema.$ref), v, path, errs);
  if ('const' in schema && v !== schema.const) errs.push(`${path}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(v)) errs.push(`${path}: must be one of ${schema.enum.join(', ')}`);
  if (schema.type && !typeOk(v, schema.type)) { errs.push(`${path}: must be ${schema.type}`); return errs; }
  if (typeof v === 'string') {
    if (schema.minLength != null && v.length < schema.minLength) errs.push(`${path}: too short`);
    if (schema.maxLength != null && v.length > schema.maxLength) errs.push(`${path}: longer than ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(v)) errs.push(`${path}: bad format`);
  }
  if (typeof v === 'number') {
    if (schema.minimum != null && v < schema.minimum) errs.push(`${path}: below ${schema.minimum}`);
    if (schema.maximum != null && v > schema.maximum) errs.push(`${path}: above ${schema.maximum}`);
  }
  if (Array.isArray(v)) {
    if (schema.minItems != null && v.length < schema.minItems) errs.push(`${path}: needs at least ${schema.minItems}`);
    if (schema.maxItems != null && v.length > schema.maxItems) errs.push(`${path}: at most ${schema.maxItems}`);
    if (schema.uniqueItems && new Set(v.map(x => JSON.stringify(x))).size !== v.length) errs.push(`${path}: duplicates`);
    if (schema.items) v.forEach((x, i) => validateSchema(root, schema.items, x, `${path}[${i}]`, errs));
  }
  if (typeOk(v, 'object')) {
    for (const k of schema.required || []) if (!(k in v)) errs.push(`${path}: missing ${k}`);
    const props = schema.properties || {};
    for (const [k, x] of Object.entries(v)) {
      if (props[k]) validateSchema(root, props[k], x, `${path}.${k}`, errs);
      else if (schema.additionalProperties === false) errs.push(`${path}: unknown field ${k}`);
      else if (typeof schema.additionalProperties === 'object') validateSchema(root, schema.additionalProperties, x, `${path}.${k}`, errs);
    }
  }
  return errs;
}

function semanticErrors(p) {
  const errs = [];
  if (!p || !Array.isArray(p.lanes)) return errs;
  const laneKeys = p.lanes.map(l => l.key);
  if (new Set(laneKeys).size !== laneKeys.length) errs.push('lanes: duplicate lane keys');
  const mKeys = p.lanes.flatMap(l => (l.measures || []).map(m => m.key));
  if (new Set(mKeys).size !== mKeys.length) errs.push('measures: duplicate measure keys');
  const controllable = p.lanes.flatMap(l => (l.measures || []).filter(m => !m.outcome)).length;
  if (controllable === 0) errs.push('measures: at least one must be something you control (not an outcome)');
  const mh = p.ritual && p.ritual.weekly_win && p.ritual.weekly_win.min_hits;
  if (mh != null && mh > controllable) errs.push(`ritual.weekly_win.min_hits: ${mh} is more than the ${controllable} measures you control`);
  for (const [i, c] of (p.checkpoints || []).entries())
    for (const k of Object.keys(c.keep_going_if || {}))
      if (k !== 'weekly_wins' && !mKeys.includes(k)) errs.push(`checkpoints[${i}].keep_going_if: unknown measure ${k}`);
  return errs;
}

function validatePlan(schema, p) {
  const errs = validateSchema(schema, schema, p);
  return errs.length ? errs : semanticErrors(p);
}

/* ---------- normalise ---------- */
const ZW = /[​-‏‪-‮⁠-⁤﻿]/g;
function slug(s) {
  let k = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (!/^[a-z]/.test(k)) k = 'm_' + k;
  return k.slice(0, 24).replace(/_+$/, '') || 'measure';
}

/** Schema-driven repair: drops unknown fields, truncates strings, clamps numbers, trims arrays. */
function coerce(root, schema, v) {
  if (schema.$ref) return coerce(root, resolveRef(root, schema.$ref), v);
  if (schema.type === 'string' && typeof v === 'string') {
    v = v.replace(ZW, '');
    return schema.maxLength && v.length > schema.maxLength ? v.slice(0, schema.maxLength - 1) + '…' : v;
  }
  if ((schema.type === 'integer' || schema.type === 'number') && v !== null && v !== '' && !isNaN(+v)) {
    v = +v;
    if (schema.type === 'integer') v = Math.round(v);
    if (schema.minimum != null) v = Math.max(schema.minimum, v);
    if (schema.maximum != null) v = Math.min(schema.maximum, v);
    return v;
  }
  if (schema.type === 'boolean' && typeof v === 'string') return v === 'true';
  if (schema.type === 'array' && Array.isArray(v)) {
    let a = v.filter(x => x !== null && x !== undefined && x !== '');
    if (schema.items) a = a.map(x => coerce(root, schema.items, x));
    if (schema.uniqueItems) a = [...new Map(a.map(x => [JSON.stringify(x), x])).values()];
    return schema.maxItems ? a.slice(0, schema.maxItems) : a;
  }
  if (schema.type === 'array' && typeof v === 'string' && schema.items && (schema.items.type === 'string' || schema.items.$ref)) {
    return coerce(root, schema, [v]);
  }
  if (schema.type === 'object' && typeOk(v, 'object')) {
    const out = {}, props = schema.properties || {};
    for (const [k, x] of Object.entries(v)) {
      if (x === null || x === undefined) continue;
      if (props[k]) {
        const s = props[k].$ref ? resolveRef(root, props[k].$ref) : props[k];
        if (s.enum && !s.enum.includes(x) && !(schema.required || []).includes(k)) continue; // drop bad optional enum
        if (typeof x === 'string' && x.trim() === '' && !(schema.required || []).includes(k) && s.type === 'string') continue;
        out[k] = coerce(root, props[k], x);
      } else if (schema.additionalProperties === false) continue;
      else if (typeof schema.additionalProperties === 'object') out[k] = coerce(root, schema.additionalProperties, x);
      else out[k] = x;
    }
    return out;
  }
  return v;
}

function normalisePlan(schema, input, today) {
  let p = JSON.parse(JSON.stringify(input || {}));
  p.schema_version = '1';
  // Lanes: keys, measures, counts.
  const usedLane = new Set(), usedM = new Set(), renamed = {};
  p.lanes = (Array.isArray(p.lanes) ? p.lanes : []).filter(l => l && typeof l === 'object').slice(0, 5).map((l, i) => {
    let key = String(l.key || l.name || '').toUpperCase().replace(/[^A-Z]/g, '').charAt(0);
    if (!key || usedLane.has(key)) key = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].find(c => !usedLane.has(c));
    usedLane.add(key);
    const arch = ['habit', 'project', 'outcome'].includes(l.archetype) ? l.archetype : 'habit';
    const measures = (Array.isArray(l.measures) ? l.measures : []).filter(m => m && typeof m === 'object').slice(0, 4).map(m => {
      let k = slug(m.key || m.label);
      const orig = m.key;
      while (usedM.has(k)) k = (k.slice(0, 21) + '_' + Math.floor(Math.random() * 99));
      usedM.add(k);
      if (orig && orig !== k) renamed[orig] = k;
      const t = Math.round(+m.target_per_week);
      return Object.assign({}, m, {
        key: k, label: String(m.label || k).trim() || k,
        count: m.count === 'days' ? 'days' : 'events',
        target_per_week: isFinite(t) ? Math.min(50, Math.max(0, t)) : (m.outcome ? 0 : 1),
      });
    });
    if (!measures.length) measures.push({ key: slug('done_' + key.toLowerCase()), label: 'Did something', count: 'days', target_per_week: 3 });
    return Object.assign({}, l, { key, name: String(l.name || 'Lane ' + key), archetype: arch, measures });
  });
  if (!p.lanes.length) throw new Error('The plan has no lanes.');
  // Goal / ritual / first action defaults.
  p.goal = typeOk(p.goal, 'object') ? p.goal : { statement: String(p.goal || '') };
  if (!p.goal.statement || String(p.goal.statement).length < 3) p.goal.statement = (p.meta && p.meta.title) || 'My goal';
  p.goal.horizon_months = Math.min(120, Math.max(1, Math.round(+p.goal.horizon_months) || 6));
  const arch = (Array.isArray(p.goal.archetypes) ? p.goal.archetypes : []).filter(a => ['habit', 'project', 'outcome'].includes(a));
  p.goal.archetypes = arch.length ? [...new Set(arch)] : [...new Set(p.lanes.map(l => l.archetype))];
  p.ritual = typeOk(p.ritual, 'object') ? p.ritual : {};
  p.ritual.trigger = p.ritual.trigger || 'After my morning drink, I open today\'s card.';
  p.ritual.minimum_day = p.ritual.minimum_day || 'Two minutes on the first lane';
  const controllable = p.lanes.flatMap(l => l.measures.filter(m => !m.outcome)).length || 1;
  if (!controllable || !p.lanes.some(l => l.measures.some(m => !m.outcome))) p.lanes[0].measures[0].outcome = false;
  const ww = typeOk(p.ritual.weekly_win, 'object') ? p.ritual.weekly_win : {};
  const mh = Math.round(+ww.min_hits);
  ww.min_hits = Math.min(controllable, Math.max(1, isFinite(mh) ? mh : Math.round(controllable * 0.7)));
  p.ritual.weekly_win = ww;
  if (p.ritual.dailyish_days == null) p.ritual.dailyish_days = 4;
  if (typeof p.first_action === 'string') p.first_action = { text: p.first_action };
  if (!typeOk(p.first_action, 'object') || !p.first_action.text) p.first_action = { text: (p.lanes[0].starter_actions || [])[0] || 'Do the minimum day right now' };
  // Checkpoints: remap renamed keys, drop unknown ones.
  if (Array.isArray(p.checkpoints)) {
    p.checkpoints = p.checkpoints.filter(c => c && typeof c === 'object').map(c => {
      const kg = {};
      for (const [k, v] of Object.entries(c.keep_going_if || {})) {
        const key = k === 'weekly_wins' ? k : (renamed[k] || k);
        if ((key === 'weekly_wins' || usedM.has(key)) && isFinite(+v)) kg[key] = Math.max(0, Math.round(+v));
      }
      return Object.assign({}, c, { label: c.label || `Week ${c.after_weeks}`, after_weeks: Math.max(1, Math.round(+c.after_weeks) || 4), keep_going_if: kg });
    });
  }
  // Themes: accept "Monday" etc.
  for (const l of p.lanes) if (typeOk(l.themes, 'object')) {
    const t = {};
    for (const [d, v] of Object.entries(l.themes)) { const k = String(d).toLowerCase().slice(0, 3); if (/^(mon|tue|wed|thu|fri|sat|sun)$/.test(k) && v) t[k] = String(v); }
    l.themes = t;
  }
  p.meta = Object.assign({}, typeOk(p.meta, 'object') ? p.meta : {});
  const dre = /^\d{4}-\d{2}-\d{2}$/;
  if (!dre.test(p.meta.created || '')) p.meta.created = today;
  if (p.meta.updated && !dre.test(p.meta.updated)) delete p.meta.updated;
  if (typeof p.compass !== 'string' && p.compass != null) p.compass = Object.entries(p.compass).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n');
  return coerce(schema, schema, p);
}

/** Pulls the last fenced ```json block (or the outermost {…}) out of an AI reply. */
function extractJson(text) {
  const blocks = [...String(text).matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map(m => m[1]);
  const candidates = blocks.length ? blocks.reverse() : [String(text).slice(String(text).indexOf('{'), String(text).lastIndexOf('}') + 1)];
  for (const c of candidates) { try { return JSON.parse(c); } catch (e) { /* next */ } }
  throw new Error('No readable JSON in the reply.');
}

if (typeof module !== 'undefined') module.exports = { validatePlan, normalisePlan, extractJson, validateSchema, semanticErrors };

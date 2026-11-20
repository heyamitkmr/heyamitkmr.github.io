/* Dailyish service worker: makes the app work offline.
   Network first (so updates arrive at once), falling back to the saved copy when offline.
   Only this site's own files are cached; AI requests to other sites are never touched. */
'use strict';
const CACHE = 'dailyish-v3';
const SHELL = [
  './', 'index.html', 'app.css', 'app.js', 'templates.js', 'plan.js', 'tune.js',
  'manifest.webmanifest', 'privacy.html', 'schema/plan.schema.json',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png', 'library-icon.svg',
  'prompts/rules.md', 'prompts/00-instant.md', 'prompts/00-all-in-one.md',
  'prompts/01-goal.md', 'prompts/02-stickiness.md', 'prompts/03-paths.md', 'prompts/04-lanes.md',
  'prompts/05-ritual.md', 'prompts/06-checkpoints.md', 'prompts/07-first-action.md',
  'prompts/08-tune.md', 'prompts/09-checkin.md', 'prompts/10-progress.md',
  'examples/habit-get-fitter.json', 'examples/project-write-a-book.json', 'examples/outcome-career-transition.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('dailyish-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // AI calls etc. go straight to the network
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(req, { cache: 'no-cache' });
      if (fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
      if (hit) return hit;
      throw err;
    }
  })());
});

# Dailyish

**Plans you can actually stick to. Most days.**

Dailyish turns a goal (getting fitter, finishing a book, changing careers) into a path and a small daily ritual built around *your* history: what made past efforts stick, and what killed them. Then it runs that ritual with about 2 minutes of upkeep a day. Showing up on 4 of 7 days counts. Missed days are normal. Changing the plan is never failure.

> Status: **v1 is live.** Plan format and prompt pack, one-box start, daily runner, tuning, in-app AI planner, offline install and calendar reminders.

**Use it:** https://nextfive.xyz/tools/dailyish/ — no sign-up, works offline once loaded.

**Run it yourself:** serve this folder with any static web server (e.g. `npx serve .` or `python3 -m http.server`) and open it. It needs a web address, not `file://`. More in [`docs/`](docs/): [how it works](docs/how-it-works.md), [AI setup](docs/ai-setup.md), [FAQ](docs/faq.md), and the [privacy page](privacy.html).

## How it works
1. **Type your goal → get a plan. That's it.** One box, one step: Dailyish builds a working ritual immediately (instantly from built-in templates; better in about 15 seconds with AI). It fits you better over time through optional *tune* questions.
2. **Go deeper, if you want:** a short guided conversation:
   - **no AI:** *Fit it to you*: 6 quick questions (when, how much time, what makes you stop, why, your minimum, what helped before). Each answer changes the plan straight away, shows what changed, and can be undone;
   - **AI in the app, one answer at a time:** with AI set up, the plan's own questions take free-text answers and the AI adjusts the plan ([`prompts/08-tune.md`](prompts/08-tune.md));
   - **any chat AI:** paste [`prompts/00-all-in-one.md`](prompts/00-all-in-one.md) into ChatGPT, Claude or Gemini and import the result;
   - **AI in the app:** bring your own key (OpenRouter) or a local model (Ollama / LM Studio). *Plan it in depth* runs the same 7 stages as a chat; each stage ends with a list of proposed changes you accept or keep talking about.
4. **With AI, day to day (optional):** *Tell me how today went* turns one messy line into proposed logs, a note and tomorrow's first steps. *How am I doing?* writes a short, objective progress update from your numbers.
3. **Run:** each day there's a card with one first action per lane, a quick log, a weekly win, a quiet "dailyish" line, and checkpoints that ask "is this helping?".

**Install it, use it offline.** On Android/Chrome/Edge, install it from the browser menu (or the in-app prompt); on iPhone, Safari → Share → Add to Home Screen. After the first visit it works with no connection. *Settings → Reminder* downloads a calendar file: a daily event at your cue time plus your check-in dates, linking back to the app (true push notifications would need a server, so Dailyish uses your calendar instead).

**One goal, or a few.** Most people do best with one. If you want parallel goals (say gardening and running), add up to 4: each gets its own plan, card and history, and a small switcher appears next to the name. Everything else works the same.

Each goal is one portable file, [`plan.json`](schema/plan.schema.json). See the [examples](examples/).

## Principles
- Your past attempts are the best spec for your next plan.
- Count what you control (sessions, sends, words), never outcomes.
- Small defaults; a minimum day for bad days; no streaks.
- Re-planning is a normal monthly step.
- Private by default: runs in your browser, no account, no server. Your AI key (if any) stays on your device and goes only to the provider you pick (OpenRouter is asked not to keep data).

## Repo layout
| Path | What |
|---|---|
| `schema/plan.schema.json` | The plan format (JSON Schema 2020-12) |
| `examples/` | Habit (fitness), project (book), outcome (career transition) |
| `prompts/` | The prompt pack: instant + all-in-one + 7 stages + shared rules |
| `index.html`, `app.js`, `app.css` | The app: one-box start, Today card, Week, Plan (re-plan), Settings |
| `templates.js` | Built-in templates for the instant no-AI plan (fitness, language, instrument, writing, career, study, money, calm, build, reading, sleep, creative, eating + generic) |
| `plan.js` | In-browser validation against the schema + repair of common AI slips |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and installing as an app |
| `tune.js` | The quick tuning questions and a plain-language "what changed" diff |

Static files only, served as-is by GitHub Pages as part of nextfive.xyz; no build step, no secrets.

## Licence
Code: MIT. Prompts and docs: CC BY 4.0. See [LICENSE](LICENSE).

*A NextFive project.*

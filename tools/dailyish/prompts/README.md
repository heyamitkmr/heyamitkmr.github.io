# The Dailyish prompt pack

The same prompts power two ways of planning:

| You have | Use | How |
|---|---|---|
| **Just a goal (default)** | `00-instant.md` | One step: the goal in → a working plan out, no questions. The app runs it automatically (or paste it into any chat AI with your goal at the end). The plan includes 3 `tune_questions` to improve it later. |
| Any chat AI, wanting the deeper version | `00-all-in-one.md` | Copy everything below its line into a new chat, answer the questions, copy the final JSON block, then **Import plan** in Dailyish. |
| An AI key or local model set up in Dailyish | Stages `01`–`07` | The app runs them as a guided chat. Each stage sends `rules.md` + the stage file + the current plan; when the stage is done, the AI returns a small JSON patch that you review and accept. |
| A plan, and one answer to improve it | `08-tune.md` | The app sends `rules.md` + this + your plan + one question and answer; the AI returns the updated plan. |
| AI set up, end of the day | `09-checkin.md` | One messy line about your day → proposed logs, a note and tomorrow's first steps. |
| AI set up, any time | `10-progress.md` | A short, objective progress update from your numbers. |
| No AI at all | — | Use *Fit it to you* in the app: quick questions whose answers change the plan directly. |

## Stages
1. `01-goal`: goal, horizon, near target, why, real blocker, archetypes
2. `02-stickiness`: what helped and what killed past efforts, constraints, rewards (the most important stage)
3. `03-paths`: your own ideas first → credible options → primary / parallel / fallback + guardrails
4. `04-lanes`: 1–4 lanes with measures you control and modest weekly targets
5. `05-ritual`: trigger, warm-up, minimum day, if-then rules, weekly win, dailyish
6. `06-checkpoints`: keep-going / rethink rules, an honest question, the one surviving habit
7. `07-first-action`: one action in the next 10 minutes + a compass summary

## Editing
These are plain Markdown. Fork and edit them freely. The plan format they target is `../schema/plan.schema.json`; the app validates everything the AI returns against it, and ignores anything else.

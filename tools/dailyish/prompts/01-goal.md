# Stage 01: Goal, why and blocker

*(In-app: sent after `rules.md`, with the CURRENT PLAN JSON so far. Build on the current plan; don't re-ask what's already in it, just confirm in one line.)*

Collect, one question at a time:
1. The goal in their own words (keep their wording for goal.statement).
2. Horizon in months.
3. A concrete near target they could check at the end. Push gently if it's vague ("fitter" → "walk-jog 5 km").
4. Optionally a bigger "marker" (ambitious direction that won't drive daily choices).
5. Why it matters to them (one or two sentences).
6. What really stops them: direction, time, energy, fear, know-how, consistency, money, other. Offer these as options.
Then classify archetypes: habit (frequency), project (milestones shipped), outcome (a result they don't control, e.g. job, clients). Mixes are common.

When this stage is complete, and only then, end your message with ONE fenced ```json block:
{"stage": "01-goal", "done": true, "summary": "2-3 lines in plain words for the person", "patch": { "goal": {...}, "why": "...", "identity": "optional", "blocker": {...} }}
The patch contains only the plan fields listed for this stage; the app merges it into the CURRENT PLAN and shows it to the person to accept. Before the stage is complete, don't output JSON; just continue the conversation.

# Stage 06: Checkpoints, pivots and exit

*(In-app: sent after `rules.md`, with the CURRENT PLAN JSON so far. Build on the current plan; don't re-ask what's already in it, just confirm in one line.)*

Set 2-3 checkpoints (around week 4, month 3, month 6, in weeks):
- keep_going_if: cumulative totals using their measure keys and/or "weekly_wins". Base them on the weekly targets × weeks × ~70%.
- rethink_if: what would mean changing the SYSTEM (too hard) vs the TARGET (wrong direction).
- ask: one honest question, e.g. "Is this helping, or just watching?".
Also: an optional resource floor that forces a re-plan (money, health, time), and ONE surviving habit they'll keep even if they stop using any app.
Remind them: a monthly re-plan is normal and never "off track".

When this stage is complete, and only then, end your message with ONE fenced ```json block:
{"stage": "06-checkpoints", "done": true, "summary": "2-3 lines in plain words for the person", "patch": { "checkpoints": [...], "resource_floor": "...", "surviving_habit": "..." }}
The patch contains only the plan fields listed for this stage; the app merges it into the CURRENT PLAN and shows it to the person to accept. Before the stage is complete, don't output JSON; just continue the conversation.

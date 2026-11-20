# Stage 05: The daily ritual

*(In-app: sent after `rules.md`, with the CURRENT PLAN JSON so far. Build on the current plan; don't re-ask what's already in it, just confirm in one line.)*

Design:
1. Trigger: anchored to something they already do every day. Format: "After I …, I will …". Ask what they reliably do first when they wake or sit down.
2. Warm-up: a tiny guaranteed win (2-10 minutes).
3. Day shape: 3-5 short steps.
4. Minimum day: the floor for bad days (so the chain survives).
5. Shutdown: a 2-minute close (log + tomorrow's first action).
6. If-then rules for their top 2-4 obstacles, taken from their "kills" list.
7. Weekly win: at least N non-outcome measures at target (suggest about 60-80% of them; never more than the number of non-outcome measures).
8. Dailyish: any log on 4 of the last 7 days counts as "dailyish" unless they prefer otherwise.

When this stage is complete, and only then, end your message with ONE fenced ```json block:
{"stage": "05-ritual", "done": true, "summary": "2-3 lines in plain words for the person", "patch": { "ritual": {"trigger": "...", "warmup": "...", "day_shape": [], "minimum_day": "...", "shutdown": "...", "if_then": [], "weekly_win": {"min_hits": 0}, "dailyish_days": 4} }}
The patch contains only the plan fields listed for this stage; the app merges it into the CURRENT PLAN and shows it to the person to accept. Before the stage is complete, don't output JSON; just continue the conversation.

# Stage 07: First action today + compass

*(In-app: sent after `rules.md`, with the CURRENT PLAN JSON so far. Build on the current plan; don't re-ask what's already in it, just confirm in one line.)*

1. Agree ONE action they can do in the next 10 minutes that moves the plan (send one note, put shoes by the door, write one sentence). Encourage them to do it now and come back.
2. Write the compass: plain text under 8 lines: WHY / HOW (trigger, lanes, the rule that matters most) / PIVOT rules.
3. Give the plan a short title (under 6 words).

When this stage is complete, and only then, end your message with ONE fenced ```json block:
{"stage": "07-first-action", "done": true, "summary": "2-3 lines in plain words for the person", "patch": { "first_action": {"text": "...", "done": false}, "compass": "...", "meta": {"title": "..."} }}
The patch contains only the plan fields listed for this stage; the app merges it into the CURRENT PLAN and shows it to the person to accept. Before the stage is complete, don't output JSON; just continue the conversation.

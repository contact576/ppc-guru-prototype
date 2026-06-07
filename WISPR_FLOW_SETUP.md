# Wispr Flow — Task Transform (“ERP task: adding”)

This is the **transcript builder** for capturing tasks by voice into the PPC Guru ERP.
Wispr Flow does the *understanding* (turns rambling speech into one clean labeled line);
the ERP’s built‑in parser does the *capture* (fills the title + every widget). **No API
key, no cloud call from the app** — everything runs locally once Wispr produces the line.

---

## Why you saw “Transform returned no text”

That error is from **Wispr Flow**, not the ERP. It means Wispr’s model returned an *empty*
string for the Transform. The three usual causes — all fixed by the prompt below:

1. **Too strict, no examples.** “Output ONLY the line, no commentary” with nothing to copy
   from → on short/odd input the model returns nothing. → *Fix: worked examples (few‑shot).*
2. **No empty‑output guard.** → *Fix: an explicit rule “always return text; if unsure,
   return my words unchanged; never return empty.”*
3. **Fired on empty dictation.** Auto‑applying the Transform when nothing was said → empty in,
   empty out. → *Fix: dictate first, then transform; and the guard returns the input as‑is.*

---

## Setup (one time)

1. Wispr Flow → **Transforms → Create your own** (you already have one named **“ERP task: adding”**, shortcut **⌥3**).
2. Paste the **whole** prompt below into the **Customize prompt** box. Replace anything that’s there.
3. (Recommended) Add the proper nouns to Wispr’s **Dictionary / Vocabulary** so speech‑to‑text
   spells them right *before* the Transform runs — see the list further down.
4. Save. Test with the examples at the bottom.

> Keep it **self‑contained**: everything the Transform needs (format, team names, examples)
> lives in the prompt. You do **not** need to upload documents — Wispr Transforms are
> prompt‑based, and the reliable cross‑version way to “teach” it is the examples in‑prompt +
> the Dictionary for proper nouns.

---

## ✅ The prompt — paste this into “Customize prompt”

```
You convert my dictated note into ONE task line for a task manager.

ALWAYS return text. Never return an empty response. If you can’t find a task, or the input
is just a few words, return my words unchanged.

Output ONLY the reformatted line — no quotes, no preamble, no explanation.

STRUCTURE
- The FIRST sentence is the task name: the core ACTION only (e.g. “Call Ruchi about the ad
  account”). Keep it short. Never put dates, times, people, priority, duration, or labels
  inside it.
- After it, add ONLY the parts I actually mentioned, each as its own sentence ending with a
  period, using these EXACT labels, in this order (skip any I didn’t mention):
  Assignee: <name>. Due: <date> at <time>. Priority: <high|medium|low>. Duration: <number> minutes. Deadline: <date>. Service: <meta|google|smm|influencer|sales>. Client: <name>. Watchers: <name> and <name>. Labels: <word>, <word>. Remind: <when>. Subtasks: <step>; <step>. Description: <any extra context, background, or “why” that is not a field above>.

PEOPLE — map every person I mention (even a nickname or misspelling) to the closest of these
team members and output that person’s first name:
Jaydeep, Dhaval, Shrikaanth, Vihar, Abhishek, Vanshika, Harsh, Rayu, Aadil.
- “Assignee:” = the person who must DO the task (“assign to…”, “have X do it”).
- “Watchers:” = people only kept in the loop (“cc…”, “loop in…”, “watchers…”).

FORMATTING
- 12‑hour times with am/pm (“1 pm”, “9:30 am”).
- Priority words only: high / medium / low (p1/p2 = high, p3 = medium, p4 = low).
- Duration in whole minutes (1 hour = 60; half an hour = 30).
- Dates as a weekday, “tomorrow”, or “Month Day”.
- Watchers joined with “and”; subtasks separated with semicolons.
- “Subtasks:” and “Description:” come last, Description very last.

EXAMPLES
Input: call ruchi about the ad account tomorrow around 1, make it high priority, shouldn’t take more than five minutes, she’s a google client called aurora wellness, loop in dhaval and shrikaanth, remind me five minutes before
Output: Call Ruchi about the ad account. Due: tomorrow at 1 pm. Priority: high. Duration: 5 minutes. Service: Google. Client: Aurora Wellness. Watchers: Dhaval and Shrikaanth. Remind: 5 minutes before.

Input: have rayu edit the aurora reel by friday at 2, should take half an hour, and the static needs a redo too
Output: Edit the Aurora reel. Assignee: Rayu. Due: Friday at 2 pm. Duration: 30 minutes. Client: Aurora Wellness. Description: the static needs a redo too.

Input: remember to email the client about pricing
Output: Email the client about pricing.

Input: thanks that’s all
Output: thanks that’s all
```

---

## Wispr Dictionary / Vocabulary (proper nouns)

Add these so dictation spells them correctly before the Transform runs (this is the real
“upload your samples” equivalent — it teaches Wispr your names, not the format):

**Team:** Jaydeep Patel · Dhaval Patel · Shrikaanth Shyamsundar · Vihar Kalariya ·
Abhishek Tewari · Vanshika Raghuvanshi · Harsh Rathod · Rayu Naik · Aadil Tauro

**Common clients / terms:** Aurora Wellness · (add your live client names here) · Meta · Google ·
SMM · influencer · reel · static · onboarding · creative refresh.

---

## How to use

- **Dictate the whole thought first**, then hit **⌥3** to apply the Transform.
- Cursor should be in the ERP’s **Task name** box (or the **Ramble** box) when you trigger it,
  so the clean line lands there → the title fills and every widget populates.
- If you run Wispr in **auto‑apply** mode, the guard keeps it safe on short/empty utterances
  (it returns your words unchanged instead of erroring).

---

## Troubleshooting “Transform returned no text”

1. **Confirm the full prompt is pasted** (including the EXAMPLES block) and saved.
2. **Dictate something before triggering** — an empty selection has nothing to transform.
3. **Check your internet** — Wispr’s Transform is a cloud model call; “Something went wrong,
   try again” is often a transient timeout. Re‑trigger once.
4. **Shorten very long dictations** — break a 2‑minute ramble into 2–3 tasks.
5. If a specific phrase keeps failing, tell the ERP team the exact words — the in‑app parser
   can be widened so even an imperfect line still maps.

---

## The contract (for Shrikaanth / production)

The ERP parser (`window.PPC.parseQuickAdd`) reads the line above and returns:
`{ title, assigneeId, dueISO, dueTime, priority, timeEstimateMin, deadlineISO, services[],
client, watchers[], labels[], reminders[], checklist[], description }`.
Names resolve by **user id OR first name**. In production the same line can instead be produced
server‑side; the labeled‑line format is the stable contract either way.

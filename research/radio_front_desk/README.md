# Radio Front Desk — transcripts (raw research input)

**What this is.** Transcripts of *Radio Front Desk*, Jane App's official podcast/YouTube
channel featuring real allied-health clinic owners and front-desk staff. This is
primary-source, verbatim industry voice — the richest available material for:
1. `vertical/VERTICAL_BIBLE.md` — owner/front-desk/patient language, pains, objections,
   how they actually talk about phones, no-shows, booking, growth, insurance.
2. `product/MODULE_A_voice.md` — tuning the AI voice-agent script to real front-desk tone
   (replaces the earlier `[PATTERN]`/`[REVIEW-PHRASE]` paraphrases with verbatim language).

Previously this source was 403-blocked to automated fetch; these transcripts fill that gap.

## Drop the export here

- **File:** `radio_front_desk.jsonl` (or `.jsonl.gz` if large)
- **Format:** JSONL (one record per line; all fields kept — title, url, date, transcript)
- Upload via GitHub browser to branch `claude/wonderful-heisenberg-1xz6am`.

## How it's processed (don't paste raw into chat)

Background subagents chunk-read the transcripts and return only structured cruxes
(verbatim language bank + pains/objections), which are folded into the Bible + voice
script. The raw stays here in version control for re-mining.

*Honesty tags in distilled output: `[V]` verbatim quote (with episode), `[E]` synthesis.*

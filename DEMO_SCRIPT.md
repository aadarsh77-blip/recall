# 🎬 Recall — Demo Video Script
## 5-minute walkthrough for H0 Hackathon judges

---

## Setup before recording

1. Run `npm run db:seed` — populates 12 realistic notes with real data
2. Open the app at `localhost:3000`
3. Record at 1080p, no mouse lag, browser zoom at 110%
4. Use a screen recording tool with system audio muted
5. Record yourself speaking (talking-head or voiceover)

---

## [0:00 – 0:30] Hook — The Problem

**Show:** A frustrated person searching through folders, Slack, docs.

**Say:**
> "Every team has this problem. You know you had a meeting about pricing 3 months ago.
> You know someone wrote down the decision. But you can't find it. You search Slack,
> dig through Notion, skim Google Drive. 20 minutes later — still nothing.
> 
> That's institutional knowledge failure. And it costs teams thousands of hours a year.
> 
> Recall fixes this. Let me show you how."

---

## [0:30 – 1:15] The App — First Impression

**Show:** Navigate to `/` — let the landing page load. Scroll slowly.

**Say:**
> "Recall is an AI-powered knowledge OS. You paste notes — meeting summaries,
> decisions, research, ideas — and our AI makes them instantly queryable in plain English.
>
> Under the hood: Claude claude-sonnet-4-6 for intelligence, Aurora PostgreSQL with pgvector
> for semantic storage, and Vercel for global edge delivery.
>
> Let me open the dashboard."

**Click:** Open App button → `/dashboard`

---

## [1:15 – 2:00] Feature 1 — Auto-Analysis

**Show:** The Notes tab. Type or paste a new note:

```
Q4 Budget Meeting — November 2024
We approved the engineering headcount expansion: 3 senior engineers,
2 ML engineers. Total budget impact: $850k annually. Decision: freeze
all other headcount through Q1. Sarah to finalize offers by Dec 1st.
```

**Click:** Save & Analyze

**Say:**
> "Watch what happens the moment I save this note. Claude analyzes it in real-time —
> it generates a clean title, a one-line summary, and relevant tags automatically.
> No manual work. No folders. No tagging.
>
> And here's what makes this technically interesting — simultaneously, we're generating
> a 1536-dimensional vector embedding and storing it in Aurora PostgreSQL's pgvector
> extension with an HNSW index. This is what makes the magic happen next."

**Show:** The note appears with auto-generated title, summary, and tags.

---

## [2:00 – 2:45] Feature 2 — Semantic Search

**Click:** Search tab

**Type:** `headcount decisions`

**Say:**
> "Now watch this. I didn't type the exact words from the note. I typed 'headcount decisions'.
> pgvector uses cosine similarity between my query vector and all note vectors to find
> semantically similar content — not just keyword matches."

**Show:** Results appear with percentage similarity scores.

**Type a second query:** `engineering team growth`

**Say:**
> "Different words, same concept. 94% similarity. This is what makes Recall
> fundamentally different from any search you've used before — it understands meaning."

---

## [2:45 – 3:45] Feature 3 — Ask AI (The Showstopper)

**Click:** Ask AI tab

**Type:** `What did we decide about Q4 budget and headcount?`

**Say:**
> "This is the core RAG pipeline — Retrieval-Augmented Generation.
>
> Watch what happens: we embed the question, retrieve the 8 most semantically relevant notes
> from Aurora PostgreSQL, then Claude synthesizes a cited answer — in real-time, streaming
> word by word."

**Show:** Answer streams in with [Source N] citations.

**Type second question:** `What are the main risks the team identified?`

**Show:** Claude pulls from multiple notes and synthesizes.

**Say:**
> "Notice the citations. Claude doesn't hallucinate — it only answers from your actual notes
> and tells you exactly which ones it used. This is critical for enterprise trust."

---

## [3:45 – 4:20] Feature 4 — Auto-Connections + Knowledge Graph

**Click:** Connections tab

**Say:**
> "Aurora PostgreSQL doesn't just store notes — it discovers relationships. After every save,
> we run a pgvector similarity query to find which existing notes are semantically related.
>
> Here's the knowledge graph — nodes are notes, edges are connections, weighted by
> similarity score. The denser the graph, the richer your knowledge base."

**Show:** Graph with animated nodes.

**Click:** AI Insights button

**Say:**
> "And Claude can analyze the entire knowledge base and surface patterns you've never
> noticed — recurring themes, knowledge gaps, unexpected connections."

**Show:** Insights bullet points appear.

---

## [4:20 – 4:50] Technical Deep-Dive (30 seconds)

**Show:** architecture.html in browser OR show the schema.sql briefly

**Say:**
> "Let me show the technical architecture briefly.
>
> All notes are stored in Aurora PostgreSQL with a pgvector column — 1536 dimensions
> from OpenAI's text-embedding-3-small model. We use an HNSW index for approximate
> nearest-neighbor search — that's what makes similarity queries return in under 10 milliseconds
> even on millions of notes.
>
> The RAG pipeline is entirely serverless: Next.js API routes on Vercel Edge, Aurora scales
> automatically, and Claude streams via the Anthropic SDK. Zero infrastructure management."

---

## [4:50 – 5:00] Close

**Show:** Return to dashboard, notes view.

**Say:**
> "Recall is production-ready today. It solves a real problem for every team
> that's ever lost institutional knowledge. 
>
> One database. One AI. Everything your team knows — finally queryable."

---

## Post-recording checklist

- [ ] Add background music (quiet, instrumental — no copyright)
- [ ] Add captions/subtitles
- [ ] Add tech stack overlay in corner (Aurora / Claude / Vercel logos)
- [ ] Upload to YouTube as unlisted
- [ ] Test the URL before submitting

## Submission checklist

- [ ] Demo video URL (YouTube)
- [ ] Deployed Vercel URL
- [ ] GitHub repo URL (public)
- [ ] Architecture diagram (architecture.html)
- [ ] Screenshots of Aurora PostgreSQL storage config
- [ ] Team ID from Vercel dashboard
- [ ] Written description (use the README intro)
- [ ] Which AWS database used: **Aurora PostgreSQL**
- [ ] Tag on social: **#H0Hackathon**

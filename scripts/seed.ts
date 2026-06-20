/**
 * Seed Script — populates your knowledge base with realistic demo data
 * Run: npm run db:seed
 *
 * This creates 12 realistic notes across different topics so you can
 * immediately demo semantic search, Q&A, and auto-connections.
 */

import 'dotenv/config';
import { Pool } from 'pg';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

// ── Realistic demo notes ─────────────────────────────────────────────
const SEED_NOTES = [
  {
    content: `Q3 Pricing Strategy Meeting — September 12
Attendees: Sarah (CEO), Marcus (Head of Product), Priya (Sales), Dev (Engineering)

We discussed moving from our current per-seat model to a usage-based pricing structure. 
Key decision: We will NOT move to pure usage-based. Instead, we'll introduce a hybrid model:
- Base tier: $49/mo for up to 5 seats
- Growth tier: $149/mo for up to 20 seats + API access
- Enterprise: Custom pricing with SLA

Main concern raised by Priya: Sales cycle becomes longer when pricing is complex. 
Marcus noted that Notion and Linear have shown hybrid models can work if the value 
is clear at each tier. Next steps: Dev to prototype pricing page by Oct 1st.`,
  },
  {
    content: `Aurora PostgreSQL Migration — Technical Notes
Date: October 3rd

Successfully migrated from RDS PostgreSQL to Aurora PostgreSQL cluster.
Key benefits we're already seeing:
- Read replica lag dropped from ~500ms to <10ms
- Storage auto-scaling eliminated manual intervention
- pgvector extension enabled — opening door to semantic search features

Gotchas we hit:
1. Connection string format is different for Aurora clusters (use cluster endpoint for writes, reader endpoint for reads)
2. pgvector requires explicit EXTENSION creation even though it's available
3. HNSW index build takes ~10min on our current 50k row dataset — run during off-peak

TODO: Enable Aurora Serverless v2 for dev environments to cut costs by ~70%.`,
  },
  {
    content: `Customer Churn Analysis — October 2024

Ran analysis on Q3 churned accounts (23 customers, $180k ARR).

Top 3 churn reasons from exit interviews:
1. "Couldn't get team adoption" — 11 customers (48%)
2. "Switched to a competitor with better integrations" — 7 customers (30%)  
3. "Price" — 5 customers (22%)

Interesting finding: 17 of the 23 churned accounts never used our API. 
Accounts that used the API had 91% retention vs 68% for non-API users.

Action items:
- Build Slack integration (top requested — mentioned by 9/23 churned accounts)
- Create "quick wins" onboarding flow to drive adoption in first 14 days
- Identify at-risk accounts using API usage as leading indicator`,
  },
  {
    content: `Product Roadmap — H2 2024 Priorities

After leadership alignment meeting on Oct 8th, we've locked these as must-ships:

P0 (ship by Dec 31):
- Slack integration
- Bulk import (CSV/Notion export)
- Advanced permissions (team roles)

P1 (if capacity allows):
- Mobile app (iOS first)
- API v2 with webhooks
- Custom AI prompts

Explicitly NOT doing this half:
- Self-hosted / on-prem option (too early, too expensive to support)
- Video/audio transcription (too expensive to build properly)

Engineering estimated P0 at 8 weeks if we start immediately. 
Product will own spec for Slack integration — Marcus to have first draft by Oct 15.`,
  },
  {
    content: `Competitor Analysis: Notion AI vs Our AI Features

Evaluated Notion AI, Guru, Confluence, and Coda as part of positioning exercise.

Notion AI:
- Strengths: Huge user base, tight editor integration, good summarization
- Weaknesses: No semantic search, no RAG Q&A over your own content, expensive add-on ($10/user/mo)
- Key gap: Can't ask "what did we decide about X" and get a cited answer

Guru:
- Strengths: Strong enterprise positioning, verification workflows
- Weaknesses: No AI Q&A, feels like a wiki, hard to keep updated
- Key gap: Knowledge gets stale because there's no incentive to update

Our differentiation: The semantic search + Q&A combo is genuinely unique. 
Users can ask questions in plain English and get answers sourced from their own notes.
No competitor does this well today (Oct 2024).`,
  },
  {
    content: `Onboarding Funnel Analysis — Week of Oct 7

Analyzed signup-to-activation funnel. Data from 340 signups in past 30 days.

Drop-off points:
- Signup → First note: 71% complete (good)
- First note → 5 notes: 38% complete (bad — huge drop)  
- 5 notes → Used search: 22% complete (critical gap)
- Used search → Paid: 64% complete (good — search drives conversion)

Key insight: Users who add 5+ notes in the first week convert at 3x the rate 
of users who add fewer. The "aha moment" is clearly tied to volume.

Proposed fix: Guided onboarding that creates 3 sample notes on signup so users 
can experience search/Q&A immediately without waiting to build up their own content.
This mimics what Calendly did with their "book a meeting with yourself" flow.`,
  },
  {
    content: `Engineering RFC: Real-time Collaboration Architecture

Problem: Currently all note saves are synchronistic. If two users edit the same 
note simultaneously, last-write-wins and the earlier edit is silently lost.

Proposed solution: Operational Transformation (OT) using a CRDT approach.
- Use Yjs library (MIT license, battle-tested in Notion, Linear, Figma)
- Store document deltas in a separate table (note_operations)
- Sync via WebSocket using Vercel's edge runtime

Why not just lock the document?
- Creates terrible UX for async teams
- Teams often have one person editing while another is reading

Estimated effort: 4-6 weeks for basic implementation.
Risk: Aurora's connection limits could be an issue with many WebSocket connections.
Mitigation: Use Aurora Serverless v2 + connection pooling (PgBouncer).`,
  },
  {
    content: `Sales Pipeline Review — October 10

Top 5 deals in pipeline:
1. Meridian Corp — $85k ARR — Stage 4 (procurement review). Deal at risk — procurement moving slowly, champion left company.
2. Veritas Health — $40k ARR — Stage 3 (technical evaluation). IT security review needed. 
3. SkyBridge Capital — $28k ARR — Stage 5 (closed verbal). Waiting on signed contract.
4. NovaTech — $15k ARR — Stage 2 (demo scheduled). Strong interest from CTO.
5. Frontline Systems — $12k ARR — Stage 2 (initial contact). Needs nurturing.

Total pipeline: $180k ARR
Weighted (by stage probability): $94k

Q4 target: $120k new ARR. Need to close Meridian and SkyBridge to hit target.
At-risk strategy for Meridian: Get executive sponsor involved, offer POC extension.`,
  },
  {
    content: `Infrastructure Cost Review — September 2024

Monthly AWS spend: $4,200
Breakdown:
- Aurora PostgreSQL: $1,800 (multi-AZ, r6g.large)
- EC2 / Fargate: $900
- CloudFront + S3: $340
- Data transfer: $280
- Other services: $880

Cost per customer: $4,200 / 340 active customers = $12.35/mo
Revenue per customer: $49-149/mo average $82
Gross margin: ~85% (target is 80%+, we're good)

Optimization opportunities:
1. Move dev/staging to Aurora Serverless v2 → save ~$600/mo
2. Implement aggressive caching on API routes → reduce Aurora read IOPS
3. Enable S3 Intelligent-Tiering for note attachments (future) → save ~$80/mo

Action: Dev to implement Aurora Serverless v2 for non-prod by end of month.`,
  },
  {
    content: `Team Retrospective — Sprint 22 (Sept 30 - Oct 11)

What went well:
- Shipped Aurora migration with zero downtime — great engineering execution
- Design system refactor complete — UI is now consistent and faster to build
- Resolved 3 critical customer bugs that were causing churn conversations

What didn't go well:
- Missed pgvector HNSW index optimization — delayed semantic search by 1 sprint
- Communication broke down between Product and Engineering on requirements for notifications feature
- On-call rotation was too heavy — 3 P1 incidents in 2 weeks

Action items:
1. Weekly 30min Product/Eng sync to align on specs before sprint start (Marcus + Dev)
2. Rotate on-call to weekly instead of bi-weekly to reduce burnout  
3. Add runbook for top 5 incident types to reduce resolution time

Team morale score: 7.2/10 (down from 8.1 last sprint — we need to address workload)`,
  },
  {
    content: `AI Feature Strategy — October 2024

After evaluating user feedback on our AI features (200 responses from in-app survey):

Most requested AI features (ranked):
1. "Ask my notes a question" — 78% wanted this
2. "Auto-summarize when I add a note" — 65%
3. "Find related notes automatically" — 61%
4. "Generate action items from meeting notes" — 54%
5. "Write a note for me" — 31% (lower than expected)

Model selection decision: We're using Claude claude-sonnet-4-6 for Q&A because:
- Best reasoning for RAG (retrieval-augmented generation)
- Streaming support built-in
- Strong instruction following for citation format
- Cost-effective at $3/M input tokens

For embeddings: text-embedding-3-small (OpenAI) at 1536 dimensions stored in Aurora pgvector.
Average note embedding cost: ~$0.00003 per note. Negligible at our scale.

Timeline: RAG Q&A ships in next sprint. Auto-tagging shipped last week.`,
  },
  {
    content: `User Research Summary — Power Users Interview Series

Interviewed 8 power users (accounts with 500+ notes, daily active users).
Conducted by Priya and Marcus, Oct 1-8.

Key insights:

1. The "lost note" problem is real and painful. Every user mentioned spending 10-30 minutes per week searching for something they know they wrote down but can't find. One user said "it's like trying to remember a dream."

2. Tags don't work at scale. All 8 users had stopped using tags after reaching ~100 notes. "Too much maintenance." They want automatic organization.

3. Meeting notes are the #1 content type. 6/8 users primarily add meeting notes. They want action items extracted automatically.

4. Connection discovery is a "wow" moment. 3 users who saw our prototype semantic connections feature said it was the most impressive thing they'd seen in a productivity tool.

5. Trust in AI is conditional. Users want to see sources. "Show me which note you're drawing from" was mentioned by 7/8 users.

These insights heavily shaped our RAG Q&A design — cited answers with [Source N] notation.`,
  },
];

// ── Main seed function ───────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting seed...\n');

  let successCount = 0;

  for (let i = 0; i < SEED_NOTES.length; i++) {
    const { content } = SEED_NOTES[i];
    process.stdout.write(`  [${i + 1}/${SEED_NOTES.length}] Analyzing & embedding note...`);

    try {
      // 1. AI analysis (title, summary, tags, concepts)
      const aiRes = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Analyze this note and return ONLY valid JSON (no markdown):
"""${content}"""

{
  "title": "concise title max 10 words",
  "summary": "one sentence summary max 20 words",
  "tags": ["tag1","tag2","tag3"],
  "key_concepts": ["concept1","concept2","concept3"]
}`,
        }],
      });

      const aiText = aiRes.content[0].type === 'text' ? aiRes.content[0].text.trim() : '{}';
      const { title, summary, tags, key_concepts } = JSON.parse(aiText);

      // 2. Generate embedding
      const embRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `Title: ${title}\n\nContent: ${content}`,
        dimensions: 1536,
      });
      const vectorStr = `[${embRes.data[0].embedding.join(',')}]`;

      // 3. Insert into Aurora PostgreSQL
      await pool.query(
        `INSERT INTO notes (id, workspace_id, title, content, summary, tags, key_concepts, embedding, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector, 'seed')
         ON CONFLICT DO NOTHING`,
        [uuidv4(), WORKSPACE_ID, title, content, summary, tags, key_concepts, vectorStr]
      );

      console.log(` ✅ "${title}"`);
      successCount++;

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.log(` ❌ Error: ${(err as Error).message}`);
    }
  }

  // 4. Discover connections between seeded notes
  console.log('\n🔗 Discovering connections between notes...');
  const { rows: allNotes } = await pool.query(
    `SELECT id, embedding FROM notes WHERE workspace_id=$1 AND embedding IS NOT NULL`,
    [WORKSPACE_ID]
  );

  let connCount = 0;
  for (const note of allNotes) {
    const { rows: similar } = await pool.query(
      `SELECT id, 1-(embedding <=> $1::vector) AS sim
       FROM notes
       WHERE workspace_id=$2 AND id!=$3 AND embedding IS NOT NULL
         AND 1-(embedding <=> $1::vector) > 0.4
       ORDER BY embedding <=> $1::vector LIMIT 5`,
      [note.embedding, WORKSPACE_ID, note.id]
    );
    for (const s of similar) {
      await pool.query(
        `INSERT INTO note_connections (from_note_id, to_note_id, similarity_score, connection_type)
         VALUES ($1,$2,$3,'semantic'),($2,$1,$3,'semantic')
         ON CONFLICT DO NOTHING`,
        [note.id, s.id, s.sim]
      );
      connCount++;
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   📝 Notes created: ${successCount}/${SEED_NOTES.length}`);
  console.log(`   🔗 Connections discovered: ${connCount}`);
  console.log(`\nOpen your app and try asking:\n`);
  console.log(`  "What did we decide about pricing?"`);
  console.log(`  "What are the main reasons customers churn?"`);
  console.log(`  "What is our AI feature strategy?"`);
  console.log(`  "What are the infrastructure costs?"\n`);

  await pool.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

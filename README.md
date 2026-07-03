# AI Marketing Team™ — MATE™ Engine

Standalone engine project. Phase 2 of the AMOS build strategy — full context in
`docs/AMOS-VISION-SPEC.md` in the `toonetic` repo.

## Naming (2026-07-02)

The `core/` engine (agent framework, orchestrator, brand-context) is branded **MATE™ Engine**
("Multi-Agent Autonomous Team Engine") — a name for the department-agnostic platform that only
made sense once it was proven generic across 2 real departments. Each department keeps its own
product-facing identity: **AMOS™ Mission Control** (`/`) for Marketing, **AI Support Team**
(`/support`) for Support. Every page footer/header says "Powered by MATE™ Engine" to make that
relationship visible. Repo/package name stays `ai-marketing-team` — this is a product-facing
brand name, not a repo rename.

## Why this repo exists

Toonetic's AMOS™ Command Center is a live, shipped product. Rather than refactor its
architecture in place, this repo builds the next-generation engine — **Marketing Brain,
AI Memory, AI Orchestrator, AI Specialists, Workflow Engine, Prompt Library, Knowledge Base**
— from scratch, deliberately ignoring Toonetic's existing UI/menu/dashboard/schema conventions.

Guiding question while building here: *"if we built the best AI marketing team in the world
today, how would we design it?"* — not "how do we fit into what already exists."

Command Center integration is a Phase 3 decision, made only after this engine is proven to work
standalone. Not addressed yet.

## Intelligence-only, not execution (2026-07-03)

MATE thinks, plans, and decides — it does not itself post to any platform. Facebook
publish/schedule was built, dogfooded, and validated end-to-end earlier, then deliberately
removed once the actual product direction became clear: MATE is the "brain" (`brand_memory`,
specialists, workflows), and execution (rendering, posting, scheduling, platform APIs) belongs to
a separate system (AMOS or otherwise) that consumes MATE's output. `content_items.status =
'approved'` is the hand-off point — an external system reads it via `GET /api/approvals` /
`GET /api/content` and does the actual publishing itself. MATE and Toonetic's existing AMOS run on
**separate Supabase projects** — any integration goes through this REST API, never a shared DB.

## Status (2026-07-02)

Live in production at `mate.toonetic.com` (`mission.toonetic.com` still works as an alias, not
removed). Two departments built and verified end-to-end:

- **Marketing** (`lib/departments/marketing/`) — 6 specialists (Strategy, Content Strategist,
  Copywriter, Creative Director, Analytics, SEO), workflow `create-todays-content`
- **Support** (`lib/departments/support/`) — 2 specialists (Support Categorizer, Support Writer),
  workflow `answer-support-ticket`, page at `/support`

## Architecture: `core/` vs `departments/`

```
lib/
  core/                  — department-agnostic engine, reused unchanged by every department
    agents/              — AgentDefinition, model tiers, runAgent (the only place that calls
                            the Anthropic SDK), AGENT_REGISTRY (aggregates every department)
    orchestrator/         — WorkflowDefinition, executeSteps (has zero knowledge of any
                            department's concepts — e.g. never heard of `content_items`),
                            WORKFLOW_REGISTRY (aggregates every department)
    brand-context/        — BrandContext (organizations → brands → campaigns tenant data +
                            per-brand memory), loadBrandContext — reused as-is by Support,
                            confirming "Marketing" was never structural, just a name
    prompts/              — shared prompt fragments (JSON output rules, Thai language rule)
  departments/
    marketing/             — specialists/, prompts/, workflows/, index.ts (exports its roster)
    support/                — same shape
  supabase/admin.ts        — infra, not department logic
```

This split happened **after** two real departments existed (restructured from
`lib/agents/specialists/` + `lib/orchestrator/workflows/` flat layout in commit after
`answer-support-ticket` shipped), not speculatively before — see project memory for the
reasoning. Each `WorkflowDefinition` owns an optional `finalize` hook deciding what "done" means
(marketing writes `content_items`, support writes `support_tickets`) — the orchestrator core has
no opinion. Adding department #3: write `lib/departments/<name>/` in the same shape, add one
import + one spread line to `core/agents/registry.ts` and `core/orchestrator/registry.ts`.

## Stack

Next.js + TypeScript (App Router) + Tailwind, `@anthropic-ai/sdk`, `@supabase/supabase-js`, own
Supabase project (`kofgjljqilaigaxoyedc`).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

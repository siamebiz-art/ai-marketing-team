# AI Marketing Team™

Standalone engine project. Phase 2 of the AMOS build strategy — full context in
`docs/AMOS-VISION-SPEC.md` in the `toonetic` repo.

## Why this repo exists

Toonetic's AMOS™ Command Center is a live, shipped product. Rather than refactor its
architecture in place, this repo builds the next-generation engine — **Marketing Brain,
AI Memory, AI Orchestrator, AI Specialists, Workflow Engine, Prompt Library, Knowledge Base**
— from scratch, deliberately ignoring Toonetic's existing UI/menu/dashboard/schema conventions.

Guiding question while building here: *"if we built the best AI marketing team in the world
today, how would we design it?"* — not "how do we fit into what already exists."

Command Center integration is a Phase 3 decision, made only after this engine is proven to work
standalone. Not addressed yet.

## Status (2026-07-02)

First vertical slice built and verified end-to-end: Marketing Brain schema, agent framework,
prompt library, workflow-registry orchestrator, one workflow (`create-todays-content`, 5
specialists, approval gate), AI Memory distillation. Plan file:
`C:\Users\Windows 10\.claude\plans\radiant-swimming-ullman.md`.

**Architecture note — this is already multi-department-ready, not marketing-only:**
- `organizations` → `brands` → `campaigns` is a generic tenant hierarchy, not marketing-specific.
- The orchestrator core (`lib/orchestrator/executeSteps.ts`) has **zero knowledge of marketing
  concepts** — it doesn't know what `content_items` is. Each `WorkflowDefinition` owns its own
  `finalize` hook to decide what "done" means (the marketing workflow writes a `content_items`
  row; a future Sales/Support/Research workflow would write somewhere else entirely).
- The agent framework (`lib/agents/`) and workflow registry (`lib/orchestrator/registry.ts`) are
  plain `Record<string, ...>` registries — adding a non-marketing specialist or workflow doesn't
  require touching either.
- **Deliberately not done yet**: renaming the repo/package, or restructuring `src/lib/` into a
  `core/` vs `departments/marketing/` split. Only one department (Marketing) exists so far —
  restructuring now would mean guessing the module boundary a second department actually needs.
  That restructure happens once, informed by real requirements, when department #2 gets built
  (e.g. AI Research Team, AI Support Team) — not before.

## Stack

Next.js + TypeScript (App Router) + Tailwind, `@anthropic-ai/sdk`, `@supabase/supabase-js`, own
Supabase project (`kofgjljqilaigaxoyedc`).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

-- AI Support Team — department #2. Deliberately reuses the shared tenant core
-- (brands, workflow_runs) but has its own schema distinct from Marketing's content_items,
-- proving the Organization -> Brand -> Campaign hierarchy and orchestrator generalize across
-- departments while each department owns its own domain data.
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  question text not null,
  category text,                          -- product_question | billing | technical | general
  urgency text,                           -- low | medium | high
  draft_reply text,
  status text not null default 'draft',   -- draft | pending_review | approved | sent
  created_at timestamptz not null default now()
);

create index idx_support_tickets_brand on support_tickets(brand_id);
create index idx_support_tickets_status on support_tickets(brand_id, status);

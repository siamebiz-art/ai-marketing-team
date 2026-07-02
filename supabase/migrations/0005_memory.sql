-- AI Memory: distilled, reusable patterns per brand (not a raw activity log)
create table brand_memory (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  category text not null,        -- content_pattern | brand_voice_note | competitor_move | campaign_learning
  summary text not null,         -- distilled, human-readable, 1-3 sentences
  evidence jsonb not null default '{}', -- source content_item ids / campaign ids that produced this
  confidence text not null default 'medium', -- low | medium | high — grows as pattern repeats
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_brand_memory_brand_category on brand_memory(brand_id, category);

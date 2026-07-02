-- Content produced by workflow runs, scoped to a brand (and optionally a campaign)
create table content_items (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  platform text not null,                -- facebook | tiktok | line_oa | website | email
  content_type text not null,            -- post | ad | video_script | landing_page | email
  status text not null default 'draft',  -- draft | pending_approval | approved | published | rejected
  payload jsonb not null default '{}',   -- the actual generated content (caption, hashtags, image_url, etc.)
  performance jsonb not null default '{}', -- filled in later by an Analytics specialist / manual entry
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_content_items_brand on content_items(brand_id);
create index idx_content_items_status on content_items(brand_id, status);

-- Social platform connections for publishing content_items for real. Deliberately separate
-- from brands.social_accounts, which is part of BrandContext and gets rendered into every
-- agent's system prompt + displayed in /test and /approvals — a credential must never live
-- there. loadBrandContext never reads this table.
create table brand_social_connections (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  platform text not null,        -- 'facebook' for now
  page_id text not null,
  page_name text,
  access_token text not null,    -- long-lived Page Access Token
  connected_at timestamptz not null default now(),
  unique (brand_id, platform)
);

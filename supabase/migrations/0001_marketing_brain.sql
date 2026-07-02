-- Marketing Brain: brand tenant root + list-shaped child tables
create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- 'toonetic' | 'atlas-office' | 'atlas-guardian' | 'usaxresearch'
  name text not null,
  business_type text,
  website_url text,
  brand_identity jsonb not null default '{}',   -- { mission, values[], visual_style, logo_url }
  brand_voice jsonb not null default '{}',       -- { tone, vocabulary_dos[], vocabulary_donts[], sample_phrases[] }
  target_audience jsonb not null default '{}',   -- { personas: [{name, demographics, pain_points[], goals[]}] }
  marketing_goals jsonb not null default '{}',   -- { primary_goal, kpis[], timeframe }
  seo_keywords text[] default '{}',
  social_accounts jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brand_competitors (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  website_url text,
  notes text,
  last_analyzed_at timestamptz,
  created_at timestamptz not null default now()
);

create table brand_products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  description text,
  price_info text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  goal text,
  status text not null default 'draft',  -- draft | active | completed | archived
  started_at timestamptz,
  ended_at timestamptz,
  summary jsonb not null default '{}',   -- outcome/results once completed, feeds AI Memory
  created_at timestamptz not null default now()
);

create index idx_brand_competitors_brand on brand_competitors(brand_id);
create index idx_brand_products_brand on brand_products(brand_id);
create index idx_campaigns_brand on campaigns(brand_id);

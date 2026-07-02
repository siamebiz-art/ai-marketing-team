-- Organization → Brand → Campaign hierarchy. Previously `brands` was the top-level tenant;
-- this adds the Organization layer above it so new brands can be added under the same
-- organization without changing the core schema, and agents can see organization-level
-- identity even though brand_memory stays strictly scoped per brand (never mixed).
create table organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table brands add column organization_id uuid references organizations(id) on delete set null;

insert into organizations (slug, name) values ('toonetic-co', 'TooNetic Co., Ltd.');

update brands set organization_id = (select id from organizations where slug = 'toonetic-co');

alter table brands alter column organization_id set not null;

create index idx_brands_organization on brands(organization_id);

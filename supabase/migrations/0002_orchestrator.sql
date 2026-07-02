-- Orchestrator state: workflow runs + per-agent step log
create table workflow_runs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  workflow_id text not null,             -- matches WORKFLOW_REGISTRY key
  status text not null default 'running', -- running | awaiting_approval | completed | failed
  input jsonb not null default '{}',
  outputs jsonb not null default '{}',    -- accumulated priorOutputs, keyed by agentId
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workflow_run_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  agent_id text not null,
  status text not null default 'running', -- running | completed | failed
  input jsonb,
  output jsonb,
  error text,
  usage jsonb not null default '{}',      -- { input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens }
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index idx_workflow_runs_brand on workflow_runs(brand_id);
create index idx_workflow_run_steps_run on workflow_run_steps(workflow_run_id);

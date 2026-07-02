import { createClient } from '@supabase/supabase-js'

// Service-role client — the primary client for this project. AI Marketing Team is an
// internal, single-operator tool run across owned brands, not a per-user SaaS with
// cookie-based auth (yet), so there's no anon/cookie client here.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

// ── Cliente Supabase (service role, solo backend) ───────────────
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.warn('⚠  Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env')
}

// supabaseAdmin omite RLS: usar SOLO desde el servidor, nunca en el frontend.
export const supabaseAdmin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
})

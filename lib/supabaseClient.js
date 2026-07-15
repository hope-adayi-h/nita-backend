import { createClient } from "@supabase/supabase-js";

// Client "public" : utilisé côté navigateur et dans les routes API
// qui exposent des actions publiques (lecture catalogue, création RDV/commande).
// Il respecte les policies RLS définies dans supabase/schema.sql.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

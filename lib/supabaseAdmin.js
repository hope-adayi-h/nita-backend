import { createClient } from "@supabase/supabase-js";

// ATTENTION : ce client utilise la clé "service_role" qui contourne les RLS.
// Il ne doit JAMAIS être importé dans du code exécuté côté navigateur.
// Utilisé uniquement dans les routes /app/api/** protégées par requireAdmin().
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Vérifie que la requête vient bien d'un utilisateur authentifié avec le rôle admin/staff.
// À appeler en tout début de chaque route d'administration.
export async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return { error: "Non authentifié", status: 401 };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return { error: "Session invalide", status: 401 };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile || !["admin", "staff"].includes(profile.role)) {
    return { error: "Accès refusé", status: 403 };
  }

  return { user: userData.user, role: profile.role };
}

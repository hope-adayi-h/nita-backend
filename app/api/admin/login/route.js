import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";

// POST /api/admin/login
// Connexion de la gérante au back-office (email/mot de passe créés au préalable
// dans Supabase Auth, avec une ligne correspondante dans la table profiles).
export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "email et password sont requis" }, { status: 400 });
  }

  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });

  if (error) return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });

  // Le front stocke ce token et le renvoie en "Authorization: Bearer <token>"
  // pour toutes les requêtes vers les routes admin.
  return NextResponse.json({
    access_token: data.session.access_token,
    user: data.user
  });
}

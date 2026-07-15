import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

// GET /api/services?category=tresses
// Public : liste des services actifs (catalogue du salon)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabasePublic.from("services").select("*").eq("active", true);
  if (category) query = query.eq("category", category);

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ services: data });
}

// POST /api/services
// Admin uniquement : création d'un nouveau service
export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { category, name, description, price, duration_minutes, image_url } = body;

  if (!category || !name || !price) {
    return NextResponse.json({ error: "category, name et price sont requis" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .insert([{ category, name, description, price, duration_minutes, image_url }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data }, { status: 201 });
}

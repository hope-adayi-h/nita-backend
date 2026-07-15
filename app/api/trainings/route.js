import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

// GET /api/trainings — Public : sessions de formation à venir
export async function GET() {
  const { data, error } = await supabasePublic
    .from("trainings")
    .select("*")
    .eq("active", true)
    .order("start_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trainings: data });
}

// POST /api/trainings — Admin : créer une nouvelle session de formation
export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { title, modules, start_date, end_date, registration_fee, training_fee, seats_available } = body;

  if (!title || !start_date || !end_date || registration_fee == null || training_fee == null) {
    return NextResponse.json(
      { error: "title, start_date, end_date, registration_fee et training_fee sont requis" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("trainings")
    .insert([{ title, modules, start_date, end_date, registration_fee, training_fee, seats_available }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ training: data }, { status: 201 });
}

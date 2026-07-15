import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

// PATCH /api/services/:id — Admin : modifier un service (prix, description, actif...)
export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const updates = await request.json();
  const { data, error } = await supabaseAdmin
    .from("services")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

// DELETE /api/services/:id — Admin : supprimer (ou désactiver) un service
export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { error } = await supabaseAdmin.from("services").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

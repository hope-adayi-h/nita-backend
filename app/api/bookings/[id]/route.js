import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

const VALID_STATUSES = ["en_attente", "confirme", "termine", "annule"];

// PATCH /api/bookings/:id — Admin : confirmer / terminer / annuler un RDV
export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { status, notes } = await request.json();
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status doit être l'un de : ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const updates = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}

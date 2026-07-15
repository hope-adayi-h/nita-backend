import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

const VALID_ORDER_STATUSES = ["en_attente", "en_livraison", "livree", "annulee"];
const VALID_PAYMENT_STATUSES = ["en_attente", "paye", "echoue", "rembourse"];

// PATCH /api/orders/:id — Admin : mettre à jour le statut de livraison/paiement
export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { order_status, payment_status } = await request.json();

  if (order_status && !VALID_ORDER_STATUSES.includes(order_status)) {
    return NextResponse.json({ error: `order_status invalide` }, { status: 400 });
  }
  if (payment_status && !VALID_PAYMENT_STATUSES.includes(payment_status)) {
    return NextResponse.json({ error: `payment_status invalide` }, { status: 400 });
  }

  const updates = {};
  if (order_status) updates.order_status = order_status;
  if (payment_status) updates.payment_status = payment_status;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}

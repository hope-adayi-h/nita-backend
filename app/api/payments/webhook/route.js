import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyWebhookSignature } from "@/lib/mobileMoney";

// POST /api/payments/webhook
// Appelé par la passerelle Mobile Money (SebPay/CinetPay) pour confirmer
// ou signaler l'échec d'une transaction. Met à jour la commande OU
// l'inscription formation correspondante selon la référence transmise.
export async function POST(request) {
  const rawBody = await request.text();

  if (!verifyWebhookSignature(request, rawBody)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  // Champs attendus (à ajuster selon le format réel du prestataire) :
  // { reference, status: "success" | "failed", transaction_id }
  const { reference, status, transaction_id } = payload;

  if (!reference || !status) {
    return NextResponse.json({ error: "Payload incomplet" }, { status: 400 });
  }

  const paymentStatus = status === "success" ? "paye" : "echoue";

  // On tente d'abord de matcher une commande...
  const { data: order } = await supabaseAdmin
    .from("orders")
    .update({ payment_status: paymentStatus, payment_reference: transaction_id })
    .eq("id", reference)
    .select()
    .maybeSingle();

  if (order) {
    return NextResponse.json({ success: true, type: "order", id: order.id });
  }

  // ...sinon une inscription formation
  const registrationPaymentStatus = status === "success" ? "acompte_paye" : "echoue";
  const { data: registration } = await supabaseAdmin
    .from("training_registrations")
    .update({ payment_status: registrationPaymentStatus, payment_reference: transaction_id })
    .eq("id", reference)
    .select()
    .maybeSingle();

  if (registration) {
    return NextResponse.json({ success: true, type: "training_registration", id: registration.id });
  }

  return NextResponse.json({ error: "Référence introuvable" }, { status: 404 });
}

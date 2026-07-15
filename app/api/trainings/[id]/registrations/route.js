import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";
import { initiateMobileMoneyPayment } from "@/lib/mobileMoney";
import { notifyWhatsApp } from "@/lib/notify";

// POST /api/trainings/:id/registrations
// Public : inscription à une session de formation
export async function POST(request, { params }) {
  const { client_name, client_phone, amount_to_pay } = await request.json();

  if (!client_name || !client_phone) {
    return NextResponse.json({ error: "client_name et client_phone sont requis" }, { status: 400 });
  }

  const { data: registration, error } = await supabasePublic
    .from("training_registrations")
    .insert([{ training_id: params.id, client_name, client_phone }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let paymentInfo = null;
  if (amount_to_pay) {
    paymentInfo = await initiateMobileMoneyPayment({
      orderId: registration.id,
      amount: amount_to_pay,
      phone: client_phone
    });
  }

  await notifyWhatsApp({
    to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    message: `Nouvelle inscription formation: ${client_name} (${client_phone})`
  });

  return NextResponse.json({ registration, payment: paymentInfo }, { status: 201 });
}

// GET /api/trainings/:id/registrations — Admin : liste des inscrits à une session
export async function GET(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await supabaseAdmin
    .from("training_registrations")
    .select("*")
    .eq("training_id", params.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ registrations: data });
}

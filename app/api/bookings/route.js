import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";
import { notifyWhatsApp } from "@/lib/notify";

// POST /api/bookings
// Public : la cliente prend rendez-vous depuis le site
export async function POST(request) {
  const body = await request.json();
  const { client_name, client_phone, service_id, scheduled_at, notes } = body;

  if (!client_name || !client_phone || !service_id || !scheduled_at) {
    return NextResponse.json(
      { error: "client_name, client_phone, service_id et scheduled_at sont requis" },
      { status: 400 }
    );
  }

  const { data, error } = await supabasePublic
    .from("bookings")
    .insert([{ client_name, client_phone, service_id, scheduled_at, notes }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notifie la gérante (et confirme à la cliente) — voir lib/notify.js
  await notifyWhatsApp({
    to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    message: `Nouveau RDV: ${client_name} (${client_phone}) le ${scheduled_at}`
  });

  return NextResponse.json({ booking: data }, { status: 201 });
}

// GET /api/bookings?status=en_attente
// Admin uniquement : liste des rendez-vous pour le back-office
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("bookings")
    .select("*, services(name, category, price)")
    .order("scheduled_at", { ascending: true });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}

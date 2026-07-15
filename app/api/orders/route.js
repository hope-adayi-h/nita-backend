import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";
import { initiateMobileMoneyPayment } from "@/lib/mobileMoney";
import { notifyWhatsApp } from "@/lib/notify";

// POST /api/orders
// Public : tunnel de commande boutique (panier -> commande)
// body attendu : { client_name, client_phone, delivery_address, payment_method, items: [{product_id, quantity, unit_price}] }
export async function POST(request) {
  const body = await request.json();
  const { client_name, client_phone, delivery_address, payment_method, items } = body;

  if (!client_name || !client_phone || !delivery_address || !payment_method || !items?.length) {
    return NextResponse.json(
      { error: "client_name, client_phone, delivery_address, payment_method et items sont requis" },
      { status: 400 }
    );
  }

  // 1. Création de la commande
  const { data: order, error: orderError } = await supabasePublic
    .from("orders")
    .insert([{ client_name, client_phone, delivery_address, payment_method }])
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // 2. Ajout des lignes de commande (le trigger SQL recalcule total_amount automatiquement)
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price
  }));

  const { error: itemsError } = await supabasePublic.from("order_items").insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  // 3. Si paiement Mobile Money : on initie la transaction auprès de la passerelle
  let paymentInfo = null;
  if (payment_method === "mobile_money") {
    paymentInfo = await initiateMobileMoneyPayment({
      orderId: order.id,
      amount: items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0),
      phone: client_phone
    });
  }

  await notifyWhatsApp({
    to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    message: `Nouvelle commande: ${client_name} (${client_phone}) — livraison: ${delivery_address}`
  });

  return NextResponse.json({ order, payment: paymentInfo }, { status: 201 });
}

// GET /api/orders?status=en_attente
// Admin uniquement : liste des commandes pour le back-office
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("orders")
    .select("*, order_items(quantity, unit_price, products(name))")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("order_status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data });
}

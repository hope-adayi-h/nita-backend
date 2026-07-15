import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabaseClient";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

// GET /api/products?category=savon
// Public : catalogue boutique Nita Cosmétics
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabasePublic.from("products").select("*").eq("active", true);
  if (category) query = query.eq("category", category);

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products: data });
}

// POST /api/products — Admin : ajouter un produit
export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { name, description, ingredients, category, price, promo_price, stock, image_url } = body;

  if (!name || !category || !price) {
    return NextResponse.json({ error: "name, category et price sont requis" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert([{ name, description, ingredients, category, price, promo_price, stock, image_url }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}

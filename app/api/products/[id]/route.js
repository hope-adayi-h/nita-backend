import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdmin } from "@/lib/supabaseAdmin";

// PATCH /api/products/:id — Admin : modifier prix, stock, promo, statut actif...
export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const updates = await request.json();
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

// DELETE /api/products/:id — Admin : supprimer un produit
export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { error } = await supabaseAdmin.from("products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

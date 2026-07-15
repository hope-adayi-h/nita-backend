"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Truck,
  DollarSign,
  MessageSquare
} from "lucide-react";

export default function AdminOrdersPage() {
  const { token } = useAdmin();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token, filterStatus]);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const url = filterStatus === "all" ? "/api/orders" : `/api/orders?status=${filterStatus}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Impossible de charger les commandes.");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, field, value) => {
    setUpdatingId(id);
    try {
      const payload = {};
      payload[field] = value;

      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la mise à jour de la commande.");
      }

      // Recharger localement
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-amber-50 text-amber-700 border-amber-255";
      case "en_livraison":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "livree":
      case "paye":
        return "bg-green-50 text-green-700 border-green-200";
      case "annulee":
      case "echoue":
        return "bg-red-50 text-red-700 border-red-200";
      case "rembourse":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const tabs = [
    { id: "all", name: "Toutes" },
    { id: "en_attente", name: "En attente" },
    { id: "en_livraison", name: "En livraison" },
    { id: "livree", name: "Livrées" },
    { id: "annulee", name: "Annulées" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 font-serif">Commandes Clients</h1>
        <p className="text-slate-550 text-xs">Suivez les ventes de Nita Cosmétics, gérez l'état de livraison et enregistrez les paiements.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-colors -mb-2 border-b-2 ${
              filterStatus === tab.id
                ? "border-cosmetics-copper text-cosmetics-copper font-bold bg-slate-50"
                : "border-transparent text-slate-550 hover:text-slate-800 hover:border-slate-350"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-cosmetics-copper" size={32} />
          <p className="text-slate-400 text-xs">Chargement des commandes...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="text-red-500 mx-auto" size={32} />
          <h3 className="font-bold text-slate-900 text-sm">Une erreur est survenue</h3>
          <p className="text-slate-550 text-xs leading-relaxed">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-sm mx-auto shadow-sm">
              <p className="text-slate-400 text-xs font-medium">Aucune commande enregistrée.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:shadow-md transition-shadow"
                >
                  {/* Left Column: Customer & Details (cols 4) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                        Commande #{order.id.substring(0, 8)}
                      </p>
                      <h4 className="font-bold text-slate-800 text-sm">{order.client_name}</h4>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-650 pl-1">
                      <div className="flex items-center space-x-2">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <a href={`tel:${order.client_phone}`} className="hover:underline font-medium text-slate-800">
                          {order.client_phone}
                        </a>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{order.delivery_address} (Lomé)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Items purchased (cols 4) */}
                  <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450">
                      Articles Commandés
                    </span>
                    <div className="divide-y divide-slate-200/60 max-h-36 overflow-y-auto pr-1">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="py-2 flex justify-between text-xs">
                          <span className="text-slate-700 font-medium leading-tight">
                            {item.products?.name || "Produit désactivé"} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                          </span>
                          <span className="font-semibold text-slate-800 shrink-0 ml-3">
                            {formatPrice(item.unit_price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Total :</span>
                      <span className="font-bold text-cosmetics-copper font-serif">{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>

                  {/* Right Column: Status updates & Payment (cols 4) */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    {/* Status badges summary */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(order.order_status)}`}>
                        📦 Livraison: {order.order_status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(order.payment_status)}`}>
                        💳 Paiement: {order.payment_status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-200 text-slate-500 bg-slate-50">
                        Mode: {order.payment_method === "mobile_money" ? "Mobile Money" : "Livraison"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                      {/* Delivery Status Select */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-450 uppercase flex items-center space-x-1">
                          <Truck size={10} />
                          <span>Livraison</span>
                        </label>
                        <select
                          value={order.order_status}
                          onChange={(e) => handleUpdateStatus(order.id, "order_status", e.target.value)}
                          disabled={updatingId === order.id}
                          className="w-full p-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-700"
                        >
                          <option value="en_attente">En attente</option>
                          <option value="en_livraison">En livraison</option>
                          <option value="livree">Livrée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                      </div>

                      {/* Payment Status Select */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-450 uppercase flex items-center space-x-1">
                          <DollarSign size={10} />
                          <span>Paiement</span>
                        </label>
                        <select
                          value={order.payment_status}
                          onChange={(e) => handleUpdateStatus(order.id, "payment_status", e.target.value)}
                          disabled={updatingId === order.id}
                          className="w-full p-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-700"
                        >
                          <option value="en_attente">En attente</option>
                          <option value="paye">Payé</option>
                          <option value="echoue">Échoué</option>
                          <option value="rembourse">Remboursé</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact customer WhatsApp */}
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${order.client_phone.replace(/\s+/g, '')}?text=Bonjour%20${encodeURIComponent(order.client_name)},%2520je%20vous%20contacte%20concernant%20votre%20commande%20%23${order.id.substring(0,8)}%20passée%20sur%20Nita%20Cosmétics.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-1.5 text-xs shadow-sm transition-colors"
                      >
                        <MessageSquare size={13} />
                        <span>Contacter WhatsApp</span>
                      </a>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

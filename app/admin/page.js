"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import {
  Calendar,
  ShoppingBag,
  GraduationCap,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAdmin();
  
  const [data, setData] = useState({
    bookings: [],
    orders: [],
    trainings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchDashboardData() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, ordersRes, trainingsRes] = await Promise.all([
          fetch("/api/bookings", { headers }),
          fetch("/api/orders", { headers }),
          fetch("/api/trainings", { headers })
        ]);

        if (!bookingsRes.ok || !ordersRes.ok || !trainingsRes.ok) {
          throw new Error("Erreur lors de la récupération des données d'administration.");
        }

        const [bookingsData, ordersData, trainingsData] = await Promise.all([
          bookingsRes.json(),
          ordersRes.json(),
          trainingsRes.json()
        ]);

        setData({
          bookings: bookingsData.bookings || [],
          orders: ordersData.orders || [],
          trainings: trainingsData.trainings || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [token]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirme":
      case "paye":
      case "livree":
        return "bg-green-50 text-green-700 border-green-200";
      case "termine":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "annule":
      case "annulee":
      case "echoue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-beauty-rose" size={36} />
        <p className="text-xs text-slate-400">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
        <AlertCircle className="text-red-500 mx-auto" size={32} />
        <h3 className="font-bold text-slate-900">Erreur d'administration</h3>
        <p className="text-slate-500 text-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Calculs statistiques
  const pendingBookings = data.bookings.filter((b) => b.status === "en_attente").length;
  const pendingOrders = data.orders.filter((o) => o.order_status === "en_attente").length;
  const activeTrainings = data.trainings.filter((t) => t.active).length;

  const totalSales = data.orders
    .filter((o) => o.payment_status === "paye")
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  // Éléments récents (limités à 5)
  const recentBookings = data.bookings.slice(0, 5);
  const recentOrders = data.orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(225,29,72,0.15),transparent_40%)]" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl font-serif font-bold">Ravi de vous revoir, Gérante !</h1>
          <p className="text-slate-400 text-xs">Voici un aperçu de l'activité de vos deux marques aujourd'hui.</p>
        </div>
        <div className="text-xs bg-slate-800 border border-slate-750 px-4 py-2 rounded-xl relative z-10">
          📅 Lomé, le {new Date().toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bookings Stat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">RDV en attente</p>
            <h3 className="text-2xl font-bold text-slate-900">{pendingBookings}</h3>
            <p className="text-slate-400 text-[10px]">{data.bookings.length} RDV enregistrés</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-beauty-rose rounded-xl flex items-center justify-center">
            <Calendar size={22} />
          </div>
        </div>

        {/* Orders Stat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Commandes en attente</p>
            <h3 className="text-2xl font-bold text-slate-900">{pendingOrders}</h3>
            <p className="text-slate-400 text-[10px]">{data.orders.length} commandes au total</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-cosmetics-copper rounded-xl flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Sales Stat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Chiffre d'Affaires</p>
            <h3 className="text-2xl font-bold text-slate-900 font-serif text-green-600">{formatPrice(totalSales)}</h3>
            <p className="text-slate-400 text-[10px]">Commandes avec statut payé</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Trainings Stat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Sessions Formation</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeTrainings}</h3>
            <p className="text-slate-400 text-[10px]">Formations actives planifiées</p>
          </div>
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
        </div>

      </div>

      {/* Main Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center space-x-2">
              <Calendar size={18} className="text-beauty-rose" />
              <span>Rendez-vous récents</span>
            </h3>
            <Link
              href="/admin/rendez-vous"
              className="text-xs font-semibold text-beauty-rose flex items-center space-x-1 hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-8">Aucun rendez-vous pour le moment.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <div key={b.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{b.client_name} ({b.client_phone})</p>
                    <p className="text-slate-500 font-medium flex items-center space-x-1">
                      <Clock size={12} className="text-slate-450 shrink-0" />
                      <span>
                        {new Date(b.scheduled_at).toLocaleDateString("fr-FR")} à {new Date(b.scheduled_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">Prestation: <span className="font-medium text-slate-600">{b.services?.name || "Inconnue"}</span></p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center space-x-2">
              <ShoppingBag size={18} className="text-cosmetics-copper" />
              <span>Dernières commandes</span>
            </h3>
            <Link
              href="/admin/commandes"
              className="text-xs font-semibold text-cosmetics-copper flex items-center space-x-1 hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-8">Aucune commande passée pour le moment.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{o.client_name} ({o.client_phone})</p>
                    <p className="text-slate-500 font-medium">Fait le {new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                    <p className="text-[10px] text-slate-400">Montant: <span className="font-bold text-slate-700">{formatPrice(o.total_amount)}</span></p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(o.order_status)}`}>
                      Livraison: {o.order_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(o.payment_status)}`}>
                      Paiement: {o.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

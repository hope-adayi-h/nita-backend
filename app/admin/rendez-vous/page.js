"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Calendar,
  Phone,
  User,
  Clock,
  AlertCircle,
  Loader2,
  Check,
  X,
  RotateCcw,
  FileText,
  Save,
  MessageSquare
} from "lucide-react";

export default function AdminBookingsPage() {
  const { token } = useAdmin();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Notes editing state
  const [editingNotes, setEditingNotes] = useState({}); // { bookingId: note_content }
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchBookings();
  }, [token, filterStatus]);

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const url = filterStatus === "all" ? "/api/bookings" : `/api/bookings?status=${filterStatus}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Impossible de récupérer la liste des rendez-vous.");
      }

      const data = await res.json();
      setBookings(data.bookings || []);
      
      // Initialiser l'état d'édition des notes
      const notesObj = {};
      (data.bookings || []).forEach((b) => {
        notesObj[b.id] = b.notes || "";
      });
      setEditingNotes(notesObj);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la mise à jour du statut.");
      }

      // Recharger localement
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesSave = async (id) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: editingNotes[id] })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde des notes.");
      }

      // Mettre à jour l'élément local
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, notes: editingNotes[id] } : b))
      );
      
      alert("Notes enregistrées avec succès !");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesChange = (id, val) => {
    setEditingNotes((prev) => ({ ...prev, [id]: val }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirme":
        return "bg-green-50 text-green-700 border-green-200";
      case "termine":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "annule":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-750 border-slate-200";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const tabs = [
    { id: "all", name: "Tous" },
    { id: "en_attente", name: "En attente" },
    { id: "confirme", name: "Confirmés" },
    { id: "termine", name: "Terminés" },
    { id: "annule", name: "Annulés" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Agenda des Rendez-vous</h1>
          <p className="text-slate-550 text-xs">Gérez les demandes de rendez-vous et validez-les après contact WhatsApp.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-colors -mb-2 border-b-2 ${
              filterStatus === tab.id
                ? "border-beauty-rose text-beauty-rose font-bold bg-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-beauty-rose animate-bounce" size={32} />
          <p className="text-slate-400 text-xs">Chargement de l'agenda...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="text-red-500 mx-auto" size={32} />
          <h3 className="font-bold text-slate-900 text-sm">Une erreur est survenue</h3>
          <p className="text-slate-550 text-xs leading-relaxed">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-sm mx-auto shadow-sm">
              <p className="text-slate-400 text-xs font-medium">Aucun rendez-vous trouvé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const dateObj = new Date(booking.scheduled_at);
                const dateStr = dateObj.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:shadow-md transition-shadow"
                  >
                    
                    {/* Customer Info (cols 4) */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-50 text-beauty-rose flex items-center justify-center font-bold text-xs shrink-0">
                          {booking.client_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{booking.client_name}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-650 pl-1">
                        <div className="flex items-center space-x-2">
                          <Phone size={13} className="text-slate-400 shrink-0" />
                          <a href={`tel:${booking.client_phone}`} className="hover:underline font-medium text-slate-850">
                            {booking.client_phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800">
                            {dateStr} à {timeStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prestation Info (cols 4) */}
                    <div className="lg:col-span-4 space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450">
                        Prestation demandée
                      </span>
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-slate-800 leading-snug">
                          {booking.services?.name || "Service désactivé ou supprimé"}
                        </p>
                        <p className="text-slate-450 text-[10px] uppercase">
                          Catégorie: {booking.services?.category || "-"}
                        </p>
                        <p className="font-bold text-beauty-rose font-serif text-sm">
                          Tarif: {booking.services?.price ? formatPrice(booking.services.price) : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Notes (cols 4) */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Notes area */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase flex items-center space-x-1">
                          <FileText size={10} />
                          <span>Notes Internes</span>
                        </label>
                        <div className="flex space-x-1.5">
                          <textarea
                            value={editingNotes[booking.id] || ""}
                            onChange={(e) => handleNotesChange(booking.id, e.target.value)}
                            placeholder="Entrez vos notes administratives ici..."
                            rows="2"
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-beauty-rose"
                          />
                          <button
                            onClick={() => handleNotesSave(booking.id)}
                            disabled={updatingId === booking.id}
                            className="bg-slate-800 hover:bg-slate-900 text-white p-2 rounded-lg flex items-center justify-center shrink-0 self-end transition-colors"
                            title="Sauvegarder les notes"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                        {booking.status === "en_attente" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "confirme")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                            >
                              <Check size={12} />
                              <span>Confirmer</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "annule")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                            >
                              <X size={12} />
                              <span>Annuler</span>
                            </button>
                          </>
                        )}

                        {booking.status === "confirme" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "termine")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                            >
                              <Check size={12} />
                              <span>Terminer</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, "annule")}
                              disabled={updatingId === booking.id}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                            >
                              <X size={12} />
                              <span>Annuler</span>
                            </button>
                          </>
                        )}

                        {(booking.status === "annule" || booking.status === "termine") && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, "en_attente")}
                            disabled={updatingId === booking.id}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <RotateCcw size={12} />
                            <span>Remettre en attente</span>
                          </button>
                        )}

                        {/* WhatsApp discussion helper link */}
                        <a
                          href={`https://wa.me/${booking.client_phone.replace(/\s+/g, '')}?text=Bonjour%20${encodeURIComponent(booking.client_name)},%20je%20vous%20contacte%20concernant%20votre%20rendez-vous%20pour%20la%20prestation%20*${encodeURIComponent(booking.services?.name || '')}*.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm ml-auto transition-colors"
                          title="Contacter sur WhatsApp"
                        >
                          <MessageSquare size={12} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
}

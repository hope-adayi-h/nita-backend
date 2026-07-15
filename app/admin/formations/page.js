"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
  Plus,
  AlertCircle,
  Loader2,
  Save,
  MessageSquare,
  Phone,
  User,
  ListOrdered
} from "lucide-react";

export default function AdminTrainingsPage() {
  const { token } = useAdmin();

  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected session for viewing registrations
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [selectedTrainingTitle, setSelectedTrainingTitle] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regsError, setRegsError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    modulesRaw: "", // Comma-separated modules
    start_date: "",
    end_date: "",
    registration_fee: "",
    training_fee: "",
    seats_available: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchTrainings();
  }, [token]);

  async function fetchTrainings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trainings");
      if (!res.ok) {
        throw new Error("Impossible de charger les sessions de formation.");
      }
      const data = await res.json();
      setTrainings(data.trainings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchRegistrations = async (id, title) => {
    setSelectedTrainingId(id);
    setSelectedTrainingTitle(title);
    setLoadingRegs(true);
    setRegsError(null);
    try {
      const res = await fetch(`/api/trainings/${id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error("Impossible de récupérer la liste des inscrits.");
      }

      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      setRegsError(err.message);
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const { title, modulesRaw, start_date, end_date, registration_fee, training_fee, seats_available } = formData;

    if (!title || !start_date || !end_date || registration_fee === "" || training_fee === "") {
      setFormError("Veuillez remplir tous les champs obligatoires (*).");
      setFormLoading(false);
      return;
    }

    // Convertir les modules séparés par des virgules en tableau
    const modules = modulesRaw
      ? modulesRaw.split(",").map((m) => m.trim()).filter((m) => m.length > 0)
      : [];

    try {
      const res = await fetch("/api/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          modules,
          start_date,
          end_date,
          registration_fee: parseFloat(registration_fee),
          training_fee: parseFloat(training_fee),
          seats_available: seats_available !== "" ? parseInt(seats_available) : null,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création de la session.");
      }

      alert("Nouvelle session de formation créée avec succès !");
      setFormData({
        title: "",
        modulesRaw: "",
        start_date: "",
        end_date: "",
        registration_fee: "",
        training_fee: "",
        seats_available: "",
      });
      fetchTrainings();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " F";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "acompte_paye":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "paye_integralement":
        return "bg-green-50 text-green-700 border-green-200";
      case "echoue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Gestion des Formations Cosmétiques</h1>
        <p className="text-slate-555 text-xs">Planifiez de nouvelles sessions pratiques et suivez les inscriptions et paiements d'acompte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Trainings sessions list (cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sessions Planifiées</h3>
          
          {loading && (
            <div className="flex items-center justify-center py-12 space-x-2">
              <Loader2 className="animate-spin text-violet-600" size={24} />
              <span className="text-slate-400 text-xs">Chargement des formations...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-650 text-xs flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <>
              {trainings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-xs text-slate-400">
                  Aucune session enregistrée.
                </div>
              ) : (
                <div className="space-y-4">
                  {trainings.map((session) => (
                    <div
                      key={session.id}
                      className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center ${
                        selectedTrainingId === session.id
                          ? "border-violet-600 ring-2 ring-violet-600/10"
                          : "border-slate-100"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] bg-violet-50 text-violet-600 font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            Active
                          </span>
                          <span className="text-[10px] text-slate-450">
                            {formatDate(session.start_date)} au {formatDate(session.end_date)}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{session.title}</h4>
                        <p className="text-[10px] text-slate-400">
                          Inscr.: <span className="font-bold text-slate-650">{formatPrice(session.registration_fee)}</span> | Formation: <span className="font-bold text-slate-650">{formatPrice(session.training_fee)}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => fetchRegistrations(session.id, session.title)}
                        className="px-4 py-2 bg-violet-50 hover:bg-violet-600 hover:text-white border border-violet-200 text-violet-700 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center space-x-1"
                      >
                        <Users size={12} />
                        <span>Voir les inscrits</span>
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Create training form (cols 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5 pb-2 border-b border-slate-100">
            <Plus size={16} className="text-violet-600" />
            <span>Créer une Session</span>
          </h3>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs flex items-start space-x-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Titre de la session *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Ex: Spécial Formation Cosmétiques"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Date début *</label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Date fin *</label>
                <input
                  type="date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Fees grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Frais d'inscription *</label>
                <input
                  type="number"
                  name="registration_fee"
                  required
                  value={formData.registration_fee}
                  onChange={handleFormChange}
                  placeholder="Ex: 5000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Frais formation *</label>
                <input
                  type="number"
                  name="training_fee"
                  required
                  value={formData.training_fee}
                  onChange={handleFormChange}
                  placeholder="Ex: 20000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Seats input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Nombre de places dispo</label>
              <input
                type="number"
                name="seats_available"
                value={formData.seats_available}
                onChange={handleFormChange}
                placeholder="Ex: 15 (Optionnel)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Modules comma-separated input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Modules (séparés par des virgules)</label>
              <input
                type="text"
                name="modulesRaw"
                value={formData.modulesRaw}
                onChange={handleFormChange}
                placeholder="Ex: Savon noir nigérian, Huile quinto, Gel douche"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-750 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 text-xs shadow-sm transition-colors"
            >
              {formLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Créer la formation</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

      {/* Bottom Section: View Registrations of selected session */}
      {selectedTrainingId && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-50">
            <ListOrdered className="text-violet-600" size={18} />
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Inscrits pour : <span className="text-violet-700">{selectedTrainingTitle}</span>
            </h3>
          </div>

          {loadingRegs && (
            <div className="flex items-center justify-center py-8 space-x-2">
              <Loader2 className="animate-spin text-violet-600" size={20} />
              <span className="text-slate-400 text-xs">Chargement des participants...</span>
            </div>
          )}

          {regsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-650 text-xs">
              {regsError}
            </div>
          )}

          {!loadingRegs && !regsError && (
            <>
              {registrations.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">Aucun participant n'est encore inscrit à cette session.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-bold text-slate-700">
                      <tr>
                        <th className="px-4 py-3">Participant</th>
                        <th className="px-4 py-3">Téléphone</th>
                        <th className="px-4 py-3">Statut Paiement</th>
                        <th className="px-4 py-3">Référence Transaction</th>
                        <th className="px-4 py-3">Date d'inscription</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-[10px]">
                              {reg.client_name.charAt(0).toUpperCase()}
                            </span>
                            <span>{reg.client_name}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <a href={`tel:${reg.client_phone}`} className="hover:underline">
                              {reg.client_phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getPaymentStatusColor(reg.payment_status)}`}>
                              {reg.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[10px] text-slate-450">
                            {reg.payment_reference || "-"}
                          </td>
                          <td className="px-4 py-3.5">
                            {new Date(reg.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <a
                              href={`https://wa.me/${reg.client_phone.replace(/\s+/g, '')}?text=Bonjour%20${encodeURIComponent(reg.client_name)},%20nous%20vous%20contactons%20pour%20valider%20votre%20inscription%20à%20la%20formation%20*${encodeURIComponent(selectedTrainingTitle)}*.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                            >
                              <MessageSquare size={12} />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}

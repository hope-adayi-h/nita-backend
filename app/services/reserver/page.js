"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Phone, User, FileText, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

// Formulaire interne utilisant useSearchParams
function ReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryServiceId = searchParams.get("serviceId");
  const queryServiceName = searchParams.get("serviceName");

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    service_id: queryServiceId || "",
    date: "",
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Charger la liste des services pour le menu déroulant
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
          // Si le service n'était pas prérempli dans l'URL ou qu'on veut s'assurer qu'il est correct
          if (queryServiceId) {
            setFormData((prev) => ({ ...prev, service_id: queryServiceId }));
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des services :", err);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, [queryServiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { client_name, client_phone, service_id, date, time, notes } = formData;

    if (!client_name || !client_phone || !service_id || !date || !time) {
      setError("Veuillez remplir tous les champs obligatoires (*).");
      setLoading(false);
      return;
    }

    try {
      // Formater scheduled_at sous forme de chaîne ISO acceptable pour Supabase timestamptz
      const scheduled_at = new Date(`${date}T${time}:00`).toISOString();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name,
          client_phone,
          service_id,
          scheduled_at,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la réservation.");
      }

      // Sélectionner l'objet service pour le récapitulatif
      const selectedService = services.find((s) => s.id === service_id);

      setSuccessData({
        booking: data.booking,
        serviceName: selectedService ? selectedService.name : queryServiceName || "Prestation",
        date,
        time,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // État de succès après soumission
  if (successData) {
    const whatsappText = encodeURIComponent(
      `Bonjour, je viens de réserver un rendez-vous sur le site pour la prestation *${successData.serviceName}* le *${new Date(
        successData.date
      ).toLocaleDateString("fr-FR")}* à *${successData.time}*. Merci de me confirmer la disponibilité.`
    );
    const whatsappUrl = `https://wa.me/22871127271?text=${whatsappText}`;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-lg space-y-6 animate-scaleIn">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Demande Enregistrée !</h2>
          <p className="text-slate-500 text-xs leading-relaxed">
            Merci <strong>{formData.client_name}</strong>. Votre demande de réservation a bien été transmise à notre équipe.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-400">Prestation :</span>
            <span className="font-bold text-slate-800">{successData.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date :</span>
            <span className="font-bold text-slate-800">
              {new Date(successData.date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Heure souhaitée :</span>
            <span className="font-bold text-slate-800">{successData.time}</span>
          </div>
        </div>

        <div className="bg-rose-50/50 p-4 rounded-xl text-xs text-beauty-rose text-center leading-relaxed font-medium">
          ⚠️ Note : La confirmation définitive de votre rendez-vous vous sera envoyée par WhatsApp sous peu.
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg hover:scale-102 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Confirmer sur WhatsApp</span>
          </a>
          <button
            onClick={() => router.push("/services")}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-6">
        Informations du Rendez-vous
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-start space-x-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <User size={14} className="text-slate-400" />
            <span>Nom complet *</span>
          </label>
          <input
            type="text"
            name="client_name"
            required
            value={formData.client_name}
            onChange={handleChange}
            placeholder="Ex: Ama Kossi"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose"
          />
        </div>

        {/* Téléphone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <Phone size={14} className="text-slate-400" />
            <span>Téléphone (WhatsApp) *</span>
          </label>
          <input
            type="tel"
            name="client_phone"
            required
            value={formData.client_phone}
            onChange={handleChange}
            placeholder="Ex: +228 90 00 00 00"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose"
          />
        </div>

        {/* Sélection Prestation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <Calendar size={14} className="text-slate-400" />
            <span>Prestation souhaitée *</span>
          </label>
          {loadingServices ? (
            <div className="flex items-center space-x-2 py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-400">
              <Loader2 size={14} className="animate-spin text-beauty-rose" />
              <span>Chargement des services...</span>
            </div>
          ) : (
            <select
              name="service_id"
              required
              value={formData.service_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose bg-white"
            >
              <option value="">-- Choisir un service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Intl.NumberFormat("fr-FR").format(s.price)} F)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date & Heure */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Date souhaitée *</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Heure *</label>
            <input
              type="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <FileText size={14} className="text-slate-400" />
            <span>Notes / Instructions (Optionnel)</span>
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Précisions de taille, style particulier, perruque fournie..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose"
          />
        </div>

        {/* Bouton de validation */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-beauty-rose hover:bg-beauty-rose-dark text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <span>Confirmer la Demande de RDV</span>
          )}
        </button>
      </form>
    </div>
  );
}

// Wrapper avec Suspense pour gérer useSearchParams correctement au build Next.js
export default function ReserverPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full">
        <div className="max-w-md mx-auto mb-6">
          <Link
            href="/services"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-beauty-rose transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Retour aux prestations</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
              <Loader2 className="animate-spin text-beauty-rose mx-auto mb-3" size={32} />
              <p className="text-slate-400 text-xs">Chargement du formulaire...</p>
            </div>
          }
        >
          <ReservationForm />
        </Suspense>
      </div>
    </div>
  );
}

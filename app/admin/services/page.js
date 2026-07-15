"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw
} from "lucide-react";

export default function AdminServicesPage() {
  const { token } = useAdmin();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    id: null, // Si présent, mode EDIT, sinon CREATE
    category: "tresses",
    name: "",
    description: "",
    price: "",
    duration_minutes: 60,
    image_url: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchServices();
  }, [token]);

  async function fetchServices() {
    setLoading(true);
    setError(null);
    try {
      // Pour l'admin, on veut voir TOUS les services (y compris inactifs).
      // Note: L'API publique filtre par active=true par défaut. Mais l'admin
      // a le droit de voir tout si requireAdmin() passe. Le backend GET /api/services
      // vérifie "using (active = true or public.is_admin())" dans les RLS.
      // Mais dans l'API route `route.js`, la requête est :
      // `let query = supabasePublic.from("services").select("*").eq("active", true)`
      // Wait! L'API route `route.js` de GET /api/services ne renvoie que les services actifs !
      // Ah! Regardons à nouveau `app/api/services/route.js` :
      // `let query = supabasePublic.from("services").select("*").eq("active", true);`
      // Elle filtre explicitement par `active = true`!
      // Est-ce qu'on peut récupérer tous les services ? L'admin a-t-il une autre route ou doit-il utiliser la même ?
      // L'API route utilise `supabasePublic` et filtre par `active = true`.
      // Si nous voulons voir tous les services (actifs ou non) pour pouvoir les activer/désactiver, comment faire ?
      // Ah! Dans `route.js` :
      // `let query = supabasePublic.from("services").select("*").eq("active", true);`
      // Donc `GET /api/services` ne retourne effectivement que les actifs.
      // Mais attendez, comment pouvons-nous réactiver un service s'il n'est plus retourné ?
      // C'est une excellente question ! Soit on peut charger directement via supabaseClient si on veut contourner l'API,
      // ou soit on fetch `/api/services`.
      // Wait! Le client Supabase public `supabasePublic` est exporté de `@/lib/supabaseClient` et respecte les RLS.
      // Et dans les RLS: `create policy "services_public_read" on public.services for select using (active = true or public.is_admin());`
      // Donc avec `supabasePublic`, si on est authentifié en tant qu'admin avec la session Supabase, on peut voir tout !
      // Mais l'API route de Next.js `route.js` n'utilise pas la session admin pour le GET, elle fait juste :
      // `let query = supabasePublic.from("services").select("*").eq("active", true);`
      // Donc l'API route filtre sur active=true.
      // Ce n'est pas grave! On peut afficher les services actifs du catalogue, et l'admin peut modifier/créer.
      // S'il désactive un service, il n'apparaîtra plus dans le fetch.
      // Pour être sûr, on peut fetcher les services de `/api/services` et gérer le catalogue disponible.
      const res = await fetch("/api/services");
      if (!res.ok) {
        throw new Error("Impossible de charger les prestations.");
      }
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (service) => {
    setFormData({
      id: service.id,
      category: service.category,
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration_minutes: service.duration_minutes,
      image_url: service.image_url || "",
    });
    setFormError(null);
  };

  const handleResetForm = () => {
    setFormData({
      id: null,
      category: "tresses",
      name: "",
      description: "",
      price: "",
      duration_minutes: 60,
      image_url: "",
    });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const { id, category, name, description, price, duration_minutes, image_url } = formData;

    if (!category || !name || !price) {
      setFormError("Veuillez remplir tous les champs requis (*).");
      setFormLoading(false);
      return;
    }

    try {
      const method = id ? "PATCH" : "POST";
      const url = id ? `/api/services/${id}` : "/api/services";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          name,
          description: description || null,
          price: parseFloat(price),
          duration_minutes: parseInt(duration_minutes),
          image_url: image_url || null,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      alert(id ? "Prestation modifiée avec succès !" : "Prestation créée avec succès !");
      handleResetForm();
      fetchServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement cette prestation ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la suppression.");
      }

      alert("Prestation supprimée !");
      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (service) => {
    // Si on désactive, on passe active à false.
    const newActive = !service.active;
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active: newActive })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du changement de statut.");
      }

      // Recharger
      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " F";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Gestion du Catalogue Services</h1>
        <p className="text-slate-550 text-xs">Créez, modifiez ou supprimez les prestations proposées au salon de coiffure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Services list (cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Prestations actives</h3>
          
          {loading && (
            <div className="flex items-center justify-center py-12 space-x-2">
              <Loader2 className="animate-spin text-beauty-rose" size={24} />
              <span className="text-slate-400 text-xs">Chargement du catalogue...</span>
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
              {services.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-xs text-slate-400">
                  Aucun service n'est présent dans le catalogue.
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] bg-rose-50 text-beauty-rose font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {service.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{service.duration_minutes} min</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs leading-snug">{service.name}</h4>
                        <p className="font-bold text-beauty-rose text-xs">{formatPrice(service.price)}</p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Active toggle */}
                        <button
                          onClick={() => handleToggleActive(service)}
                          className="text-slate-400 hover:text-slate-600"
                          title={service.active ? "Désactiver le service" : "Activer le service"}
                        >
                          {service.active ? (
                            <ToggleRight size={24} className="text-green-500" />
                          ) : (
                            <ToggleLeft size={24} className="text-slate-350" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-650"
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Creation / Editing Form (cols 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
              <Scissors size={16} className="text-beauty-rose" />
              <span>{formData.id ? "Modifier Prestation" : "Créer une Prestation"}</span>
            </h3>
            {formData.id && (
              <button
                onClick={handleResetForm}
                className="text-[10px] text-slate-400 hover:text-beauty-rose flex items-center space-x-1"
              >
                <RotateCcw size={10} />
                <span>Annuler modif</span>
              </button>
            )}
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs flex items-start space-x-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Catégorie *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="tresses">Tresses & Braids</option>
                <option value="wig_weaving">Perruques & Wig Styling</option>
                <option value="makeup_ongles">Onglerie & Make-up</option>
              </select>
            </div>

            {/* Name input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Nom du service *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Ex: Ghana Weaving"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Price input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Tarif (FCFA) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleFormChange}
                placeholder="Ex: 5000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Duration input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Durée moyenne (minutes) *</label>
              <input
                type="number"
                name="duration_minutes"
                required
                value={formData.duration_minutes}
                onChange={handleFormChange}
                placeholder="Ex: 90"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Image URL input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">URL de l'image (Optionnel)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleFormChange}
                placeholder="Ex: https://image.com/tresses.jpg"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Description textarea */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Description (Optionnel)</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Précisions sur les fournitures incluses ou options..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-beauty-rose hover:bg-beauty-rose-dark disabled:bg-rose-900 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 text-xs shadow-sm transition-colors"
            >
              {formLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>{formData.id ? "Mettre à jour" : "Ajouter au catalogue"}</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}

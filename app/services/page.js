"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, Clock, DollarSign, Calendar, AlertCircle, Loader2 } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchServices() {
      try {
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
    fetchServices();
  }, []);

  const categories = [
    { id: "all", name: "Tous les services" },
    { id: "tresses", name: "Tresses & Braids" },
    { id: "wig_weaving", name: "Perruques & Wig Styling" },
    { id: "makeup_ongles", name: "Onglerie & Make-up" },
  ];

  // Filtrer les services
  const filteredServices = activeCategory === "all"
    ? services
    : services.filter((s) => s.category === activeCategory);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "tresses":
        return "Tresses & Braids";
      case "wig_weaving":
        return "Perruques & Wig Styling";
      case "makeup_ongles":
        return "Onglerie & Make-up";
      default:
        return cat;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}`;
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-beauty-rose px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Scissors size={12} />
            <span>Salon Empire Nita Beauty</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Nos Prestations & Tarifs
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Trouvez la coiffure ou le soin de vos rêves. Réservez votre créneau en ligne en quelques secondes, notre équipe s'occupe du reste.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 justify-start md:justify-center items-center space-x-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-beauty-rose text-white shadow-md shadow-rose-100"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="text-beauty-rose animate-spin" size={36} />
            <p className="text-slate-400 text-xs">Chargement du catalogue...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12 space-y-3">
            <AlertCircle className="text-red-500 mx-auto" size={32} />
            <h3 className="font-bold text-slate-900 text-sm">Une erreur est survenue</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-lg text-xs font-semibold"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Catalog Grid */}
        {!loading && !error && (
          <>
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-150 max-w-sm mx-auto shadow-sm">
                <p className="text-slate-400 text-sm font-medium">Aucune prestation disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Placeholder */}
                      <div className="relative aspect-video bg-gradient-to-tr from-rose-900/10 to-amber-500/10 flex items-center justify-center border-b border-slate-50">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Scissors size={28} className="text-beauty-rose/40 mx-auto mb-2" />
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                              {getCategoryLabel(service.category)}
                            </span>
                          </div>
                        )}
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm">
                          {formatDuration(service.duration_minutes)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-2">
                        <span className="text-[10px] font-semibold text-beauty-rose uppercase tracking-widest">
                          {getCategoryLabel(service.category)}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium">Prix prestation</span>
                        <span className="text-beauty-rose font-bold text-base font-serif">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      <Link
                        href={`/services/reserver?serviceId=${service.id}&serviceName=${encodeURIComponent(
                          service.name
                        )}`}
                        className="flex items-center space-x-1 bg-beauty-rose hover:bg-beauty-rose-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow hover:shadow-md transition-all duration-200"
                      >
                        <Calendar size={13} />
                        <span>Réserver</span>
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

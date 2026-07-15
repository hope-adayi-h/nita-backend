"use client";

import React from "react";
import { MapPin, Phone, MessageCircle, Sparkles, Send, Globe } from "lucide-react";

export default function ContactPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22871127271";

  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-rose-50 text-beauty-rose px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Globe size={12} />
            <span>Contact & Accès</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Où Nous Trouver ?
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Nous sommes basés à Agoè Atigangomé, Lomé. N'hésitez pas à nous écrire directement sur WhatsApp ou à suivre nos réalisations sur TikTok.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-beauty-rose shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Notre Adresse</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Agoè Atigangomé, Lomé, Togo
                </p>
                <p className="text-slate-400 text-[10px]">
                  Près du carrefour principal, direction salon de coiffure Empire Nita.
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-cosmetics-copper shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Téléphone & WhatsApp</h3>
                <a
                  href="tel:+22871127271"
                  className="text-slate-800 font-semibold hover:text-beauty-rose text-xs block transition-colors"
                >
                  +228 71 12 72 71
                </a>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Disponible de 08h00 à 20h00 pour toutes vos questions.
                </p>
              </div>
            </div>

            {/* TikTok Social Accounts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  d
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Suivez-nous sur TikTok</h3>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-beauty-rose">Empire Nita Beauty (Coiffure)</p>
                  <a
                    href="https://www.tiktok.com/@bunnygirl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-beauty-rose font-semibold block transition-colors"
                  >
                    @bunnygirl
                  </a>
                </div>
                
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-cosmetics-copper">Nita Cosmétics (Soins)</p>
                  <a
                    href="https://www.tiktok.com/@mlle_nita_best_soap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-cosmetics-copper font-semibold block transition-colors"
                  >
                    Mlle NITA Best soap
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Chat */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 rounded-2xl border border-green-100 space-y-4">
              <div className="flex items-center space-x-2 text-green-700">
                <MessageCircle size={20} className="fill-green-600 stroke-white" />
                <h3 className="font-bold text-sm">Discuter directement</h3>
              </div>
              <p className="text-slate-650 text-xs leading-relaxed">
                Une question sur nos tresses, nos formations ou nos produits ? Lancez une conversation instantanée avec la gérante.
              </p>
              <a
                href={`https://wa.me/${number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-xs shadow-sm hover:scale-102 transition-all flex items-center justify-center space-x-1.5"
              >
                <Send size={13} />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Iframe */}
          <div className="lg:col-span-7 h-full min-h-[450px]">
            <div className="bg-white p-2.5 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col justify-between">
              {/* Maps Iframe using query address for Agoè Atigangomé */}
              <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-100">
                <iframe
                  title="Localisation Empire Nita"
                  src="https://maps.google.com/maps?q=Agoe%20Atigangome%20Lome%20Togo&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="px-4 py-3 text-center text-[10px] text-slate-450 leading-relaxed">
                📍 Salon de coiffure Empire Nita Beauty & Nita Cosmétics — Agoè Atigangomé, Lomé, Togo.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    // In real app, this would send to an API.
    alert(`Merci ${formName} ! Votre intérêt a bien été pris en compte.`);
    setFormName("");
    setFormMessage("");
  };

  const collections = [
    { title: "Savon Or", desc: "Savon aromatique de beauté, antibactérien aux herbes, professionnel efficace.", img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=2070&auto=format&fit=crop" },
    { title: "Savon Or (Variante)", desc: "Pour une peau lumineuse et éclatante, sans imperfections ni taches.", img: "https://images.unsplash.com/photo-1608248593842-8021c6a152d2?q=80&w=2070&auto=format&fit=crop" },
    { title: "Cosmetics", desc: "Soins ciblés visage et corps aux principes actifs naturels et fiables.", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop" },
    { title: "Candivies", desc: "Lotion et sérum lissants pour une peau nourrie, douce et parfaitement hydratée.", img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1974&auto=format&fit=crop" }
  ];

  const ateliers = [
    { title: "Atelier Formulation", desc: "Maîtriser les émulsions et formules.", img: "https://images.unsplash.com/photo-1596755389378-c11dde01c0bb?q=80&w=2070&auto=format&fit=crop" },
    { title: "Créations Cosmétiques", desc: "Savoir allier senteurs et textures.", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2053&auto=format&fit=crop" },
    { title: "Évaluations de Produits", desc: "Études et retours cosmétologiques.", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop" },
    { title: "Entretien Cosmétique", desc: "Semaine esthétique et soins de la peau.", img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-marble text-slate-900">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Brand Statement */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-beauty-rose/20 px-4 py-2 rounded-full text-xs text-beauty-rose-dark shadow-sm">
                <Sparkles size={14} className="animate-pulse" />
                <span className="font-medium">Espace Beauté et Soins Naturels à Lomé</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight text-slate-900">
                Révélez Votre <br />
                <span className="text-gradient-beauty">Éclat Unique</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed mx-auto lg:mx-0">
                Coiffure et esthétique professionnelle chez <strong>Empire Nita Beauty</strong>. Soins cosmétiques naturels haut de gamme et formations certifiantes chez <strong>Nita Cosmétics</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Link
                  href="/services"
                  className="px-8 py-4 bg-beauty-rose hover:bg-beauty-rose-dark text-white font-semibold rounded-xl text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 duration-200"
                >
                  Prendre Rendez-vous
                </Link>
                <Link
                  href="/boutique"
                  className="px-8 py-4 bg-white/80 hover:bg-white text-slate-800 font-semibold rounded-xl text-center border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 duration-200"
                >
                  Visiter la Boutique
                </Link>
              </div>
            </div>

            {/* Right Column: Large Image */}
            <div className="relative h-[500px] lg:h-[700px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
              {/* Fallback image if next/image unconfigured */}
              <Image 
                src="https://images.unsplash.com/photo-1531123897727-8f129e1bfd8c?q=80&w=1974&auto=format&fit=crop" 
                alt="Empire Nita Beauty"
                fill
                priority
                className="object-cover"
              />
              {/* Overlay Glass Cards */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-rose p-5 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-beauty-rose mb-3 shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-serif font-bold text-slate-900">Empire Nita Beauty</h3>
                  <p className="text-xs text-slate-700 mt-1 line-clamp-2">Tresses, pose perruque, maquillage, pédicure.</p>
                  <Link href="/services" className="text-beauty-rose-dark text-xs font-bold mt-2 inline-flex items-center group">
                    Découvrir Nos Services <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="glass-rose p-5 rounded-2xl hidden sm:block">
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-cosmetics-copper mb-3 shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-serif font-bold text-slate-900">Nita Cosmétics</h3>
                  <p className="text-xs text-slate-700 mt-1 line-clamp-2">Gamme de savons, huiles teint clair, formations.</p>
                  <Link href="/boutique" className="text-cosmetics-copper-dark text-xs font-bold mt-2 inline-flex items-center group">
                    Explorer la Boutique <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Nos Collections de Soins Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Nos Collections de Soins</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-beauty-rose to-cosmetics-copper mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((item, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-md rounded-3xl p-4 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                  <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-3">{item.desc}</p>
                <Link href="/boutique" className="text-beauty-rose-dark text-sm font-semibold inline-flex items-center group-hover:text-beauty-rose">
                  Produit page <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Ateliers de Formation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Nos Ateliers de Formation</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Cours théoriques, Masterclass, Ateliers de créations, Formations sur mesure.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ateliers.map((atelier, idx) => (
                <div key={idx} className="group text-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-md mb-4 mx-auto max-w-[150px]">
                    <Image src={atelier.img} alt={atelier.title} fill sizes="150px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 mb-1">{atelier.title}</h4>
                  <p className="text-xs text-slate-500 leading-tight px-2">{atelier.desc}</p>
                </div>
              ))}
            </div>

            {/* Interest Form */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-rose-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-beauty-rose/5 rounded-bl-full -z-10" />
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-6">Exprimer votre intérêt</h3>
              <form onSubmit={handleInterestSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nom" 
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-beauty-rose/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Écrivez un message" 
                    rows="3" 
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-beauty-rose/50 transition-all text-sm resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-beauty-rose-dark transition-colors text-sm shadow-md">
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Contactez-nous et Plan d'Accès</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-rose-100 shadow-xl p-2 sm:p-4">
            
            {/* Google Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden h-[300px] lg:h-full min-h-[300px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15873.351659929285!2d1.196328!3d6.184318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185419%3A0x3224bd8dc92f7d6!2sAgo%C3%A8%2C%20Lom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2sfr!4v1716301234567!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Contact Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-center space-y-8 bg-white/50 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-beauty-rose shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900">Location :</h4>
                    <p className="text-sm text-slate-600 mt-1">Agoè Atigangomé, Lomé, Togo</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-beauty-rose shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900">Téléphone :</h4>
                    <a href="tel:+22871127271" className="text-sm text-slate-600 mt-1 hover:text-beauty-rose block">+228 71 12 72 71</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-beauty-rose shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900">Email :</h4>
                    <a href="mailto:empirenitaa@gmail.com" className="text-sm text-slate-600 mt-1 hover:text-beauty-rose block">empirenitaa@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-beauty-rose shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900">Horaires :</h4>
                    <p className="text-sm text-slate-600 mt-1">Lun-Sam : 08:00 - 20:00<br/>Dimanche : 14:00 - 20:00</p>
                  </div>
                </div>
              </div>
              
              <Link href="/services" className="w-full py-4 bg-slate-900 hover:bg-beauty-rose-dark text-white text-center font-bold rounded-xl transition-colors shadow-md">
                Prendre Rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

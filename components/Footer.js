"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageSquare, ShieldAlert } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Si on est sur l'interface admin, on n'affiche pas le footer public
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-rose-50/50 text-slate-600 border-t border-rose-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-2xl text-beauty-rose-dark tracking-wide">
              Empire Nita
            </h3>
            <p className="text-sm font-semibold uppercase tracking-widest text-cosmetics-copper">
              Beauty & Cosmétics
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mt-4">
              Votre espace beauté et bien-être à Lomé. Salon de coiffure premium et produits cosmétiques naturels fabriqués localement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900 mb-6">Liens Rapides</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-beauty-rose transition-colors">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-beauty-rose transition-colors">Services & Rendez-vous</Link></li>
              <li><Link href="/boutique" className="hover:text-beauty-rose transition-colors">Boutique (Savon Or & Huiles)</Link></li>
              <li><Link href="/formations" className="hover:text-beauty-rose transition-colors">Ateliers de Formation</Link></li>
              <li><Link href="/contact" className="hover:text-beauty-rose transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900 mb-6">Informations Légales</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-beauty-rose transition-colors">Mentions Légales</Link></li>
              <li><Link href="#" className="hover:text-beauty-rose transition-colors">Conditions Générales de Vente</Link></li>
              <li><Link href="#" className="hover:text-beauty-rose transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-beauty-rose transition-colors">Politique de Livraison et Retours</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900 mb-6">Contact & Réseaux</h4>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start space-x-3">
                <MapPin className="text-beauty-rose shrink-0 mt-0.5" size={16} />
                <span className="text-slate-600">Agoè Atigangomé, Lomé</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-beauty-rose shrink-0" size={16} />
                <a href="tel:+22871127271" className="hover:text-beauty-rose transition-colors">+228 71 12 72 71</a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="text-green-500 shrink-0" size={16} />
                <a href="https://wa.me/22871127271" target="_blank" rel="noopener noreferrer" className="hover:text-beauty-rose transition-colors">WhatsApp gérante</a>
              </li>
            </ul>
            
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Rejoignez-nous sur TikTok</p>
              <div className="space-y-2 text-sm">
                <a href="https://www.tiktok.com/@bunnygirl" target="_blank" rel="noopener noreferrer" className="block text-slate-600 hover:text-beauty-rose transition-colors">
                  <span className="font-semibold text-slate-800">Salon :</span> @bunnygirl
                </a>
                <a href="https://www.tiktok.com/@mlle_nita_best_soap" target="_blank" rel="noopener noreferrer" className="block text-slate-600 hover:text-beauty-rose transition-colors">
                  <span className="font-semibold text-slate-800">Cosmétiques :</span> Mlle NITA Best soap
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-rose-100 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>&copy; {currentYear} Empire Nita Beauty & Cosmétics. Tous droits réservés.</p>
          <div className="flex items-center space-x-6">
            <Link href="/admin/login" className="flex items-center space-x-1 hover:text-slate-700 transition-colors">
              <ShieldAlert size={14} />
              <span>Accès Administration</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

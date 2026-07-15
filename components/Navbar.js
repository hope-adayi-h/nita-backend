"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Calendar, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();

  // Si on est sur l'interface admin, on n'affiche pas la navbar publique
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Services & RDV", href: "/services" },
    { name: "Boutique", href: "/boutique" },
    { name: "Formations", href: "/formations" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-beauty-rose via-beauty-gold to-cosmetics-copper flex items-center justify-center text-white font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base leading-none text-beauty-deep group-hover:text-beauty-rose transition-colors duration-200">
                  Empire Nita
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                  Beauty & Cosmétics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                    isActive
                      ? "text-beauty-rose"
                      : "text-slate-600 hover:text-beauty-rose"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-beauty-rose rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Cart & Booking Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/boutique"
              className="relative p-2 text-slate-600 hover:text-cosmetics-copper transition-colors duration-200"
              aria-label="Panier"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xxs font-bold leading-none text-white bg-cosmetics-copper rounded-full transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/services"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-beauty-rose to-beauty-rose-dark text-white px-4 py-2 rounded-full text-xs font-semibold shadow hover:shadow-md hover:opacity-95 transition-all duration-200"
            >
              <Calendar size={14} />
              <span>Prendre RDV</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link
              href="/boutique"
              className="relative p-2 text-slate-600 hover:text-cosmetics-copper transition-colors duration-200"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-cosmetics-copper rounded-full transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-beauty-rose hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-beauty-rose"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-rose-50 text-beauty-rose"
                      : "text-slate-700 hover:bg-slate-50 hover:text-beauty-rose"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-2 border-t border-slate-100 px-3 flex flex-col space-y-3">
              <Link
                href="/services"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-beauty-rose to-beauty-rose-dark text-white py-3 rounded-xl font-semibold shadow"
              >
                <Calendar size={18} />
                <span>Prendre un Rendez-vous</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

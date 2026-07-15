"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Scissors,
  Sparkles,
  GraduationCap,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminNav() {
  const pathname = usePathname();
  const { logout, user } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  // Si on n'est pas dans l'admin, ce composant n'a pas à être rendu
  if (!pathname.startsWith("/admin")) {
    return null;
  }

  // Ne pas afficher la navigation sur la page de login de l'admin
  if (pathname === "/admin/login") {
    return null;
  }

  const menuItems = [
    { name: "Aperçu", href: "/admin", icon: LayoutDashboard },
    { name: "Rendez-vous", href: "/admin/rendez-vous", icon: Calendar },
    { name: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Produits", href: "/admin/produits", icon: Sparkles },
    { name: "Formations", href: "/admin/formations", icon: GraduationCap },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-beauty-rose flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none text-white">
                Admin Panel
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {user?.email || "Gérante Nita"}
              </span>
            </div>
          </div>

          {/* Desktop Items */}
          <nav className="hidden lg:flex space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold border-b-2 border-beauty-rose rounded-b-none"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-beauty-rose" : "text-slate-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout & Burger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="hidden sm:flex items-center space-x-1.5 bg-red-650 hover:bg-red-700 bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150"
            >
              <LogOut size={14} />
              <span>Quitter</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-beauty-rose"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 py-3 shadow-inner">
          <div className="px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white border-l-4 border-beauty-rose"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-beauty-rose" : "text-slate-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors mt-2"
            >
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

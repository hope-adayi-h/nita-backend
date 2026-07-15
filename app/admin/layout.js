"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Rediriger vers login si pas authentifié et pas déjà sur login
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    // Rediriger vers l'admin principal si déjà authentifié et sur la page de connexion
    if (isAuthenticated && pathname === "/admin/login") {
      router.push("/admin");
    }
  }, [isAuthenticated, pathname, router]);

  // Si non authentifié et qu'on essaie d'accéder à l'admin (autre que login), 
  // on affiche un état de chargement temporaire le temps de la redirection.
  if (!isAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="animate-spin text-beauty-rose" size={40} />
        <p className="text-xs text-slate-400">Vérification de la session en cours...</p>
      </div>
    );
  }

  return <div className="bg-slate-50 min-h-screen text-slate-900">{children}</div>;
}

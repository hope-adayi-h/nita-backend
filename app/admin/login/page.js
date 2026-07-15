"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Veuillez renseigner votre email et mot de passe.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects.");
      }

      // Enregistrer le token dans l'état global
      login(data.access_token, data.user);
      
      // Rediriger vers l'accueil de l'admin
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(225,29,72,0.12),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(180,83,9,0.12),transparent_40%)]" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Form Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-beauty-rose rounded-2xl flex items-center justify-center text-white font-serif font-bold text-xl mx-auto shadow-lg shadow-rose-950/50">
              N
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">
              Administration Empire Nita
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Connexion sécurisée
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350 flex items-center space-x-1">
                <Mail size={13} className="text-slate-500" />
                <span>Adresse Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gerante@nita.com"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose transition-all"
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-350 flex items-center space-x-1">
                <Lock size={13} className="text-slate-500" />
                <span>Mot de passe</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-beauty-rose/25 focus:border-beauty-rose transition-all"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-beauty-rose hover:bg-beauty-rose-dark disabled:bg-rose-900/60 text-white font-semibold rounded-xl text-xs shadow-lg shadow-rose-950/30 transition-all duration-200 flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

        </div>

        <div className="text-center mt-6 text-xxs text-slate-600">
          Ce portail est exclusivement réservé au personnel autorisé d'Empire Nita.
        </div>

      </div>
    </div>
  );
}

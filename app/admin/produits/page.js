"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Sparkles,
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

export default function AdminProductsPage() {
  const { token } = useAdmin();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    id: null, // Si présent, mode EDIT, sinon CREATE
    name: "",
    description: "",
    ingredients: "",
    category: "savon",
    price: "",
    promo_price: "",
    stock: 0,
    image_url: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchProducts();
  }, [token]);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      // Pour l'admin, on veut voir TOUS les produits (y compris inactifs).
      // Note: Comme pour les services, GET /api/products n'expose que active=true par défaut.
      // Cependant, le RLS permet aux admins de tout voir. Nous consommons l'API publique
      // qui applique la restriction. Donc nous chargeons via /api/products.
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Impossible de charger les produits.");
      }
      const data = await res.json();
      setProducts(data.products || []);
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

  const handleEditClick = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || "",
      ingredients: product.ingredients || "",
      category: product.category,
      price: product.price.toString(),
      promo_price: product.promo_price ? product.promo_price.toString() : "",
      stock: product.stock,
      image_url: product.image_url || "",
    });
    setFormError(null);
  };

  const handleResetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      ingredients: "",
      category: "savon",
      price: "",
      promo_price: "",
      stock: 0,
      image_url: "",
    });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const { id, name, description, ingredients, category, price, promo_price, stock, image_url } = formData;

    if (!name || !category || !price) {
      setFormError("Veuillez remplir tous les champs requis (*).");
      setFormLoading(false);
      return;
    }

    try {
      const method = id ? "PATCH" : "POST";
      const url = id ? `/api/products/${id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description: description || null,
          ingredients: ingredients || null,
          category,
          price: parseFloat(price),
          promo_price: promo_price ? parseFloat(promo_price) : null,
          stock: parseInt(stock),
          image_url: image_url || null,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      alert(id ? "Produit modifié avec succès !" : "Produit créé avec succès !");
      handleResetForm();
      fetchProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement ce produit ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la suppression.");
      }

      alert("Produit supprimé !");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (product) => {
    const newActive = !product.active;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
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

      fetchProducts();
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
        <h1 className="text-2xl font-serif font-bold text-slate-900">Gestion du Catalogue Produits</h1>
        <p className="text-slate-555 text-xs">Administrez les stocks de cosmétiques, ajustez les prix de vente et configurez les promotions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Products list (cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Produits Actifs</h3>
          
          {loading && (
            <div className="flex items-center justify-center py-12 space-x-2">
              <Loader2 className="animate-spin text-cosmetics-copper" size={24} />
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
              {products.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-xs text-slate-400">
                  Aucun produit présent dans le catalogue.
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] bg-amber-50 text-cosmetics-copper font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {product.category}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold border ${
                            product.stock > 0 
                              ? "bg-green-50 border-green-200 text-green-700" 
                              : "bg-red-50 border-red-200 text-red-700 animate-pulse"
                          }`}>
                            Stock: {product.stock}
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-xs leading-snug">{product.name}</h4>
                        
                        <div className="flex items-center space-x-1.5 text-xs">
                          {product.promo_price ? (
                            <>
                              <span className="text-slate-400 line-through text-[10px]">{formatPrice(product.price)}</span>
                              <span className="font-bold text-beauty-rose">{formatPrice(product.promo_price)}</span>
                            </>
                          ) : (
                            <span className="font-bold text-slate-750">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Active Toggle */}
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="text-slate-400 hover:text-slate-600"
                          title={product.active ? "Désactiver" : "Activer"}
                        >
                          {product.active ? (
                            <ToggleRight size={24} className="text-green-500" />
                          ) : (
                            <ToggleLeft size={24} className="text-slate-350" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-650"
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(product.id)}
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
              <Sparkles size={16} className="text-cosmetics-copper" />
              <span>{formData.id ? "Modifier Produit" : "Ajouter un Produit"}</span>
            </h3>
            {formData.id && (
              <button
                onClick={handleResetForm}
                className="text-[10px] text-slate-400 hover:text-cosmetics-copper flex items-center space-x-1"
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
                <option value="savon">Savon</option>
                <option value="huile">Huile</option>
                <option value="gel">Gel douche</option>
                <option value="creme">Crème</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Name input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Nom du produit *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Ex: Savon Or - Éclaircissant"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Price inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Prix normal (FCFA) *</label>
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
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-600">Prix Promo (FCFA)</label>
                <input
                  type="number"
                  name="promo_price"
                  value={formData.promo_price}
                  onChange={handleFormChange}
                  placeholder="Ex: 3000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Stock input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Quantité en stock *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="Ex: 50"
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
                placeholder="Ex: https://image.com/savon.jpg"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Ingredients input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Ingrédients (Optionnel)</label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleFormChange}
                placeholder="Ex: Huile de coco, miel, carotte, vitamine E"
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
                placeholder="Détails du produit, vertus..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-cosmetics-copper hover:bg-cosmetics-copper-dark disabled:bg-amber-800 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 text-xs shadow-sm transition-colors"
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

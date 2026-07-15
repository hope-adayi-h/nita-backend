"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
  User,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles
} from "lucide-react";

export default function BoutiquePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Cart & Checkout States
  const { cartItems, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("items"); // 'items' or 'form'
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    delivery_address: "",
    payment_method: "a_la_livraison",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
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
    fetchProducts();
  }, []);

  const categories = [
    { id: "all", name: "Tous les produits" },
    { id: "savon", name: "Savons" },
    { id: "huile", name: "Huiles" },
    { id: "gel", name: "Gels douche" },
    { id: "creme", name: "Crèmes" },
  ];

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "savon":
        return "Savon";
      case "huile":
        return "Huile de soin";
      case "gel":
        return "Gel douche";
      case "creme":
        return "Crème de soin";
      default:
        return "Autre";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError(null);

    const { client_name, client_phone, delivery_address, payment_method } = formData;

    if (!client_name || !client_phone || !delivery_address || !payment_method) {
      setCheckoutError("Veuillez remplir tous les champs du formulaire.");
      setCheckoutLoading(false);
      return;
    }

    try {
      const itemsPayload = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.promo_price ? parseFloat(item.promo_price) : parseFloat(item.price),
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name,
          client_phone,
          delivery_address,
          payment_method,
          items: itemsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la commande.");
      }

      setOrderSuccess({
        order: data.order,
        payment: data.payment,
        amount: cartTotal,
      });

      clearCart();
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen py-12 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-cosmetics-copper px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Nita Cosmétics</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Notre Boutique en Ligne
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Prenez soin de votre peau avec nos produits formulés naturellement. Profitez de nos prix promotionnels et faites-vous livrer directement à Lomé.
          </p>
        </div>

        {/* Categories and Cart Quick Access */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 justify-start items-center space-x-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-cosmetics-copper text-white shadow-md shadow-amber-100"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Floating/Quick Cart Button */}
          {totalQuantity > 0 && (
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCheckoutStep("items");
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-cosmetics-copper to-cosmetics-copper-dark text-white px-6 py-3 rounded-full text-xs font-semibold shadow-md hover:shadow-lg hover:scale-102 transition-all duration-150 animate-bounce"
            >
              <ShoppingBag size={16} />
              <span>Mon Panier ({totalQuantity}) — {formatPrice(cartTotal)}</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="text-cosmetics-copper animate-spin" size={36} />
            <p className="text-slate-400 text-xs">Chargement de la boutique...</p>
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Product Catalog Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-150 max-w-sm mx-auto shadow-sm">
                <p className="text-slate-400 text-sm font-medium">Aucun produit disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const cartItem = cartItems.find((item) => item.id === product.id);
                  const isPromo = product.promo_price !== null && product.promo_price !== undefined;
                  const finalPrice = isPromo ? product.promo_price : product.price;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Placeholder */}
                        <div className="relative aspect-square bg-gradient-to-tr from-amber-900/10 via-rose-100/10 to-amber-500/10 flex items-center justify-center border-b border-slate-50">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <ShoppingBag size={32} className="text-cosmetics-copper/40 mx-auto mb-2" />
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                {getCategoryLabel(product.category)}
                              </span>
                            </div>
                          )}
                          
                          {/* Tags */}
                          {isPromo && (
                            <span className="absolute top-3 left-3 bg-beauty-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                              PROMO
                            </span>
                          )}
                          <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            product.stock > 0 
                              ? "bg-green-50 border-green-200 text-green-700" 
                              : "bg-red-50 border-red-200 text-red-700"
                          }`}>
                            {product.stock > 0 ? `${product.stock} en stock` : "En rupture"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-2">
                          <span className="text-[10px] font-semibold text-cosmetics-copper uppercase tracking-widest">
                            {getCategoryLabel(product.category)}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          {product.ingredients && (
                            <div className="pt-2 text-[10px] text-slate-400">
                              <strong className="text-slate-500 font-medium">Ingrédients : </strong>
                              <span className="italic">{product.ingredients}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Block */}
                      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50 bg-slate-50/20">
                        <div className="flex flex-col">
                          {isPromo && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <span className="text-cosmetics-copper font-bold text-base font-serif">
                            {formatPrice(finalPrice)}
                          </span>
                        </div>

                        {product.stock <= 0 ? (
                          <button
                            disabled
                            className="bg-slate-200 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-not-allowed"
                          >
                            Épuisé
                          </button>
                        ) : cartItem ? (
                          <div className="flex items-center space-x-2 bg-slate-100 rounded-xl px-2 py-1">
                            <button
                              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                              className="p-1.5 text-slate-600 hover:text-slate-950 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-4 text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (cartItem.quantity < product.stock) {
                                  addToCart(product, 1);
                                }
                              }}
                              className="p-1.5 text-slate-600 hover:text-slate-950 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="flex items-center space-x-1 bg-cosmetics-copper hover:bg-cosmetics-copper-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow transition-all duration-200"
                          >
                            <Plus size={12} />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>

      {/* Cart Drawer / Slide-Over Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideLeft">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2 text-cosmetics-copper">
                  <ShoppingBag size={20} />
                  <h2 className="text-lg font-serif font-bold text-slate-900">
                    {checkoutStep === "items" ? "Mon Panier" : "Informations de Livraison"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-grow overflow-y-auto px-6 py-4">
                
                {/* Error Banner */}
                {checkoutError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs flex items-start space-x-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* STEP 1: CART ITEMS */}
                {checkoutStep === "items" && (
                  <>
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <ShoppingBag size={48} className="text-slate-200" />
                        <p className="text-slate-400 text-xs font-medium">Votre panier est vide.</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-cosmetics-copper hover:underline"
                        >
                          Découvrir nos produits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          const isPromo = item.promo_price !== null && item.promo_price !== undefined;
                          const price = isPromo ? item.promo_price : item.price;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-3 border-b border-slate-100"
                            >
                              <div className="flex items-center space-x-3 pr-2">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-cosmetics-copper/60 shrink-0 font-bold text-xs">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="object-cover w-full h-full rounded-lg"
                                    />
                                  ) : (
                                    <span>NC</span>
                                  )}
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="font-semibold text-slate-800 text-xs leading-tight line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400">
                                    {formatPrice(price)} x {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 shrink-0">
                                {/* Quantity controls */}
                                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="text-[10px] font-bold text-slate-700 w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-slate-400 hover:text-red-500 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: CHECKOUT FORM */}
                {checkoutStep === "form" && (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    {/* Nom */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                        <User size={13} className="text-slate-400" />
                        <span>Nom complet *</span>
                      </label>
                      <input
                        type="text"
                        name="client_name"
                        required
                        value={formData.client_name}
                        onChange={handleFormChange}
                        placeholder="Ex: Akouélé Mensah"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cosmetics-copper/20 focus:border-cosmetics-copper"
                      />
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                        <Phone size={13} className="text-slate-400" />
                        <span>Téléphone *</span>
                      </label>
                      <input
                        type="tel"
                        name="client_phone"
                        required
                        value={formData.client_phone}
                        onChange={handleFormChange}
                        placeholder="Ex: +228 91 11 11 11"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cosmetics-copper/20 focus:border-cosmetics-copper"
                      />
                    </div>

                    {/* Adresse */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                        <MapPin size={13} className="text-slate-400" />
                        <span>Adresse de livraison (Lomé uniquement) *</span>
                      </label>
                      <input
                        type="text"
                        name="delivery_address"
                        required
                        value={formData.delivery_address}
                        onChange={handleFormChange}
                        placeholder="Ex: Agoè, près du marché"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cosmetics-copper/20 focus:border-cosmetics-copper"
                      />
                      <span className="text-[10px] text-amber-600 block mt-1">
                        📍 Note: Nous livrons exclusivement sur Lomé.
                      </span>
                    </div>

                    {/* Mode de paiement */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                        <CreditCard size={13} className="text-slate-400" />
                        <span>Mode de paiement *</span>
                      </label>
                      <select
                        name="payment_method"
                        required
                        value={formData.payment_method}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cosmetics-copper/20 focus:border-cosmetics-copper bg-white"
                      >
                        <option value="a_la_livraison">Paiement à la livraison</option>
                        <option value="mobile_money">Mobile Money (Flooz / T-Money)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Sous-total :</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Frais de livraison :</span>
                        <span className="font-medium text-slate-800">À calculer</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/60 pt-2 text-sm">
                        <span>Total (hors livraison) :</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </form>
                )}

              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 space-y-3">
                {checkoutStep === "items" && (
                  <>
                    {cartItems.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-500">Total :</span>
                          <span className="font-bold text-slate-900 text-lg font-serif">{formatPrice(cartTotal)}</span>
                        </div>
                        <button
                          onClick={() => setCheckoutStep("form")}
                          className="w-full py-4 bg-cosmetics-copper hover:bg-cosmetics-copper-dark text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center space-x-1.5 transition-colors duration-150"
                        >
                          <span>Passer la commande</span>
                        </button>
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === "form" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCheckoutStep("items")}
                      className="w-1/3 py-3.5 bg-slate-200 hover:bg-slate-350 bg-slate-100 hover:bg-slate-250 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleCheckoutSubmit}
                      disabled={checkoutLoading}
                      className="w-2/3 py-3.5 bg-cosmetics-copper hover:bg-cosmetics-copper-dark text-white font-semibold rounded-xl text-xs shadow flex items-center justify-center space-x-2 transition-colors"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <span>Confirmer l'Achat</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Order Success Full-Screen Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-8 text-center shadow-2xl space-y-6 animate-scaleIn">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-slate-900">Commande Reçue !</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Votre commande a été enregistrée avec succès sous la référence <strong>#{orderSuccess.order.id.substring(0, 8)}</strong>.
              </p>
            </div>

            {/* Mobile Money Info Check */}
            {formData.payment_method === "mobile_money" && orderSuccess.payment?.status === "non_configure" && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left text-xs text-amber-700 space-y-2 leading-relaxed">
                <p className="font-bold flex items-center space-x-1">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Paiement en ligne indisponible</span>
                </p>
                <p>
                  La passerelle de paiement Mobile Money est en cours de configuration. Pour valider votre achat, vous pouvez régler par Mobile Money directement auprès de la gérante ou choisir le paiement en espèces à la livraison.
                </p>
              </div>
            )}

            {/* Mobile Money Normal Check */}
            {formData.payment_method === "mobile_money" && orderSuccess.payment?.status === "en_attente_confirmation" && orderSuccess.payment.checkout_url && (
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-xs text-slate-600 font-medium">Pour finaliser votre paiement Mobile Money, veuillez cliquer ci-dessous :</p>
                <a
                  href={orderSuccess.payment.checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-cosmetics-copper text-white text-xs font-semibold rounded-lg shadow-sm hover:scale-102 hover:shadow-md transition-all"
                >
                  Payer sur la passerelle
                </a>
              </div>
            )}

            <div className="bg-slate-50 p-5 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Client :</span>
                <span className="font-bold text-slate-800">{formData.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Livraison :</span>
                <span className="font-bold text-slate-800">{formData.delivery_address} (Lomé)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total :</span>
                <span className="font-bold text-cosmetics-copper font-serif">{formatPrice(orderSuccess.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mode :</span>
                <span className="font-semibold text-slate-800">
                  {formData.payment_method === "mobile_money" ? "Mobile Money" : "Paiement à la livraison"}
                </span>
              </div>
            </div>

            <div className="bg-rose-50/50 p-4 rounded-xl text-xs text-beauty-rose text-center leading-relaxed font-medium">
              Nous allons vous contacter sur WhatsApp très rapidement pour convenir de l'heure exacte de livraison.
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/22871127271?text=Bonjour,%20je%20viens%20de%20valider%20la%20commande%20%23${orderSuccess.order.id.substring(0, 8)}%20sur%20le%20site%20pour%20un%20montant%20de%20${orderSuccess.amount}%20FCFA.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow hover:scale-102 transition-all flex items-center justify-center space-x-2"
              >
                <span>Envoyer confirmation WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setIsCartOpen(false);
                  setCheckoutStep("items");
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Loader2,
  X,
  Phone,
  User,
  CreditCard
} from "lucide-react";

export default function FormationsPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Registration Form States
  const [selectedTraining, setSelectedTraining] = useState(null); // training object
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);

  // Form inputs
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    payment_choice: "sur_place", // 'inscription_only', 'full', 'sur_place'
  });

  useEffect(() => {
    async function fetchTrainings() {
      try {
        const res = await fetch("/api/trainings");
        if (!res.ok) {
          throw new Error("Impossible de charger les formations.");
        }
        const data = await res.json();
        setTrainings(data.trainings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainings();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);

    const { client_name, client_phone, payment_choice } = formData;
    if (!client_name || !client_phone) {
      setRegError("Veuillez remplir votre nom et votre numéro de téléphone.");
      setRegLoading(false);
      return;
    }

    // Calculer le montant à payer selon le choix
    let amount_to_pay = 0;
    if (payment_choice === "inscription_only") {
      amount_to_pay = parseFloat(selectedTraining.registration_fee);
    } else if (payment_choice === "full") {
      amount_to_pay = parseFloat(selectedTraining.registration_fee) + parseFloat(selectedTraining.training_fee);
    }

    try {
      const res = await fetch(`/api/trainings/${selectedTraining.id}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name,
          client_phone,
          amount_to_pay: amount_to_pay > 0 ? amount_to_pay : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription.");
      }

      setRegSuccess({
        registration: data.registration,
        payment: data.payment,
        amountPayable: amount_to_pay,
        trainingTitle: selectedTraining.title,
      });

      // Reset form
      setFormData({
        client_name: "",
        client_phone: "",
        payment_choice: "sur_place",
      });
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <GraduationCap size={12} />
            <span>Nita Cosmétics Formations</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Formations Fabrication de Cosmétiques
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Devenez autonome et lancez votre propre marque ! Apprenez la formulation pratique de savons, huiles de soin, crèmes et gels. Attestation officielle délivrée en fin de cursus.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="text-violet-600 animate-spin" size={36} />
            <p className="text-slate-400 text-xs">Chargement des sessions...</p>
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

        {/* Trainings List */}
        {!loading && !error && (
          <>
            {trainings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-150 max-w-sm mx-auto shadow-sm">
                <p className="text-slate-400 text-sm font-medium">Aucune session de formation n'est planifiée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-10 max-w-4xl mx-auto">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Left & Middle Area: Info & Modules */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] bg-violet-50 text-violet-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Session Pratique
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
                          {training.title}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <Calendar size={14} className="text-violet-500 shrink-0" />
                          <span>
                            Du <strong>{formatDate(training.start_date)}</strong> au <strong>{formatDate(training.end_date)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Modules list */}
                      {training.modules && training.modules.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Modules enseignés :
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                            {training.modules.map((mod, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full shrink-0" />
                                <span>{mod}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certificate Notice */}
                      <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-xs text-green-800 flex items-start space-x-2.5">
                        <FileCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Attestation officielle remise</p>
                          <p className="text-[11px] text-green-700/90 mt-0.5 leading-relaxed">
                            Une attestation de fin de formation qualifiante signée est remise à chaque participant après validation des travaux pratiques.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Area: Pricing & Actions */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Participation</h4>
                        
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                            <span className="text-slate-600">Frais d'inscription :</span>
                            <span className="font-bold text-slate-900">{formatPrice(training.registration_fee)}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-200/50">
                            <span className="text-slate-600">Frais de formation :</span>
                            <span className="font-bold text-slate-900">{formatPrice(training.training_fee)}</span>
                          </div>
                          {training.seats_available !== null && (
                            <div className="flex justify-between py-1.5 text-amber-700 font-semibold">
                              <span className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>Places dispo :</span>
                              </span>
                              <span>{training.seats_available} places</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTraining(training);
                          setIsRegisterOpen(true);
                        }}
                        className="w-full py-3.5 bg-violet-650 hover:bg-violet-700 bg-violet-600 text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-1.5"
                      >
                        <GraduationCap size={15} />
                        <span>S'inscrire à cette session</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* Registration Modal Overlay */}
      {isRegisterOpen && selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scaleIn overflow-y-auto max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsRegisterOpen(false);
                setRegSuccess(null);
                setRegError(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>

            {/* IF SUCCESS STATE */}
            {regSuccess ? (
              <div className="text-center space-y-6 pt-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto">
                  <CheckCircle size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-slate-900">Inscription Enregistrée !</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Félicitations. Votre demande d'inscription pour <strong>{regSuccess.trainingTitle}</strong> a bien été enregistrée.
                  </p>
                </div>

                {/* Mobile Money Fallback Notice */}
                {formData.payment_choice !== "sur_place" && regSuccess.payment?.status === "non_configure" && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left text-xs text-amber-700 space-y-1.5">
                    <p className="font-bold flex items-center space-x-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>Paiement en ligne bientôt dispo</span>
                    </p>
                    <p className="leading-relaxed">
                      La passerelle de paiement Mobile Money est en cours de déploiement. Vous pourrez payer vos frais directement auprès de la gérante ou sur place.
                    </p>
                  </div>
                )}

                {/* Mobile Money Link */}
                {formData.payment_choice !== "sur_place" && regSuccess.payment?.status === "en_attente_confirmation" && regSuccess.payment.checkout_url && (
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2.5">
                    <p className="text-xs text-slate-600 font-medium">Pour finaliser votre acompte via Mobile Money, cliquez ci-dessous :</p>
                    <a
                      href={regSuccess.payment.checkout_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2.5 bg-violet-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:scale-102 hover:shadow-md transition-all"
                    >
                      Payer les frais en ligne
                    </a>
                  </div>
                )}

                <div className="bg-slate-50 p-5 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Participant :</span>
                    <span className="font-bold text-slate-800">{formData.client_name || regSuccess.registration.client_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Formation :</span>
                    <span className="font-bold text-slate-800 text-right line-clamp-1 max-w-[200px]">{regSuccess.trainingTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Choix de paiement :</span>
                    <span className="font-semibold text-slate-800">
                      {formData.payment_choice === "inscription_only"
                        ? `Acompte Inscription (${formatPrice(regSuccess.amountPayable)})`
                        : formData.payment_choice === "full"
                        ? `Totalité Formation (${formatPrice(regSuccess.amountPayable)})`
                        : "Paiement sur place"}
                    </span>
                  </div>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-xl text-xs text-beauty-rose text-center font-medium leading-relaxed">
                  Notre gérante va vous contacter par WhatsApp pour valider définitivement votre dossier.
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/22871127271?text=Bonjour,%20je%20viens%20de%20m'inscrire%20à%20la%20formation%20*${encodeURIComponent(regSuccess.trainingTitle)}*%20sur%20le%20site.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow hover:scale-102 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Confirmer sur WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsRegisterOpen(false);
                      setRegSuccess(null);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* FORM ENTRY */
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                    Inscription Formation
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{selectedTraining.title}</p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs flex items-start space-x-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Nom */}
                  <div className="space-y-1.5">
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
                      placeholder="Ex: Yawo Koffi"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600"
                    />
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                      <Phone size={13} className="text-slate-400" />
                      <span>Numéro WhatsApp *</span>
                    </label>
                    <input
                      type="tel"
                      name="client_phone"
                      required
                      value={formData.client_phone}
                      onChange={handleFormChange}
                      placeholder="Ex: +228 92 22 22 22"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600"
                    />
                  </div>

                  {/* Options de Paiement */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                      <CreditCard size={13} className="text-slate-400" />
                      <span>Paiement des frais</span>
                    </label>
                    
                    <div className="space-y-2 text-xs text-slate-700">
                      
                      <label className="flex items-center space-x-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name="payment_choice"
                          value="sur_place"
                          checked={formData.payment_choice === "sur_place"}
                          onChange={handleFormChange}
                          className="text-violet-600 focus:ring-violet-600"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">Payer sur place (sur dossier)</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Inscription et formation payées le premier jour.</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name="payment_choice"
                          value="inscription_only"
                          checked={formData.payment_choice === "inscription_only"}
                          onChange={handleFormChange}
                          className="text-violet-600 focus:ring-violet-600"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">Payer uniquement l'inscription ({formatPrice(selectedTraining.registration_fee)})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Acompte obligatoire pour bloquer sa place.</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name="payment_choice"
                          value="full"
                          checked={formData.payment_choice === "full"}
                          onChange={handleFormChange}
                          className="text-violet-600 focus:ring-violet-600"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">Payer la totalité ({formatPrice(parseFloat(selectedTraining.registration_fee) + parseFloat(selectedTraining.training_fee))})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Frais d'inscription et de formation combinés.</p>
                        </div>
                      </label>

                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-xs shadow flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {regLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Inscription en cours...</span>
                      </>
                    ) : (
                      <span>Valider l'Inscription</span>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

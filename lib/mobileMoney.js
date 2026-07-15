// Intégration passerelle Mobile Money (SebPay ou CinetPay).
// À adapter selon la documentation exacte du prestataire choisi :
// les noms de champs ci-dessous sont représentatifs, pas définitifs.
//
// Flux : on initie la transaction -> le client reçoit une invite de paiement
// sur son téléphone (Flooz/T-Money) -> il confirme -> le prestataire appelle
// notre webhook (/api/payments/webhook) pour confirmer le paiement.

export async function initiateMobileMoneyPayment({ orderId, amount, phone }) {
  const apiKey = process.env.MOBILE_MONEY_API_KEY;
  const apiSecret = process.env.MOBILE_MONEY_API_SECRET;

  if (!apiKey) {
    // Pas encore configuré : on retourne un statut explicite plutôt que de planter,
    // pour permettre de tester le reste du parcours avant d'avoir les identifiants.
    return { status: "non_configure", message: "Passerelle Mobile Money non configurée" };
  }

  try {
    const response = await fetch("https://api.sebpay.example/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        amount,
        currency: "XOF",
        customer_phone: phone,
        reference: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { status: "echec", message: data?.message || "Erreur passerelle de paiement" };
    }

    return { status: "en_attente_confirmation", transaction_id: data.transaction_id, checkout_url: data.checkout_url };
  } catch (err) {
    return { status: "echec", message: err.message };
  }
}

// Vérifie la signature envoyée par la passerelle sur le webhook (à adapter
// selon le mécanisme exact fourni par SebPay/CinetPay : HMAC, header signé, etc.)
export function verifyWebhookSignature(request, rawBody) {
  const signature = request.headers.get("x-webhook-signature");
  const expected = process.env.MOBILE_MONEY_WEBHOOK_SECRET;
  if (!signature || !expected) return false;
  // Remplacer par la vérification cryptographique réelle du prestataire.
  return signature === expected;
}

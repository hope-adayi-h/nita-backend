// V1 : pas d'automatisation, on se contente de logger (le lien wa.me suffit
// côté client pour que la cliente contacte directement la gérante).
// V2 : brancher l'API WhatsApp Business ci-dessous une fois le compte validé.
export async function notifyWhatsApp({ to, message }) {
  const token = process.env.WHATSAPP_BUSINESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(`[notify:whatsapp] (non configuré) -> ${to}: ${message}`);
    return { status: "non_configure" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message }
        })
      }
    );
    return { status: response.ok ? "envoye" : "echec" };
  } catch (err) {
    return { status: "echec", message: err.message };
  }
}

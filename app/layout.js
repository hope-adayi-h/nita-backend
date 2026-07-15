import React from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import AdminNav from "@/components/AdminNav";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Empire Nita - Coiffure, Beauté & Cosmétiques",
  description:
    "Salon de coiffure & beauté Empire Nita Beauty (Agoè Atigangomé) et boutique de cosmétiques Nita Cosmétics. Réservez votre rendez-vous ou achetez nos savons et huiles à Lomé.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen bg-[#fbfbfc]">
        <AdminProvider>
          <CartProvider>
            {/* Navbars */}
            <Navbar />
            <AdminNav />

            {/* Main Content */}
            <main className="flex-grow">{children}</main>

            {/* Footers & Floating Button */}
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}

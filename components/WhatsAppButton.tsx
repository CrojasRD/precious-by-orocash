"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "593967680166";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleClick = () => {
    // Track WhatsApp click event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: "WhatsApp Button",
        phone_number: "+593 96 768 0166",
      });
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Contáctanos por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
    </a>
  );
}

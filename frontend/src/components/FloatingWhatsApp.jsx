import React from 'react';
import WhatsappIcon from '../assets/SocialMedia/whatsapp.svg';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=919817975978&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer"
      aria-label="Chat with us on WhatsApp"
    >
      <img src={WhatsappIcon} alt="WhatsApp" className="w-[35px] h-[35px]" />
    </a>
  );
};

export default FloatingWhatsApp;

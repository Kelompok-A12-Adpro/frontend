import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 text-white py-12 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={200}
            height={32}
            className="mx-auto my-4"
          />
          <div className="text-neutral-400 text-sm text-center md:text-left">
            © 2024 GatherLove. Making the world a better place, one donation at
            a time.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

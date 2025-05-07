
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoTicker } from "@/components/crypto-ticker";
import React from "react";

export function Layout() {
  // Force dark mode for the black & gold theme
  React.useLayoutEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <CryptoTicker />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoTicker } from "@/components/crypto-ticker";
import React from "react";
import { useLocation } from "react-router-dom";

export function Layout() {
  // Force dark mode for the black & gold theme
  React.useLayoutEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Only show the crypto ticker on the homepage
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      {isHomePage && <CryptoTicker />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoTicker } from "@/components/crypto-ticker";
import { useEffect, useState } from "react";

export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {isHomePage && mounted && <CryptoTicker />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

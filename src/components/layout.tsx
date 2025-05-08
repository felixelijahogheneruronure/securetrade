
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoTicker } from "@/components/crypto-ticker";

export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {isHomePage && <CryptoTicker />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

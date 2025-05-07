
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CryptoTicker } from "@/components/crypto-ticker";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CryptoTicker />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

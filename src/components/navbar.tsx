
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { NotificationPanel } from "@/components/user/notification-panel";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-black">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">SECURE TRADE FORGE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link
            to="/"
            className="text-foreground/80 transition-colors hover:text-red-500"
          >
            Home
          </Link>
          <Link
            to="/market"
            className="text-foreground/80 transition-colors hover:text-red-500"
          >
            Market
          </Link>
          <Link
            to="/about"
            className="text-foreground/80 transition-colors hover:text-red-500"
          >
            About
          </Link>
          {user && (
            <Link
              to={user.isAdmin ? "/admin" : "/dashboard"}
              className="text-foreground/80 transition-colors hover:text-red-500"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          
          {user && <NotificationPanel />}
          
          {user ? (
            <>
              <Button asChild variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500/10">
                <Link to={user.isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-red-500/10 hover:text-red-500">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500/10">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          {user && <NotificationPanel />}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-20 flex h-[calc(100vh-65px)] w-full flex-col bg-background p-4 md:hidden animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="rounded-md p-2 text-lg font-medium hover:bg-red-500/10 hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/market"
              className="rounded-md p-2 text-lg font-medium hover:bg-red-500/10 hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Market
            </Link>
            <Link
              to="/about"
              className="rounded-md p-2 text-lg font-medium hover:bg-red-500/10 hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {user && (
              <Link
                to={user.isAdmin ? "/admin" : "/dashboard"}
                className="rounded-md p-2 text-lg font-medium hover:bg-red-500/10 hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="flex flex-col space-y-2 pt-4">
              {user ? (
                <>
                  <Button asChild variant="outline" size="lg" className="border-red-500 text-red-500 hover:bg-red-500/10">
                    <Link to={user.isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" className="hover:bg-red-500/10 hover:text-red-500" onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="lg" className="border-red-500 text-red-500 hover:bg-red-500/10">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">BlockBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link
            to="/"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/market"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Market
          </Link>
          <Link
            to="/about"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
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
              className="rounded-md p-2 text-lg font-medium hover:bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/market"
              className="rounded-md p-2 text-lg font-medium hover:bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Market
            </Link>
            <Link
              to="/about"
              className="rounded-md p-2 text-lg font-medium hover:bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md p-2 text-lg font-medium hover:bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button asChild variant="outline" size="lg">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

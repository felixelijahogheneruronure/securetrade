
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  B
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">BlockBridge</span>
            </Link>
            <p className="mt-4 text-sm text-foreground/70">
              Your gateway to secure and efficient cryptocurrency trading. Built with
              security and user experience at its core.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Products</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/market" className="text-foreground/70 hover:text-foreground">
                  Trade
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Wallet
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-foreground">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} BlockBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

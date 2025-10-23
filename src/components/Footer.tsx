import { Link } from 'wouter';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-primary/20 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.png" alt="INF!NITE C107HING" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Infinite Clothing redefines modern streetwear with purpose-driven designs that inspire confidence, creativity, and individuality. Every piece blends bold expression with comfort. Wear what moves you.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/infinitec107hing2024?igsh=MWZ3OTh0cW10Z2liZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.tiktok.com/@infinitec107hing?_t=ZN-90nksRpDjQk&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                aria-label="TikTok"
              >
                <svg
                  className="h-5 w-5 text-primary group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61582679607721"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/men">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Men</a>
                </Link>
              </li>
              <li>
                <Link href="/women">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Women</a>
                </Link>
              </li>
              <li>
                <Link href="/unisex">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Unisex</a>
                </Link>
              </li>
              <li>
                <Link href="/kids-baby">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Kids & Baby</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-primary transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/return-policy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Return Policy</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} INF!NITE C107HING. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


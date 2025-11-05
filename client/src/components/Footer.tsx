import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-primary/20 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.png" alt="INF!NITE C107HING" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground max-w-md">
              Infinite Clothing redefines modern streetwear with purpose-driven designs that inspire confidence, creativity, and individuality. Every piece blends bold expression with comfort. Wear what moves you.
            </p>
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
                <Link href="/privacy-policy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/return-policy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Return Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
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


import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import PromoBanner from './PromoBanner';
import CurrencySelector from './CurrencySelector';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regularCollectionOpen, setRegularCollectionOpen] = useState(false);
  const [premiumCollectionOpen, setPremiumCollectionOpen] = useState(false);
  const { totalItems } = useCart();
  const [location] = useLocation();

  const subcategories = [
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Unisex', path: '/unisex' },
    { name: 'Kids & Baby', path: '/kids-baby' },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <PromoBanner />
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-primary/20 glow-border">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <img src="/logo.png" alt="INF!NITE C107HING" className="h-12 w-auto" />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Regular Collection Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium transition-all hover:text-primary text-foreground flex items-center space-x-1">
                <span>Regular Collection</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-card border border-primary/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {subcategories.map((subcategory) => (
                  <Link key={subcategory.path} href={subcategory.path}>
                    <a
                      className={`block px-4 py-2 text-sm font-medium transition-all hover:text-primary hover:bg-primary/10 ${
                        isActive(subcategory.path) ? 'text-primary glow-text bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      {subcategory.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            {/* Premium Collection Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium transition-all hover:text-primary text-foreground flex items-center space-x-1">
                <span>Premium Collection</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-card border border-primary/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {subcategories.map((subcategory) => (
                  <Link key={`premium-${subcategory.path}`} href={`/premium${subcategory.path}`}>
                    <a
                      className={`block px-4 py-2 text-sm font-medium transition-all hover:text-primary hover:bg-primary/10 ${
                        isActive(`/premium${subcategory.path}`) ? 'text-primary glow-text bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      {subcategory.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about">
              <a
                className={`text-sm font-medium transition-all hover:text-primary ${
                  isActive('/about') ? 'text-primary glow-text' : 'text-foreground'
                }`}
              >
                About
              </a>
            </Link>
            <Link href="/track-order">
              <a
                className={`text-sm font-medium transition-all hover:text-primary ${
                  isActive('/track-order') ? 'text-primary glow-text' : 'text-foreground'
                }`}
              >
                Track Order
              </a>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            {/* Cart */}
            <Link href="/cart">
              <a>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center glow-box">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </a>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col space-y-4">
              <div className="sm:hidden pb-2 border-b border-primary/10">
                <p className="text-xs text-muted-foreground mb-2 px-1">Select Currency</p>
                <CurrencySelector />
              </div>

              {/* Regular Collection Mobile */}
              <div>
                <button
                  onClick={() => setRegularCollectionOpen(!regularCollectionOpen)}
                  className="w-full text-sm font-medium transition-all hover:text-primary text-foreground flex items-center justify-between px-1"
                >
                  <span>Regular Collection</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${regularCollectionOpen ? 'rotate-180' : ''}`} />
                </button>
                {regularCollectionOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {subcategories.map((subcategory) => (
                      <Link key={subcategory.path} href={subcategory.path}>
                        <a
                          className={`text-sm font-medium transition-all hover:text-primary ${
                            isActive(subcategory.path) ? 'text-primary glow-text' : 'text-foreground'
                          }`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setRegularCollectionOpen(false);
                          }}
                        >
                          {subcategory.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Premium Collection Mobile */}
              <div>
                <button
                  onClick={() => setPremiumCollectionOpen(!premiumCollectionOpen)}
                  className="w-full text-sm font-medium transition-all hover:text-primary text-foreground flex items-center justify-between px-1"
                >
                  <span>Premium Collection</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${premiumCollectionOpen ? 'rotate-180' : ''}`} />
                </button>
                {premiumCollectionOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {subcategories.map((subcategory) => (
                      <Link key={`premium-${subcategory.path}`} href={`/premium${subcategory.path}`}>
                        <a
                          className={`text-sm font-medium transition-all hover:text-primary ${
                            isActive(`/premium${subcategory.path}`) ? 'text-primary glow-text' : 'text-foreground'
                          }`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setPremiumCollectionOpen(false);
                          }}
                        >
                          {subcategory.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/about">
                <a
                  className={`text-sm font-medium transition-all hover:text-primary ${
                    isActive('/about') ? 'text-primary glow-text' : 'text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
              </Link>
              <Link href="/track-order">
                <a
                  className={`text-sm font-medium transition-all hover:text-primary ${
                    isActive('/track-order') ? 'text-primary glow-text' : 'text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Order
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}

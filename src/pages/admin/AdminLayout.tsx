import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Music, Home, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/audio', label: 'Audio Tracks', icon: Music },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-primary/20 flex flex-col">
        <div className="p-6 border-b border-primary/20">
          <Link href="/">
            <a>
              <img src="/logo.png" alt="INF!NITE C107HING" className="h-10 w-auto" />
            </a>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/">
            <a>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Store
              </Button>
            </a>
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <a>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start ${isActive ? 'glow-box' : ''}`}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">Administrator</p>
            <p className="text-xs text-muted-foreground">admin@infiniteclothingstore.co.uk</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}


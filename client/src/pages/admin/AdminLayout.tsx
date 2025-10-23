import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { Package, ShoppingCart, Music, Home, LogOut } from 'lucide-react';
import { getLoginUrl } from '@/const';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  // Redirect if not admin
  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Link href="/">
            <a>
              <Button>Back to Home</Button>
            </a>
          </Link>
        </div>
      </div>
    );
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
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => logout()}
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


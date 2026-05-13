import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import SEO from '@/components/SEO';
import { LogOut, Package, Heart, Settings, Eye, EyeOff, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Account() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);

  // Get customer data
  const { data: customer, isLoading: customerLoading } = trpc.customers.getProfile.useQuery();
  const { data: orders, isLoading: ordersLoading } = trpc.customers.getOrders.useQuery();
  const { data: activityStats, isLoading: statsLoading } = trpc.customers.getActivityStats.useQuery();
  const { data: wishlistItems, isLoading: wishlistLoading } = trpc.customers.getWishlist.useQuery();

  const logoutMutation = trpc.customers.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      setLocation('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (customerLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-400">Loading your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Please log in to view your account</p>
            <Button onClick={() => setLocation('/login')}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SEO title="My Account - INF!NITE C107HING" description="Manage your account and view your activity" />
      <Navigation />

      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 glow-text">
                  Welcome, {customer.firstName}!
                </h1>
                <p className="text-gray-400">
                  {customer.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full md:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          {activityStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-card/50 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-primary">{activityStats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary/50" />
                </div>
              </div>
              <div className="bg-card/50 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-primary">£{(activityStats.totalSpent / 100).toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/50" />
                </div>
              </div>
              <div className="bg-card/50 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Wishlist Items</p>
                    <p className="text-3xl font-bold text-primary">{activityStats.wishlistCount}</p>
                  </div>
                  <Heart className="w-8 h-8 text-primary/50" />
                </div>
              </div>
              <div className="bg-card/50 border border-primary/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Active</p>
                    <p className="text-sm font-bold text-primary">
                      {new Date(customer.lastActivityDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-primary/50" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-primary/20 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'wishlist', label: 'Wishlist', icon: Heart },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-card/50 border border-primary/20 p-8 rounded-lg">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">First Name</p>
                      <p className="text-lg font-semibold">{customer.firstName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Last Name</p>
                      <p className="text-lg font-semibold">{customer.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-lg font-semibold">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-lg font-semibold">{customer.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Country</p>
                      <p className="text-lg font-semibold">{customer.country || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">City</p>
                      <p className="text-lg font-semibold">{customer.city || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-6">
                  <h3 className="text-xl font-bold mb-4">Style Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {customer.stylePreferences.length > 0 ? (
                      customer.stylePreferences.map(style => (
                        <span key={style} className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm">
                          {style}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No preferences set</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-6">
                  <h3 className="text-xl font-bold mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={customer.newsletter}
                        disabled
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Subscribed to newsletter</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={customer.marketingConsent}
                        disabled
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Marketing communications enabled</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-6">
                  <Button className="w-full md:w-auto">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {ordersLoading ? (
                  <p className="text-gray-400">Loading orders...</p>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-primary/20 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Order #{order.orderNumber}</p>
                            <p className="text-lg font-semibold">£{(order.total / 100).toFixed(2)}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-500/20 text-green-400'
                                : order.status === 'shipped'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No orders yet. Start shopping!</p>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistLoading ? (
                  <p className="text-gray-400">Loading wishlist...</p>
                ) : wishlistItems && wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                      <div key={item.id} className="border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all">
                        <div className="aspect-square bg-black/50 flex items-center justify-center">
                          {item.productImage && (
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-semibold mb-2">{item.productName}</p>
                          <p className="text-primary font-bold">£{(item.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Your wishlist is empty</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

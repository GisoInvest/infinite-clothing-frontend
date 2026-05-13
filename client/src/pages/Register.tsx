import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import SEO from '@/components/SEO';
import { Mail, Lock, User, Phone, MapPin, Heart } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    ageGroup: '',
    stylePreferences: [] as string[],
    newsletter: true,
    marketingConsent: true,
  });

  const registerMutation = trpc.customers.register.useMutation();

  const styleOptions = ['Streetwear', 'Casual', 'Luxury', 'Athletic', 'Minimalist', 'Bold & Expressive'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStylePreference = (style: string) => {
    setFormData(prev => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(style)
        ? prev.stylePreferences.filter(s => s !== style)
        : [...prev.stylePreferences, style]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        ageGroup: formData.ageGroup || undefined,
        stylePreferences: formData.stylePreferences,
        newsletter: formData.newsletter,
        marketingConsent: formData.marketingConsent,
      });

      toast.success('Registration successful! Redirecting to your account...');
      setTimeout(() => {
        setLocation('/account');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SEO title="Create Account - INF!NITE C107HING" description="Join our community and create your account" />
      <Navigation />

      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              Create Your Account
            </h1>
            <p className="text-gray-400 text-lg">
              Join INF!NITE C107HING and unlock exclusive features
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 p-8 rounded-lg border border-primary/20">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <User className="inline w-4 h-4 mr-2" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="+44 123 456 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Age Group
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                >
                  <option value="">Select age group</option>
                  <option value="18-25">18-25</option>
                  <option value="25-35">25-35</option>
                  <option value="35-50">35-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="United Kingdom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="London"
                />
              </div>
            </div>

            {/* Style Preferences */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                <Heart className="inline w-4 h-4 mr-2" />
                Your Style Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styleOptions.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStylePreference(style)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.stylePreferences.includes(style)
                        ? 'bg-primary border-primary text-black'
                        : 'border-primary/30 text-gray-300 hover:border-primary/50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-primary/30 bg-black/50"
                />
                <span className="text-sm text-gray-300">
                  Subscribe to our newsletter for exclusive offers and updates
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-primary/30 bg-black/50"
                />
                <span className="text-sm text-gray-300">
                  I agree to receive marketing communications
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glow-box pulse-glow text-lg py-6 mt-8"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:text-primary/80 font-semibold">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import SEO from '@/components/SEO';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = trpc.customers.login.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      toast.success('Login successful! Redirecting to your account...');
      setTimeout(() => {
        setLocation('/account');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SEO title="Sign In - INF!NITE C107HING" description="Sign in to your account" />
      <Navigation />

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container max-w-md">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">
              Sign in to your INF!NITE C107HING account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 p-8 rounded-lg border border-primary/20">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glow-box pulse-glow text-lg py-6 mt-8"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-primary hover:text-primary/80 font-semibold">
                Create one
              </a>
            </p>

            {/* Forgot Password */}
            <p className="text-center text-gray-500 text-xs">
              <a href="#" className="text-primary/60 hover:text-primary/80">
                Forgot your password?
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, ChevronDown } from 'lucide-react';

const STYLE_PREFERENCES = [
  'Streetwear',
  'Luxury',
  'Casual',
  'Urban',
  'Minimalist',
  'Bold Expression',
  'Vintage',
  'Contemporary',
];

const AGE_GROUPS = ['18-25', '25-35', '35-50', '50+'];

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Other',
];

export default function EntryPortal() {
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageGroup: '',
    country: '',
    city: '',
    stylePreferences: [] as string[],
    newsletter: true,
    marketingConsent: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const registerMutation = trpc.customers.register.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStylePreferenceChange = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(preference)
        ? prev.stylePreferences.filter(p => p !== preference)
        : [...prev.stylePreferences, preference],
    }));
  };

  const handleCheckboxChange = (field: 'newsletter' | 'marketingConsent') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.stylePreferences.length === 0) {
      toast.error('Please select at least one style preference');
      return;
    }

    setIsLoading(true);

    try {
      await registerMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        ageGroup: formData.ageGroup || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        stylePreferences: formData.stylePreferences,
        newsletter: formData.newsletter,
        marketingConsent: formData.marketingConsent,
      });

      toast.success('Welcome to INF!NITE! Registration successful.');
      
      // Store registration in localStorage
      localStorage.setItem('infiniteRegistered', 'true');
      localStorage.setItem('infiniteEmail', formData.email);

      // Redirect to home
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {step === 'welcome' ? (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                INF!NITE
              </h1>
              <p className="text-gray-400 text-lg">CLOTHING</p>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Enter the System
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Join an exclusive community of bold thinkers and style innovators. Experience luxury streetwear redefined.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <p className="text-gray-300">Exclusive access to limited collections</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <p className="text-gray-300">Early access to new releases</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <p className="text-gray-300">Personalized style recommendations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <p className="text-gray-300">VIP member benefits and rewards</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => setStep('form')}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Join the Movement
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>

            {/* Footer */}
            <p className="text-gray-500 text-sm">
              Unsettle the system. Express yourself. Be infinite.
            </p>
          </div>
        ) : (
          <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm animate-fade-in">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-white">Create Your Profile</CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about yourself so we can personalize your experience
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">First Name *</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 7xxx xxxxxx"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>

                {/* Age Group & Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Age Group</label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500"
                    >
                      <option value="">Select</option>
                      {AGE_GROUPS.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500"
                    >
                      <option value="">Select</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>

                {/* Style Preferences */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Your Style Preferences * (Select at least one)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_PREFERENCES.map(preference => (
                      <label key={preference} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.stylePreferences.includes(preference)}
                          onChange={() => handleStylePreferenceChange(preference)}
                          className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                        />
                        <span className="text-sm text-gray-300">{preference}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={() => handleCheckboxChange('newsletter')}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                    />
                    <span className="text-sm text-gray-300">Subscribe to our newsletter for exclusive offers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={() => handleCheckboxChange('marketingConsent')}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                    />
                    <span className="text-sm text-gray-300">I agree to receive marketing communications</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Enter INF!NITE'
                  )}
                </Button>

                {/* Back Button */}
                <Button
                  type="button"
                  onClick={() => setStep('welcome')}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Back
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);
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

  const registerMutation = trpc.customers.register.useMutation({
    onSuccess: () => {
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('customerEmail', formData.email);
      toast.success('Welcome to INF!NITE! Redirecting to store...');
      setTimeout(() => {
        window.location.href = '/shop';
      }, 1500);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStylePreferenceChange = (style: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      stylePreferences: checked
        ? [...prev.stylePreferences, style]
        : prev.stylePreferences.filter((s) => s !== style),
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.stylePreferences.length === 0) {
      toast.error('Please select at least one style preference');
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) contrast(1.1)' }}
      >
        <source src="/entry-portal-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {step === 'welcome' ? (
          // Welcome Screen
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/branding-logo.png"
                alt="INF!NITE Clothing"
                className="h-32 object-contain"
              />
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1
                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 leading-tight tracking-wider"
                style={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.15em',
                  animation: 'glitch 2s infinite',
                  textShadow:
                    '0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.03em 0.04em 0 #ffff00',
                }}
              >
                ENTER THE SYSTEM
              </h1>

              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                Join an exclusive community of bold thinkers and style innovators.
                Experience luxury streetwear redefined.
              </p>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-6 py-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300">Exclusive access to limited collections</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300">Early access to new releases</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300">Personalized style recommendations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300">VIP member benefits and rewards</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setStep('form')}
                className="w-full md:w-96 h-14 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-black rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                Join the Movement
              </button>

              <p className="text-sm text-gray-400 pt-4">
                Unsettle the system. Express yourself. Be infinite.
              </p>
            </div>
          </div>
        ) : (
          // Registration Form
          <div className="max-w-2xl w-full">
            <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl rounded-lg p-8">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold mb-2">
                  Create Your Profile
                </h2>
                <p className="text-gray-400">
                  Tell us about yourself so we can personalize your experience
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+44 7xxx xxxxxx"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Age & Country */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Age Group
                    </label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                    >
                      <option value="">Select</option>
                      {AGE_GROUPS.map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                    >
                      <option value="">Select</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="London"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-md focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none transition"
                  />
                </div>

                {/* Style Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Style Preferences <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STYLE_PREFERENCES.map((style) => (
                      <label key={style} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.stylePreferences.includes(style)}
                          onChange={(e) =>
                            handleStylePreferenceChange(style, e.target.checked)
                          }
                          className="w-4 h-4 bg-gray-900/50 border border-gray-600 rounded accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                          {style}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) =>
                        handleCheckboxChange('newsletter', e.target.checked)
                      }
                      className="w-4 h-4 bg-gray-900/50 border border-gray-600 rounded accent-cyan-400 cursor-pointer mt-1"
                    />
                    <span className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                      Subscribe to our newsletter for exclusive offers
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) =>
                        handleCheckboxChange('marketingConsent', e.target.checked)
                      }
                      className="w-4 h-4 bg-gray-900/50 border border-gray-600 rounded accent-cyan-400 cursor-pointer mt-1"
                    />
                    <span className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                      I agree to receive marketing communications
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep('welcome')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-900/50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-black font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Registering...' : 'Enter INF!NITE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.03em 0.04em 0 #ffff00;
          }
          14% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.03em 0.04em 0 #ffff00;
          }
          15% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #ffff00;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #ffff00;
          }
          50% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.03em 0.04em 0 #ffff00;
          }
          100% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.03em 0.04em 0 #ffff00;
          }
        }
      `}</style>
    </div>
  );
}

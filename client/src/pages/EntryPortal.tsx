import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, ChevronDown, ArrowLeft } from 'lucide-react';

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

  const registerCustomer = trpc.registerCustomer.useMutation({
    onSuccess: () => {
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('customerEmail', formData.email);
      toast.success('Welcome to INF!NITE! Redirecting to store...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('style-')) {
      const style = name.replace('style-', '');
      setFormData((prev) => ({
        ...prev,
        stylePreferences: checked
          ? [...prev.stylePreferences, style]
          : prev.stylePreferences.filter((s) => s !== style),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await registerCustomer.mutateAsync(formData);
    } finally {
      setIsLoading(false);
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
          <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/branding-logo.png"
                alt="INF!NITE Clothing"
                className="h-32 object-contain"
              />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 leading-tight">
                Enter the System
              </h1>

              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                Join an exclusive community of bold thinkers and style innovators. Experience luxury streetwear redefined.
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
              <Button
                onClick={() => setStep('form')}
                className="w-full md:w-96 h-14 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-black rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                Join the Movement
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-gray-400 pt-4">
                Unsettle the system. Express yourself. Be infinite.
              </p>
            </div>
          </div>
        ) : (
          // Registration Form
          <div className="max-w-2xl w-full animate-fade-in">
            <Card className="bg-black/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Create Your Profile
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tell us about yourself so we can personalize your experience
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        First Name <span className="text-cyan-400">*</span>
                      </label>
                      <Input
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Last Name <span className="text-cyan-400">*</span>
                      </label>
                      <Input
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Phone Number</label>
                      <Input
                        name="phone"
                        placeholder="+44 7xxx xxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  {/* Age & Country */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Age Group</label>
                      <select
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:border-cyan-400 focus:ring-cyan-400/20"
                      >
                        <option value="">Select</option>
                        {AGE_GROUPS.map((age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:border-cyan-400 focus:ring-cyan-400/20"
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">City</label>
                    <Input
                      name="city"
                      placeholder="London"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  {/* Style Preferences */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">
                      Style Preferences <span className="text-cyan-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {STYLE_PREFERENCES.map((style) => (
                        <label
                          key={style}
                          className="flex items-center space-x-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={formData.stylePreferences.includes(style)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(`style-${style}`, checked as boolean)
                            }
                            className="border-gray-600 bg-gray-900/50 text-cyan-400"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors">
                            {style}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <Checkbox
                        checked={formData.newsletter}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('newsletter', checked as boolean)
                        }
                        className="border-gray-600 bg-gray-900/50 text-cyan-400 mt-1"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors">
                        Subscribe to our newsletter for exclusive offers
                      </span>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <Checkbox
                        checked={formData.marketingConsent}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('marketingConsent', checked as boolean)
                        }
                        className="border-gray-600 bg-gray-900/50 text-cyan-400 mt-1"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors">
                        I agree to receive marketing communications
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={() => setStep('welcome')}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-900/50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Enter INF!NITE'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}

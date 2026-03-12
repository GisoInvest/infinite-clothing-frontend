import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, TrendingUp, Globe, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function BusinessEnquiries() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    country: '',
    website: '',
    annualRevenue: '',
    productInterest: '',
    businessBackground: '',
    marketingStrategy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    'Retail Store',
    'Online Boutique',
    'Department Store',
    'Fashion Distributor',
    'Wholesale Supplier',
    'Franchise',
    'Pop-up Shop',
    'Other',
  ];

  const revenueRanges = [
    'Under £100,000',
    '£100,000 - £500,000',
    '£500,000 - £1,000,000',
    '£1,000,000 - £5,000,000',
    '£5,000,000+',
  ];

  const productInterests = [
    'T-Shirts & Tops',
    'Hoodies & Sweatshirts',
    'Jackets',
    'Accessories',
    'Full Range',
    'Custom Orders',
    'Seasonal Collections',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone || !formData.businessType || !formData.country || !formData.productInterest || !formData.businessBackground) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit business enquiry
      const result = await trpc.businessEnquiries.submit.mutate({
        companyName: formData.companyName,
        businessType: formData.businessType,
        website: formData.website,
        country: formData.country,
        annualRevenue: formData.annualRevenue,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        productInterest: formData.productInterest,
        businessBackground: formData.businessBackground,
        marketingStrategy: formData.marketingStrategy,
      });

      toast.success(`Business enquiry submitted successfully! Enquiry #${result.enquiryNumber}. Our partnership team will contact you within 2-3 business days.`);
      
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        businessType: '',
        country: '',
        website: '',
        annualRevenue: '',
        productInterest: '',
        businessBackground: '',
        marketingStrategy: '',
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Business Partnerships</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join the INF!NITE CLOTHING movement. We're looking for passionate retailers and distributors to partner with us and bring our bold, innovative streetwear to customers worldwide.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Competitive Margins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Attractive wholesale pricing with flexible minimum order quantities to suit your business model.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access to our growing customer base and marketing support to help you succeed in your market.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Briefcase className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personal account manager, marketing materials, and ongoing support for your partnership.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Partnership Tiers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Partnership Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Retail Partner</CardTitle>
                  <CardDescription>For established retail stores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>✓ Wholesale pricing</li>
                    <li>✓ Minimum orders: 50 units</li>
                    <li>✓ Marketing support</li>
                    <li>✓ Seasonal collections</li>
                    <li>✓ Account manager</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 border-2 border-primary">
                <CardHeader>
                  <CardTitle>Distribution Partner</CardTitle>
                  <CardDescription>For distributors & wholesalers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>✓ Bulk wholesale pricing</li>
                    <li>✓ Minimum orders: 200+ units</li>
                    <li>✓ Co-marketing programs</li>
                    <li>✓ Territory exclusivity</li>
                    <li>✓ Dedicated support team</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Online Partner</CardTitle>
                  <CardDescription>For e-commerce platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>✓ Drop-shipping available</li>
                    <li>✓ API integration</li>
                    <li>✓ Flexible quantities</li>
                    <li>✓ Real-time inventory</li>
                    <li>✓ Technical support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Form */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Partnership Enquiry Form</CardTitle>
                  <CardDescription>
                    Tell us about your business and how we can partner together.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Company Information</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                            Company Name *
                          </label>
                          <Input
                            id="companyName"
                            name="companyName"
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company name"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                            Business Type *
                          </label>
                          <select
                            id="businessType"
                            name="businessType"
                            required
                            value={formData.businessType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          >
                            <option value="">Select business type</option>
                            {businessTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-2">
                          Website URL
                        </label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.yourcompany.com"
                          className="w-full"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium mb-2">
                            Country/Region *
                          </label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            required
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="e.g., United Kingdom"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="annualRevenue" className="block text-sm font-medium mb-2">
                            Annual Revenue
                          </label>
                          <select
                            id="annualRevenue"
                            name="annualRevenue"
                            value={formData.annualRevenue}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          >
                            <option value="">Select range</option>
                            {revenueRanges.map(range => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Contact Information</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contactName" className="block text-sm font-medium mb-2">
                            Contact Person *
                          </label>
                          <Input
                            id="contactName"
                            name="contactName"
                            type="text"
                            required
                            value={formData.contactName}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@company.com"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+44 7xxx xxxxxx"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Partnership Details</h3>

                      <div>
                        <label htmlFor="productInterest" className="block text-sm font-medium mb-2">
                          Products of Interest *
                        </label>
                        <select
                          id="productInterest"
                          name="productInterest"
                          required
                          value={formData.productInterest}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        >
                          <option value="">Select products</option>
                          {productInterests.map(product => (
                            <option key={product} value={product}>{product}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="businessBackground" className="block text-sm font-medium mb-2">
                          Business Background *
                        </label>
                        <Textarea
                          id="businessBackground"
                          name="businessBackground"
                          required
                          value={formData.businessBackground}
                          onChange={handleChange}
                          placeholder="Tell us about your business, experience, and customer base..."
                          className="w-full min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label htmlFor="marketingStrategy" className="block text-sm font-medium mb-2">
                          Marketing & Growth Strategy
                        </label>
                        <Textarea
                          id="marketingStrategy"
                          name="marketingStrategy"
                          value={formData.marketingStrategy}
                          onChange={handleChange}
                          placeholder="How do you plan to market INF!NITE products? What's your growth strategy?"
                          className="w-full min-h-[100px]"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full glow-box" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Partnership Enquiry
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Required fields. Our partnership team will review your enquiry and contact you within 48 hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-primary/20 sticky top-4">
                <CardHeader>
                  <CardTitle>Why Partner With Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Innovative Designs</h4>
                    <p className="text-muted-foreground">Bold, trendy collections that resonate with modern consumers.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Quality Products</h4>
                    <p className="text-muted-foreground">Premium materials and craftsmanship in every piece.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Strong Brand</h4>
                    <p className="text-muted-foreground">Growing recognition in the streetwear fashion industry.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Support</h4>
                    <p className="text-muted-foreground">Dedicated account managers and marketing support.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Founded:</span>
                    <p className="text-muted-foreground">2024</p>
                  </div>
                  <div>
                    <span className="font-semibold">Headquarters:</span>
                    <p className="text-muted-foreground">United Kingdom</p>
                  </div>
                  <div>
                    <span className="font-semibold">Global Reach:</span>
                    <p className="text-muted-foreground">Multiple countries</p>
                  </div>
                  <div>
                    <span className="font-semibold">Specialization:</span>
                    <p className="text-muted-foreground">Premium Streetwear</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Contact Our Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold">Partnerships Email:</p>
                    <a href="mailto:partnerships@infiniteclothingstore.co.uk" className="text-primary hover:underline">
                      partnerships@infiniteclothingstore.co.uk
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold">Phone:</p>
                    <a href="tel:+447403139086" className="text-primary hover:underline">
                      +44 7403 139086
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

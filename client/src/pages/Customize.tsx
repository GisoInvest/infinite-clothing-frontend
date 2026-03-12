import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Send, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import PricingCalculator from '@/components/PricingCalculator';

export default function Customize() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    fabricQuality: '200',
    description: '',
    specialRequests: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fabricOptions = [
    { value: '150', label: '150 GSM - Lightweight (Standard)' },
    { value: '180', label: '180 GSM - Medium Weight' },
    { value: '200', label: '200 GSM - Premium (Recommended)' },
    { value: '250', label: '250 GSM - Heavy Weight' },
    { value: '300', label: '300 GSM - Extra Heavy Weight' },
    { value: '400', label: '400 GSM - Ultra Premium' },
  ];

  const productTypes = [
    'T-Shirt',
    'Hoodie',
    'Sweatshirt',
    'Polo Shirt',
    'Long Sleeve Shirt',
    'Jacket',
    'Cap',
    'Tote Bag',
    'Other (Please specify)',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (PNG, JPG, GIF) or PDF');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploadedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }

      toast.success('File uploaded successfully!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.productType || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload your graphic file');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to storage and get URL
      const fileFormData = new FormData();
      fileFormData.append('file', uploadedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: fileFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadedData = await uploadResponse.json();
      const designFileUrl = uploadedData.url;

      // Submit customization enquiry
      const result = await trpc.customizationEnquiries.submit.mutate({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        productType: formData.productType,
        quantity: parseInt(formData.quantity),
        fabricQuality: parseInt(formData.fabricQuality),
        designDescription: formData.description,
        specialRequests: formData.specialRequests,
        designFileUrl,
      });

      toast.success(`Customization request submitted! Enquiry #${result.enquiryNumber}. We'll review your design and contact you within 24 hours.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        productType: '',
        quantity: '',
        fabricQuality: '200',
        description: '',
        specialRequests: '',
      });
      setUploadedFile(null);
      setFilePreview(null);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Custom Printing Service</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your own unique designs with our professional custom printing service. Upload your graphic, choose your fabric quality, and let us bring your vision to life.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader>
                <Shirt className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quality Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose from 6 different fabric weights (150-400 GSM) to match your needs and budget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Upload className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload your design in PNG, JPG, GIF, or PDF format. Our team will review and provide feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Send className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quick Turnaround</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We'll contact you within 24 hours with a quote and timeline for your custom order.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Submit Your Design</CardTitle>
                  <CardDescription>
                    Fill out the form below with your customization requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Your Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
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
                            placeholder="your.email@example.com"
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

                    {/* Product Details */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Product Details</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="productType" className="block text-sm font-medium mb-2">
                            Product Type *
                          </label>
                          <select
                            id="productType"
                            name="productType"
                            required
                            value={formData.productType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          >
                            <option value="">Select a product type</option>
                            {productTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                            Quantity *
                          </label>
                          <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            required
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g., 50"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="fabricQuality" className="block text-sm font-medium mb-2">
                          Fabric Quality (GSM) *
                        </label>
                        <select
                          id="fabricQuality"
                          name="fabricQuality"
                          required
                          value={formData.fabricQuality}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        >
                          {fabricOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-muted-foreground mt-2">
                          GSM (Grams per Square Meter) indicates fabric weight and durability. Higher GSM = thicker, more durable fabric.
                        </p>
                      </div>
                    </div>

                    {/* Design Upload */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Upload Your Design</h3>

                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/gif,application/pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="fileInput"
                        />
                        <label htmlFor="fileInput" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="font-medium">Click to upload your design</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, GIF, or PDF (Max 10MB)
                          </p>
                          {uploadedFile && (
                            <p className="text-sm text-primary mt-2">
                              ✓ {uploadedFile.name}
                            </p>
                          )}
                        </label>
                      </div>

                      {filePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Design Preview:</p>
                          <img src={filePreview} alt="Design preview" className="max-h-48 rounded-lg border border-primary/20" />
                        </div>
                      )}
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Additional Information</h3>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                          Design Description
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your design, colors, placement, etc."
                          className="w-full min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium mb-2">
                          Special Requests
                        </label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          placeholder="Any special requirements or notes for our design team?"
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
                          Submit Customization Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Required fields. We'll review your design and contact you within 24 hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Pricing Calculator */}
              {formData.productType && formData.quantity && (
                <PricingCalculator
                  productType={formData.productType}
                  quantity={parseInt(formData.quantity) || 0}
                  fabricQuality={parseInt(formData.fabricQuality)}
                />
              )}

              <Card className="border-primary/20 sticky top-4">
                <CardHeader>
                  <CardTitle>Fabric Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">150 GSM</h4>
                    <p className="text-xs text-muted-foreground">Lightweight, breathable. Best for summer wear.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">200 GSM</h4>
                    <p className="text-xs text-muted-foreground">Premium quality. Our most popular choice.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">250-300 GSM</h4>
                    <p className="text-xs text-muted-foreground">Heavy weight, durable. Great for hoodies.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">400 GSM</h4>
                    <p className="text-xs text-muted-foreground">Ultra premium. Maximum durability and comfort.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Pricing varies based on:
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Quantity ordered</li>
                    <li>• Fabric quality (GSM)</li>
                    <li>• Design complexity</li>
                    <li>• Product type</li>
                  </ul>
                  <p className="text-primary font-semibold mt-4">
                    Get a custom quote after submission!
                  </p>
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

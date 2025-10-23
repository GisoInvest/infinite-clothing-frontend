import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 glow-text">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with the INF!NITE C107HING team
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Email */}
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    For general inquiries and customer support
                  </p>
                  <a
                    href="mailto:info@infiniteclothingstore.co.uk"
                    className="text-primary hover:underline font-medium"
                  >
                    info@infiniteclothingstore.co.uk
                  </a>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Speak with our team directly
                  </p>
                  <a
                    href="tel:+447403139086"
                    className="text-primary hover:underline font-medium"
                  >
                    +44 7403 139086
                  </a>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    United Kingdom
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Online store serving customers worldwide
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card className="border-primary/20 glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-2xl">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Whether you have questions about our products, need assistance with an order, or just want to share feedback, we're here to help. Our team is dedicated to providing you with the best customer experience possible.
                </p>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">What we can help you with:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Product information and sizing guidance</li>
                    <li>Order status and tracking</li>
                    <li>Returns and exchanges</li>
                    <li>Payment and shipping questions</li>
                    <li>Custom orders and bulk purchases</li>
                    <li>Partnership and collaboration inquiries</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  We aim to respond to all inquiries within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


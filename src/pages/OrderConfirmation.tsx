import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const [location] = useLocation();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const order = params.get('order');
    if (order) {
      setOrderNumber(order);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 flex items-center justify-center py-20">
        <Card className="max-w-2xl w-full border-primary/20 glow-border">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-primary mx-auto glow-box" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 glow-text">Order Confirmed!</h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              Thank you for your purchase
            </p>

            {orderNumber && (
              <div className="bg-card/50 border border-primary/20 rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>
            )}

            <div className="space-y-4 text-left mb-8">
              <p className="text-muted-foreground">
                We've sent a confirmation email with your order details and tracking information.
              </p>
              <p className="text-muted-foreground">
                Your order will be processed and shipped within 1-2 business days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <a>
                  <Button size="lg" className="glow-box">
                    Continue Shopping
                  </Button>
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}


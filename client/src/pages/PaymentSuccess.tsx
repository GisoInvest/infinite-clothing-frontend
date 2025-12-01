import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const createOrder = trpc.simpleOrders.create.useMutation();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Get session_id from URL
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        setError('No payment session found');
        setIsProcessing(false);
        return;
      }

      try {
        // Get session metadata from Stripe (stored in session)
        // For now, we'll use localStorage to get the order data
        const orderDataStr = localStorage.getItem('pendingOrder');
        if (!orderDataStr) {
          throw new Error('Order data not found');
        }

        const orderData = JSON.parse(orderDataStr);
        
        // Create order in database
        await createOrder.mutateAsync({
          orderNumber: orderData.orderNumber,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          shippingAddress: orderData.shippingAddress,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          tax: orderData.tax,
          total: orderData.total,
          paymentIntentId: sessionId,
        });

        setOrderNumber(orderData.orderNumber);
        clearCart();
        localStorage.removeItem('pendingOrder');
        toast.success('Order placed successfully!');
        setIsProcessing(false);
      } catch (err) {
        console.error('Order creation error:', err);
        setError('Failed to create order. Please contact support.');
        setIsProcessing(false);
      }
    };

    handlePaymentSuccess();
  }, [createOrder, clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container max-w-2xl">
          {isProcessing ? (
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Processing your order...</h2>
                <p className="text-muted-foreground">Please wait while we confirm your payment</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-500">Order Error</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{error}</p>
                <Button onClick={() => setLocation('/contact')}>Contact Support</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-green-500">Payment Successful!</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">Thank you for your order!</p>
                <p>Order Number: <span className="font-bold">{orderNumber}</span></p>
                <p className="text-muted-foreground">
                  You will receive a confirmation email shortly with your order details.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button onClick={() => setLocation('/')}>Continue Shopping</Button>
                  <Button variant="outline" onClick={() => setLocation(`/order-confirmation?order=${orderNumber}`)}>
                    View Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

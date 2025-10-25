import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, orderData }: { clientSecret: string; orderData: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const createOrder = trpc.orders.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-confirmation',
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order in database
        await createOrder.mutateAsync({
          ...orderData,
          paymentIntentId: paymentIntent.id,
        });

        clearCart();
        toast.success('Order placed successfully!');
        setLocation(`/order-confirmation?order=${orderData.orderNumber}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('An error occurred during payment');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        size="lg"
        className="w-full glow-box"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay £${(orderData.total / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United Kingdom',
  });

  const createPaymentIntent = trpc.payment.createIntent.useMutation();

  useEffect(() => {
    if (items.length === 0) {
      setLocation('/cart');
    }
  }, [items, setLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shipping = 500; // £5.00 flat rate
  const tax = Math.round(subtotal * 0.2); // 20% VAT
  const total = subtotal + shipping + tax;

  const handleCreatePayment = async () => {
    // Validate form
    if (!formData.email || !formData.name || !formData.line1 || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newOrderNumber = `INF${Date.now()}`;
    setOrderNumber(newOrderNumber);

    try {
      const result = await createPaymentIntent.mutateAsync({
        amount: total,
        orderNumber: newOrderNumber,
      });

      setClientSecret(result.clientSecret!);
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error(error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const orderData = {
    orderNumber,
    customerEmail: formData.email,
    customerName: formData.name,
    customerPhone: formData.phone,
    shippingAddress: {
      line1: formData.line1,
      line2: formData.line2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    },
    items: items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal,
    shipping,
    tax,
    total,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 glow-text">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      name="line2"
                      value={formData.line2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">County/State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postcode *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!clientSecret && (
                <Button
                  size="lg"
                  className="w-full mt-6 glow-box"
                  onClick={handleCreatePayment}
                  disabled={createPaymentIntent.isPending}
                >
                  {createPaymentIntent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              )}
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>£{((item.price * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-primary/20 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>£{(subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>£{(shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (20%)</span>
                      <span>£{(tax / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary border-t border-primary/20 pt-2">
                      <span>Total</span>
                      <span>£{(total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              {clientSecret && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
                    </Elements>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


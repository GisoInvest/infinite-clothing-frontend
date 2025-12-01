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
  const createOrder = trpc.simpleOrders.create.useMutation();

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
        // Create order in database with simplified data
        await createOrder.mutateAsync({
          orderNumber: orderData.orderNumber,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          shippingAddress: JSON.stringify(orderData.shippingAddress),
          items: JSON.stringify(orderData.items),
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          tax: orderData.tax,
          total: orderData.total,
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
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');

  const validateDiscount = trpc.discountCodes.validate.useMutation();

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

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setDiscountError('');
    
    try {
      const result = await validateDiscount.mutateAsync({
        code: discountCode.trim().toUpperCase(),
        purchaseAmount: subtotal,
      });

      if (result.valid && result.discount) {
        setAppliedDiscount(result);
        toast.success(`Discount code applied! You saved £${(Math.round((subtotal * Number(result.discount.discountValue)) / 100) / 100).toFixed(2)}`);
      } else {
        setDiscountError(result.error || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error) {
      setDiscountError('Failed to validate discount code');
      setAppliedDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountError('');
  };

  const shipping = 300; // £3.00 flat rate
  const tax = 0; // No VAT charged
  
  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount?.discount) {
    const discount = appliedDiscount.discount;
    if (discount.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * Number(discount.discountValue)) / 100);
    } else {
      discountAmount = Math.round(Number(discount.discountValue) * 100); // Convert to cents
    }
  }
  
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

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

      if (!result.clientSecret) {
        throw new Error('No client secret returned from payment intent');
      }

      console.log('Payment intent created successfully:', result.paymentIntentId);
      setClientSecret(result.clientSecret);
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error('Payment initialization error:', error);
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
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${item.size || 'no-size'}-${index}`} className="flex justify-between text-sm">
                      <span>
                        {item.productName} {item.size && `(${item.size})`} x {item.quantity}
                      </span>
                      <span>£{((item.price * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {/* Discount Code Section */}
                  <div className="border-t border-primary/20 pt-4">
                    {!appliedDiscount ? (
                      <div className="space-y-2">
                        <Label htmlFor="discountCode">Discount Code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="discountCode"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleApplyDiscount}
                            disabled={validateDiscount.isPending}
                            variant="outline"
                          >
                            {validateDiscount.isPending ? 'Checking...' : 'Apply'}
                          </Button>
                        </div>
                        {discountError && (
                          <p className="text-sm text-red-500">{discountError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-500">Discount Applied</p>
                            <p className="text-xs text-muted-foreground">{appliedDiscount.discount.code}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveDiscount}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-primary/20 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>£{(subtotal / 100).toFixed(2)}</span>
                    </div>
                    {appliedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Discount ({appliedDiscount.discount.discountValue}% off)</span>
                        <span>-£{(discountAmount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>£{(shipping / 100).toFixed(2)}</span>
                    </div>
                    {/* VAT removed - no longer charged */}
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
                    <Elements 
                      stripe={stripePromise} 
                      options={{ 
                        clientSecret,
                        appearance: {
                          theme: 'night',
                          variables: {
                            colorPrimary: '#00d4ff',
                          },
                        },
                      }}
                    >
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


import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';
import { Loader2, Tag, X, CreditCard, Bitcoin } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutSimple() {
  const { items, subtotal } = useCart();
  const [location, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
  
  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  const createCheckoutSession = trpc.payment.createCheckoutSession.useMutation();
  const createCryptoPayment = trpc.cryptoCheckout.createPayment.useMutation();
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

  // Auto-apply discount code from URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code') || urlParams.get('discount');
    
    if (codeFromUrl && !appliedDiscount) {
      setDiscountCode(codeFromUrl.toUpperCase());
      handleApplyDiscountFromUrl(codeFromUrl.toUpperCase());
    }
  }, []);

  const handleApplyDiscountFromUrl = async (code: string) => {
    if (!code.trim()) return;
    setIsValidatingDiscount(true);
    setDiscountError('');
    try {
      const result = await validateDiscount.mutateAsync({
        code: code.trim().toUpperCase(),
        purchaseAmount: subtotal,
      });
      if (result.valid && result.discount) {
        setAppliedDiscount(result);
        toast.success(`Discount code "${code}" applied! You're saving ${result.discount.discountValue}%`);
      } else {
        setDiscountError(result.error || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error) {
      console.error('Discount validation error:', error);
      setDiscountError('Failed to validate discount code');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    setIsValidatingDiscount(true);
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
      console.error('Discount validation error:', error);
      setDiscountError('Failed to validate discount code');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountError('');
    toast.info('Discount code removed');
  };

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

  const shipping = 300; // £3.00 flat rate
  const tax = 0;
  
  let discountAmount = 0;
  if (appliedDiscount?.discount) {
    const discount = appliedDiscount.discount;
    if (discount.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * Number(discount.discountValue)) / 100);
    } else {
      discountAmount = Math.round(Number(discount.discountValue) * 100);
    }
  }
  
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const handleCheckout = async () => {
    if (!formData.email || !formData.name || !formData.line1 || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = `INF${Date.now()}`;
      const shippingAddressObj = {
        line1: formData.line1,
        line2: formData.line2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      };
      const shippingAddress = JSON.stringify(shippingAddressObj);

      const itemsDataArray = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));
      const itemsData = JSON.stringify(itemsDataArray);

      localStorage.setItem('pendingOrder', JSON.stringify({
        orderNumber,
        customerEmail: formData.email,
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress,
        items: itemsData,
        subtotal,
        discountCode: appliedDiscount?.discount?.code || null,
        discountAmount,
        shipping,
        tax,
        total,
      }));

      if (paymentMethod === 'stripe') {
        const result = await createCheckoutSession.mutateAsync({
          orderNumber,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          shippingAddress,
          items: itemsData,
          subtotal,
          shipping,
          tax,
          total,
        });

        if (result.url) {
          window.location.href = result.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } else {
        // Crypto payment via NOWPayments
        const result = await createCryptoPayment.mutateAsync({
          orderNumber,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          shippingAddress: shippingAddressObj,
          items: itemsDataArray,
          subtotal,
          shipping,
          tax,
          total,
        });

        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          throw new Error('No crypto payment URL returned');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 py-12">
        <div className="container max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 glow-text">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input id="line1" name="line1" value={formData.line1} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input id="line2" name="line2" value={formData.line2} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="state">County/State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postcode *</Label>
                      <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" value={formData.country} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'crypto')}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg w-full hover:bg-primary/5 transition-colors">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground">Secure payment via Stripe (includes Klarna)</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg w-full hover:bg-primary/5 transition-colors">
                        <Bitcoin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cryptocurrency</p>
                          <p className="text-xs text-muted-foreground">Pay with BTC, ETH, and more via NOWPayments</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-primary/20 glow-border">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${item.size || 'no-size'}-${index}`} className="flex justify-between text-sm">
                      <span>{item.productName} {item.size && `(${item.size})`} x {item.quantity}</span>
                      <span>£{((item.price * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-primary/20 pt-4">
                    {!appliedDiscount ? (
                      <div className="space-y-2">
                        <Label htmlFor="discountCode" className="flex items-center gap-2">
                          <Tag className="h-4 w-4" /> Discount Code
                        </Label>
                        <div className="flex gap-2">
                          <Input id="discountCode" value={discountCode} onChange={(e) => setDiscountCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1" />
                          <Button type="button" onClick={handleApplyDiscount} disabled={isValidatingDiscount} variant="outline">
                            {isValidatingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                          </Button>
                        </div>
                        {discountError && <p className="text-sm text-red-500">{discountError}</p>}
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-green-500">Discount Applied!</p>
                              <p className="text-xs text-muted-foreground">{appliedDiscount.discount.code} - {appliedDiscount.discount.discountValue}% off</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveDiscount} className="text-red-500 hover:text-red-600 h-8 w-8 p-0">
                            <X className="h-4 w-4" />
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
                    <div className="flex justify-between text-lg font-bold text-primary border-t border-primary/20 pt-2">
                      <span>Total</span>
                      <span>£{(total / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full mt-6 glow-box" onClick={handleCheckout} disabled={isProcessing}>
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirecting...</>
                    ) : (
                      `Proceed to Payment - £${(total / 100).toFixed(2)}`
                    )}
                  </Button>
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

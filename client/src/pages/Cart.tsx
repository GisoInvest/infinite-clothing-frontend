import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to get started!
            </p>
            <Link href="/">
              <a>
                <Button size="lg" className="glow-box">
                  Continue Shopping
                </Button>
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 glow-text">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.productId}-${item.size || 'no-size'}-${index}`} className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.category} • {item.subcategory}
                        </p>
                        {item.size && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Size: <span className="font-semibold text-foreground">{item.size}</span>
                          </p>
                        )}
                        {item.discount && item.discount > 0 && (
                          <p className="text-xs text-destructive font-semibold mb-2">
                            {item.discount}% OFF Applied
                          </p>
                        )}
                        <p className="text-xl font-bold text-primary">
                          £{(item.price / 100).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Total: £{((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-primary/20 glow-border sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">£{(subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-primary/20 pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Estimated Total</span>
                        <span className="font-bold text-primary text-xl">
                          £{(subtotal / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <a className="block">
                      <Button size="lg" className="w-full glow-box text-lg">
                        Proceed to Checkout
                      </Button>
                    </a>
                  </Link>

                  <Link href="/">
                    <a className="block mt-4">
                      <Button variant="outline" size="lg" className="w-full">
                        Continue Shopping
                      </Button>
                    </a>
                  </Link>
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


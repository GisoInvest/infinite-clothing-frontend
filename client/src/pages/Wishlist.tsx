import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Loader2, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useAuth } from '@/_core/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { data: wishlistData, isLoading, refetch } = trpc.wishlist.getWithProducts.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      toast.success('Removed from wishlist');
      refetch();
    },
  });

  const handleMoveToCart = (product: any) => {
    if (!product.sizes || product.sizes.length === 0) {
      toast.error('Please select a size');
      return;
    }
    
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      quantity: 1,
      size: product.sizes[0], // Default to first size
      color: product.colors?.[0] || 'Default',
      image: product.images?.[0] || '',
    });
    
    toast.success('Added to cart');
  };

  const handleRemove = async (productId: number) => {
    await removeMutation.mutateAsync({ productId });
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEO title="Wishlist" description="Your saved products" />
        <Navigation />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-6">
              Save your favorite products and access them from any device
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="My Wishlist" description="Your saved favorite products" />
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              My <span className="text-gradient">Wishlist</span>
            </h1>
            <p className="text-muted-foreground">
              {wishlistData?.length || 0} saved items
            </p>
          </div>

          {/* Wishlist Items */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : wishlistData && wishlistData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistData.map(item => {
                const product = item.product;
                if (!product) return null;

                return (
                  <Card key={item.wishlistId} className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all">
                    <CardContent className="p-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative aspect-square overflow-hidden cursor-pointer">
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {product.discount && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              -{product.discount}%
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Badge variant="destructive" className="text-lg px-4 py-2">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          {product.stock > 0 && product.stock < 10 && (
                            <Badge className="absolute top-2 left-2 bg-orange-500">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {product.discount ? (
                            <>
                              <span className="text-muted-foreground line-through text-sm">
                                £{(product.price / 100).toFixed(2)}
                              </span>
                              <span className="text-primary font-bold text-lg">
                                £{((product.price * (1 - product.discount / 100)) / 100).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-bold text-lg">
                              £{(product.price / 100).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleMoveToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Move to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemove(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-4">
                Your wishlist is empty
              </p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { Loader2, ShoppingBag, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : 0;
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images?.[0],
      category: product.category,
      subcategory: product.subcategory,
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <Link href="/">
              <a>
                <Button>Back to Home</Button>
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allMedia = [
    ...(product.images || []).map((url) => ({ type: 'image' as const, url })),
    ...(product.videos || []).map((url) => ({ type: 'video' as const, url })),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container">
          <Link href={`/${product.category}`}>
            <a className="inline-flex items-center text-primary hover:underline mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {product.category}
            </a>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Media Gallery */}
            <div className="space-y-4">
              {/* Main Media */}
              <Card className="aspect-square overflow-hidden border-primary/20 glow-border">
                {allMedia.length > 0 ? (
                  allMedia[selectedMediaIndex].type === 'image' ? (
                    <img
                      src={allMedia[selectedMediaIndex].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={allMedia[selectedMediaIndex].url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ShoppingBag className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}
              </Card>

              {/* Thumbnails */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMediaIndex(index)}
                      className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                        selectedMediaIndex === index
                          ? 'border-primary glow-border'
                          : 'border-primary/20 hover:border-primary/50'
                      }`}
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs">VIDEO</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary uppercase tracking-wider mb-2">
                  {product.category} • {product.subcategory}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  £{(product.price / 100).toFixed(2)}
                </p>
              </div>

              <div className="border-t border-b border-primary/20 py-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`font-semibold ${product.stock > 0 ? 'text-primary' : 'text-destructive'}`}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full glow-box text-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              <div className="bg-card/50 border border-primary/20 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-primary">Product Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Premium quality materials</li>
                  <li>• Comfortable fit for all-day wear</li>
                  <li>• Machine washable</li>
                  <li>• Free shipping on orders over £50</li>
                  <li>• 30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { OrganizationStructuredData } from '@/components/StructuredData';
import NeonParticles from '@/components/NeonParticles';
import WelcomePopup from '@/components/WelcomePopup';

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.getFeatured.useQuery();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <NeonParticles />
      <SEO />
      <OrganizationStructuredData />
      <WelcomePopup />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 glow-text animate-fade-in">
            INF!NITE C107HING
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up">
            Redefining modern streetwear with purpose-driven designs that inspire confidence, creativity, and individuality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link href="/men">
              <a>
                <Button size="lg" className="glow-box pulse-glow text-lg px-8">
                  Shop Men
                </Button>
              </a>
            </Link>
            <Link href="/women">
              <a>
                <Button size="lg" variant="outline" className="text-lg px-8 glow-border">
                  Shop Women
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
              Wear What <span className="text-primary glow-text">Moves You</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
              Every piece blends bold expression with comfort. We believe fashion is more than fabric—it's a statement of who you are and what you stand for. Our designs push boundaries while keeping you comfortable in your own skin.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="text-primary glow-text">Collection</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our latest drops and bestsellers
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 interactive-card"
                >
                  <Link href={`/product/${product.id}`}>
                    <a>
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-20 w-20 text-muted-foreground" />
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </a>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <a>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </a>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary glow-text">
                        £{(product.price / 100).toFixed(2)}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <a>
                          <Button
                            size="sm"
                            className="glow-box"
                          >
                            View Details
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Shop by <span className="text-primary glow-text">Category</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Men', path: '/men', desc: 'Bold & Confident' },
              { name: 'Women', path: '/women', desc: 'Fierce & Fearless' },
              { name: 'Unisex', path: '/unisex', desc: 'For Everyone' },
              { name: 'Kids & Baby', path: '/kids-baby', desc: 'Future Icons' },
            ].map((category) => (
              <Link key={category.path} href={category.path}>
                <a>
                  <Card className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 interactive-card h-48 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors glow-text">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground">{category.desc}</p>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

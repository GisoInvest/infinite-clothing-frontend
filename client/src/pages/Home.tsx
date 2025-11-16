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
import ProductCardQuickSelector from '@/components/ProductCardQuickSelector';
import ShopTheLook from '@/components/ShopTheLook';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import WishlistButton from '@/components/WishlistButton';

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

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Half - Brand Identity */}
            <div className="text-center lg:text-left space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold glow-text leading-tight">
                INF!NITE C107HING
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up">
                Redefining modern streetwear with purpose-driven designs that inspire confidence, creativity, and individuality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                <Link href="/men">
                  <a>
                    <Button size="lg" className="glow-box pulse-glow text-lg px-8 w-full sm:w-auto">
                      Shop Men
                    </Button>
                  </a>
                </Link>
                <Link href="/women">
                  <a>
                    <Button size="lg" variant="outline" className="text-lg px-8 glow-border w-full sm:w-auto">
                      Shop Women
                    </Button>
                  </a>
                </Link>
              </div>
            </div>

            {/* Right Half - Featured Product Showcase */}
            <div className="relative animate-fade-in-up">
              {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : featuredProducts && featuredProducts.length > 0 ? (
                <Link href={`/product/${featuredProducts[0]?.id || ''}`}>
                  <a className="relative group block cursor-pointer">
                    <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-300 glow-box">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={featuredProducts[0].images?.[0] || '/placeholder-product.jpg'}
                          alt={featuredProducts[0].name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* NEW ARRIVAL Badge */}
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                          NEW ARRIVAL
                        </div>
                        
                        {/* Stock Indicators */}
                        {featuredProducts[0].stock === 0 ? (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg">
                              OUT OF STOCK
                            </span>
                          </div>
                        ) : featuredProducts[0].stock < 10 ? (
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg animate-pulse">
                            LOW STOCK - Only {featuredProducts[0].stock} left!
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6 space-y-4 bg-gradient-to-b from-card to-card/50">
                        <h3 className="text-2xl font-bold text-primary glow-text">
                          {featuredProducts[0].name}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {featuredProducts[0].description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {featuredProducts[0].discount ? (
                              <>
                                <span className="text-2xl font-bold text-muted-foreground line-through">
                                  £{(featuredProducts[0].price / 100).toFixed(2)}
                                </span>
                                <span className="text-3xl font-bold text-cyan-400">
                                  £{((featuredProducts[0].price * (1 - featuredProducts[0].discount / 100)) / 100).toFixed(2)}
                                </span>
                                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  -{featuredProducts[0].discount}%
                                </span>
                              </>
                            ) : (
                              <span className="text-3xl font-bold text-cyan-400">
                                £{(featuredProducts[0].price / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </a>
                </Link>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                  <p>No featured products available</p>
                </div>
              )}
            </div>
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

      {/* Shop the Look */}
      <ShopTheLook />

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
              {featuredProducts.filter(p => p && p.id).map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 interactive-card"
                >
                  <Link href={`/product/${product.id}`}>
                    <a>
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        <WishlistButton productId={product.id} />
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
                        
                        {/* Stock Indicators */}
                        {product.stock === 0 ? (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                              OUT OF STOCK
                            </span>
                          </div>
                        ) : product.stock < 10 ? (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg animate-pulse">
                            {product.stock} left
                          </div>
                        ) : null}
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {product.discount ? (
                            <>
                              <span className="text-sm font-semibold text-muted-foreground line-through">
                                £{(product.price / 100).toFixed(2)}
                              </span>
                              <span className="text-xl font-bold text-primary glow-text">
                                £{((product.price * (1 - product.discount / 100)) / 100).toFixed(2)}
                              </span>
                              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                -{product.discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-primary glow-text">
                              £{(product.price / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Quick Add Selector */}
                      <ProductCardQuickSelector product={product} />
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

      {/* Testimonials Section */}
      <TestimonialsCarousel />

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

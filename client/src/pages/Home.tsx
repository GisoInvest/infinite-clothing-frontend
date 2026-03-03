import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
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

const HERO_SLIDES = [
  {
    image: '/hero-slides/hero_1.png',
    title: 'INFINITE POTENTIAL',
    subtitle: 'Unsettle the system with bold expression.',
    link: '/men'
  },
  {
    image: '/hero-slides/hero_2.png',
    title: 'UNBOUND FREEDOM',
    subtitle: 'Modern luxury meets urban heritage.',
    link: '/women'
  },
  {
    image: '/hero-slides/hero_3.png',
    title: 'FUTURE IS HANDMADE',
    subtitle: 'Crafted for the bold, the creative, and the unique.',
    link: '/shop'
  },
  {
    image: '/hero-slides/hero_4.png',
    title: 'MODERN HERITAGE',
    subtitle: 'Redefining streetwear with purpose-driven design.',
    link: '/shop'
  }
];

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.getFeatured.useQuery();
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen flex flex-col">
      <NeonParticles />
      <SEO />
      <OrganizationStructuredData />
      <WelcomePopup />
      <Navigation />

      {/* Hero Section - Luxury Slider */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-contain md:object-cover object-center scale-105 animate-slow-zoom"
            />
            <div className="container relative z-30 h-full flex flex-col justify-center items-start space-y-6">
              <div className="max-w-2xl space-y-4 animate-fade-in-up">
                <h2 className="text-cyan-400 font-bold tracking-[0.3em] text-sm md:text-base uppercase">
                  New Collection 2026
                </h2>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold glow-text leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex gap-4 pt-4">
                  <Link href={slide.link}>
                    <a>
                      <Button size="lg" className="glow-box pulse-glow text-lg px-10">
                        Shop Now
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 z-40 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full border-primary/30 hover:bg-primary/20 glow-border h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-8 bg-primary shadow-[0_0_10px_rgba(0,255,255,0.8)]' : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full border-primary/30 hover:bg-primary/20 glow-border h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.discount ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              £{(product.price / 100).toFixed(2)}
                            </span>
                            <span className="font-bold text-primary">
                              £{((product.price * (1 - product.discount / 100)) / 100).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-primary">
                            £{(product.price / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <ProductCardQuickSelector product={product} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>No products found in this collection.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

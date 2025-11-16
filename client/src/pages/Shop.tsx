import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Loader2, SlidersHorizontal, X } from 'lucide-react';
import SEO from '@/components/SEO';
import ProductCardQuickSelector from '@/components/ProductCardQuickSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import WishlistButton from '@/components/WishlistButton';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function Shop() {
  const { data: products, isLoading } = trpc.products.getAll.useQuery();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values from products
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const sizes = useMemo(() => {
    if (!products) return [];
    const allSizes = new Set<string>();
    products.forEach(p => {
      if (p.sizes) {
        p.sizes.forEach((size: string) => allSizes.add(size));
      }
    });
    return Array.from(allSizes);
  }, [products]);

  const colors = useMemo(() => {
    if (!products) return [];
    const allColors = new Set<string>();
    products.forEach(p => {
      if (p.colors) {
        p.colors.forEach((color: string) => allColors.add(color));
      }
    });
    return Array.from(allColors);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      const price = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const productSizes = product.sizes || [];
        if (!selectedSizes.some(size => productSizes.includes(size))) {
          return false;
        }
      }

      // Color filter
      if (selectedColors.length > 0) {
        const productColors = product.colors || [];
        if (!selectedColors.some(color => productColors.includes(color))) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'popular':
        // Sort by stock sold (assuming lower stock = more popular)
        filtered.sort((a, b) => a.stock - b.stock);
        break;
    }

    return filtered;
  }, [products, selectedCategory, priceRange, selectedSizes, selectedColors, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    return count;
  }, [selectedCategory, selectedSizes, selectedColors]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  return (
    <>
      <SEO
        title="Shop All Products"
        description="Browse our complete collection of modern streetwear"
      />
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Shop <span className="text-gradient">All Products</span>
            </h1>
            <p className="text-muted-foreground">
              Discover our complete collection of modern streetwear
            </p>
          </div>

          {/* Filters and Sort Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Category</h3>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat!}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Size</h3>
                    <div className="space-y-2">
                      {sizes.map(size => (
                        <div key={size} className="flex items-center">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => toggleSize(size)}
                          />
                          <Label htmlFor={`size-${size}`} className="ml-2 cursor-pointer">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Color</h3>
                    <div className="space-y-2">
                      {colors.map(color => (
                        <div key={color} className="flex items-center">
                          <Checkbox
                            id={`color-${color}`}
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() => toggleColor(color)}
                          />
                          <Label htmlFor={`color-${color}`} className="ml-2 cursor-pointer">
                            {color}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        £{(priceRange[0] / 100).toFixed(2)} - £{(priceRange[1] / 100).toFixed(2)}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all">
                  <CardContent className="p-0">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden cursor-pointer">
                        <WishlistButton productId={product.id} />
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
                      
                      <div className="flex items-center gap-2 mb-3">
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

                      <ProductCardQuickSelector 
                        product={product}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No products found matching your filters.
              </p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

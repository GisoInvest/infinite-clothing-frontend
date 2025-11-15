import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardQuickSelectorProps {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    sizes: string[];
    colors: string[];
    category: string;
    subcategory: string;
  };
}

export default function ProductCardQuickSelector({ product }: ProductCardQuickSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showSelectors, setShowSelectors] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images?.[0],
      category: product.category,
      subcategory: product.subcategory,
      size: selectedSize,
      color: selectedColor,
    });

    toast.success(`${product.name} added to cart!`);
    setShowSelectors(false);
    setSelectedSize('');
    setSelectedColor('');
  };

  if (!showSelectors) {
    return (
      <Button
        size="sm"
        className="glow-box w-full"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowSelectors(true);
        }}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Quick Add
      </Button>
    );
  }

  return (
    <div 
      className="space-y-3 p-3 bg-slate-900/50 rounded-lg border border-primary/20"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Size Selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Size</label>
        <div className="flex flex-wrap gap-1">
          {product.sizes && product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(size);
              }}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                selectedSize === size
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-primary/30 hover:border-primary/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Color</label>
        <div className="flex flex-wrap gap-1">
          {product.colors && product.colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                selectedColor === color
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-primary/30 hover:border-primary/50'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSelectors(false);
            setSelectedSize('');
            setSelectedColor('');
          }}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1 glow-box text-xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={!selectedSize || !selectedColor}
        >
          <Check className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

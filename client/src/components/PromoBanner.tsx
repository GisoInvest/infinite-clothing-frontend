import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-3 px-4 text-center animate-pulse">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <span className="text-sm md:text-base font-bold">
          🎄 20% OFF ALL ITEMS - CHRISTMAS SALE! 🎄
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}


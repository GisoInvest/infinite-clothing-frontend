import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden tron-banner">
      {/* Animated background scanlines */}
      <div className="absolute inset-0 tron-scanlines opacity-20" />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 tron-border-glow" />
      
      {/* Main content */}
      <div className="relative container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-3 px-4">
        <span className="text-sm md:text-base font-bold text-white tron-flicker">
          🎉 25% OFF ALL ITEMS - NEW YEAR SALE! 🎉
        </span>
        <CountdownTimer 
          targetDate={new Date('2026-01-31T23:59:59')}
          onComplete={() => setIsVisible(false)}
        />
      </div>
      
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/20 z-10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Animated light sweep */}
      <div className="absolute inset-0 tron-sweep pointer-events-none" />
    </div>
  );
}

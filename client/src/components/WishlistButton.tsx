import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { getLoginUrl } from '@/const';

interface WishlistButtonProps {
  productId: number;
  className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const isWishlisted = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your wishlist');
      window.location.href = getLoginUrl();
      return;
    }

    toggleWishlist(productId);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background ${className}`}
      onClick={handleClick}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
        }`}
      />
    </Button>
  );
}

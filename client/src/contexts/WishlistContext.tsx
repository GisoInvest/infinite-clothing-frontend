import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface WishlistContextType {
  wishlistItems: number[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => void;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  
  const { data: wishlistData, isLoading, refetch } = trpc.wishlist.getAll.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const addMutation = trpc.wishlist.add.useMutation({
    onSuccess: () => refetch(),
  });
  
  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    if (wishlistData) {
      setWishlistItems(wishlistData.map(item => item.productId));
    }
  }, [wishlistData]);

  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      // Store in localStorage for non-logged-in users
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (localWishlist.includes(productId)) {
        const updated = localWishlist.filter((id: number) => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlistItems(updated);
      } else {
        const updated = [...localWishlist, productId];
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlistItems(updated);
      }
      return;
    }

    // For logged-in users, use API
    if (isInWishlist(productId)) {
      await removeMutation.mutateAsync({ productId });
    } else {
      await addMutation.mutateAsync({ productId });
    }
  };

  // Load from localStorage for non-logged-in users
  useEffect(() => {
    if (!user) {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(localWishlist);
    }
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

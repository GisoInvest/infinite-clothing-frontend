interface PriceDisplayProps {
  price: number;
  discount?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function PriceDisplay({ price, discount = 0, size = 'medium' }: PriceDisplayProps) {
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? Math.round(price * (1 - discount / 100)) : price;

  const sizeClasses = {
    small: {
      original: 'text-sm',
      discounted: 'text-lg',
      badge: 'text-xs px-2 py-0.5',
    },
    medium: {
      original: 'text-lg',
      discounted: 'text-2xl',
      badge: 'text-sm px-2 py-1',
    },
    large: {
      original: 'text-2xl',
      discounted: 'text-3xl',
      badge: 'text-base px-3 py-1',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {hasDiscount ? (
        <>
          <span className={`${classes.discounted} font-bold text-primary`}>
            £{(discountedPrice / 100).toFixed(2)}
          </span>
          <span className={`${classes.original} text-muted-foreground line-through`}>
            £{(price / 100).toFixed(2)}
          </span>
          <span className={`${classes.badge} bg-destructive text-destructive-foreground font-semibold rounded`}>
            -{discount}%
          </span>
        </>
      ) : (
        <span className={`${classes.discounted} font-bold text-primary`}>
          £{(price / 100).toFixed(2)}
        </span>
      )}
    </div>
  );
}


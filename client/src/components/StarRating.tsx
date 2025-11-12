import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 20,
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isPartial = index === Math.floor(rating) && rating % 1 !== 0;
        
        return (
          <div 
            key={index}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => handleClick(index)}
          >
            {isPartial ? (
              <div className="relative">
                <Star size={size} className="text-muted-foreground" />
                <div 
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star size={size} className="fill-primary text-primary" />
                </div>
              </div>
            ) : (
              <Star 
                size={size} 
                className={isFilled ? 'fill-primary text-primary' : 'text-muted-foreground'}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import StarRating from '@/components/StarRating';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading, refetch } = trpc.reviews.getByProduct.useQuery({ productId });
  const { data: averageRating = 0 } = trpc.reviews.getAverageRating.useQuery({ productId });
  
  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      setTitle('');
      setComment('');
      setName('');
      setEmail('');
      setRating(5);
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  const markHelpful = trpc.reviews.markHelpful.useMutation({
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      refetch();
    },
  });

  const handleSubmitReview = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    createReview.mutate({
      productId,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      userName: name.trim(),
      userEmail: email.trim(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <StarRating rating={averageRating} size={24} />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-muted-foreground">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="glow-box">
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <Card className="p-6 border-primary/20 bg-card/50 space-y-4">
          <h3 className="text-xl font-semibold">Write Your Review</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="review-name">Your Name *</Label>
              <Input
                id="review-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-email">Your Email *</Label>
              <Input
                id="review-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <StarRating rating={rating} interactive onRatingChange={setRating} size={32} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-title">Review Title (Optional)</Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">Your Review *</Label>
            <Textarea
              id="review-comment"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSubmitReview} 
              disabled={createReview.isPending}
              className="glow-box"
            >
              {createReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowForm(false);
                setTitle('');
                setComment('');
                setName('');
                setEmail('');
                setRating(5);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 border-primary/20 bg-card/50 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6 border-primary/20 bg-card/50 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size={18} />
                    {review.verifiedPurchase && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold">{review.title}</h4>
                  )}
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p className="font-medium">{review.userName}</p>
                  <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-foreground/90">{review.comment}</p>

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markHelpful.mutate({ id: review.id })}
                  disabled={markHelpful.isPending}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpfulCount})
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

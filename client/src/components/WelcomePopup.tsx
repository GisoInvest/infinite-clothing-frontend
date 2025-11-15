import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.discountCode) {
        setDiscountCode(data.discountCode);
        setShowCode(true);
        toast.success('Welcome! Your discount code is ready!');
      } else {
        toast.success('Welcome! Check your email for your discount code.');
        setIsVisible(false);
        sessionStorage.setItem('welcomePopupShown', 'true');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    },
  });

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('welcomePopupShown');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      // Show popup on exit intent (mouse leaving viewport)
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !sessionStorage.getItem('welcomePopupShown')) {
          setIsVisible(true);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcomePopupShown', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    toast.success('Discount code copied to clipboard!');
  };

  const handleCloseWithCode = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcomePopupShown', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please enter your name and email');
      return;
    }
    subscribeMutation.mutate({ email, name });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-scale-in">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400/50 rounded-lg shadow-2xl overflow-hidden">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-white hover:bg-white/20 z-10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="relative p-8 text-center">
            {!showCode ? (
              <>
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <span className="text-3xl">🎁</span>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 glow-text">
                  Welcome to INF!NITE C107HING!
                </h2>
                <p className="text-cyan-300 mb-6 text-sm md:text-base">
                  Get <span className="font-bold text-lg text-cyan-400">10% OFF</span> your first order
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800/50 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? 'Subscribing...' : 'Get My 10% OFF'}
                  </Button>
                </form>

                {/* Fine print */}
                <p className="text-xs text-gray-400 mt-4">
                  By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>

                {/* Success Heading */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 glow-text">
                  Your Discount Code!
                </h2>
                <p className="text-cyan-300 mb-6 text-sm md:text-base">
                  Use this code at checkout for <span className="font-bold text-lg text-green-400">10% OFF</span>
                </p>

                {/* Discount Code Display */}
                <div className="bg-white/10 border-2 border-dashed border-cyan-400 rounded-lg p-6 mb-6">
                  <p className="text-xs text-gray-400 mb-2">YOUR DISCOUNT CODE</p>
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-wider mb-4 glow-text">
                    {discountCode}
                  </p>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                  >
                    Copy Code
                  </Button>
                </div>

                {/* Instructions */}
                <div className="text-left bg-slate-800/50 rounded-lg p-4 mb-4 text-sm text-gray-300">
                  <p className="mb-2">✨ <strong>How to use:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Add items to your cart</li>
                    <li>Go to checkout</li>
                    <li>Enter your discount code</li>
                    <li>Enjoy 10% off your order!</li>
                  </ol>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  📧 We've also sent this code to your email: <strong className="text-cyan-400">{email}</strong>
                </p>

                <Button
                  onClick={handleCloseWithCode}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/30"
                >
                  Start Shopping
                </Button>
              </>
            )}
          </div>

          {/* Animated scanlines */}
          <div className="absolute inset-0 tron-scanlines opacity-10 pointer-events-none" />
        </div>
      </div>
    </>
  );
}

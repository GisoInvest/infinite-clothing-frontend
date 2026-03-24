import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export function useAnalytics() {
  const [location] = useLocation();
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    let id = sessionStorage.getItem('sessionId');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', id);
    }
    return id;
  });

  const trackPageViewMutation = trpc.analytics.trackPageView.useMutation();
  const trackInteractionMutation = trpc.analytics.trackInteraction.useMutation();

  // Track page views
  useEffect(() => {
    const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    trackPageViewMutation.mutate({
      sessionId,
      page: location,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ipAddress: '', // Will be set by backend if needed
      country: '', // Will be set by backend if needed
      city: '', // Will be set by backend if needed
      deviceType: getDeviceType(),
    });
  }, [location, sessionId, trackPageViewMutation]);

  const trackEvent = (eventType: 'page_view' | 'product_click' | 'add_to_cart' | 'remove_from_cart' | 'add_to_wishlist' | 'remove_from_wishlist' | 'checkout_start' | 'checkout_complete' | 'search' | 'filter_applied' | 'form_submission' | 'button_click', eventData?: Record<string, any>) => {
    trackInteractionMutation.mutate({
      sessionId,
      eventType,
      eventData,
      page: location,
    });
  };

  return { trackEvent, sessionId };
}

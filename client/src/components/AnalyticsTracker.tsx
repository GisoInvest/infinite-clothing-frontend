import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

/**
 * Global Analytics Tracker Component
 * Tracks page views and interactions across the entire application
 */
export default function AnalyticsTracker() {
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

  // Get device type
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Track page views on location change
  useEffect(() => {
    // Don't track admin pages or entry portal
    if (location.startsWith('/admin') || location === '/entry') {
      return;
    }

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

  return null; // This component doesn't render anything visible
}

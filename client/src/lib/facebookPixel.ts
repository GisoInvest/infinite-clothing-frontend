/**
 * Facebook Pixel Tracking Utility
 * Provides helper functions to track various events with Meta Pixel
 */

declare global {
  interface Window {
    fbq?: (command: string, event: string, data?: Record<string, any>) => void;
  }
}

export const FacebookPixel = {
  /**
   * Track a product view event
   */
  trackViewContent: (productId: number, productName: string, price: number, currency: string = 'GBP') => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: currency,
      });
    }
  },

  /**
   * Track an add to cart event
   */
  trackAddToCart: (productId: number, productName: string, price: number, quantity: number = 1, currency: string = 'GBP') => {
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price * quantity,
        currency: currency,
        quantity: quantity,
      });
    }
  },

  /**
   * Track an initiate checkout event
   */
  trackInitiateCheckout: (value: number, currency: string = 'GBP', numItems: number = 1) => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: value,
        currency: currency,
        num_items: numItems,
      });
    }
  },

  /**
   * Track a purchase event
   */
  trackPurchase: (value: number, currency: string = 'GBP', orderId?: string) => {
    if (window.fbq) {
      const data: Record<string, any> = {
        value: value,
        currency: currency,
      };
      if (orderId) {
        data.transaction_id = orderId;
      }
      window.fbq('track', 'Purchase', data);
    }
  },

  /**
   * Track a search event
   */
  trackSearch: (searchString: string) => {
    if (window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchString,
      });
    }
  },

  /**
   * Track a custom event
   */
  trackCustomEvent: (eventName: string, data?: Record<string, any>) => {
    if (window.fbq) {
      window.fbq('track', eventName, data || {});
    }
  },

  /**
   * Track a page view (can be called manually if needed)
   */
  trackPageView: () => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  },
};

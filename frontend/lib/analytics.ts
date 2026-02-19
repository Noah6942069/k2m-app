// Google Analytics Event Tracking Utilities

/**
 * Track page views
 * @param url - The page URL
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom events
 * @param action - The action being tracked (e.g., 'login', 'button_click')
 * @param category - Event category (e.g., 'engagement', 'navigation')
 * @param label - Event label (optional)
 * @param value - Event value (optional)
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track login events
 * @param method - Login method (e.g., 'email', 'google')
 */
export const trackLogin = (method: string) => {
  event({
    action: 'login',
    category: 'authentication',
    label: method,
  });
};

/**
 * Track page interactions
 * @param pageName - Name of the page
 * @param action - Action performed
 */
export const trackPageInteraction = (pageName: string, action: string) => {
  event({
    action: action,
    category: 'page_interaction',
    label: pageName,
  });
};

/**
 * Track errors
 * @param description - Error description
 * @param fatal - Whether the error is fatal
 */
export const trackError = (description: string, fatal: boolean = false) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  }
};

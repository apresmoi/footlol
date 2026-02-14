const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

let analyticsEnabled = false;
let analyticsScriptInjected = false;

const ensureGtag = () => {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
};

const injectAnalyticsScript = () => {
  if (analyticsScriptInjected) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  analyticsScriptInjected = true;
};

export const initializeAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return false;
  }

  if (analyticsEnabled) {
    return true;
  }

  ensureGtag();
  injectAnalyticsScript();

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  analyticsEnabled = true;
  return true;
};

export const trackPageView = ({ path, title }) => {
  if (!analyticsEnabled || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: `${window.location.origin}${path}`,
  });
};

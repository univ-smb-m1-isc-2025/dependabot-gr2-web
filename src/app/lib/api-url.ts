export function getApiUrl() {
  // For client-side rendering, check hostname first
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'depocheck.djapamal.fr') {
      return 'https://api.depocheck.djapamal.fr';
    }
  }
  
  // Try next/config (might not work in App Router)
  try {
    const getConfig = require('next/config').default;
    const { publicRuntimeConfig } = getConfig() || {};
    if (publicRuntimeConfig?.apiUrl) {
      return publicRuntimeConfig.apiUrl;
    }
  } catch (e) {
    console.debug('Could not load config:', e);
  }
  
  // Fall back to environment variable or hardcoded default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
}
/**
 * Meta Pixel & Conversions API — Hybrid Implementation
 * 
 * CAPI METHOD: Server-side endpoint (/api/meta-capi)
 * 
 * This file now handles both the client-side Pixel events and forwards
 * the necessary data to a secure, server-side endpoint for CAPI.
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Generates a cryptographically secure unique event ID.
 */
function generateEventId(): string {
  return crypto.randomUUID();
}

/**
 * Retrieves a cookie by its name.
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Store user data in memory
let storedUserData: Record<string, string> = {};

export function setUserData(data: { email?: string; phone?: string; firstName?: string; lastName?: string; city?: string; state?: string; zip?: string }) {
  if (data.email) storedUserData.em = data.email;
  if (data.phone) storedUserData.ph = data.phone;
  if (data.firstName) storedUserData.fn = data.firstName;
  if (data.lastName) storedUserData.ln = data.lastName;
  if (data.city) storedUserData.ct = data.city;
  if (data.state) storedUserData.st = data.state;
  if (data.zip) storedUserData.zp = data.zip;
}

// ============================================================
// PIXEL EVENTS — Sent from the client
// ============================================================

export function trackPixelEvent(eventName: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventParams = { ...params };
    if (eventId) {
      eventParams.eventID = eventId;
    }
    window.fbq('track', eventName, eventParams);
    console.log(`[Meta Pixel] Tracked: ${eventName}`, eventParams);
  }
}

// ============================================================
// CAPI — Sent to the server-side endpoint
// ============================================================

async function sendCAPIEvent(eventName: string, eventData: Record<string, unknown>, eventId: string) {
  const fbc = getCookie('_fbc');
  const fbp = getCookie('_fbp');

  const payload = {
    eventName,
    eventData,
    eventId,
    eventSourceUrl: window.location.href,
    userData: storedUserData, // Send raw PII to server for secure hashing
    fbc: fbc,
    fbp: fbp,
  };

  try {
    const response = await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(`[CAPI Client] Server returned an error for ${eventName}:`, await response.json());
    }
  } catch (err) {
    console.error(`[CAPI Client] Failed to send ${eventName} to server:`, err);
  }
}

// ============================================================
// UNIFIED EVENT FUNCTIONS (PIXEL + CAPI)
// ============================================================

export function trackViewContent(productId: string, productName: string, value: number, currency: string) {
  const eventId = generateEventId();
  const params = { content_ids: [productId], content_type: 'product', content_name: productName, value, currency };
  trackPixelEvent('ViewContent', params, eventId);
  sendCAPIEvent('ViewContent', params, eventId);
}

export function trackAddToCart(productId: string, productName: string, value: number, currency: string, quantity: number) {
  const eventId = generateEventId();
  const params = { content_ids: [productId], content_type: 'product', content_name: productName, value, currency, num_items: quantity };
  trackPixelEvent('AddToCart', params, eventId);
  sendCAPIEvent('AddToCart', params, eventId);
}

export function trackInitiateCheckout(value: number, currency: string, numItems: number, contentIds?: string[]) {
  const eventId = generateEventId();
  const params = { value, currency, num_items: numItems, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}) };
  trackPixelEvent('InitiateCheckout', params, eventId);
  sendCAPIEvent('InitiateCheckout', params, eventId);
}

export function trackPurchase(value: number, currency: string, contentIds?: string[], numItems?: number) {
  const eventId = generateEventId();
  const params = { value, currency, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}), ...(numItems ? { num_items: numItems } : {}) };
  trackPixelEvent('Purchase', params, eventId);
  sendCAPIEvent('Purchase', params, eventId);
}

export function trackLead(formType?: string) {
  const eventId = generateEventId();
  const params = { content_name: formType || 'contact_form', value: 10.00, currency: 'USD' };
  trackPixelEvent('Lead', params, eventId);
  sendCAPIEvent('Lead', params, eventId);
}

export function trackCompleteRegistration(method?: string) {
  const eventId = generateEventId();
  const params = { content_name: method || 'email', value: 5.00, currency: 'USD', status: true };
  trackPixelEvent('CompleteRegistration', params, eventId);
  sendCAPIEvent('CompleteRegistration', params, eventId);
}

export function trackContact() {
  const eventId = generateEventId();
  const params = { value: 15.00, currency: 'USD' };
  trackPixelEvent('Contact', params, eventId);
  sendCAPIEvent('Contact', params, eventId);
}

export function trackSearch(query: string) {
  const eventId = generateEventId();
  const params = { search_string: query, content_category: 'products' };
  trackPixelEvent('Search', params, eventId);
  sendCAPIEvent('Search', params, eventId);
}

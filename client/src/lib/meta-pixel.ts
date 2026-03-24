/**
 * Meta Pixel & Conversions API — Direct HTTP POST Implementation
 * 
 * CAPI METHOD: Raw fetch() POST to Graph API endpoint
 * 
 * PIXEL STATUS: Good — proper init with advanced matching (em, ph),
 *   noscript fallback present, all standard events tracked with decent params.
 * 
 * CAPI STATUS: Functional but improvable
 * CAPI GAPS:
 * 1. Access token exposed client-side (should be server-side)
 * 2. No retry logic on failed requests
 * 3. No batching — sends one event per request instead of batching up to 1000
 * 4. Missing fbc (click ID) and fbp (browser ID) cookies in user_data
 * 5. event_id generated but uses Math.random() — not cryptographically strong
 * 6. No data_processing_options for CCPA/GDPR
 * 7. Missing client_ip_address (can't be obtained client-side accurately)
 * 8. Hashing uses SHA-256 but doesn't normalize before hashing (no lowercase/trim)
 * 9. No error handling callback or dead letter queue
 * 10. event_time uses client clock which may be inaccurate
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = '1684145446350033';
const ACCESS_TOKEN = 'EAAEDq1LHx1gBRPAEq5cUOKS5JrrvMif65SN8ysCUrX5t0SUZB3ETInM6Pt71VHea0bowwEehinD0oZAeSmIPWivziiVu0FuEIcsmgvT3fiqZADKQDiFgKdsugONbJXELgvLuQxHT0krELKt3DPhm0EyUa44iXu8uaZBZBddgVmEnFdNMBmsWmYJdOT17DTitYKwZDZD';
// GAP: Access token is hardcoded client-side — should be on server

const CAPI_ENDPOINT = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;

// ============================================================
// HELPERS
// ============================================================

function generateEventId(): string {
  // GAP: Uses Math.random() — should use crypto.randomUUID()
  return 'evt_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

async function hashSHA256(value: string): Promise<string> {
  // GAP: Does NOT normalize (lowercase, trim) before hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
// PIXEL EVENTS — Good implementation with event_id
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

export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
}

// ============================================================
// CAPI — Direct HTTP POST (fetch)
// ============================================================

async function sendCAPIEvent(eventName: string, eventData: Record<string, unknown>, eventId: string) {
  const userData: Record<string, unknown> = {
    client_user_agent: navigator.userAgent,
    // GAP: Missing fbc — should read _fbc cookie
    // GAP: Missing fbp — should read _fbp cookie
    // GAP: Missing client_ip_address — needs server-side
  };

  if (storedUserData.em) userData.em = [await hashSHA256(storedUserData.em)];
  if (storedUserData.ph) userData.ph = [await hashSHA256(storedUserData.ph)];
  if (storedUserData.fn) userData.fn = [await hashSHA256(storedUserData.fn)];
  if (storedUserData.ln) userData.ln = [await hashSHA256(storedUserData.ln)];
  if (storedUserData.ct) userData.ct = [await hashSHA256(storedUserData.ct)];
  if (storedUserData.st) userData.st = [await hashSHA256(storedUserData.st)];
  if (storedUserData.zp) userData.zp = [await hashSHA256(storedUserData.zp)];

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: userData,
      custom_data: eventData,
      // GAP: Missing data_processing_options
    }],
    access_token: ACCESS_TOKEN,
  };

  // Direct HTTP POST — no retry, no batching
  try {
    const response = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log(`[CAPI HTTP] ${eventName} response:`, result);
  } catch (err) {
    console.error(`[CAPI HTTP] ${eventName} failed:`, err);
    // GAP: No retry, no dead letter queue
  }
}

// ============================================================
// EVENT FUNCTIONS
// ============================================================

export function trackViewContent(productId: string, productName: string, value: number, currency: string) {
  const eventId = generateEventId();
  trackPixelEvent('ViewContent', { content_ids: [productId], content_type: 'product', content_name: productName, value, currency }, eventId);
  sendCAPIEvent('ViewContent', { content_ids: [productId], content_type: 'product', content_name: productName, value, currency }, eventId);
}

export function trackAddToCart(productId: string, productName: string, value: number, currency: string, quantity: number) {
  const eventId = generateEventId();
  trackPixelEvent('AddToCart', { content_ids: [productId], content_type: 'product', content_name: productName, value, currency, num_items: quantity }, eventId);
  sendCAPIEvent('AddToCart', { content_ids: [productId], content_type: 'product', content_name: productName, value, currency, num_items: quantity }, eventId);
}

export function trackInitiateCheckout(value: number, currency: string, numItems: number, contentIds?: string[]) {
  const eventId = generateEventId();
  trackPixelEvent('InitiateCheckout', { value, currency, num_items: numItems, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}) }, eventId);
  sendCAPIEvent('InitiateCheckout', { value, currency, num_items: numItems, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}) }, eventId);
}

export function trackPurchase(value: number, currency: string, contentIds?: string[], numItems?: number) {
  const eventId = generateEventId();
  trackPixelEvent('Purchase', { value, currency, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}), ...(numItems ? { num_items: numItems } : {}) }, eventId);
  sendCAPIEvent('Purchase', { value, currency, content_type: 'product', ...(contentIds ? { content_ids: contentIds } : {}), ...(numItems ? { num_items: numItems } : {}) }, eventId);
}

export function trackLead(formType?: string) {
  const eventId = generateEventId();
  trackPixelEvent('Lead', { content_name: formType || 'contact_form', value: 10.00, currency: 'USD' }, eventId);
  sendCAPIEvent('Lead', { content_name: formType || 'contact_form', value: 10.00, currency: 'USD' }, eventId);
}

export function trackCompleteRegistration(method?: string) {
  const eventId = generateEventId();
  trackPixelEvent('CompleteRegistration', { content_name: method || 'email', value: 5.00, currency: 'USD', status: true }, eventId);
  sendCAPIEvent('CompleteRegistration', { content_name: method || 'email', value: 5.00, currency: 'USD', status: true }, eventId);
}

export function trackContact() {
  const eventId = generateEventId();
  trackPixelEvent('Contact', { value: 15.00, currency: 'USD' }, eventId);
  sendCAPIEvent('Contact', { value: 15.00, currency: 'USD' }, eventId);
}

export function trackSearch(query: string) {
  const eventId = generateEventId();
  trackPixelEvent('Search', { search_string: query, content_category: 'products' }, eventId);
  sendCAPIEvent('Search', { search_string: query, content_category: 'products' }, eventId);
}

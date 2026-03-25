# demo-ecommerce-capi-http

## Overview
This variant demonstrates a direct client-side implementation of the Meta Conversions API (CAPI) using `fetch` to send events directly to the Graph API from the browser. This is part of a collection of demo e-commerce sites that showcase different levels of Meta Pixel and Conversions API (CAPI) implementation quality. Each variant is deployed on GitHub Pages.

**Live Site:** https://mishaberman.github.io/demo-ecommerce-capi-http/
**Quality Grade:** B-

## Meta Pixel Setup

### Base Pixel Code
- **Pixel ID:** `1684145446350033`
- **Location:** Loaded in the `<head>` tag of `index.html`.
- **Noscript Fallback:** Includes the `<noscript>` tag for browsers with JavaScript disabled.

### Advanced Matching
- User data fields passed to `fbq('init', PIXEL_ID, {em: 'user@example.com'})` for initial page load.
- `setUserData()` is implemented to capture and send additional user data fields: `em`, `ph`, `fn`, `ln`, and `external_id`.
- **Issue:** While advanced matching is implemented, it relies on client-side data which may not always be available.

## Conversions API (CAPI) Setup

### Method
This variant uses a **Client-Side Direct HTTP** method. Events are sent directly from the user's browser to the Meta Graph API endpoint using the `fetch` API. This is **not a recommended practice** as it exposes the access token.

### Implementation Details
- **Endpoint:** Events are sent via `POST` requests to `https://graph.facebook.com/v13.0/PIXEL_ID/events`.
- **Access Token:** The access token is **exposed** in the client-side JavaScript code, which is a major security risk.
- **User Data:** The following `user_data` fields are sent with CAPI events: `em`, `ph`, `fn`, `ln`, `external_id`.
- **Hashing:** PII is hashed client-side using SHA-256 before being sent.
- **Data Processing Options:** `data_processing_options` are **not** included, which may be a gap for CCPA/GDPR compliance.

## Events Tracked

| Event Name | Pixel | CAPI | Parameters Sent | event_id |
|---|---|---|---|---|
| ViewContent | Yes | Yes | content_ids, content_type, content_name, value, currency | Yes |
| AddToCart | Yes | Yes | content_ids, content_type, content_name, value, currency, num_items | Yes |
| InitiateCheckout | Yes | Yes | content_ids, content_type, content_name, value, currency, num_items | Yes |
| Purchase | Yes | Yes | content_ids, content_type, content_name, value, currency, num_items | Yes |
| Lead | Yes | Yes | content_name, value, currency | Yes |
| CompleteRegistration | Yes | Yes | content_name, currency | Yes |
| Search | Yes | Yes | search_string | Yes |
| Contact | Yes | Yes | - | Yes |

## Event Deduplication
- **`event_id` Generation:** A unique `event_id` is generated for each event using `crypto.randomUUID()`.
- **Implementation:** The same `event_id` is passed to both the `fbq('track', ...)` call (in the `eventID` property) and the CAPI payload (in the `event_id` field).
- **Status:** Deduplication is correctly implemented and functional in this variant.

## Custom Data
- **Custom Properties:** No `custom_data` fields are sent with events.
- **Content Type:** The `content_type` is `product` for e-commerce events.
- **Content IDs:** The `content_ids` use the format `['SKU1234']`.

## Known Issues
- **Access Token Exposure:** The CAPI access token is hardcoded in the client-side JavaScript, making it publicly visible. This is a significant security vulnerability.
- **Missing Server-Side Data:** Important user data parameters that are only available server-side (`client_ip_address`, `client_user_agent`) and from URL parameters (`fbc`) or cookies (`fbp`) are not being sent with CAPI events.
- **No Privacy Compliance:** The implementation does not include `data_processing_options` for CCPA/GDPR compliance.

## Security Considerations
- **Access Token:** The access token is exposed in client-side code, which is a major security risk.
- **PII Hashing:** PII is properly hashed on the client-side before transmission.
- **Privacy Compliance:** There are gaps in privacy compliance due to the missing `data_processing_options`.

---
*This variant is part of the [Meta Pixel Quality Variants](https://github.com/mishaberman) collection for testing and educational purposes.*

# CAPI HTTP Variant &nbsp; <img src="https://img.shields.io/badge/Grade-C+-yellow" alt="Grade C+">

This variant demonstrates a functional but insecure implementation of the Meta Conversions API (CAPI) using direct client-side HTTP calls. Events are sent from the browser to Meta's Graph API, featuring client-side SHA-256 hashing and event deduplication. However, it exposes the access token in the client-side JavaScript, which is a critical security vulnerability. This example serves to illustrate the risks of implementing CAPI without a secure server-side proxy, highlighting potential issues like Cross-Origin Resource Sharing (CORS) errors and the lack of server-side data enrichment.

### Quick Facts

| Category          | Details                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Pixel ID**      | `1684145446350033`                                                                                      |
| **CAPI Method**   | Client-side direct HTTP POST to `graph.facebook.com/v21.0/{pixel_id}/events`                            |
| **Grade**         | C+                                                                                                      |
| **Live Site**     | [https://mishaberman.github.io/demo-ecommerce-capi-http/](https://mishaberman.github.io/demo-ecommerce-capi-http/) |
| **GitHub Repo**   | [https://github.com/mishaberman/demo-ecommerce-capi-http](https://github.com/mishaberman/demo-ecommerce-capi-http)     |

### What's Implemented

- [x] Meta Pixel Base Code
- [x] Standard Events (ViewContent, AddToCart, InitiateCheckout, Purchase, Lead, Search, CompleteRegistration)
- [x] Conversions API (CAPI) via direct HTTP
- [x] `fbc` and `fbp` parameters are correctly sent
- [x] Client-side SHA-256 hashing of user data
- [x] Event deduplication using `event_id`
- [x] Data Processing Options (DPO) are configured

### What's Missing or Broken

- [ ] **CRITICAL: Access token is exposed in client-side JavaScript**
- [ ] No server-side data enrichment (IP address, User Agent)
- [ ] No server-side hashing of user data
- [ ] Potential for CORS issues depending on browser policies
- [ ] All processing occurs in the browser, increasing client-side load
- [ ] No Automatic Advanced Matching (AAM)

### Event Coverage

| Event                | Pixel | CAPI  |
| -------------------- | :---: | :---: |
| ViewContent          |   ✅   |   ✅   |
| AddToCart            |   ✅   |   ✅   |
| InitiateCheckout     |   ✅   |   ✅   |
| Purchase             |   ✅   |   ✅   |
| Lead                 |   ✅   |   ✅   |
| Search               |   ✅   |   ✅   |
| CompleteRegistration |   ✅   |   ✅   |

### Parameter Completeness

| Event                | `content_type` | `content_ids` | `value` | `currency` | `content_name` | `num_items` |
| -------------------- | :------------: | :-----------: | :-----: | :--------: | :------------: | :---------: |
| ViewContent          |       ✅       |       ✅       |    ❌    |     ❌     |       ✅       |      ❌      |
| AddToCart            |       ✅       |       ✅       |    ✅    |     ✅     |       ✅       |      ✅      |
| InitiateCheckout     |       ✅       |       ✅       |    ✅    |     ✅     |       ✅       |      ✅      |
| Purchase             |       ✅       |       ✅       |    ✅    |     ✅     |       ✅       |      ✅      |
| Lead                 |       ❌       |       ❌       |    ❌    |     ❌     |       ❌       |      ❌      |
| Search               |       ❌       |       ❌       |    ❌    |     ❌     |       ❌       |      ❌      |
| CompleteRegistration |       ❌       |       ❌       |    ❌    |     ❌     |       ❌       |      ❌      |

### Architecture

This variant implements a "client-side CAPI" architecture where both the Meta Pixel and Conversions API events are sent directly from the user's browser. The process is as follows:

1.  **Pixel Event Fires**: The standard Meta Pixel fires on the page, sending its event to Meta.
2.  **CAPI Event is Constructed**: JavaScript on the client side constructs a CAPI event payload. This includes user data that is hashed using the browser's native Web Crypto API for SHA-256 encryption.
3.  **HTTP POST to Graph API**: The script makes a direct `POST` request to the Meta Graph API endpoint (`graph.facebook.com/v21.0/{pixel_id}/events`) with the constructed payload and the hardcoded access token.
4.  **Deduplication**: Both the Pixel and CAPI events share the same `event_id`, allowing Meta to deduplicate them and keep the best of both.

This approach is highly insecure due to the exposed access token and is not a recommended practice. It is intended for demonstration purposes only.

### How to Use This Variant

To test and audit this variant, follow these steps:

1.  **Browse the Site**: Navigate to the [live site](https://mishaberman.github.io/demo-ecommerce-capi-http/).
2.  **Use Meta Pixel Helper**: Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension to observe Pixel events firing as you navigate the site and perform actions like "Add to Cart" or "Purchase".
3.  **Inspect Network Requests**: Open your browser's developer tools (e.g., Chrome DevTools) and go to the "Network" tab. Filter for requests to `graph.facebook.com` to see the CAPI events being sent directly from your browser.
4.  **Examine the Source Code**: Review the [GitHub repository](https://github.com/mishaberman/demo-ecommerce-capi-http) to see how the access token is exposed and how the client-side hashing and API calls are implemented.

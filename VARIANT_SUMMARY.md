# Demo E-Commerce — Pixel/CAPI Variant Summary

All 5 versions use **Pixel ID: 1684145446350033** and share the same UI/UX. They differ only in Meta Pixel and Conversions API integration quality.

## Live GitHub Pages URLs

| Variant | GitHub Pages URL | Repo |
|---------|-----------------|------|
| Base (Medium) | https://mishaberman.github.io/demo-ecommerce/ | [demo-ecommerce](https://github.com/mishaberman/demo-ecommerce) |
| Excellent | https://mishaberman.github.io/demo-ecommerce-excellent/ | [demo-ecommerce-excellent](https://github.com/mishaberman/demo-ecommerce-excellent) |
| Good | https://mishaberman.github.io/demo-ecommerce-good/ | [demo-ecommerce-good](https://github.com/mishaberman/demo-ecommerce-good) |
| Poor | https://mishaberman.github.io/demo-ecommerce-poor/ | [demo-ecommerce-poor](https://github.com/mishaberman/demo-ecommerce-poor) |
| Minimal | https://mishaberman.github.io/demo-ecommerce-minimal/ | [demo-ecommerce-minimal](https://github.com/mishaberman/demo-ecommerce-minimal) |

## Key Files to Analyze

- `client/index.html` — Pixel base code, noscript, advanced matching init
- `client/src/lib/meta-pixel.ts` — All tracking functions, CAPI simulation, event_id generation
- `client/src/pages/Checkout.tsx` — Purchase + Lead events
- `client/src/pages/Contact.tsx` — Contact + Lead events
- `client/src/pages/Register.tsx` — CompleteRegistration + Lead events
- `client/src/pages/ProductDetail.tsx` — ViewContent event
- `client/src/components/ProductCard.tsx` — AddToCart event
- `client/src/components/CartDrawer.tsx` — InitiateCheckout event
- `client/src/pages/Shop.tsx` — Search event (excellent only)

## Integration Quality Matrix

| Feature | Excellent | Good | Poor | Minimal |
|---------|-----------|------|------|---------|
| **Pixel Base Code** | Yes | Yes | Yes | Yes |
| **noscript Fallback** | Yes | Yes | No | No |
| **Advanced Matching (init)** | Full (em, ph, fn, ln, ct, st, zp) | Partial (em, ph only) | None | None |
| **PageView** | Yes | Yes | Yes | Yes |
| **ViewContent** | Full params + content_category | Full params | value + currency only | Not tracked |
| **AddToCart** | Full params | Full params | value only | value only |
| **InitiateCheckout** | Full (content_ids, num_items) | value + currency | value only | Not tracked |
| **Purchase** | Full + num_items | Full params | value + currency only | value only, no content_ids |
| **Lead** | value + currency | value + currency | No value | Not tracked |
| **Contact** | content_name param | Yes | Yes | Not tracked |
| **CompleteRegistration** | value + currency + content_name | value + currency | status only | Not tracked |
| **Search** | Yes (with search_string) | No | No | No |
| **setUserData (AAM)** | Full PII on form submit | Partial (email only) | None | None |
| **CAPI Simulation** | Full server-side with user_data, event_id, hashing | Basic with event_id, no hashing | None | None |
| **Event Deduplication** | event_id on all events | event_id on some events | None | None |
| **SHA-256 Hashing** | Yes (all PII) | No | No | No |
| **Data Processing Options** | Yes (LDU) | No | No | No |
| **fbp/fbc Cookie Forwarding** | Yes | Partial (fbp only) | No | No |
| **content_type param** | Always "product" | Sometimes | Never | Never |
| **content_ids param** | All events | Purchase only | Never | Never |

## What Your Skill Should Detect Per Variant

### Excellent — Expected Score: ~90-95%
- Minor: Could add more user_data fields (date_of_birth, gender)
- Minor: CAPI is still client-side simulation (should be true server-side)
- Minor: No consent management integration

### Good — Expected Score: ~65-75%
- Missing: noscript present but advanced matching only has em/ph
- Missing: No SHA-256 hashing of PII
- Missing: No data processing options
- Missing: No fbc cookie forwarding
- Missing: Search event not implemented
- Missing: setUserData only passes email, not full PII
- Partial: Event deduplication present but inconsistent

### Poor — Expected Score: ~30-45%
- Missing: No noscript fallback
- Missing: No advanced matching at all
- Missing: No CAPI whatsoever
- Missing: No event deduplication
- Missing: Many events have incomplete parameters
- Missing: No setUserData calls
- Missing: Search, Lead events incomplete
- Present: Basic pixel fires for core events

### Minimal — Expected Score: ~10-20%
- Missing: No noscript fallback
- Missing: No advanced matching
- Missing: No CAPI
- Missing: No event deduplication
- Missing: Only 3 events tracked (PageView, AddToCart, Purchase)
- Missing: No ViewContent, InitiateCheckout, Lead, Contact, CompleteRegistration, Search
- Missing: Purchase has no content_ids
- Critical: Most of the funnel is untracked

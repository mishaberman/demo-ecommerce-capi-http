import { motion } from "framer-motion";
import { ExternalLink, Github, Eye, AlertTriangle, CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/* ============================================================
 * VARIANTS DIRECTORY PAGE
 * Lists all 9 demo-ecommerce versions with full breakdowns
 * of their Meta Pixel and CAPI integration quality.
 * ============================================================ */

interface Variant {
  name: string;
  slug: string;
  repo: string;
  liveUrl: string;
  grade: "A+" | "A" | "B+" | "B" | "C" | "D" | "F" | "F-" | "D-";
  gradeColor: string;
  tagline: string;
  description: string;
  pixelSummary: string;
  capiSummary: string;
  keyIssues: string[];
  keyStrengths: string[];
  details: {
    pixelBaseCode: "correct" | "partial" | "wrong" | "missing";
    pixelId: "correct" | "wrong" | "placeholder";
    noscriptFallback: boolean;
    advancedMatching: "full" | "partial" | "none" | "unhashed";
    pageViewEvent: boolean;
    viewContentEvent: "correct" | "wrong-name" | "wrong-params" | "trackCustom" | "missing";
    addToCartEvent: "correct" | "trackCustom" | "wrong-name" | "wrong-params" | "missing";
    initiateCheckoutEvent: "correct" | "wrong-params" | "wrong-name" | "trackCustom" | "missing";
    purchaseEvent: "correct" | "trackCustom" | "wrong-name" | "wrong-params" | "missing";
    leadEvent: "correct" | "wrong-name" | "wrong-params" | "missing";
    contactEvent: "correct" | "wrong-name" | "wrong-params" | "missing";
    registrationEvent: "correct" | "trackCustom" | "wrong-name" | "wrong-params" | "missing";
    searchEvent: "correct" | "missing";
    eventId: "all" | "some" | "none";
    setUserData: boolean;
    capiPresent: boolean;
    capiServerSide: boolean;
    capiHashing: "full" | "partial" | "none" | "n/a";
    capiUserData: "complete" | "partial" | "minimal" | "none";
    capiFbcFbp: boolean;
    capiDeduplication: "working" | "broken" | "none";
    capiDataProcessingOptions: boolean;
    duplicateEvents: boolean;
    legacyImgPixel: boolean;
    doubleFbeventsLoad: boolean;
    wrongParamNames: boolean;
    currencyConsistency: boolean;
  };
}

const variants: Variant[] = [
  {
    name: "Excellent",
    slug: "demo-ecommerce-excellent",
    repo: "https://github.com/mishaberman/demo-ecommerce-excellent",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-excellent/",
    grade: "A+",
    gradeColor: "bg-emerald-500",
    tagline: "Near-perfect implementation",
    description: "The gold standard. Full advanced matching (em, ph, fn, ln, external_id), all 8 standard events with complete parameters, event_id on every event for deduplication, properly hashed CAPI with SHA-256, fbc/fbp cookie forwarding, data processing options, and setUserData on all form pages.",
    pixelSummary: "All events use fbq('track') with complete parameters including content_ids, content_name, content_type, value, currency, and num_items. Event IDs attached to every event.",
    capiSummary: "Full CAPI with SHA-256 hashed PII, fbc/fbp cookies, client_user_agent, event_id deduplication, data_processing_options, and proper action_source.",
    keyStrengths: [
      "All 8 standard events + Search event tracked",
      "Full advanced matching (em, ph, fn, ln, external_id)",
      "event_id on every event for pixel-CAPI dedup",
      "SHA-256 hashed PII in CAPI",
      "fbc/fbp cookie forwarding",
      "data_processing_options for CCPA compliance",
      "setUserData called on all form submissions",
      "noscript fallback present",
    ],
    keyIssues: [
      "CAPI runs client-side (should be server-side)",
      "Access token exposed in frontend code",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: true,
      advancedMatching: "full", pageViewEvent: true,
      viewContentEvent: "correct", addToCartEvent: "correct", initiateCheckoutEvent: "correct",
      purchaseEvent: "correct", leadEvent: "correct", contactEvent: "correct",
      registrationEvent: "correct", searchEvent: "correct",
      eventId: "all", setUserData: true,
      capiPresent: true, capiServerSide: false, capiHashing: "full",
      capiUserData: "complete", capiFbcFbp: true, capiDeduplication: "working",
      capiDataProcessingOptions: true, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Good",
    slug: "demo-ecommerce-good",
    repo: "https://github.com/mishaberman/demo-ecommerce-good",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-good/",
    grade: "B+",
    gradeColor: "bg-blue-500",
    tagline: "Solid pixel, basic CAPI with gaps",
    description: "A competent implementation with room for improvement. Advanced matching covers email and phone but misses fn, ln, and external_id. Events have most parameters but some are incomplete. CAPI is present but lacks hashing and has incomplete user_data.",
    pixelSummary: "Standard events use fbq('track') with most required parameters. Some events missing content_name or num_items. Event IDs present on most events.",
    capiSummary: "CAPI present but PII sent unhashed. Only fbp cookie forwarded (missing fbc). No data_processing_options.",
    keyStrengths: [
      "noscript fallback present",
      "Advanced matching for em and ph",
      "Most standard events tracked correctly",
      "event_id on most events",
      "CAPI endpoint configured",
    ],
    keyIssues: [
      "Advanced matching missing fn, ln, external_id",
      "CAPI PII not hashed with SHA-256",
      "Missing fbc cookie forwarding",
      "No data_processing_options",
      "Some events missing content_name",
      "Search event not implemented",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: true,
      advancedMatching: "partial", pageViewEvent: true,
      viewContentEvent: "correct", addToCartEvent: "correct", initiateCheckoutEvent: "correct",
      purchaseEvent: "correct", leadEvent: "correct", contactEvent: "correct",
      registrationEvent: "correct", searchEvent: "missing",
      eventId: "some", setUserData: false,
      capiPresent: true, capiServerSide: false, capiHashing: "none",
      capiUserData: "partial", capiFbcFbp: false, capiDeduplication: "working",
      capiDataProcessingOptions: false, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Base (Original)",
    slug: "demo-ecommerce",
    repo: "https://github.com/mishaberman/demo-ecommerce",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce/",
    grade: "B",
    gradeColor: "bg-sky-500",
    tagline: "Functional but many improvement opportunities",
    description: "The original baseline. Pixel fires all standard events but with incomplete parameters. CAPI is simulated client-side with placeholder token. No advanced matching, no event_id, no hashing, no noscript fallback.",
    pixelSummary: "All standard events fire via fbq('track') but many are missing content_name, num_items, or content_type. No event_id for deduplication.",
    capiSummary: "Simulated CAPI — logs to console but doesn't actually send to Graph API. No user_data, no hashing, placeholder access token.",
    keyStrengths: [
      "All 7 standard events tracked",
      "Correct pixel ID",
      "Correct event names on correct pages",
      "value and currency on commerce events",
    ],
    keyIssues: [
      "No advanced matching at all",
      "No noscript fallback",
      "No event_id on any event",
      "CAPI is only simulated (console.log)",
      "Missing content_name on ViewContent",
      "Missing num_items on AddToCart",
      "No Search event",
      "No setUserData calls",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: false,
      advancedMatching: "none", pageViewEvent: true,
      viewContentEvent: "wrong-params", addToCartEvent: "correct", initiateCheckoutEvent: "wrong-params",
      purchaseEvent: "correct", leadEvent: "correct", contactEvent: "correct",
      registrationEvent: "correct", searchEvent: "missing",
      eventId: "none", setUserData: false,
      capiPresent: true, capiServerSide: false, capiHashing: "none",
      capiUserData: "none", capiFbcFbp: false, capiDeduplication: "none",
      capiDataProcessingOptions: false, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Poor",
    slug: "demo-ecommerce-poor",
    repo: "https://github.com/mishaberman/demo-ecommerce-poor",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-poor/",
    grade: "C",
    gradeColor: "bg-yellow-500",
    tagline: "Pixel only, many parameter gaps, no CAPI",
    description: "Pixel-only implementation with significant gaps. No advanced matching, no noscript, and several events have minimal parameters. No CAPI whatsoever.",
    pixelSummary: "Events fire but with minimal parameters. Missing content_name, content_type, num_items on most events. No event_id.",
    capiSummary: "No CAPI implementation at all.",
    keyStrengths: [
      "Correct pixel ID",
      "Standard events use fbq('track')",
      "PageView fires on load",
    ],
    keyIssues: [
      "No CAPI at all",
      "No advanced matching",
      "No noscript fallback",
      "Events missing most optional parameters",
      "No event_id",
      "No Search event",
      "No setUserData",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: false,
      advancedMatching: "none", pageViewEvent: true,
      viewContentEvent: "wrong-params", addToCartEvent: "wrong-params", initiateCheckoutEvent: "wrong-params",
      purchaseEvent: "wrong-params", leadEvent: "wrong-params", contactEvent: "correct",
      registrationEvent: "wrong-params", searchEvent: "missing",
      eventId: "none", setUserData: false,
      capiPresent: false, capiServerSide: false, capiHashing: "n/a",
      capiUserData: "none", capiFbcFbp: false, capiDeduplication: "none",
      capiDataProcessingOptions: false, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Minimal",
    slug: "demo-ecommerce-minimal",
    repo: "https://github.com/mishaberman/demo-ecommerce-minimal",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-minimal/",
    grade: "D",
    gradeColor: "bg-orange-500",
    tagline: "Bare minimum — only PageView, Purchase, and AddToCart",
    description: "Absolute bare minimum. Only 3 events tracked (PageView, Purchase, AddToCart). Missing ViewContent, InitiateCheckout, Lead, Contact, CompleteRegistration. No CAPI, no advanced matching, no noscript.",
    pixelSummary: "Only PageView, Purchase, and AddToCart fire. All other events are no-ops. Minimal parameters.",
    capiSummary: "No CAPI implementation at all.",
    keyStrengths: [
      "Correct pixel ID",
      "PageView fires",
      "Purchase event exists (though minimal)",
    ],
    keyIssues: [
      "Only 3 of 8+ standard events implemented",
      "Missing ViewContent, InitiateCheckout, Lead, Contact, CompleteRegistration",
      "No CAPI",
      "No advanced matching",
      "No noscript",
      "Minimal parameters on existing events",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: false,
      advancedMatching: "none", pageViewEvent: true,
      viewContentEvent: "missing", addToCartEvent: "wrong-params", initiateCheckoutEvent: "missing",
      purchaseEvent: "wrong-params", leadEvent: "missing", contactEvent: "missing",
      registrationEvent: "missing", searchEvent: "missing",
      eventId: "none", setUserData: false,
      capiPresent: false, capiServerSide: false, capiHashing: "n/a",
      capiUserData: "none", capiFbcFbp: false, capiDeduplication: "none",
      capiDataProcessingOptions: false, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "CAPI-Only",
    slug: "demo-ecommerce-capi-only",
    repo: "https://github.com/mishaberman/demo-ecommerce-capi-only",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-capi-only/",
    grade: "D-",
    gradeColor: "bg-orange-600",
    tagline: "Strong CAPI but broken pixel (wrong ID, unhashed PII)",
    description: "Paradoxical setup: the CAPI implementation is excellent (proper hashing, event_id, fbc/fbp, data_processing_options) but the pixel uses a WRONG pixel ID (extra digit). Advanced matching passes raw unhashed PII — a privacy violation. Deduplication is broken because pixel and CAPI use different pixel IDs.",
    pixelSummary: "Pixel fires all events with complete parameters and event_id, BUT uses wrong pixel ID (16841454463500331 instead of 1684145446350033). Advanced matching passes raw unhashed PII.",
    capiSummary: "Excellent CAPI: correct pixel ID, SHA-256 hashed PII, fbc/fbp cookies, event_id, data_processing_options. But dedup broken due to pixel ID mismatch.",
    keyStrengths: [
      "CAPI has proper SHA-256 hashing",
      "CAPI uses correct pixel ID",
      "event_id on all events",
      "fbc/fbp cookie forwarding in CAPI",
      "data_processing_options present",
      "All standard events tracked",
    ],
    keyIssues: [
      "PIXEL uses WRONG pixel ID (extra digit)",
      "Advanced matching passes RAW unhashed PII (privacy violation!)",
      "Deduplication broken — pixel and CAPI use different IDs",
      "Pixel events go to non-existent pixel",
      "CAPI still client-side",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "wrong", noscriptFallback: true,
      advancedMatching: "unhashed", pageViewEvent: true,
      viewContentEvent: "correct", addToCartEvent: "correct", initiateCheckoutEvent: "correct",
      purchaseEvent: "correct", leadEvent: "correct", contactEvent: "correct",
      registrationEvent: "correct", searchEvent: "correct",
      eventId: "all", setUserData: true,
      capiPresent: true, capiServerSide: false, capiHashing: "full",
      capiUserData: "complete", capiFbcFbp: true, capiDeduplication: "broken",
      capiDataProcessingOptions: true, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Duplicate Events",
    slug: "demo-ecommerce-duplicate",
    repo: "https://github.com/mishaberman/demo-ecommerce-duplicate",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-duplicate/",
    grade: "D",
    gradeColor: "bg-orange-500",
    tagline: "Every event fires twice — no deduplication",
    description: "Every single event fires TWICE — once immediately and once via setTimeout (simulating a race condition bug). CAPI also sends each event twice. No event_id on any event, making deduplication impossible. This inflates all conversion counts by 2x.",
    pixelSummary: "All events fire twice via fbq('track') — once immediately, once after 100ms delay. No event_id. Correct pixel ID and decent parameters.",
    capiSummary: "CAPI present but each event sent twice with no event_id. Incomplete user_data (only fbp, missing fbc/em/ph/fn/ln).",
    keyStrengths: [
      "Correct pixel ID",
      "All standard events tracked",
      "Parameters mostly complete",
      "noscript fallback present",
    ],
    keyIssues: [
      "EVERY event fires TWICE (2x inflation)",
      "No event_id on any event — dedup impossible",
      "CAPI also duplicates every event",
      "setUserData is a no-op",
      "CAPI user_data very incomplete",
      "No PII hashing in CAPI",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: true,
      advancedMatching: "partial", pageViewEvent: true,
      viewContentEvent: "correct", addToCartEvent: "correct", initiateCheckoutEvent: "correct",
      purchaseEvent: "correct", leadEvent: "correct", contactEvent: "correct",
      registrationEvent: "correct", searchEvent: "missing",
      eventId: "none", setUserData: false,
      capiPresent: true, capiServerSide: false, capiHashing: "none",
      capiUserData: "minimal", capiFbcFbp: false, capiDeduplication: "none",
      capiDataProcessingOptions: false, duplicateEvents: true, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: true,
    },
  },
  {
    name: "Wrong Events",
    slug: "demo-ecommerce-wrong-events",
    repo: "https://github.com/mishaberman/demo-ecommerce-wrong-events",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-wrong-events/",
    grade: "F",
    gradeColor: "bg-red-500",
    tagline: "Correct structure but wrong event names on wrong pages",
    description: "Structurally looks correct at first glance — pixel and CAPI both fire with event_id and parameters. But the event names are SWAPPED: product pages fire AddToCart, cart fires ViewContent, checkout fires Lead, contact fires CompleteRegistration, and the lead form fires Purchase (inflating purchase count!). Currency is also inconsistent (EUR vs USD).",
    pixelSummary: "Events fire via fbq('track') with event_id and parameters, but event names are WRONG for each page context. Purchase fires on lead form (inflates revenue).",
    capiSummary: "CAPI mirrors the wrong events consistently. Has event_id and basic user_data but incomplete (missing fn, ln, external_id).",
    keyStrengths: [
      "Pixel and CAPI both fire",
      "event_id present on all events",
      "Parameters are structurally valid",
      "noscript fallback present",
    ],
    keyIssues: [
      "ViewContent fires 'AddToCart' instead",
      "AddToCart fires 'ViewContent' instead",
      "Purchase fires 'Lead' instead (purchases never tracked!)",
      "Lead fires 'Purchase' instead (inflates purchase count!)",
      "Contact fires 'CompleteRegistration' instead",
      "Registration fires 'Contact' instead",
      "Currency inconsistency (EUR mixed with USD)",
      "Advanced matching only captures email",
    ],
    details: {
      pixelBaseCode: "correct", pixelId: "correct", noscriptFallback: true,
      advancedMatching: "partial", pageViewEvent: true,
      viewContentEvent: "wrong-name", addToCartEvent: "wrong-name", initiateCheckoutEvent: "correct",
      purchaseEvent: "wrong-name", leadEvent: "wrong-name", contactEvent: "wrong-name",
      registrationEvent: "wrong-name", searchEvent: "missing",
      eventId: "all", setUserData: false,
      capiPresent: true, capiServerSide: false, capiHashing: "none",
      capiUserData: "partial", capiFbcFbp: false, capiDeduplication: "working",
      capiDataProcessingOptions: true, duplicateEvents: false, legacyImgPixel: false,
      doubleFbeventsLoad: false, wrongParamNames: false, currencyConsistency: false,
    },
  },
  {
    name: "Legacy/Outdated",
    slug: "demo-ecommerce-legacy",
    repo: "https://github.com/mishaberman/demo-ecommerce-legacy",
    liveUrl: "https://mishaberman.github.io/demo-ecommerce-legacy/",
    grade: "F-",
    gradeColor: "bg-red-700",
    tagline: "Deprecated patterns, trackCustom, wrong params, no CAPI",
    description: "Everything is wrong in a legacy way. fbevents.js loaded TWICE (conflicts). Uses deprecated setUserProperties instead of advanced matching. Standard events (AddToCart, Purchase, CompleteRegistration) sent via trackCustom — Meta won't recognize them for optimization. Parameter names are wrong (product_id instead of content_ids, price instead of value). Legacy img-tag pixel fires alongside JS pixel creating duplicates. No CAPI at all.",
    pixelSummary: "Mix of fbq('track') and fbq('trackCustom'). trackCustom used for AddToCart, Purchase, CompleteRegistration — these won't optimize. Wrong parameter names throughout.",
    capiSummary: "No CAPI implementation whatsoever.",
    keyStrengths: [
      "Correct pixel ID",
      "PageView fires (though potentially duplicated)",
    ],
    keyIssues: [
      "fbevents.js loaded TWICE (script conflict)",
      "Deprecated setUserProperties with wrong key format ($email instead of em)",
      "AddToCart, Purchase, CompleteRegistration use trackCustom (won't optimize!)",
      "Wrong parameter names: product_id, price, currency_code, quantity",
      "Legacy img-tag pixel creates duplicate events",
      "No CAPI at all",
      "No event_id",
      "No advanced matching in init",
      "Contact event has zero parameters",
    ],
    details: {
      pixelBaseCode: "wrong", pixelId: "correct", noscriptFallback: true,
      advancedMatching: "none", pageViewEvent: true,
      viewContentEvent: "wrong-params", addToCartEvent: "trackCustom", initiateCheckoutEvent: "wrong-params",
      purchaseEvent: "trackCustom", leadEvent: "wrong-params", contactEvent: "correct",
      registrationEvent: "trackCustom", searchEvent: "missing",
      eventId: "none", setUserData: false,
      capiPresent: false, capiServerSide: false, capiHashing: "n/a",
      capiUserData: "none", capiFbcFbp: false, capiDeduplication: "none",
      capiDataProcessingOptions: false, duplicateEvents: true, legacyImgPixel: true,
      doubleFbeventsLoad: true, wrongParamNames: true, currencyConsistency: false,
    },
  },
];

function StatusIcon({ status }: { status: boolean | string }) {
  if (status === true || status === "correct" || status === "full" || status === "all" || status === "working" || status === "complete") {
    return <CheckCircle className="w-4 h-4 text-emerald-500 inline" />;
  }
  if (status === "partial" || status === "some" || status === "broken") {
    return <MinusCircle className="w-4 h-4 text-yellow-500 inline" />;
  }
  if (status === "unhashed" || status === "trackCustom" || status === "wrong-name" || status === "wrong-params" || status === "wrong") {
    return <AlertTriangle className="w-4 h-4 text-orange-500 inline" />;
  }
  return <XCircle className="w-4 h-4 text-red-400 inline" />;
}

function StatusLabel({ status }: { status: boolean | string }) {
  if (typeof status === "boolean") return <span>{status ? "Yes" : "No"}</span>;
  const labels: Record<string, string> = {
    correct: "Correct", partial: "Partial", full: "Full", none: "None",
    wrong: "Wrong", missing: "Missing", "wrong-name": "Wrong Name",
    "wrong-params": "Wrong Params", trackCustom: "trackCustom (broken)",
    all: "All Events", some: "Some Events", working: "Working",
    broken: "Broken", complete: "Complete", minimal: "Minimal",
    unhashed: "Unhashed PII!", "n/a": "N/A", placeholder: "Placeholder",
  };
  return <span>{labels[status] || status}</span>;
}

function VariantCard({ variant, index }: { variant: Variant; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-sm overflow-hidden bg-card"
    >
      {/* Header */}
      <div className="p-5 flex items-start gap-4">
        <div className={`${variant.gradeColor} text-white font-bold text-lg w-12 h-12 rounded-sm flex items-center justify-center shrink-0 font-[family-name:var(--font-display)]`}>
          {variant.grade}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">{variant.name}</h3>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-mono">{variant.slug}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{variant.tagline}</p>
          <div className="flex gap-3 mt-3">
            <a href={variant.repo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a href={variant.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Eye className="w-3.5 h-3.5" /> Live Site
            </a>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed">{variant.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="bg-muted/50 rounded-sm p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pixel Summary</h4>
            <p className="text-xs leading-relaxed">{variant.pixelSummary}</p>
          </div>
          <div className="bg-muted/50 rounded-sm p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">CAPI Summary</h4>
            <p className="text-xs leading-relaxed">{variant.capiSummary}</p>
          </div>
        </div>

        {/* Strengths & Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {variant.keyStrengths.map((s, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">Issues</h4>
            <ul className="space-y-1">
              {variant.keyIssues.map((s, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 border-t border-border flex items-center justify-between text-xs font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span>Detailed Feature Matrix</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          <table className="w-full text-xs mt-3">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold text-muted-foreground">Feature</th>
                <th className="text-left py-2 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                ["Pixel Base Code", variant.details.pixelBaseCode],
                ["Pixel ID", variant.details.pixelId],
                ["noscript Fallback", variant.details.noscriptFallback],
                ["Advanced Matching", variant.details.advancedMatching],
                ["PageView Event", variant.details.pageViewEvent],
                ["ViewContent Event", variant.details.viewContentEvent],
                ["AddToCart Event", variant.details.addToCartEvent],
                ["InitiateCheckout Event", variant.details.initiateCheckoutEvent],
                ["Purchase Event", variant.details.purchaseEvent],
                ["Lead Event", variant.details.leadEvent],
                ["Contact Event", variant.details.contactEvent],
                ["CompleteRegistration Event", variant.details.registrationEvent],
                ["Search Event", variant.details.searchEvent],
                ["event_id (Dedup)", variant.details.eventId],
                ["setUserData Calls", variant.details.setUserData],
                ["CAPI Present", variant.details.capiPresent],
                ["CAPI Server-Side", variant.details.capiServerSide],
                ["CAPI PII Hashing", variant.details.capiHashing],
                ["CAPI User Data", variant.details.capiUserData],
                ["CAPI fbc/fbp Cookies", variant.details.capiFbcFbp],
                ["CAPI Deduplication", variant.details.capiDeduplication],
                ["CAPI data_processing_options", variant.details.capiDataProcessingOptions],
                ["Duplicate Events", variant.details.duplicateEvents],
                ["Legacy img Pixel", variant.details.legacyImgPixel],
                ["Double fbevents.js Load", variant.details.doubleFbeventsLoad],
                ["Wrong Parameter Names", variant.details.wrongParamNames],
                ["Currency Consistency", variant.details.currencyConsistency],
              ].map(([label, status]) => (
                <tr key={label as string}>
                  <td className="py-1.5">{label as string}</td>
                  <td className="py-1.5 flex items-center gap-1.5">
                    <StatusIcon status={status as boolean | string} />
                    <StatusLabel status={status as boolean | string} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default function Variants() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-[family-name:var(--font-display)] tracking-tight">
            Elevé
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
            <span className="font-medium text-foreground">Variants</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] tracking-tight mb-4">
            Pixel & CAPI Variants Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-2">
            9 versions of the same e-commerce site, each with a different quality of Meta Pixel and Conversions API integration.
            Built for testing pixel/CAPI analysis skills — from near-perfect to catastrophically broken.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Pixel ID: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">1684145446350033</code> &nbsp;|&nbsp;
            All sites share the same UI, products, and page structure. Only the tracking code differs.
          </p>
        </motion.div>
      </div>

      {/* Comparison Matrix */}
      <div className="container pb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-[family-name:var(--font-display)] mb-4">Quick Comparison</h2>
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-semibold sticky left-0 bg-muted/50 z-10">Variant</th>
                  <th className="p-3 font-semibold text-center">Grade</th>
                  <th className="p-3 font-semibold text-center">Links</th>
                  <th className="p-3 font-semibold text-center">Pixel ID</th>
                  <th className="p-3 font-semibold text-center">Adv. Match</th>
                  <th className="p-3 font-semibold text-center">noscript</th>
                  <th className="p-3 font-semibold text-center">Events</th>
                  <th className="p-3 font-semibold text-center">event_id</th>
                  <th className="p-3 font-semibold text-center">CAPI</th>
                  <th className="p-3 font-semibold text-center">Hashing</th>
                  <th className="p-3 font-semibold text-center">Dedup</th>
                  <th className="p-3 font-semibold text-center">Dupes</th>
                  <th className="p-3 font-semibold text-center">Legacy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {variants.map((v) => (
                  <tr key={v.slug} className="hover:bg-muted/20">
                    <td className="p-3 font-medium sticky left-0 bg-card z-10">{v.name}</td>
                    <td className="p-3 text-center"><span className={`${v.gradeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>{v.grade}</span></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a href={v.repo} target="_blank" rel="noopener noreferrer" title="GitHub Repo" className="text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                        <a href={v.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Site" className="text-muted-foreground hover:text-primary transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.pixelId} /></td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.advancedMatching} /></td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.noscriptFallback} /></td>
                    <td className="p-3 text-center">
                      {[v.details.viewContentEvent, v.details.addToCartEvent, v.details.purchaseEvent, v.details.leadEvent, v.details.contactEvent, v.details.registrationEvent]
                        .filter(e => e === "correct").length}/6
                    </td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.eventId} /></td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.capiPresent} /></td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.capiHashing} /></td>
                    <td className="p-3 text-center"><StatusIcon status={v.details.capiDeduplication} /></td>
                    <td className="p-3 text-center"><StatusIcon status={!v.details.duplicateEvents} /></td>
                    <td className="p-3 text-center"><StatusIcon status={!v.details.legacyImgPixel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Individual Cards */}
      <div className="container pb-16">
        <h2 className="text-2xl font-[family-name:var(--font-display)] mb-6">Detailed Breakdown</h2>
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <VariantCard key={variant.slug} variant={variant} index={index} />
          ))}
        </div>
      </div>

      {/* Key Files Reference */}
      <div className="container pb-16">
        <h2 className="text-2xl font-[family-name:var(--font-display)] mb-4">Key Files to Analyze</h2>
        <div className="border border-border rounded-sm p-5 bg-card">
          <p className="text-sm text-muted-foreground mb-4">
            When running your pixel/CAPI analysis skill against these repos, these are the primary files to inspect:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Pixel Configuration</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/index.html</code> — Pixel base code, init, advanced matching, noscript</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/lib/meta-pixel.ts</code> — All event tracking functions + CAPI</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Event Trigger Points</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/pages/ProductDetail.tsx</code> — ViewContent</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/components/ProductCard.tsx</code> — AddToCart</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/components/CartDrawer.tsx</code> — InitiateCheckout</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/pages/Checkout.tsx</code> — Purchase</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/pages/Contact.tsx</code> — Lead, Contact</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">client/src/pages/Register.tsx</code> — CompleteRegistration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-xs text-muted-foreground">
          Built for testing Meta Pixel & CAPI analysis skills. All sites use Pixel ID 1684145446350033.
        </div>
      </footer>
    </div>
  );
}

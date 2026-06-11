import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Rendered once from the root layout, so the gtag.js tag is injected into the
 * <head> of every page automatically (no per-page pasting needed).
 *
 * The Measurement ID is hardcoded below. (A GA4 Measurement ID is public — it
 * ships in the page HTML — so this is safe.)
 */
const GA_ID = "G-3FGTMHG8RP";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

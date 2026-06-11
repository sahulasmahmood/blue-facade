import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Reads the Measurement ID from NEXT_PUBLIC_GA_ID. If the env var is not set
 * (e.g. local dev, or before a GA4 property is created) this renders nothing,
 * so the site works fine without it. To enable: create a GA4 property at
 * https://analytics.google.com, then set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

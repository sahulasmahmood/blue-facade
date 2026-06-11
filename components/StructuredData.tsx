import { siteConfig } from "@/config/site";

/**
 * Serialize to JSON for embedding in a <script> tag, escaping `<` so a value
 * containing `</script>` (e.g. a user-authored blog title) can't break out of
 * the tag. Standard safe pattern for inline JSON-LD.
 */
function toJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Sitewide Schema.org structured data (JSON-LD).
 *
 * Emits an Organization, a LocalBusiness (GeneralContractor) and a WebSite
 * node in a single @graph so search engines can build a rich knowledge panel
 * and understand the business, its contact details and service area.
 *
 * Rendered once from the root layout. Page-specific schema (Article, Service,
 * BreadcrumbList) can be added per-page with the <JsonLd> helper below.
 */
export function StructuredData() {
  const { url, name, description, contact, branches, social } = siteConfig;
  const logo = `${url}/android-chrome-512x512.png`;

  const graph = [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name,
      url,
      logo,
      description,
      email: contact.email,
      telephone: `+91${contact.phone}`,
      sameAs: [social.instagram, social.linkedin, social.facebook],
    },
    {
      "@type": "GeneralContractor",
      "@id": `${url}/#localbusiness`,
      name,
      image: logo,
      url,
      telephone: `+91${contact.phone}`,
      email: contact.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "#35/39, S5, Avyaya Apartments, East Tambaram",
        addressLocality: "Chennai",
        postalCode: "600059",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      areaServed: branches.map((b) => ({ "@type": "City", name: b })),
      parentOrganization: { "@id": `${url}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name,
      description,
      publisher: { "@id": `${url}/#organization` },
      inLanguage: "en",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }}
    />
  );
}

/**
 * Helper to drop a single Schema.org node (e.g. Article, Service,
 * BreadcrumbList) onto an individual page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: toJsonLdString({ "@context": "https://schema.org", ...data }),
      }}
    />
  );
}

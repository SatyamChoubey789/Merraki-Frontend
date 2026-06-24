import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://merrakisolutions.com";
const SITE_NAME = "Merraki Solutions";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;

interface GenerateMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
}

export function generateMeta({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  noIndex = false,
  type = "website",
  publishedAt,
  author,
}: GenerateMetaOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@merrakisolutions",
      site: "@merrakisolutions",
    },
  };
}

// Structured data helpers
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Financial modelling, Excel dashboards, templates, and founder consulting for Indian businesses.",
    founders: [
      { "@type": "Person", name: "Parag Bhutani", jobTitle: "Co-Founder" },
      { "@type": "Person", name: "Khyati Gupta", jobTitle: "Co-Founder" },
    ],
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    sameAs: [
      "https://linkedin.com/company/merrakisolutions",
      "https://twitter.com/merrakisolutions",
    ],
  };
}

export function generateProductSchema(template: {
  name: string;
  description: string;
  price: number;
  currency: string;
  slug: string;
  rating: number;
  reviewCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.name,
    description: template.description,
    url: `${BASE_URL}/templates/${template.slug}`,
    offers: {
      "@type": "Offer",
      price: template.price,
      priceCurrency: template.currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: template.rating,
      reviewCount: template.reviewCount,
    },
  };
}

export function generateArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  authorName: string;
  coverImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: `${BASE_URL}/logo.png`,
    },
    ...(post.coverImage && { image: post.coverImage }),
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

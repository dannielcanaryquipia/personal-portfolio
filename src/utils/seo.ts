/**
 * SEO Utility for managing meta tags and structured data
 * 
 * Usage:
 * ```tsx
 * import { useSEO } from '@/utils/seo';
 * 
 * export const MyPage = () => {
 *   useSEO({
 *     title: 'My Page',
 *     description: 'Page description',
 *     structuredData: personStructuredData({
 *       name: 'Danniel Canary',
 *       // ...other fields
 *     })
 *   });
 *   return <div>...</div>;
 * };
 * ```
 */

import { useEffect } from 'react';

export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

/**
 * Hook to set SEO meta tags on the current page
 */
export const useSEO = (meta: SEOMeta = {}) => {
  useEffect(() => {
    const baseTitle = 'Danniel Canary';
    const fullTitle = meta.title ? `${meta.title} | ${baseTitle}` : baseTitle;
    
    // Update document title
    document.title = fullTitle;
    
    // Helper to set or create meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Set basic meta tags
    if (meta.description) {
      setMetaTag('description', meta.description);
    }
    
    if (meta.keywords?.length) {
      setMetaTag('keywords', meta.keywords.join(', '));
    }
    
    if (meta.author) {
      setMetaTag('author', meta.author);
    }
    
    // Open Graph tags
    setMetaTag('og:title', meta.ogTitle || fullTitle, true);
    setMetaTag('og:site_name', baseTitle, true);
    setMetaTag('og:type', 'website', true);
    
    if (meta.ogDescription || meta.description) {
      setMetaTag('og:description', meta.ogDescription || meta.description!, true);
    }
    
    if (meta.ogImage) {
      setMetaTag('og:image', meta.ogImage, true);
    }
    
    if (meta.ogUrl || meta.canonicalUrl) {
      setMetaTag('og:url', meta.ogUrl || meta.canonicalUrl!, true);
    }
    
    // Twitter Card tags
    setMetaTag('twitter:card', meta.twitterCard || 'summary');
    setMetaTag('twitter:title', meta.twitterTitle || meta.title || baseTitle);
    
    if (meta.twitterDescription || meta.description) {
      setMetaTag('twitter:description', meta.twitterDescription || meta.description!);
    }
    
    if (meta.twitterImage) {
      setMetaTag('twitter:image', meta.twitterImage);
    }
    
    // Canonical URL
    if (meta.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', meta.canonicalUrl);
    }
    
    // Robots meta tag
    if (meta.noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    }
    
    // Structured Data (JSON-LD)
    if (meta.structuredData) {
      const structuredDataArray = Array.isArray(meta.structuredData) 
        ? meta.structuredData 
        : [meta.structuredData];
      
      // Remove existing structured data scripts
      document.querySelectorAll('script[data-seo="structured-data"]').forEach(el => el.remove());
      
      // Add new structured data
      structuredDataArray.forEach(data => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo', 'structured-data');
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }
    
    // Cleanup on unmount
    return () => {
      // Note: We don't remove meta tags on unmount to avoid flickering
      // between page transitions in a SPA context
    };
  }, [meta]);
};

/**
 * Generate Person structured data for SEO
 */
export interface PersonData {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
  sameAs?: string[]; // Social profile URLs
  email?: string;
  telephone?: string;
  address?: {
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
  alumniOf?: string;
  knowsAbout?: string[];
}

export const personStructuredData = (data: PersonData): object => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: data.name,
  jobTitle: data.jobTitle,
  description: data.description,
  image: data.image,
  url: data.url,
  sameAs: data.sameAs,
  email: data.email,
  telephone: data.telephone,
  address: data.address ? {
    '@type': 'PostalAddress',
    ...data.address,
  } : undefined,
  alumniOf: data.alumniOf ? {
    '@type': 'CollegeOrUniversity',
    name: data.alumniOf,
  } : undefined,
  knowsAbout: data.knowsAbout,
});

/**
 * Generate WebSite structured data for SEO
 */
export interface WebsiteData {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string; // URL pattern for site search, e.g., "https://example.com/search?q={search_term_string}"
}

export const websiteStructuredData = (data: WebsiteData): object => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: data.name,
  url: data.url,
  description: data.description,
  potentialAction: data.searchUrl ? {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: data.searchUrl,
    },
    'query-input': 'required name=search_term_string',
  } : undefined,
});

/**
 * Generate Project/SoftwareApplication structured data for SEO
 */
export interface ProjectData {
  name: string;
  description: string;
  url?: string;
  image?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  author?: string;
  datePublished?: string;
  softwareVersion?: string;
  codeRepository?: string;
  programmingLanguage?: string[];
}

export const projectStructuredData = (data: ProjectData): object => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: data.name,
  description: data.description,
  url: data.url,
  image: data.image,
  applicationCategory: data.applicationCategory || 'DeveloperApplication',
  operatingSystem: data.operatingSystem || 'Any',
  author: data.author ? {
    '@type': 'Person',
    name: data.author,
  } : undefined,
  datePublished: data.datePublished,
  softwareVersion: data.softwareVersion,
  codeRepository: data.codeRepository,
  programmingLanguage: data.programmingLanguage,
});

/**
 * Generate Article/BlogPosting structured data for SEO
 */
export interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  url?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisher?: string;
  publisherLogo?: string;
}

export const articleStructuredData = (data: ArticleData): object => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: data.headline,
  description: data.description,
  image: data.image,
  url: data.url,
  datePublished: data.datePublished,
  dateModified: data.dateModified || data.datePublished,
  author: {
    '@type': 'Person',
    name: data.author,
  },
  publisher: data.publisher ? {
    '@type': 'Organization',
    name: data.publisher,
    logo: data.publisherLogo ? {
      '@type': 'ImageObject',
      url: data.publisherLogo,
    } : undefined,
  } : undefined,
});

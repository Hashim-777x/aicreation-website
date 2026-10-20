# Search visibility checklist

Local code changes are not live until the site is deployed.

1. Confirm https://aicreation.pro serves the current production build; configure www and HTTP redirects to the canonical HTTPS host in Cloudflare.
2. Verify a Domain property in Google Search Console using its supplied DNS TXT record. Do not invent a verification token.
3. Submit https://aicreation.pro/sitemap-index.xml. Inspect Home and primary service URLs; check live URL accessibility and request indexing where appropriate.
4. Check Pages indexing reports for exclusions, duplicate canonicals, redirects and crawl errors. Monitor queries/impressions before judging ranking.
5. Publish original client-approved case studies and useful service content. Concept studies remain labelled; no fabricated reviews or results are included.
6. Recheck indexing after deployment. robots.txt permits crawling but does not guarantee indexing or rank. Titles and descriptions describe real services without keyword stuffing.

Preview deployments: set PUBLIC_SITE_INDEXABLE=false for the preview build environment only (not production). This adds noindex, nofollow. Keep canonicals pointing at the production domain. robots.txt is not an access control mechanism.

Native cross-document view transitions are progressive enhancement. Unsupported browsers keep normal full-page navigation; forms and scripts initialize normally after every navigation. Reduced-motion disables transition animations.

Video playback remains unconfigured until approved clips are uploaded. The Home hero still uses its approved static responsive poster. No VideoObject schema is emitted for unavailable clips. See video-storage.md for delivery setup.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://docs.astro.build/en/guides/view-transitions/

Automated regression check: after npm run build, run npm run check:seo. It validates built titles, descriptions, canonical/Open Graph URLs, heading counts, schema entities, local links/assets, robots.txt, sitemap and the noindex 404 page. It does not measure Google rankings or replace Search Console URL Inspection.

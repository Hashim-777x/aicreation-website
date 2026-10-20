# English and Arabic
English stays at the existing paths; Arabic lives at /ar, /ar/work, /ar/ai-creative, /ar/agents, /ar/studio, /ar/contact, /ar/privacy and /ar/terms. Switching language is explicit and stays on the corresponding page. No automatic browser-language redirect or language cookie is used.

Every page is static HTML with its own canonical, reciprocal en/ar/x-default alternates, localized title/description and lang/dir. Both sets are included in the sitemap. Arabic keeps the original artwork. Workflow geometry uses LTR positioning while node content is RTL so measured connectors remain aligned.

Shared navigation, CTA, footer and workflow labels: src/i18n/ar.json. Arabic metadata: src/i18n/seo.ts. Layout rules: src/styles/arabic.css. Arabic page copy is in src/pages/ar. Arabic uses the system Arabic-capable Segoe UI/Tahoma/Arial stack and more generous line heights, rather than forcing condensed Latin lettering.

When English page structure changes, scripts/prepare-arabic.mjs can prepare matching Arabic sources for the six main pages using the phrase dictionary. Run intentionally and review the output; it is not an automatic translation service. Legal translations are edited separately. Shared component changes affect both languages. Keep images and media paths identical.

Translations are an initial Modern Standard Arabic version. Native editorial and legal review is recommended before marketing launch. No third-party translation widget is used.

Verify npm run build and npm run check:seo; visually inspect desktop/mobile, language switching, menu, Selected Work scroll reversal, workflow interactions and Arabic form drafts. Actual email delivery still requires the visitor to review/send the compose draft.

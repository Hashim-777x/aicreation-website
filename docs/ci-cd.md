# GitHub Actions and Cloudflare

Workflow: .github/workflows/ci-cd.yml.

## Current mode (ready on commit/push)
Pushes and pull requests to main run Node 22, npm ci, npm run build and npm run check:seo. CI needs no Cloudflare credentials. Cloudflare's existing Git integration remains the automatic deployment owner; GitHub checks do not block an independent Cloudflare build after a direct push. Protect main and require the Build and bilingual SEO checks status before merging pull requests if you want a merge gate.

## Optional: move deployment to GitHub Actions
The dashboard screenshot identifies this as a Worker with static assets, named aicreation-website. wrangler.jsonc uses that same name and only deploys dist, with canonical trailing-slash behavior and a real 404 fallback. Confirm that this is the intended Worker before enabling.

1. In GitHub repository Settings > Secrets and variables > Actions, add secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID. Scope the API token to the intended account with Workers Scripts Edit access. Never commit tokens.
2. Optionally configure the production GitHub environment with approval rules. The deploy job targets that environment.
3. Disable Cloudflare's automatic Git build trigger for this Worker to avoid two deployments per commit. Keep the existing custom domain attachment.
4. Set repository Actions variable CLOUDFLARE_DEPLOY_FROM_ACTIONS to true.
5. Push to main, or use Actions > Website CI and Cloudflare deployment > Run workflow on main.

The deploy job runs only after validation, downloads the exact tested bundle, deploys using Wrangler, then checks live English/Arabic routes, canonical metadata, robots.txt, sitemaps, favicon and missing-page status. PRs never deploy. Production runs are serialized, not cancelled midway.

Future video build configuration: set repository Actions variables PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_VIDEO_BUCKET when the public bucket is ready. They are public configuration, not API keys. Current empty variables retain static posters. Existing Cloudflare build variables are not automatically inherited by GitHub Actions.

No GitHub workflow has been executed or external credentials configured by writing these files. Commit/push is required for CI; the optional deployment job stays skipped until explicitly enabled.

References:
https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/

## Assets-only configuration correction
Do not set assets.binding for this site: it has no Worker script (main entrypoint). Static assets are served directly. Wrangler 4.151.3 rejects an assets-only deployment with a binding. The earlier ASSETS binding was removed after the Cloudflare error identified it. Keep html_handling and not_found_handling to preserve canonical routes and real 404s.

Wrangler is pinned to 4.151.3 in devDependencies and the optional deployment action. CI now runs npm run check:deployment after the build; this invokes Wrangler with --dry-run, performs no upload, and needs no API token. Cloudflare's existing npx wrangler deploy command resolves the installed pinned version.

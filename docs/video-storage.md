# Supabase video delivery

The site remains a static Astro build on Cloudflare Pages. No custom backend or Supabase SDK is required for public playback. Supabase manages storage; upload clips through its dashboard or a trusted S3 client. Never expose S3 credentials or service-role keys in frontend code.

## Connect later
1. Create a public Storage bucket named site-videos. Public means anyone with the file URL can view it; uploads still require authorization.
2. Prepare silent H.264 MP4 clips (with fast-start metadata), using original aspect ratios and separate mobile compositions. Do not upscale. Upload versioned filenames with video/mp4 Content-Type and suitable Cache-Control.
3. Copy .env.example to .env locally. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_VIDEO_BUCKET. Set the same values in Cloudflare Pages build settings.
4. Add actual uploaded object paths to src/data/videos.ts. Do not enable paths before their files exist. Rebuild/redeploy to publish configuration.
5. Confirm public URLs return 200, Content-Type video/mp4, and seek/range requests work. Check actual desktop/mobile playback, autoplay restrictions, network failures, offscreen pause, manual pause and reduced-motion on real devices.

Configured placements: Home Product, Fashion, Residences, Hospitality cards and AI Creative Short Films. Home hero and Selected Work remain unchanged. An unconfigured slot renders exactly its existing responsive poster with no fake play controls. A missing mobile video retains the dedicated mobile poster instead of downloading the desktop clip.

Playback begins only when visible. Only one responsive source is assigned. Offscreen or background-tab videos pause. Reduced-motion and data-saving visitors see posters. Playback errors return to the poster. A keyboard-accessible Pause/Play button appears only after successful playback.

This is progressive MP4 delivery, not adaptive streaming or automatic transcoding. No videos have been uploaded or live delivery verified yet.

Official docs: https://supabase.com/docs/guides/storage/serving/downloads

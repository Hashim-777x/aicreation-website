// Set only after the corresponding approved clips have been uploaded.
// Paths are relative to the public bucket; no credentials belong here.
export const videoPaths: Record<string, { desktop: string; mobile?: string }> = {
  // 'product-perfume': { desktop: 'product/desktop-v1.mp4', mobile: 'product/mobile-v1.mp4' },
  // 'silver-fashion': { desktop: 'fashion/desktop-v1.mp4', mobile: 'fashion/mobile-v1.mp4' },
  // 'residence': { desktop: 'residences/desktop-v1.mp4', mobile: 'residences/mobile-v1.mp4' },
  // 'hospitality': { desktop: 'hospitality/desktop-v1.mp4', mobile: 'hospitality/mobile-v1.mp4' },
  // 'short-films': { desktop: 'short-films/desktop-v1.mp4', mobile: 'short-films/mobile-v1.mp4' },
};
export function videoSources(key: string) {
  const path = videoPaths[key];
  const base = import.meta.env.PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const bucket = import.meta.env.PUBLIC_SUPABASE_VIDEO_BUCKET;
  if (!path || !base || !bucket) return undefined;
  if (new URL(base).protocol !== 'https:') throw new Error('Supabase video delivery requires HTTPS.');
  const url = (value: string) => `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${value.split('/').map(encodeURIComponent).join('/')}`;
  return { desktop: url(path.desktop), mobile: path.mobile ? url(path.mobile) : undefined };
}

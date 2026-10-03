import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const sourceRoot = 'D:/Automation-Repos/aicreation.pro/website-design/production-assets';
const outputRoot = new URL('../public/media/', import.meta.url);
const outputPath = fileURLToPath(outputRoot);

const assets = [
  ['hero-fashion-desktop', '01-fashion-hero/hero-fashion-desktop-poster.png', [1280, 1672]],
  ['hero-fashion-mobile', '01-fashion-hero/hero-fashion-mobile-poster.png', [640, 941]],
  ['product-perfume-desktop', '02-product-perfume/product-perfume-desktop-poster.png', [720, 1200]],
  ['product-perfume-mobile', '02-product-perfume/product-perfume-mobile-poster.png', [640, 941]],
  ['silver-fashion-desktop', '03-silver-fashion/silver-fashion-desktop-poster.png', [720, 1200]],
  ['silver-fashion-mobile', '03-silver-fashion/silver-fashion-mobile-poster.png', [640, 941]],
  ['residence-desktop', '04-residence/residence-desktop-poster.png', [960, 1600]],
  ['residence-mobile', '04-residence/residence-mobile-poster.png', [640, 941]],
  ['hospitality-desktop', '05-hospitality/hospitality-desktop-poster.png', [720, 1200]],
  ['hospitality-mobile', '05-hospitality/hospitality-mobile-poster.png', [640, 941]],
  ['perfume-source-desktop', '06-perfume-source/perfume-source-poster.png', [640, 1000]],
  ['perfume-source-mobile', '06-perfume-source/perfume-source-mobile-poster.png', [640, 941]],
  ['perfume-finished-desktop', '07-perfume-finished/perfume-finished-poster-v2.png', [640, 1000]],
  ['perfume-finished-mobile', '07-perfume-finished/perfume-finished-mobile-poster-v2.png', [640, 941]],
  ['after-hours-desktop', '08-work-previews/after-hours-desktop-poster.png', [800, 1280]],
  ['after-hours-mobile', '08-work-previews/after-hours-mobile-poster.png', [640, 941]],
  ['form-in-motion-desktop', '08-work-previews/form-in-motion-desktop-poster.png', [800, 1280]],
  ['form-in-motion-mobile', '08-work-previews/form-in-motion-mobile-poster.png', [640, 941]],
  ['still-water-desktop', '08-work-previews/still-water-desktop-poster.png', [800, 1280]],
  ['still-water-mobile', '08-work-previews/still-water-mobile-poster.png', [640, 941]],
  ['automation-background-desktop', '09-automation-background/automation-background-desktop-poster.png', [1280, 1672]],
  ['automation-background-mobile', '09-automation-background/automation-background-mobile-poster.png', [640, 941]],
  ['work-page-hero-desktop', '11-work-page-hero/work-page-hero-desktop-poster.png', [1280, 1672]],
  ['work-page-hero-mobile', '11-work-page-hero/work-page-hero-mobile-poster.png', [640, 941]],
  ['ai-creative-product-macro-desktop', '12-ai-creative-product-macro/ai-creative-product-macro-desktop-poster.png', [1280, 1920]],
  ['ai-creative-product-macro-mobile', '12-ai-creative-product-macro/ai-creative-product-macro-mobile-poster.png', [640, 941]],
  ['ai-creative-burgundy-fashion-desktop', '13-ai-creative-burgundy-fashion/ai-creative-burgundy-fashion-desktop-poster.png', [1280, 1920]],
  ['ai-creative-burgundy-fashion-mobile', '13-ai-creative-burgundy-fashion/ai-creative-burgundy-fashion-mobile-poster.png', [640, 941]],
  ['ai-creative-short-film-desktop', '13-ai-creative-burgundy-fashion/ai-creative-burgundy-fashion-desktop-video-placeholder.png', [1280, 1920]],
  ['ai-creative-short-film-mobile', '13-ai-creative-burgundy-fashion/ai-creative-burgundy-fashion-mobile-video-placeholder.png', [640, 941]],
  ['studio-page-hero-desktop', '14-studio-page-hero/studio-page-hero-desktop-poster.png', [1280, 1672]],
  ['studio-page-hero-mobile', '14-studio-page-hero/studio-page-hero-mobile-poster.png', [640, 941]],
  ['studio-detail-texture', '14-studio-page-hero/studio-detail-texture.png', [750]],
  ['studio-detail-product-fidelity', '14-studio-page-hero/studio-detail-product-fidelity.png', [700]],
  ['studio-detail-consistency', '14-studio-page-hero/studio-detail-consistency.png', [880]],
  ['contact-page-portrait-desktop', '15-contact-page-portrait/contact-page-portrait-desktop-poster.png', [1000, 1448]],
  ['contact-page-portrait-mobile', '15-contact-page-portrait/contact-page-portrait-mobile-poster.png', [640, 941]],
];

const footerAssets = [
  ['cosmic-footer-desktop', '16-hyperreal-cosmic-footer/hyperreal-cosmic-footer-desktop-4k-v2.png', [1280, 1920, 2560, 3840]],
  ['cosmic-footer-mobile', '16-hyperreal-cosmic-footer/hyperreal-cosmic-footer-mobile-2240x2800-v2.png', [640, 960, 1440, 2240]],
];

await fs.mkdir(outputRoot, { recursive: true });
const report = [];

for (const [name, relative, widths] of assets) {
  const source = path.join(sourceRoot, relative);
  const metadata = await sharp(source).metadata();
  const originalName = `${name}-original.png`;
  try {
    await fs.access(new URL(originalName, outputRoot));
  } catch {
    await fs.copyFile(source, new URL(originalName, outputRoot));
  }
  const originalStat = await fs.stat(source);
  report.push({ file: originalName, width: metadata.width, height: metadata.height, bytes: originalStat.size, format: 'PNG fallback' });

  for (const width of [...new Set(widths)].filter((item) => item <= metadata.width)) {
    const height = Math.round(metadata.height * width / metadata.width);
    const pipeline = sharp(source).resize({ width, withoutEnlargement: true, fit: 'inside' }).withMetadata({ orientation: undefined });
    for (const [format, options] of [['avif', { quality: 78, effort: 7, chromaSubsampling: '4:4:4' }], ['webp', { quality: 92, effort: 6, smartSubsample: true }]]) {
      const filename = `${name}-${width}.${format}`;
      const destination = path.join(outputPath, filename);
      try {
        await fs.access(destination);
      } catch {
        await pipeline.clone()[format](options).toFile(destination);
      }
      const stat = await fs.stat(destination);
      report.push({ file: filename, width, height, bytes: stat.size, format: format.toUpperCase() });
    }
  }
}

const footerOutput = path.join(outputPath, 'footer');
await fs.mkdir(footerOutput, { recursive: true });
for (const [name, relative, widths] of footerAssets) {
  const source = path.join(sourceRoot, relative);
  const metadata = await sharp(source).metadata();
  const fallbackName = `${name}.png`;
  const fallbackDestination = path.join(footerOutput, fallbackName);
  await fs.copyFile(source, fallbackDestination);
  const fallbackStat = await fs.stat(fallbackDestination);
  report.push({ file: `footer/${fallbackName}`, width: metadata.width, height: metadata.height, bytes: fallbackStat.size, format: 'PNG fallback' });

  for (const width of widths.filter((item) => item <= metadata.width)) {
    const height = Math.round(metadata.height * width / metadata.width);
    const pipeline = sharp(source).resize({ width, withoutEnlargement: true, fit: 'inside' }).withMetadata({ orientation: undefined });
    for (const [format, options] of [['avif', { quality: 82, effort: 7, chromaSubsampling: '4:4:4' }], ['webp', { quality: 92, effort: 6, smartSubsample: true }]]) {
      const filename = `${name}-${width}.${format}`;
      const destination = path.join(footerOutput, filename);
      await pipeline.clone()[format](options).toFile(destination);
      const stat = await fs.stat(destination);
      report.push({ file: `footer/${filename}`, width, height, bytes: stat.size, format: format.toUpperCase() });
    }
  }
}

await fs.writeFile(new URL('asset-report.json', outputRoot), JSON.stringify(report, null, 2));
console.table(report.map(({ file, width, height, bytes, format }) => ({ file, width, height, kb: Math.round(bytes / 1024), format })));

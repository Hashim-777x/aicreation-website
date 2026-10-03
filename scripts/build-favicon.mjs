import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const sizes = [16, 24, 32, 48, 64, 128, 256];
const source = await readFile(new URL('../public/media/logo-symbol-black.svg', import.meta.url));
const images = await Promise.all(sizes.map((size) => sharp(source, { density: 384 })
  .resize(size, size, { fit: 'fill' })
  .png({ compressionLevel: 9, palette: true })
  .toBuffer()));

const header = Buffer.alloc(6 + (16 * images.length));
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + (index * 16);
  const size = sizes[index];
  header.writeUInt8(size === 256 ? 0 : size, entry);
  header.writeUInt8(size === 256 ? 0 : size, entry + 1);
  header.writeUInt8(0, entry + 2);
  header.writeUInt8(0, entry + 3);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});

await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, ...images]));
console.log(`Created favicon.ico with ${sizes.join(', ')}px transparent symbol variants.`);

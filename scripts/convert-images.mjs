import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'images');

async function convert() {
  // Hero.png -> desktop (800w) and mobile (400w) WebP
  await sharp(path.join(publicDir, 'Hero.png'))
    .resize(800)
    .webp({ quality: 85 })
    .toFile(path.join(publicDir, 'hero-desktop.webp'));

  await sharp(path.join(publicDir, 'Hero.png'))
    .resize(400)
    .webp({ quality: 80 })
    .toFile(path.join(publicDir, 'hero-mobile.webp'));

  // Diogo.jpg -> desktop (400w) and mobile (200w) WebP
  await sharp(path.join(publicDir, 'Diogo.jpg'))
    .resize(400)
    .webp({ quality: 85 })
    .toFile(path.join(publicDir, 'diogo-desktop.webp'));

  await sharp(path.join(publicDir, 'Diogo.jpg'))
    .resize(200)
    .webp({ quality: 80 })
    .toFile(path.join(publicDir, 'diogo-mobile.webp'));

  console.log('✅ Images converted to WebP successfully!');
}

convert().catch(console.error);

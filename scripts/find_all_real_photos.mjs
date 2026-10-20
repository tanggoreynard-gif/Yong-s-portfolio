import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'scratch/scans';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function scanPage(src, prefix) {
  const meta = await sharp(src).metadata();
  console.log(`Scanning ${prefix}: width=${meta.width}, height=${meta.height}`);

  // Create an overview strip scaled down to 400px wide
  await sharp(src)
    .resize({ width: 400 })
    .jpeg({ quality: 75 })
    .toFile(path.join(outDir, `${prefix}_overview.jpg`));

  console.log(`${prefix} overview created.`);
}

async function main() {
  await scanPage('C:/Users/USER/OneDrive/Documents/PDS/GHL/fitness co whole page 2.png', 'fitco');
  await scanPage('C:/Users/USER/OneDrive/Documents/PDS/GHL/home4daged web.png', 'haven');
  await scanPage('C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png', 'meridian');
}

main().catch(console.error);

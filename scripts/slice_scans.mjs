import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function sliceOverview(prefix) {
  const file = `scratch/scans/${prefix}_overview.jpg`;
  const meta = await sharp(file).metadata();
  const step = Math.floor(meta.height / 8);

  for (let i = 0; i < 8; i++) {
    const top = i * step;
    const height = Math.min(step, meta.height - top);
    await sharp(file)
      .extract({ left: 0, top, width: meta.width, height })
      .jpeg()
      .toFile(`scratch/scans/${prefix}_part_${i + 1}.jpg`);
  }
  console.log(`Sliced ${prefix} into 8 parts`);
}

async function main() {
  await sliceOverview('fitco');
  await sliceOverview('haven');
  await sliceOverview('meridian');
}

main().catch(console.error);

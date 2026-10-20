import sharp from 'sharp';
import fs from 'fs';

async function check() {
  if (!fs.existsSync('scratch')) fs.mkdirSync('scratch', { recursive: true });
  const src = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png';

  // Let's sample key sections down the page to find the best clean photography
  const slices = [
    { name: 'm_2500', top: 2500, height: 800 },
    { name: 'm_5500', top: 5500, height: 800 },
    { name: 'm_8500', top: 8500, height: 800 },
    { name: 'm_11500', top: 11500, height: 800 },
    { name: 'm_14500', top: 14500, height: 800 }
  ];

  for (const s of slices) {
    await sharp(src)
      .extract({ left: 40, top: s.top, width: 1120, height: s.height })
      .jpeg({ quality: 80 })
      .toFile(`scratch/${s.name}.jpg`);
  }
  console.log('Slices generated!');
}

check().catch(console.error);

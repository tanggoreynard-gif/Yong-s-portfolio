import { chromium } from 'playwright';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\46f7ed4f-37ba-4051-bd1e-aa7236117547';

const sections = [
  { selector: '#hero', filename: 'sec1_hero.png' },
  { selector: '#gap', filename: 'sec2_workout_gap.png' },
  { selector: '#reviews', filename: 'sec3_reviews.png' },
  { selector: '#disciplines', filename: 'sec4_disciplines.png' },
  { selector: '#protocol', filename: 'sec5_protocol.png' },
  { selector: '#ethos', filename: 'sec6_ethos.png' },
  { selector: '#coach', filename: 'sec7_coach.png' },
  { selector: '#intake', filename: 'sec8_intake.png' },
  { selector: '#faq', filename: 'sec9_faq.png' },
  { selector: '#location', filename: 'sec10_location.png' },
  { selector: 'section.turning-point', filename: 'sec11_banner.png' }
];

async function main() {
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  await page.goto('http://localhost:5173/samples/fitco-coaching.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Capture Section 1 for thumbnail
  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join('public/samples/thumbs/fitco-coaching.jpeg'), quality: 90, type: 'jpeg' });
    await heroEl.screenshot({ path: path.join('public/home/samples-fitco-coaching.jpeg'), quality: 90, type: 'jpeg' });
    console.log('Updated portfolio thumbnails!');
  }

  // Capture each section to brainDir
  for (const s of sections) {
    const el = await page.$(s.selector);
    if (el) {
      await el.screenshot({ path: path.join(brainDir, s.filename) });
      console.log(`Captured ${s.filename}`);
    }
  }

  await browser.close();
}

main().catch(console.error);

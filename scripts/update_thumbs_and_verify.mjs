import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\46f7ed4f-37ba-4051-bd1e-aa7236117547';
const pubDir = path.resolve('public');

const samples = [
  {
    name: 'fitco-coaching',
    url: 'http://localhost:5173/samples/fitco-coaching.html',
    title: 'FitCo Coaching'
  },
  {
    name: 'haven-senior-care',
    url: 'http://localhost:5173/samples/haven-senior-care.html',
    title: 'Haven Senior Care'
  },
  {
    name: 'meridian-staffing',
    url: 'http://localhost:5173/samples/meridian-staffing.html',
    title: 'Meridian Staffing'
  }
];

async function main() {
  console.log('Launching Edge browser...');
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  // 1. High-fidelity desktop screenshots of the live demo pages
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5
  });

  for (const s of samples) {
    console.log(`Capturing live demo for ${s.name}...`);
    const page = await desktopContext.newPage();
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const outBrain = path.join(brainDir, `${s.name}_polished_hero.png`);
    await page.screenshot({ path: outBrain });
    console.log(`Saved ${outBrain}`);

    await page.close();
  }

  // 2. Thumbnails for portfolio cards (1080x1440 3:4 aspect ratio viewport crop)
  const thumbContext = await browser.newContext({
    viewport: { width: 1080, height: 1440 },
    deviceScaleFactor: 1
  });

  for (const s of samples) {
    console.log(`Generating card thumbnail for ${s.name}...`);
    const page = await thumbContext.newPage();
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Save thumbnail in public/samples/thumbs/
    const thumbPath = path.join(pubDir, 'samples', 'thumbs', `${s.name}.jpeg`);
    await page.screenshot({ path: thumbPath, type: 'jpeg', quality: 85 });
    console.log(`Saved ${thumbPath}`);

    // Also update public/home/
    const homeThumbPath = path.join(pubDir, 'home', `samples-${s.name}.jpeg`);
    if (fs.existsSync(path.dirname(homeThumbPath))) {
      await page.screenshot({ path: homeThumbPath, type: 'jpeg', quality: 85 });
      console.log(`Saved ${homeThumbPath}`);
    }

    await page.close();
  }

  // 3. Capture home page websites section to show how clean the cards look now
  const homePage = await desktopContext.newPage();
  console.log('Capturing Home page client websites section...');
  await homePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await homePage.waitForTimeout(3500); // intro overlay

  const websitesSection = await homePage.$('section[aria-labelledby="client-websites-title"]');
  if (websitesSection) {
    await websitesSection.scrollIntoViewIfNeeded();
    await homePage.waitForTimeout(600);
    const homeSectionOut = path.join(brainDir, 'home_client_websites_polished.png');
    await websitesSection.screenshot({ path: homeSectionOut });
    console.log(`Saved ${homeSectionOut}`);
  }

  await browser.close();
  console.log('All thumbnails and previews successfully generated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

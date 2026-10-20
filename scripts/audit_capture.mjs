import { chromium } from 'playwright';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\46f7ed4f-37ba-4051-bd1e-aa7236117547';

const sites = [
  { url: 'http://localhost:5173/samples/lumina-dental.html', name: 'lumina' },
  { url: 'http://localhost:5173/samples/fitco-coaching.html', name: 'fitco' },
  { url: 'http://localhost:5173/samples/haven-senior-care.html', name: 'haven' },
  { url: 'http://localhost:5173/samples/meridian-staffing.html', name: 'meridian' }
];

async function main() {
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  for (const s of sites) {
    // Desktop view
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1
    });

    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Capture desktop hero
    await page.screenshot({ path: path.join(brainDir, `audit_${s.name}_hero_desktop.png`) });

    // Mobile view
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2
    });

    await mobilePage.goto(s.url, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(brainDir, `audit_${s.name}_hero_mobile.png`) });

    await page.close();
    await mobilePage.close();
    console.log(`Captured ${s.name} desktop & mobile screenshots`);
  }

  await browser.close();
}

main().catch(console.error);

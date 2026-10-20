import { chromium } from 'playwright';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\46f7ed4f-37ba-4051-bd1e-aa7236117547';

async function main() {
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });

  await page.goto('http://localhost:5173/samples/fitco-coaching.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Capture full page screenshot
  await page.screenshot({
    path: path.join(brainDir, 'fitco_full_page.png'),
    fullPage: true
  });
  console.log('Full page captured!');

  await browser.close();
}

main().catch(console.error);

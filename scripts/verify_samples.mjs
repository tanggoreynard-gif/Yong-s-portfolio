import { chromium } from 'playwright';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\46f7ed4f-37ba-4051-bd1e-aa7236117547';

async function main() {
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  // 1. Home page - Websites & Landing Pages section (target the exact bounding box of the section)
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500); // wait for intro overlay to finish

  const websitesSection = await page.$('section[aria-labelledby="client-websites-title"]');
  if (websitesSection) {
    await websitesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Screenshot of the actual websites section element
    await websitesSection.screenshot({ path: path.join(outDir, 'home_websites_section_clean.png') });
    console.log('Saved home_websites_section_clean.png');
  }

  // 2. Projects view - Websites & Funnels filter
  console.log('Navigating to http://localhost:5173/projects ...');
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  const filterBtn = await page.$('button.pfilter__btn:has-text("Websites & Funnels")');
  if (filterBtn) {
    await filterBtn.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(outDir, 'projects_websites_filter_clean.png') });
  console.log('Saved projects_websites_filter_clean.png');

  // 3. Open FitCo project modal
  const fitcoCard = await page.$('button.bento__card:has-text("FitCo")');
  if (fitcoCard) {
    await fitcoCard.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, 'fitco_project_modal_clean.png') });
    console.log('Saved fitco_project_modal_clean.png');

    // 4. Click Inspect High-Res
    const inspectBtn = await page.$('.proof-card__figure');
    if (inspectBtn) {
      await inspectBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, 'fitco_lightbox_zoom_clean.png') });
      console.log('Saved fitco_lightbox_zoom_clean.png');
    }
  }

  // 5. FitCo Live Demo Page
  console.log('Navigating to FitCo Live demo...');
  await page.goto('http://localhost:5173/samples/fitco-coaching.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'fitco_live_site.png') });
  console.log('Saved fitco_live_site.png');

  // 6. Haven Senior Care Live Demo Page
  console.log('Navigating to Haven Senior Care Live demo...');
  await page.goto('http://localhost:5173/samples/haven-senior-care.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'haven_live_site.png') });
  console.log('Saved haven_live_site.png');

  // 7. Meridian Staffing Live Demo Page
  console.log('Navigating to Meridian Staffing Live demo...');
  await page.goto('http://localhost:5173/samples/meridian-staffing.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'meridian_live_site.png') });
  console.log('Saved meridian_live_site.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

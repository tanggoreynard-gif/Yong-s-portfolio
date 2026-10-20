import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outFitco = 'd:/Yong\'s portfolio/public/samples/fitco';
const outHaven = 'd:/Yong\'s portfolio/public/samples/haven';
const outMeridian = 'd:/Yong\'s portfolio/public/samples/meridian';

[outFitco, outHaven, outMeridian].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function extract() {
  console.log('Extracting FitCo assets...');
  const fitcoSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/fitness co whole page 2.png';
  // FitCo hero image is approximately in the top 1500px on the right
  await sharp(fitcoSrc)
    .extract({ left: 650, top: 0, width: 946, height: 1100 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outFitco, 'hero-gym.jpg'));
  
  // FitCo athlete sitting
  await sharp(fitcoSrc)
    .extract({ left: 700, top: 1400, width: 850, height: 950 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outFitco, 'athlete-focus.jpg'));

  // FitCo coach Alex Carter
  await sharp(fitcoSrc)
    .extract({ left: 60, top: 7600, width: 550, height: 680 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outFitco, 'coach-alex.jpg'));

  console.log('FitCo assets extracted.');

  console.log('Extracting Haven assets...');
  const havenSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/home4daged web.png';
  // Haven hero caregiver and senior
  await sharp(havenSrc)
    .extract({ left: 650, top: 120, width: 850, height: 750 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outHaven, 'hero-care.jpg'));

  // Haven consultation at table
  await sharp(havenSrc)
    .extract({ left: 680, top: 1150, width: 800, height: 700 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outHaven, 'care-table.jpg'));

  // Haven reading book
  await sharp(havenSrc)
    .extract({ left: 100, top: 9350, width: 550, height: 500 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outHaven, 'senior-reading.jpg'));

  // Haven caregiver hands
  await sharp(havenSrc)
    .extract({ left: 90, top: 13350, width: 550, height: 500 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outHaven, 'caregiver-hands.jpg'));

  console.log('Haven assets extracted.');

  console.log('Extracting Meridian assets...');
  const meridianSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png';
  // Meridian hero team
  await sharp(meridianSrc)
    .extract({ left: 0, top: 0, width: 1208, height: 700 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outMeridian, 'hero-team.jpg'));

  // Meridian executive woman with laptop
  await sharp(meridianSrc)
    .extract({ left: 450, top: 9150, width: 680, height: 550 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outMeridian, 'executive-woman.jpg'));

  // Meridian team discussion
  await sharp(meridianSrc)
    .extract({ left: 80, top: 14750, width: 1000, height: 550 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outMeridian, 'team-meeting.jpg'));

  console.log('Meridian assets extracted.');
}

extract().catch(console.error);

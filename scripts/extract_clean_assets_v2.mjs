import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function extractClean() {
  console.log('Extracting clean FitCo assets...');
  const fitcoSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/fitness co whole page 2.png';
  
  // Clean hero gym photo
  await sharp(fitcoSrc)
    .extract({ left: 650, top: 65, width: 570, height: 835 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/fitco/hero-gym.jpg');

  // Clean athlete sitting on bench
  await sharp(fitcoSrc)
    .extract({ left: 760, top: 1220, width: 750, height: 860 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/fitco/athlete-focus.jpg');

  console.log('FitCo assets saved.');

  console.log('Extracting clean Haven assets...');
  const havenSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/home4daged web.png';

  // Hero: caregiver & senior in armchairs
  await sharp(havenSrc)
    .extract({ left: 692, top: 226, width: 464, height: 464 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/haven/hero-care.jpg');

  // Caregiver and daughter at wooden table
  await sharp(havenSrc)
    .extract({ left: 715, top: 1115, width: 440, height: 535 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/haven/care-table.jpg');

  console.log('Haven assets saved.');

  console.log('Extracting clean Meridian assets...');
  const meridianSrc = 'C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png';

  // Hero: Executive woman leader with laptop & skyline
  await sharp(meridianSrc)
    .extract({ left: 45, top: 8615, width: 1110, height: 472 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/meridian/hero-team.jpg');

  // Executive meeting
  await sharp(meridianSrc)
    .extract({ left: 600, top: 120, width: 600, height: 560 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/meridian/team-meeting.jpg');

  console.log('Meridian assets saved.');
}

extractClean().catch(console.error);

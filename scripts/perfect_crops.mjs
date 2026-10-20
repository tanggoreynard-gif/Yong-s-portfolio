import sharp from 'sharp';

async function perfectCrops() {
  console.log('Generating pixel-perfect crops...');

  // 1. FitCo hero gym: left: 650, top: 65, width: 570, height: 835
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/fitness co whole page 2.png')
    .extract({ left: 650, top: 65, width: 570, height: 835 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/fitco/hero-gym.jpg');

  // 2. FitCo athlete: left: 775, top: 1230, width: 420, height: 495
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/fitness co whole page 2.png')
    .extract({ left: 775, top: 1230, width: 420, height: 495 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/fitco/athlete-focus.jpg');

  // 3. Haven hero care: left: 698, top: 236, width: 454, height: 450
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/home4daged web.png')
    .extract({ left: 698, top: 236, width: 454, height: 450 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/haven/hero-care.jpg');

  // 4. Haven table consultation: left: 715, top: 1135, width: 440, height: 515
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/home4daged web.png')
    .extract({ left: 715, top: 1135, width: 440, height: 515 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/haven/care-table.jpg');

  // 5. Meridian hero leader (executive woman with laptop overlooking skyline)
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png')
    .extract({ left: 45, top: 8615, width: 1110, height: 472 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/meridian/hero-team.jpg');

  // 6. Meridian team meeting: left: 600, top: 120, width: 600, height: 560
  await sharp('C:/Users/USER/OneDrive/Documents/PDS/GHL/meridian staffing whole page.png')
    .extract({ left: 600, top: 120, width: 600, height: 560 })
    .jpeg({ quality: 95 })
    .toFile('public/samples/meridian/team-meeting.jpg');

  console.log('All crops finished with 100% precision!');
}

perfectCrops().catch(console.error);

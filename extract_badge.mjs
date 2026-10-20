import fs from 'fs';

// Read raw PDF bytes
const data = fs.readFileSync('C:\\Users\\USER\\Downloads\\HLA_Certified_Builder_-_Template_-_Template.pdf');

// Look for JPEG markers: FF D8 FF (start) and FF D9 (end)
let found = [];
for (let i = 0; i < data.length - 3; i++) {
  if (data[i] === 0xFF && data[i+1] === 0xD8 && data[i+2] === 0xFF) {
    // Find the end marker FF D9
    let end = -1;
    for (let j = i + 2; j < data.length - 1; j++) {
      if (data[j] === 0xFF && data[j+1] === 0xD9) { end = j + 2; break; }
    }
    if (end > i) {
      found.push({ start: i, end, size: end - i });
      console.log(`JPEG found: offset ${i} -> ${end} (${end - i} bytes)`);
    }
  }
}

if (found.length > 0) {
  // Extract the largest JPEG (likely the main image)
  found.sort((a, b) => b.size - a.size);
  const best = found[0];
  const jpeg = data.subarray(best.start, best.end);
  fs.writeFileSync("d:\\Yong's portfolio\\public\\hla_badge_raw.jpg", jpeg);
  console.log(`\nSaved largest JPEG (${best.size} bytes) to hla_badge_raw.jpg`);
} else {
  console.log('No JPEG found, checking for PNG...');
  // PNG magic: 89 50 4E 47
  for (let i = 0; i < data.length - 8; i++) {
    if (data[i] === 0x89 && data[i+1] === 0x50 && data[i+2] === 0x4E && data[i+3] === 0x47) {
      // Find IEND chunk
      let end = -1;
      for (let j = i + 8; j < data.length - 4; j++) {
        if (data[j] === 0x49 && data[j+1] === 0x45 && data[j+2] === 0x4E && data[j+3] === 0x44) {
          end = j + 8; break;
        }
      }
      if (end > i) {
        const png = data.subarray(i, end);
        fs.writeFileSync("d:\\Yong's portfolio\\public\\hla_badge_raw.png", png);
        console.log(`PNG found and saved (${png.length} bytes)`);
        break;
      }
    }
  }
}

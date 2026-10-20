import fs from 'node:fs';

const buf = fs.readFileSync('C:/Users/USER/Downloads/HighLevel_Certified_Admin_Final_Exam_Guide.docx');
// Find word/document.xml in zip
// Simple zip header search: PK\x03\x04
let idx = buf.indexOf('word/document.xml');
console.log('Found word/document.xml at:', idx);
if (idx !== -1) {
  // Let's print string matches of text
  const str = buf.toString('latin1');
  const matches = str.match(/[\x20-\x7E]{5,100}/g);
  const relevant = matches?.filter(m => /admin|cert|number|id|exam|pass|hl/i.test(m));
  console.log('Relevant snippets:', relevant?.slice(0, 20));
}

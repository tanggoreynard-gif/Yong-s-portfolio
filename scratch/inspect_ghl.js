const https = require('https');

https.get('https://directory.gohighlevel.com/assets/index-D7wQ8aYz.js', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('JS length:', data.length);
    const badgeMatches = data.match(/https:\/\/[^"']*(?:badge|upload|object|cert)[^"']*/gi);
    console.log('Badge/upload matches:', badgeMatches ? badgeMatches.slice(0, 15) : 'none');
    const apiMatches = data.match(/\/api\/[a-zA-Z0-9_\/-]+/gi);
    console.log('API matches:', apiMatches ? [...new Set(apiMatches)].slice(0, 20) : 'none');
    
    // Look for "admin number" or similar terms
    const adminTerms = data.match(/[^.!?;"']*(?:admin[_\s-]?number|cert(?:ificate)?[_\s-]?number|badge)[^.!?;"']*/gi);
    console.log('Admin number terms:', adminTerms ? adminTerms.slice(0, 10) : 'none');
  });
});

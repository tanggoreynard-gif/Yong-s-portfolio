import https from 'node:https';

https.get('https://directory.gohighlevel.com/assets/index-D7wQ8aYz.js', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all endpoints matching /api/
    const allApis = data.match(/\/api\/[a-zA-Z0-9_\/-]+/g);
    console.log('All APIs found:', [...new Set(allApis)]);
    // Find references to "certified" or "admin" or "search"
    const searchTerms = data.match(/\/api\/(?:public|directory|users|profiles|v1)[a-zA-Z0-9_\/-]*/gi);
    console.log('Public/directory APIs:', searchTerms ? [...new Set(searchTerms)] : 'none');
  });
});

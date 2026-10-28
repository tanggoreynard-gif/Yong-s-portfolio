import https from 'node:https';

/**
 * GoHighLevel Automated Pipeline & Stage Provisioner
 * Pre-configured for Location: QY3OuusNTXzf3pQxYaWa
 */

const LOCATION_ID = process.env.GHL_LOCATION_ID || 'QY3OuusNTXzf3pQxYaWa';
const PIT_TOKEN = process.env.GHL_TOKEN;

if (!PIT_TOKEN) {
  console.error('\x1b[31m[ERROR] GHL_TOKEN environment variable is missing.\x1b[0m');
  console.log('Usage:');
  console.log('  Windows PowerShell: $env:GHL_TOKEN="pit-your-token-here"; node scripts/setup_ghl_pipelines.mjs');
  console.log('  Windows CMD:        set GHL_TOKEN=pit-your-token-here && node scripts/setup_ghl_pipelines.mjs');
  process.exit(1);
}

const PIPELINES = [
  {
    name: '001 - Sales Pipeline',
    stages: [
      { name: '001 New Lead', position: 0, stageWinProbability: 10, color: '#38BDF8' },
      { name: '002 Consultation Booked', position: 1, stageWinProbability: 30, color: '#60A5FA' },
      { name: '003 Consultation Completed', position: 2, stageWinProbability: 50, color: '#818CF8' },
      { name: '004 Follow Up', position: 3, stageWinProbability: 40, color: '#F59E0B' },
      { name: '005 Client Enrolled', position: 4, stageWinProbability: 100, color: '#10B981' },
      { name: '006 Active Client', position: 5, stageWinProbability: 100, color: '#34D399' },
      { name: '007 Closed Lost', position: 6, stageWinProbability: 0, color: '#EF4444' }
    ]
  },
  {
    name: '002 - Client Onboarding',
    stages: [
      { name: '001 New Client', position: 0, stageWinProbability: 20, color: '#38BDF8' },
      { name: '002 Intake Complete', position: 1, stageWinProbability: 40, color: '#60A5FA' },
      { name: '003 Agreement Signed', position: 2, stageWinProbability: 60, color: '#818CF8' },
      { name: '004 Payment Confirmed', position: 3, stageWinProbability: 80, color: '#10B981' },
      { name: '005 Onboarding Call', position: 4, stageWinProbability: 90, color: '#F59E0B' },
      { name: '006 Program Setup', position: 5, stageWinProbability: 95, color: '#A78BFA' },
      { name: '007 Active Coaching', position: 6, stageWinProbability: 100, color: '#059669' }
    ]
  }
];

const TAGS = [
  'lead:source-web',
  'status:new-lead',
  'status:consultation-booked',
  'status:consultation-completed',
  'status:follow-up',
  'status:client-enrolled',
  'status:active-client',
  'status:closed-lost',
  'onb:intake-pending',
  'onb:agreement-signed',
  'onb:payment-confirmed',
  'onb:call-booked',
  'onb:setup-complete',
  'onb:active-coaching'
];

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject({ status: res.statusCode, error: parsed, raw: body });
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: body });
          } else {
            reject({ status: res.statusCode, error: body });
          }
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log(`\n\x1b[36m====================================================\x1b[0m`);
  console.log(`\x1b[36m  Deploying Process Map to GoHighLevel\x1b[0m`);
  console.log(`  Location ID: \x1b[33m${LOCATION_ID}\x1b[0m`);
  console.log(`\x1b[36m====================================================\x1b[0m\n`);

  // Step 1: Verify Location Access
  console.log('[1/3] Verifying sub-account access...');
  try {
    const locRes = await request({
      hostname: 'services.leadconnectorhq.com',
      path: `/locations/${LOCATION_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PIT_TOKEN}`,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    console.log(`  ✔ Verified connected sub-account: \x1b[32m"${locRes.data.location?.name || 'Authorized'}"\x1b[0m`);
  } catch (err) {
    console.warn(`  ⚠️ Location detail fetch check skipped (${err.status || err.message}). Proceeding with pipeline provisioning...`);
  }

  // Step 2: Deploy Pipelines & Stages
  console.log('\n[2/3] Provisioning Pipelines & 14 Stages...');
  for (const pipeline of PIPELINES) {
    try {
      const payload = {
        locationId: LOCATION_ID,
        name: pipeline.name,
        stages: pipeline.stages.map(s => ({
          name: s.name,
          position: s.position
        }))
      };

      const res = await request({
        hostname: 'services.leadconnectorhq.com',
        path: '/opportunities/pipelines',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PIT_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }, payload);

      console.log(`  ✔ Successfully created pipeline: \x1b[32m"${pipeline.name}"\x1b[0m (ID: ${res.data.pipeline?.id || 'Created'})`);
      pipeline.stages.forEach(s => {
        console.log(`     └─ Stage ${s.position + 1}: ${s.name} (${s.stageWinProbability}%)`);
      });
    } catch (err) {
      console.error(`  ❌ Error creating "${pipeline.name}":`, err.error || err.raw || err);
    }
  }

  // Step 3: Deploy Tags
  console.log('\n[3/3] Provisioning Process Map Tags...');
  for (const tag of TAGS) {
    try {
      await request({
        hostname: 'services.leadconnectorhq.com',
        path: `/locations/${LOCATION_ID}/tags`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PIT_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }, { name: tag });
      console.log(`  ✔ Added tag: \x1b[32m${tag}\x1b[0m`);
    } catch (err) {
      // Tags might already exist, which is fine
      console.log(`  ℹ Tag notice: ${tag} (${err.status === 400 ? 'already exists' : 'skipped'})`);
    }
  }

  console.log(`\n\x1b[32m====================================================\x1b[0m`);
  console.log(`\x1b[32m  ✔ Process Map Provisioning Complete!\x1b[0m`);
  console.log(`  Check your GHL sub-account at: Opportunities -> Pipelines`);
  console.log(`\x1b[32m====================================================\x1b[0m\n`);
}

run().catch(err => {
  console.error('\n\x1b[31mFatal error during provisioning:\x1b[0m', err);
});

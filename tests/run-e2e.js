#!/usr/bin/env node
/**
 * Dev Krafters Unified E2E Test Runner
 * Executes all 4 tiers of comprehensive tests:
 *   Tier 1: Feature Coverage (Isolation)
 *   Tier 2: Boundary & Corner Cases
 *   Tier 3: Cross-Feature Combinations
 *   Tier 4: Real-World Customer Journeys
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testRoot = __dirname;
const projectRoot = path.resolve(testRoot, '..');

const TIERS = [
  {
    name: 'Tier 1: Feature Coverage (Isolation)',
    dir: path.join(testRoot, 'tier1-feature-coverage'),
  },
  {
    name: 'Tier 2: Boundary & Corner Cases',
    dir: path.join(testRoot, 'tier2-boundary-corner'),
  },
  {
    name: 'Tier 3: Cross-Feature Combinations',
    dir: path.join(testRoot, 'tier3-cross-feature'),
  },
  {
    name: 'Tier 4: Real-World Customer Journeys',
    dir: path.join(testRoot, 'tier4-real-world-scenarios'),
  },
];

console.log('================================================================');
console.log(' DEV KRAFTERS — E2E TEST SUITE RUNNER');
console.log(' Node:', process.version, '| Platform:', process.platform);
console.log('================================================================\n');

let totalFiles = 0;
let passedFiles = 0;
let failedFiles = 0;
const results = [];
const startTime = Date.now();

for (const tier of TIERS) {
  if (!fs.existsSync(tier.dir)) {
    console.warn(`[WARNING] Directory not found: ${tier.dir}`);
    continue;
  }

  const files = fs
    .readdirSync(tier.dir)
    .filter((f) => f.endsWith('.test.js'))
    .sort();

  console.log(`\n--- ${tier.name} (${files.length} suites) ---`);

  for (const file of files) {
    totalFiles++;
    const fullPath = path.join(tier.dir, file);
    const relPath = path.relative(projectRoot, fullPath);

    process.stdout.write(`  • Running ${file} ... `);
    const startSingle = Date.now();

    const proc = spawnSync(process.execPath, ['--test-force-exit', '--test', fullPath], {
      cwd: projectRoot,
      env: {
        ...process.env,
        ADMIN_PASSCODE: '1234',
        RESEND_API_KEY: 're_your_resend_api_key_here',
      },
      encoding: 'utf8',
    });

    const duration = Date.now() - startSingle;
    const isSuccess = proc.status === 0;

    if (isSuccess) {
      passedFiles++;
      console.log(`✔ PASSED (${duration}ms)`);
      results.push({ tier: tier.name, file, passed: true, duration });
    } else {
      failedFiles++;
      console.log(`✖ FAILED (${duration}ms)`);
      console.error('\n--- Failure Output ---');
      console.error(proc.stdout || proc.stderr);
      console.error('----------------------\n');
      results.push({ tier: tier.name, file, passed: false, duration, output: proc.stderr || proc.stdout });
    }
  }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n================================================================');
console.log(' TEST EXECUTION SUMMARY');
console.log('================================================================');
console.log(`Total Test Suites: ${totalFiles}`);
console.log(`Passed Suites:     ${passedFiles}`);
console.log(`Failed Suites:     ${failedFiles}`);
console.log(`Total Duration:    ${totalDuration}s`);
console.log('================================================================\n');

if (failedFiles === 0) {
  console.log('🎉 ALL E2E TEST SUITES PASSED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error(`💥 ${failedFiles} test suite(s) failed. Check details above.\n`);
  process.exit(1);
}

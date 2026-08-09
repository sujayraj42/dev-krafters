const prodUrl = 'https://dev-krafters.vercel.app';

console.log('--- Testing Production Live API Endpoints ---');

// 1. Test Health Check API
try {
  console.log('1. Testing POST /api/health-check...');
  const res = await fetch(`${prodUrl}/api/health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://example.com' }),
  });
  console.log('Health check HTTP status:', res.status);
  const data = await res.json();
  console.log('Health check output:', { score: data.score, url: data.url, summary: data.summary?.slice(0, 100) });
} catch (e) {
  console.error('Health check API error:', e.message);
}

// 2. Test Chat API
try {
  console.log('\n2. Testing POST /api/chat...');
  const res = await fetch(`${prodUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What are your pricing packages?' }],
    }),
  });
  console.log('Chat HTTP status:', res.status);
  const data = await res.json();
  console.log('Chat reply:', data.reply);
} catch (e) {
  console.error('Chat API error:', e.message);
}

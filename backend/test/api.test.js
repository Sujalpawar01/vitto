const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../src/app');
const db = require('../src/config/db');

// Helper to start the Express server on an ephemeral port
function startTestServer(app) {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({
        server,
        url: `http://127.0.0.1:${port}`
      });
    });
  });
}

test('Vitto API Endpoints and Validation Test Suite', async (t) => {
  let serverInstance;
  let testServerUrl;

  // Setup server before running tests
  t.before(async () => {
    const { server, url } = await startTestServer(app);
    serverInstance = server;
    testServerUrl = url;
  });

  // Teardown server after tests
  t.after(() => {
    serverInstance.close();
  });

  // Mock database query method
  let lastQueryText = '';
  let lastQueryParams = [];
  let queryMockReturnValue = { rows: [] };

  db.query = async (text, params) => {
    lastQueryText = text;
    lastQueryParams = params;
    return queryMockReturnValue;
  };

  await t.test('GET / - Should return health check response', async () => {
    const res = await fetch(`${testServerUrl}/`);
    const body = await res.json();
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.match(body.message, /API is running/);
  });

  await t.test('POST /api/applications - Should succeed with valid inputs', async () => {
    // Setup mock return value representing created application
    const mockAppId = '12345678-1234-1234-1234-123456789012';
    queryMockReturnValue = {
      rows: [{
        id: mockAppId,
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        amount: 25000,
        purpose: 'Agriculture equipment purchase',
        language: 'Hindi',
        status: 'pending',
        created_at: new Date().toISOString()
      }]
    };

    const res = await fetch(`${testServerUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        amount: 25000,
        purpose: 'Agriculture equipment purchase',
        language: 'Hindi'
      })
    });

    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.application.id, mockAppId);
    assert.strictEqual(body.application.name, 'Rajesh Kumar');
    assert.match(lastQueryText, /INSERT INTO applications/i);
  });

  await t.test('POST /api/applications - Should fail validation with invalid mobile number', async () => {
    const res = await fetch(`${testServerUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rajesh Kumar',
        mobile: '12345', // Invalid
        amount: 25000,
        purpose: 'Agriculture equipment',
        language: 'Hindi'
      })
    });

    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(body.errors.some(err => err.includes('mobile')));
  });

  await t.test('POST /api/applications - Should fail validation with invalid language option', async () => {
    const res = await fetch(`${testServerUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        amount: 25000,
        purpose: 'Agriculture equipment',
        language: 'German' // Invalid
      })
    });

    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.ok(body.errors.some(err => err.includes('language')));
  });

  await t.test('GET /api/applications - Should fail unauthorized access without JWT token', async () => {
    const res = await fetch(`${testServerUrl}/api/applications`);
    const body = await res.json();

    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.success, false);
    assert.match(body.message, /No authentication token/i);
  });

  await t.test('GET /api/applications - Should fail access with invalid token', async () => {
    const res = await fetch(`${testServerUrl}/api/applications`, {
      headers: { 'Authorization': 'Bearer invalid_jwt_token_format' }
    });
    const body = await res.json();

    assert.strictEqual(res.status, 403);
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Failed to authenticate/i);
  });
});

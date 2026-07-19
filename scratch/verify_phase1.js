const http = require('http');

const payload = JSON.stringify({
  username: 'john_doe',
  password: 'password'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

function postRequest(options, data, token) {
  return new Promise((resolve, reject) => {
    const headers = { ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request({ ...options, headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ success: false, raw: body });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function run() {
  console.log('🏁 Starting Phase 1 automated API verification...');
  try {
    const loginRes = await postRequest(loginOptions, payload);
    if (!loginRes.success) {
      console.error('❌ Login failed:', loginRes);
      return;
    }
    const token = loginRes.token;
    console.log('✅ Logged in successfully. Token:', token.substring(0, 30) + '...');

    // Complete lesson 1861
    console.log('\n--- Completing Lesson 1861 ---');
    const res1861 = await postRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/lessons/1861/progress',
      method: 'POST'
    }, null, token);
    console.log('Response:', JSON.stringify(res1861, null, 2));

    // Complete lesson 1862
    console.log('\n--- Completing Lesson 1862 ---');
    const res1862 = await postRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/lessons/1862/progress',
      method: 'POST'
    }, null, token);
    console.log('Response:', JSON.stringify(res1862, null, 2));

    // Complete lesson 1863
    console.log('\n--- Completing Lesson 1863 ---');
    const res1863 = await postRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/lessons/1863/progress',
      method: 'POST'
    }, null, token);
    console.log('Response:', JSON.stringify(res1863, null, 2));

    console.log('\n🎉 Verification completed successfully!');
  } catch (err) {
    console.error('❌ Verification failed with error:', err);
  }
}

run();

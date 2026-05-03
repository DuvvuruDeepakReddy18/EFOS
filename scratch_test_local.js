import handler from './api/analyze-resume.js';

async function testLocalApi() {
  const req = {
    method: 'POST',
    headers: { origin: 'http://localhost:5173' },
    body: { resumeText: 'This is a test resume with more than 50 characters so it does not fail early on length checks.' }
  };
  const res = {
    _status: 200,
    _json: null,
    setHeader(k, v) { console.log('setHeader', k, v); },
    status(code) { this._status = code; return this; },
    json(data) { this._json = data; return this; },
    end() { return this; }
  };

  try {
    await handler(req, res);
    console.log('Status:', res._status);
    console.log('JSON:', res._json);
  } catch (err) {
    console.error('Error during handler execution:', err);
  }
}

testLocalApi();

async function testApi() {
  try {
    const res = await fetch('https://internmatch-temp.vercel.app/api/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: 'This is a test resume with more than 50 characters so it does not fail early on length checks.' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testApi();

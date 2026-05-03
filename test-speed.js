const key = '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';
const url = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function testSpeed(model) {
  const start = Date.now();
  console.log(`Testing ${model}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an expert career analyst. Generate a large JSON object analyzing a fake resume.' },
          { role: 'user', content: 'Generate a large JSON response with at least 1500 tokens of nested arrays and objects.' }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })
    });
    const d = await res.json();
    console.log(`Model ${model} took ${Date.now() - start} ms. Tokens: ${d.usage?.completion_tokens}`);
  } catch (err) {
    console.error(`Error with ${model}:`, err.message);
  }
}

async function run() {
  await testSpeed('meta/llama-3.1-8b-instruct');
  await testSpeed('meta/llama-3.1-70b-instruct');
  await testSpeed('meta/llama-3.3-70b-instruct');
}

run();

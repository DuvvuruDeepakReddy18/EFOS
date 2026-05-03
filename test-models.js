const key = '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';
const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
async function testModel(model) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 10
    })
  });
  console.log(model, res.status);
  if (!res.ok) console.log(await res.text());
}
testModel('meta/llama-3.1-405b-instruct')
  .then(() => testModel('meta/llama-3.1-70b-instruct'))
  .then(() => testModel('meta/llama-3.1-8b-instruct'));

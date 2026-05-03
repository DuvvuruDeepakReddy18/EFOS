const API_KEY = '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';
const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
const SYSTEM_PROMPT = `You are an AI Resume Analyzer. Given a resume, return ONLY JSON with this structure:
{"resume_score":85,"summary":"Short 1-sentence summary","name":"Name","email":"Email","education":{"degree":"Degree","year":"2024"},"skills":[{"name":"Skill","level":"Beginner"}],"projects":[{"title":"Proj","description":"Short"}],"improvement_tips":[{"text":"Tip1","type":"tip"}],"talent_dna":{"analyticalThinking":80,"communication":85},"skill_gaps":[{"skill":"Skill","priority":"Moderate","reason":"Why"}],"target_roles":["Role1"]}
Keep arrays extremely short (max 3 items each). Be fast and concise. ONLY output valid JSON.`;

const resumeText = 'Software Engineer with experience in React and Node.js. '.repeat(100);

const start = Date.now();
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + API_KEY
  },
  body: JSON.stringify({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: 'Analyze this resume and return the JSON:\n\n---RESUME START---\n' + resumeText + '\n---RESUME END---' }
    ],
    temperature: 0.15,
    top_p: 0.9,
    max_tokens: 1000,
    stream: false
  })
}).then(r => r.json()).then(data => console.log('Took', Date.now() - start, 'ms', JSON.stringify(data).substring(0, 100))).catch(e => console.error(e));

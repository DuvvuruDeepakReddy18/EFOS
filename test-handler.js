import { createRequire } from "module";
const require = createRequire(import.meta.url);

import handler from './api/analyze-resume.js';

const req = {
  method: 'POST',
  headers: {
    origin: 'http://localhost:3000'
  },
  body: {
    resumeText: 'John Doe. Experienced software engineer with 5 years in React and Node.js. Built multiple scalable applications. BS in Computer Science.'
  }
};

const res = {
  setHeader: (key, val) => console.log(`Set header: ${key} = ${val}`),
  status: (code) => {
    console.log(`Status: ${code}`);
    return {
      json: (data) => console.log(`JSON:`, JSON.stringify(data, null, 2)),
      end: () => console.log('End')
    };
  }
};

(async () => {
  console.log("Calling handler...");
  await handler(req, res);
  console.log("Handler finished.");
})();

# InternMatch - EFOS Hackathon

InternMatch is India's smartest AI-powered internship allocation platform. This project was developed for the EFOS Open Domain Challenge.

## Key Features

- **AI Resume Intelligence**: Upload your resume (PDF, DOCX, TXT) and let our AI (powered by Llama 3) extract your skills, analyze your experience, and calculate a Resume Score.
- **Skill Passport & Gap Analyzer**: Get a clear view of your strengths and identify critical skill gaps needed for your target roles.
- **Personalized Learning Hub**: Receive a custom 4-6 week learning plan with curated courses to bridge your skill gaps.
- **Opportunity Scoring Engine**: Connects candidates to the right internships based on a weighted scoring mechanism.
- **Responsive & Modern UI**: Built with React, TailwindCSS, Framer Motion, and Vite for a seamless user experience.

## Technology Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, Framer Motion, Zustand (State Management)
- **Backend**: Vercel Serverless Functions (Node.js), PDF & DOCX parsing (pdfjs-dist, mammoth, pdf-parse)
- **AI Integration**: NVIDIA AI endpoint (`meta/llama-3.1-8b-instruct`)
- **Database**: Supabase (PostgreSQL)

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file based on `.env.example` (or configure Vercel Environment Variables).
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on Vercel. 
- API endpoints are located in the `api/` directory and run as serverless functions.
- The frontend is built and served as static assets.

# InternMatch - EFOS Hackathon

## Overview
InternMatch is an AI-driven platform designed to connect candidates with opportunities using an advanced opportunity scoring engine and fairness analytics. Developed as part of the **EFOS Hackathon** for the **Open Innovation** domain, the platform provides a seamless experience for both candidates and companies.

## Key Features
- **AI-Powered Matching:** Candidates are matched to opportunities based on real-time fairness algorithms and probabilistic models.
- **Fairness Monitor:** Admins can view and manage fairness analytics to ensure unbiased allocation.
- **Supabase Edge Functions:** Core ML and fairness engines are built using Supabase Edge Functions for fast, scalable serverless execution.
- **Modern UI:** Built with React, Vite, Tailwind CSS, Framer Motion, and Lucide Icons for a beautiful, responsive, and accessible user experience.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, TypeScript
- **Backend & Database:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js installed
- Supabase account and project set up

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment
This project is configured to be deployed on Vercel. Simply run:
```bash
vercel --prod
```

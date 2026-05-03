import type {
  Internship, Skill, RewardTransaction, Course, Challenge,
  LeaderboardEntry, TalentDNA, CareerPathStep
} from '@/types';

export const mockSkills: Skill[] = [
  { id: '1', name: 'Python', category: 'Programming', level: 'Expert', verified: true, confidence: 0.97, source: 'Resume + Challenge' },
  { id: '2', name: 'Machine Learning', category: 'AI/ML', level: 'Intermediate', verified: true, confidence: 0.88, source: 'Resume + Project' },
  { id: '3', name: 'TensorFlow', category: 'AI/ML', level: 'Intermediate', verified: true, confidence: 0.82, source: 'Resume' },
  { id: '4', name: 'React', category: 'Web Dev', level: 'Beginner', verified: false, confidence: 0.65, source: 'Resume' },
  { id: '5', name: 'SQL', category: 'Database', level: 'Intermediate', verified: true, confidence: 0.91, source: 'Challenge Passed' },
  { id: '6', name: 'Arduino', category: 'Electronics', level: 'Expert', verified: true, confidence: 0.94, source: 'Project + Cert' },
  { id: '7', name: 'Data Analysis', category: 'Data Science', level: 'Intermediate', verified: true, confidence: 0.86, source: 'Course Completed' },
  { id: '8', name: 'FastAPI', category: 'Backend', level: 'Beginner', verified: false, confidence: 0.58, source: 'Resume' },
  { id: '9', name: 'Docker', category: 'DevOps', level: 'Beginner', verified: false, confidence: 0.45, source: 'Resume' },
  { id: '10', name: 'NLP', category: 'AI/ML', level: 'Intermediate', verified: true, confidence: 0.78, source: 'Project' },
];

export const mockInternships: Internship[] = [
  {
    id: '1', companyId: 'c1', companyName: 'Google India', companyLogo: '🔵',
    title: 'AI/ML Research Intern', description: 'Work on cutting-edge machine learning models for search optimization.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'NLP'],
    stipendMin: 50000, stipendMax: 80000, durationWeeks: 12,
    location: 'Bangalore', mode: 'Hybrid', totalSeats: 20, filledSeats: 12,
    deadline: '2026-04-15', status: 'Active', matchScore: 94,
    matchBreakdown: {
      skillMatch: 95, projectRelevance: 92, locationFit: 88, experienceMatch: 96, overallScore: 94,
      reasons: ['Your Python skills match 95% of requirements', 'ML project aligns with core research domain', 'TensorFlow expertise directly applicable', 'Strong NLP foundation matches team needs']
    }
  },
  {
    id: '2', companyId: 'c2', companyName: 'Microsoft', companyLogo: '🟢',
    title: 'Data Science Intern', description: 'Analyze large-scale datasets and build predictive models.',
    requiredSkills: ['Python', 'Data Analysis', 'SQL', 'Machine Learning'],
    stipendMin: 45000, stipendMax: 70000, durationWeeks: 10,
    location: 'Hyderabad', mode: 'Onsite', totalSeats: 15, filledSeats: 8,
    deadline: '2026-04-20', status: 'Active', matchScore: 89,
    matchBreakdown: {
      skillMatch: 91, projectRelevance: 85, locationFit: 95, experienceMatch: 84, overallScore: 89,
      reasons: ['SQL and data analysis skills are strong matches', 'Python proficiency exceeds requirements', 'Location preference aligns with Hyderabad office', 'ML background adds bonus value']
    }
  },
  {
    id: '3', companyId: 'c3', companyName: 'Flipkart', companyLogo: '🟡',
    title: 'Full Stack Engineer Intern', description: 'Build scalable e-commerce features with React and Node.js.',
    requiredSkills: ['React', 'Node.js', 'SQL', 'Docker'],
    stipendMin: 40000, stipendMax: 60000, durationWeeks: 8,
    location: 'Bangalore', mode: 'Remote', totalSeats: 25, filledSeats: 18,
    deadline: '2026-03-30', status: 'Active', matchScore: 72,
    matchBreakdown: {
      skillMatch: 68, projectRelevance: 72, locationFit: 100, experienceMatch: 65, overallScore: 72,
      reasons: ['Partial React skills detected — consider upskilling', 'SQL proficiency is a strong match', 'Remote mode fits your preference', 'Missing Node.js and Docker experience']
    }
  },
  {
    id: '4', companyId: 'c4', companyName: 'ISRO', companyLogo: '🚀',
    title: 'Embedded Systems Intern', description: 'Work on satellite communication firmware and IoT protocols.',
    requiredSkills: ['Arduino', 'Python', 'Embedded C', 'IoT'],
    stipendMin: 25000, stipendMax: 35000, durationWeeks: 16,
    location: 'Ahmedabad', mode: 'Onsite', totalSeats: 8, filledSeats: 3,
    deadline: '2026-05-01', status: 'Active', matchScore: 86,
    matchBreakdown: {
      skillMatch: 90, projectRelevance: 88, locationFit: 70, experienceMatch: 85, overallScore: 86,
      reasons: ['Arduino expertise matches perfectly', 'Python skills highly valued', 'ECE branch aligns with embedded domain', 'Missing Embedded C — recommended to learn']
    }
  },
  {
    id: '5', companyId: 'c5', companyName: 'Infosys', companyLogo: '🔷',
    title: 'Cloud Engineering Intern', description: 'Deploy and manage cloud infrastructure on AWS and Azure.',
    requiredSkills: ['Docker', 'AWS', 'Linux', 'Python'],
    stipendMin: 30000, stipendMax: 45000, durationWeeks: 12,
    location: 'Pune', mode: 'Hybrid', totalSeats: 30, filledSeats: 22,
    deadline: '2026-04-10', status: 'Active', matchScore: 61,
    matchBreakdown: {
      skillMatch: 55, projectRelevance: 60, locationFit: 72, experienceMatch: 58, overallScore: 61,
      reasons: ['Python foundation is solid', 'Docker skills are beginner level', 'Missing AWS and Linux experience', 'Hybrid mode partially fits preference']
    }
  },
];

export const mockRewards: RewardTransaction[] = [
  { id: '1', action: 'Profile Completed', points: 20, description: 'Completed student profile setup', createdAt: '2026-03-15', icon: '✅' },
  { id: '2', action: 'Resume Uploaded', points: 20, description: 'Uploaded and parsed resume', createdAt: '2026-03-14', icon: '📄' },
  { id: '3', action: 'Course Completed', points: 50, description: 'Python for Data Science — Coursera', createdAt: '2026-03-12', icon: '🎓' },
  { id: '4', action: 'Challenge Won', points: 200, description: '1st place in SQL Challenge', createdAt: '2026-03-10', icon: '🏆' },
  { id: '5', action: 'Micro Module', points: 15, description: 'SQL Joins — 45 min module', createdAt: '2026-03-08', icon: '⚡' },
  { id: '6', action: 'Skill Added', points: 10, description: 'Added NLP to skill passport', createdAt: '2026-03-06', icon: '🧠' },
  { id: '7', action: 'Application Submitted', points: 10, description: 'Applied to Google AI Intern', createdAt: '2026-03-05', icon: '📨' },
  { id: '8', action: 'Lab Completed', points: 30, description: 'ML Model Lab — 92% accuracy', createdAt: '2026-03-03', icon: '🧪' },
];

export const mockCourses: Course[] = [
  { id: '1', provider: 'Coursera', title: 'Machine Learning Specialization', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0', skillName: 'Machine Learning', durationMins: 480, rewardPoints: 50, status: 'Completed', thumbnail: '🎓' },
  { id: '2', provider: 'Udemy', title: 'Docker for Beginners', url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE', skillName: 'Docker', durationMins: 300, rewardPoints: 50, status: 'In Progress', thumbnail: '🐳' },
  { id: '3', provider: 'NPTEL', title: 'Deep Learning with PyTorch', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', skillName: 'Deep Learning', durationMins: 600, rewardPoints: 50, status: 'Not Started', thumbnail: '🔥' },
  { id: '4', provider: 'Kaggle', title: 'Pandas for Data Analysis', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', skillName: 'Data Analysis', durationMins: 180, rewardPoints: 30, status: 'Completed', thumbnail: '🐼' },
  { id: '5', provider: 'edX', title: 'React Fundamentals', url: 'https://www.youtube.com/watch?v=SqcY0GlETPk', skillName: 'React', durationMins: 360, rewardPoints: 50, status: 'In Progress', thumbnail: '⚛️' },
  { id: '6', provider: 'YouTube', title: 'FastAPI Crash Course', url: 'https://www.youtube.com/watch?v=0RS9W8MtZe4', skillName: 'FastAPI', durationMins: 120, rewardPoints: 20, status: 'Not Started', thumbnail: '🚀' },
];

export const mockChallenges: Challenge[] = [
  { id: '1', title: 'Build a Movie Recommendation System', description: 'Create a content-based recommender using Python', difficulty: 'Medium', rewardPoints: 100, deadline: '2026-03-25', category: 'ML', participants: 342 },
  { id: '2', title: 'Optimize this SQL Query', description: 'Reduce execution time of a complex multi-join query', difficulty: 'Easy', rewardPoints: 30, deadline: '2026-03-22', category: 'SQL', participants: 891 },
  { id: '3', title: 'Deploy a Flask API on Cloud', description: 'Containerize and deploy a REST API', difficulty: 'Hard', rewardPoints: 200, deadline: '2026-04-01', category: 'DevOps', participants: 156 },
  { id: '4', title: 'NLP Sentiment Analyzer', description: 'Build a real-time sentiment analysis tool', difficulty: 'Medium', rewardPoints: 100, deadline: '2026-03-28', category: 'NLP', participants: 267 },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, studentName: 'Priya Patel', college: 'IIT Bombay', points: 2450, level: 'Diamond', avatar: '', badges: ['🏆', '⭐', '🔥'] },
  { rank: 2, studentName: 'Rahul Singh', college: 'IIT Delhi', points: 2280, level: 'Diamond', avatar: '', badges: ['⭐', '🎯'] },
  { rank: 3, studentName: 'Arjun Sharma', college: 'NIT Trichy', points: 2150, level: 'Platinum', avatar: '', badges: ['🧠', '🎓'] },
  { rank: 4, studentName: 'Sneha Kumar', college: 'BITS Pilani', points: 1980, level: 'Platinum', avatar: '', badges: ['🔥'] },
  { rank: 5, studentName: 'Vikram Reddy', college: 'IIT Madras', points: 1850, level: 'Gold', avatar: '', badges: ['⭐'] },
  { rank: 6, studentName: 'Ananya Mishra', college: 'NIT Warangal', points: 1720, level: 'Gold', avatar: '', badges: ['🎯'] },
  { rank: 7, studentName: 'Karthik Nair', college: 'VIT Vellore', points: 1650, level: 'Gold', avatar: '', badges: [] },
  { rank: 8, studentName: 'Divya Joshi', college: 'IIIT Hyderabad', points: 1520, level: 'Silver', avatar: '', badges: ['🧠'] },
  { rank: 9, studentName: 'Aditya Chopra', college: 'DTU Delhi', points: 1480, level: 'Silver', avatar: '', badges: [] },
  { rank: 10, studentName: 'Meera Iyer', college: 'Anna University', points: 1350, level: 'Silver', avatar: '', badges: ['🎓'] },
];

export const mockTalentDNA: TalentDNA = {
  analyticalThinking: 88,
  creativity: 72,
  leadership: 65,
  adaptability: 81,
  communication: 70,
  collaboration: 78,
  problemSolving: 92,
  innovationIndex: 76,
};

export const mockCareerPath: CareerPathStep[] = [
  { semester: 'Year 2 — Sem 1', role: 'Data Analysis Internship', level: 'Entry', skills: ['Python', 'SQL', 'Pandas'], predictedScore: 68 },
  { semester: 'Year 2 — Sem 2', role: 'ML Research Internship', level: 'Entry', skills: ['ML', 'TensorFlow', 'NumPy'], predictedScore: 75 },
  { semester: 'Year 3 — Sem 1', role: 'AI Product Internship', level: 'Mid', skills: ['NLP', 'FastAPI', 'Docker'], predictedScore: 84 },
  { semester: 'Year 3 — Sem 2', role: 'Full-Stack AI Engineer', level: 'Mid', skills: ['React', 'Node.js', 'AWS'], predictedScore: 92 },
];

export const mockCompanyInternships = [
  { id: '1', title: 'AI/ML Research Intern', applications: 156, seats: 20, filled: 12, matchAvg: 87, status: 'Active' as const },
  { id: '2', title: 'Backend Engineer Intern', applications: 234, seats: 15, filled: 15, matchAvg: 82, status: 'Closed' as const },
  { id: '3', title: 'Data Analyst Intern', applications: 89, seats: 10, filled: 4, matchAvg: 79, status: 'Active' as const },
  { id: '4', title: 'DevOps Intern', applications: 45, seats: 5, filled: 2, matchAvg: 74, status: 'Active' as const },
];

export const mockCandidates = [
  { id: '1', name: 'Arjun Sharma', college: 'NIT Trichy', branch: 'ECE', cgpa: 8.2, matchScore: 94, skills: ['Python', 'ML', 'TensorFlow'], status: 'Applied' as const },
  { id: '2', name: 'Priya Patel', college: 'IIT Bombay', branch: 'CSE', cgpa: 9.1, matchScore: 91, skills: ['Python', 'NLP', 'PyTorch'], status: 'Shortlisted' as const },
  { id: '3', name: 'Rahul Singh', college: 'IIT Delhi', branch: 'CSE', cgpa: 8.8, matchScore: 88, skills: ['Python', 'Data Science', 'SQL'], status: 'Applied' as const },
  { id: '4', name: 'Sneha Kumar', college: 'BITS Pilani', branch: 'IT', cgpa: 8.5, matchScore: 85, skills: ['Python', 'ML', 'React'], status: 'Applied' as const },
  { id: '5', name: 'Vikram Reddy', college: 'IIT Madras', branch: 'EE', cgpa: 7.9, matchScore: 82, skills: ['Python', 'Arduino', 'Embedded'], status: 'Rejected' as const },
  { id: '6', name: 'Ananya Mishra', college: 'NIT Warangal', branch: 'CSE', cgpa: 8.7, matchScore: 80, skills: ['React', 'Node.js', 'Docker'], status: 'Applied' as const },
];

export const nationalStats = {
  totalStudents: 312450,
  activeInternships: 10284,
  seatsFilled: 78542,
  matchAccuracy: 94.7,
  companiesRegistered: 4521,
  industries: 52,
  fairnessScore: 87.3,
  ecosystemHealth: 91.2,
};

export const skillShortageData = [
  { skill: 'Cybersecurity', demand: 8500, supply: 2100, gap: 75 },
  { skill: 'MLOps', demand: 6200, supply: 1800, gap: 71 },
  { skill: 'Cloud Architecture', demand: 9100, supply: 3200, gap: 65 },
  { skill: 'Blockchain', demand: 4800, supply: 1900, gap: 60 },
  { skill: 'DevOps', demand: 12000, supply: 5400, gap: 55 },
  { skill: 'Data Engineering', demand: 7800, supply: 3800, gap: 51 },
  { skill: 'AI/ML', demand: 15000, supply: 8200, gap: 45 },
  { skill: 'React/Angular', demand: 18000, supply: 11000, gap: 39 },
];

export interface User {
  id: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  name: string;
  avatar?: string;
  company_name?: string;
  institution?: string;
  department?: string;
}

export interface Student {
  userId: string;
  name: string;
  college: string;
  branch: string;
  year: number;
  cgpa: number;
  location: string;
  bio: string;
  photoUrl: string;
  matchScore: number;
  skillPassportComplete: number;
  totalPoints: number;
  level: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  verified: boolean;
  confidence: number;
  source: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  requiredSkills: string[];
  stipendMin: number;
  stipendMax: number;
  durationWeeks: number;
  location: string;
  mode: 'Remote' | 'Onsite' | 'Hybrid';
  totalSeats: number;
  filledSeats: number;
  deadline: string;
  status: 'Active' | 'Closed' | 'Draft';
  matchScore?: number;
  matchBreakdown?: MatchBreakdown;
}

export interface MatchBreakdown {
  skillMatch: number;
  projectRelevance: number;
  locationFit: number;
  experienceMatch: number;
  overallScore: number;
  reasons: string[];
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  matchScore: number;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Accepted' | 'Allocated';
  appliedAt: string;
}

export interface RewardTransaction {
  id: string;
  action: string;
  points: number;
  description: string;
  createdAt: string;
  icon: string;
}

export interface Course {
  id: string;
  provider: string;
  title: string;
  url: string;
  skillName: string;
  durationMins: number;
  rewardPoints: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  thumbnail: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardPoints: number;
  deadline: string;
  category: string;
  participants: number;
}

export interface Mentor {
  id: string;
  name: string;
  domain: string;
  experienceYears: number;
  bio: string;
  avatar: string;
  rating: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  college: string;
  points: number;
  level: string;
  avatar: string;
  badges: string[];
}

export interface FairnessMetrics {
  genderBias: number;
  regionalEquity: number;
  institutionEquity: number;
  overallFairness: number;
}

export interface NationalStats {
  totalStudents: number;
  activeInternships: number;
  seatsFilled: number;
  matchAccuracy: number;
  companiesRegistered: number;
  industries: number;
}

export interface TalentDNA {
  analyticalThinking: number;
  creativity: number;
  leadership: number;
  adaptability: number;
  communication: number;
  collaboration: number;
  problemSolving: number;
  innovationIndex: number;
}

export interface CareerPathStep {
  semester: string;
  role: string;
  level: string;
  skills: string[];
  predictedScore: number;
}

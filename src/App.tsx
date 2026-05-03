import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

// Student
import StudentDashboard from '@/pages/student/Dashboard';
import ResumeUpload from '@/pages/student/ResumeUpload';
import SkillPassport from '@/pages/student/SkillPassport';
import SkillGapAnalyzer from '@/pages/student/SkillGapAnalyzer';
import InternshipMatches from '@/pages/student/InternshipMatches';
import LearningHub from '@/pages/student/LearningHub';
import Rewards from '@/pages/student/Rewards';
import CareerPathway from '@/pages/student/CareerPathway';
import TalentDNA from '@/pages/student/TalentDNA';
import Chatbot from '@/pages/student/Chatbot';

// Company
import CompanyDashboard from '@/pages/company/Dashboard';
import PostInternship from '@/pages/company/PostInternship';
import Candidates from '@/pages/company/Candidates';
import CompanyAnalytics from '@/pages/company/Analytics';

// Admin
import AdminDashboard from '@/pages/admin/Dashboard';
import FairnessMonitor from '@/pages/admin/FairnessMonitor';
import SkillRadar from '@/pages/admin/SkillRadar';
import PolicySimulator from '@/pages/admin/PolicySimulator';
import MatchingEngine from '@/pages/admin/MatchingEngine'; // Moved to Admin

import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Portal */}
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/resume" element={<ResumeUpload />} />
          <Route path="/student/skill-passport" element={<SkillPassport />} />
          <Route path="/student/skill-gap" element={<SkillGapAnalyzer />} />
          <Route path="/student/matches" element={<InternshipMatches />} />
          <Route path="/student/learning-hub" element={<LearningHub />} />
          <Route path="/student/rewards" element={<Rewards />} />
          <Route path="/student/career-path" element={<CareerPathway />} />
          <Route path="/student/talent-dna" element={<TalentDNA />} />
          <Route path="/student/chatbot" element={<Chatbot />} />
        </Route>

        {/* Company Portal */}
        <Route element={<DashboardLayout />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/post" element={<PostInternship />} />
          <Route path="/company/candidates" element={<Candidates />} />
          <Route path="/company/analytics" element={<CompanyAnalytics />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/fairness" element={<FairnessMonitor />} />
          <Route path="/admin/skill-radar" element={<SkillRadar />} />
          <Route path="/admin/policy-simulator" element={<PolicySimulator />} />
          <Route path="/admin/matching" element={<MatchingEngine />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2332',
            color: '#F9FAFB',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </BrowserRouter>
  );
}

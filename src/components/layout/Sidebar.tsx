import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Shield, Search, BookOpen, Trophy,
  Map, Dna, Upload, Users, BarChart3, Building2, PlusCircle,
  UserCheck, LineChart, Globe, Activity, AlertTriangle, Zap,
  ChevronLeft, ChevronRight, LogOut, Sparkles, Brain, Database, MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/resume', label: 'Resume Intelligence', icon: Upload },
  { path: '/student/skill-passport', label: 'Skill Passport', icon: Shield },
  { path: '/student/skill-gap', label: 'Skill Gap Analyzer', icon: Search },
  { path: '/student/matches', label: 'AI Matches', icon: Sparkles },
  { path: '/student/learning-hub', label: 'Learning Hub', icon: BookOpen },
  { path: '/student/rewards', label: 'Rewards & Rank', icon: Trophy },
  { path: '/student/career-path', label: 'Career Pathway', icon: Map },
  { path: '/student/talent-dna', label: 'Talent DNA', icon: Dna },
  { path: '/student/chatbot', label: 'AI Chatbot', icon: MessageSquare },
];

const companyNav = [
  { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/company/post', label: 'Post Internship', icon: PlusCircle },
  { path: '/company/candidates', label: 'AI Candidates', icon: UserCheck },
  { path: '/company/analytics', label: 'Analytics', icon: LineChart },
];

const adminNav = [
  { path: '/admin/dashboard', label: 'National Dashboard', icon: Globe },
  { path: '/admin/fairness', label: 'Fairness Monitor', icon: Activity },
  { path: '/admin/skill-radar', label: 'Skill Shortage', icon: AlertTriangle },
  { path: '/admin/policy-simulator', label: 'Policy Simulator', icon: Zap },
  { path: '/admin/matching', label: 'AI Allocation Hub', icon: Database },
];

export default function Sidebar() {
  const { user, logout, sidebarCollapsed, setSidebarCollapsed } = useAuthStore();
  const navigate = useNavigate();

  const navItems = user?.role === 'company' ? companyNav
    : user?.role === 'admin' ? adminNav
    : studentNav;

  const roleLabel = user?.role === 'company' ? 'Company Portal'
    : user?.role === 'admin' ? 'Admin Portal'
    : 'Student Portal';

  const roleIcon = user?.role === 'company' ? Building2
    : user?.role === 'admin' ? Users
    : BarChart3;

  const RoleIcon = roleIcon;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-[260px]'}`}
      style={{
        background: 'linear-gradient(180deg, #0d1526 0%, #0A0F1E 100%)',
        borderRight: '1px solid rgba(59, 130, 246, 0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-500/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain size={22} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-bold text-white leading-tight">InternMatch</h1>
              <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">AI Engine</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role badge */}
      <div className="px-3 py-3">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${sidebarCollapsed ? 'justify-center' : ''}`}
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <RoleIcon size={16} className="text-blue-400 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-xs font-semibold text-blue-300">{roleLabel}</span>}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              } ${sidebarCollapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full"
                  />
                )}
                <item.icon size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-blue-500/20">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2 border-t border-blue-500/10 pt-3">
        {/* User info */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}

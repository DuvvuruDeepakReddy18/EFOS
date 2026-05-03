import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Building2, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const roles = [
  { id: 'student' as const, label: 'Student', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
  { id: 'company' as const, label: 'Company', icon: Building2, color: 'from-purple-500 to-pink-500' },
  { id: 'admin' as const, label: 'Admin', icon: Shield, color: 'from-amber-500 to-orange-500' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | 'admin'>('student');
  const { loginAsync, switchRole, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs — no empty fields allowed
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    // Authenticate against Supabase
    const { success, error } = await loginAsync(email.trim(), password);
    if (success) {
      switchRole(selectedRole);
      toast.success(`Welcome back! Logged in as ${selectedRole}`);
      const paths: Record<string, string> = { student: '/student/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' };
      navigate(paths[selectedRole]);
    } else {
      toast.error(error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary grid-bg flex items-center justify-center p-6 relative overflow-y-auto">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 shrink-0 py-12"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={26} className="text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white">InternMatch</span>
              <span className="text-2xl font-bold text-blue-400 ml-1">AI</span>
            </div>
          </Link>
          <p className="text-sm text-gray-400">Sign in to your account</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                selectedRole === role.id
                  ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mx-auto mb-2`}>
                <role.icon size={16} className="text-white" />
              </div>
              <p className={`text-xs font-semibold ${selectedRole === role.id ? 'text-white' : 'text-gray-400'}`}>{role.label}</p>
            </button>
          ))}
        </div>

        {/* Login form */}
        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="glow-btn w-full flex items-center justify-center gap-2 !py-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? 'Signing in...' : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          EFOS Hackathon • Black Squad • PM Internship Scheme
        </p>
      </motion.div>
    </div>
  );
}

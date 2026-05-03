import { create } from 'zustand';
import type { User } from '@/types';
import { loginUser, signUpUser } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  isLoading: boolean;

  /** Login against Supabase user_profiles table */
  login: (email: string, password: string) => void;

  /** Sign up and write a new row to Supabase */
  signup: (data: {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'company' | 'admin';
    institution?: string;
    department?: string;
  }) => Promise<{ success: boolean; error: string | null }>;

  logout: () => void;
  switchRole: (role: 'student' | 'company' | 'admin') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /** Async Supabase login with error handling */
  loginAsync: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
}

// Keep demo users as fallback for offline / quick-demo usage
const demoUsers: Record<string, User> = {
  'student@demo.com': { id: 's1', email: 'student@demo.com', role: 'student', name: 'Arjun Sharma', avatar: '' },
  'company@demo.com': { id: 'c1', email: 'company@demo.com', role: 'company', name: 'TechCorp India', avatar: '' },
  'admin@demo.com': { id: 'a1', email: 'admin@demo.com', role: 'admin', name: 'Admin User', avatar: '' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  isLoading: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Synchronous fallback login (for quick demo buttons)
  login: (email: string, _password: string) => {
    const user = demoUsers[email];
    if (user) {
      set({ user, isAuthenticated: true });
      return;
    }
    set({
      user: { id: 'demo', email, role: 'student', name: email.split('@')[0], avatar: '' },
      isAuthenticated: true,
    });
  },

  // Async login that talks to Supabase
  loginAsync: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user: dbUser, error } = await loginUser(email, password);
      if (error || !dbUser) {
        set({ isLoading: false });
        return { success: false, error: error || 'Invalid email or password' };
      }
      set({
        user: {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          name: dbUser.name,
          avatar: dbUser.avatar_url || '',
          company_name: dbUser.company_name,
          institution: dbUser.institution,
          department: dbUser.department,
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, error: null };
    } catch {
      set({ isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Sign up: writes to Supabase
  signup: async (data) => {
    set({ isLoading: true });
    try {
      const { user: dbUser, error } = await signUpUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        institution: data.institution,
        department: data.department,
      });
      if (error || !dbUser) {
        set({ isLoading: false });
        return { success: false, error: error || 'Signup failed' };
      }
      set({
        user: {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          name: dbUser.name,
          avatar: dbUser.avatar_url || '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, error: null };
    } catch {
      set({ isLoading: false });
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  switchRole: (role) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, role } };
    });
  },
}));

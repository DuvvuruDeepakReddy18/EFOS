import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irqtxxeymkamuwketglk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycXR4eGV5bWthbXV3a2V0Z2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg4MTQsImV4cCI6MjA4OTMxNDgxNH0.UXBpl8kTALL294gOdWUjp40I4gyvbc71dUp2ZvOlMWQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- User Profile Service ----

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'company' | 'admin';
  institution?: string;
  department?: string;
  year_of_study?: string;
  cgpa?: number;
  company_name?: string;
  company_domain?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/** Sign up a new user and write credentials to Supabase */
export async function signUpUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'company' | 'admin';
  institution?: string;
  department?: string;
  year_of_study?: string;
  cgpa?: number;
  company_name?: string;
  company_domain?: string;
}): Promise<{ user: UserProfile | null; error: string | null }> {
  // Check if user already exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existing) {
    return { user: null, error: 'An account with this email already exists.' };
  }

  const { data: newUser, error } = await supabase
    .from('user_profiles')
    .insert([{
      email: data.email,
      password_hash: data.password, // In production, hash before storing
      name: data.name,
      role: data.role,
      institution: data.institution,
      department: data.department,
      year_of_study: data.year_of_study,
      cgpa: data.cgpa,
      company_name: data.company_name,
      company_domain: data.company_domain,
    }])
    .select()
    .single();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: newUser as UserProfile, error: null };
}

/** Log in an existing user by verifying credentials against Supabase */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  if (error || !user) {
    return { user: null, error: 'Invalid email or password.' };
  }

  return { user: user as UserProfile, error: null };
}

/** Fetch all registered users (admin use) */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as UserProfile[];
}

/** Update a user profile */
export async function updateUserProfile(
  id: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ---- Internship Service ----

export interface Internship {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  description: string;
  location: string;
  mode: string;
  min_stipend: number;
  max_stipend: number;
  duration_weeks: number;
  total_seats: number;
  required_skills: string[];
  created_at: string;
}

/** Create a new internship posting */
export async function createInternship(
  data: Omit<Internship, 'id' | 'created_at'>
): Promise<{ internship: Internship | null; error: string | null }> {
  const { data: newInternship, error } = await supabase
    .from('internships')
    .insert([data])
    .select()
    .single();

  if (error) {
    return { internship: null, error: error.message };
  }

  return { internship: newInternship as Internship, error: null };
}

/** Fetch all internships */
export async function fetchInternships(): Promise<Internship[]> {
  const { data, error } = await supabase
    .from('internships')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Internship[];
}

// ---- Application Service ----

export interface Application {
  id: string;
  student_id: string;
  company_id: string;
  internship_id: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Accepted' | 'Allocated';
  created_at: string;
}

/** Check if a student has already applied for an internship */
export async function checkApplicationStatus(
  studentId: string,
  internshipId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('student_id', studentId)
    .eq('internship_id', internshipId)
    .single();

  if (error || !data) return false;
  return true;
}

/** Apply for an internship */
export async function applyForInternship(
  studentId: string,
  companyId: string,
  internshipId: string
): Promise<{ success: boolean; error: string | null }> {
  // First verify they haven't already applied
  const hasApplied = await checkApplicationStatus(studentId, internshipId);
  if (hasApplied) {
    return { success: false, error: 'You have already applied for this role.' };
  }

  const { error } = await supabase
    .from('applications')
    .insert([{
      student_id: studentId,
      company_id: companyId,
      internship_id: internshipId,
      status: 'Applied'
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

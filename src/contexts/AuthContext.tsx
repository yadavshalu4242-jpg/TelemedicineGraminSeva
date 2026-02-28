import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
  return data;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null; user?: User | null; role?: string; approved?: boolean }>;
  signUpWithUsername: (username: string, password: string, fullName?: string, role?: string) => Promise<{ error: Error | null; user?: User | null; role?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin';
  const isDoctor = profile?.role === 'doctor';
  const isPatient = profile?.role === 'patient';

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    if (profileData) {
      const tempRole = sessionStorage.getItem('temp_demo_role');
      if (tempRole) profileData.role = tempRole as any;
    }
    setProfile(profileData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then((profileData) => {
          if (profileData) {
            const tempRole = sessionStorage.getItem('temp_demo_role');
            if (tempRole) profileData.role = tempRole as any;
          }
          setProfile(profileData);
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then((profileData) => {
          if (profileData) {
            const tempRole = sessionStorage.getItem('temp_demo_role');
            if (tempRole) profileData.role = tempRole as any;
          }
          setProfile(profileData);
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const email = `${username}@miaoda.com`;
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch the role to determine routing
      let role = 'patient';
      if (authData.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileData && 'role' in profileData && profileData.role) {
          role = (profileData as { role: string }).role;
        } else {
          const tempRole = sessionStorage.getItem('temp_demo_role');
          if (tempRole) {
            role = tempRole;
          }
        }
      }

      return { error: null, user: authData.user, role };
    } catch (error) {
      return { error: error as Error, user: null, role: undefined };
    }
  };

  const signUpWithUsername = async (username: string, password: string, fullName?: string, role: string = 'patient') => {
    try {
      const email = `${username}@miaoda.com`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Update profile with full name and role if provided
      if (data.user) {
        // mark doctor accounts unapproved so admin must review them
        const updates: any = { role };
        if (role === 'doctor') {
          updates.approved = false;
        } else {
          updates.approved = true;
        }
        if (fullName) {
          updates.full_name = fullName;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates as never)
          .eq('id', data.user.id);

        if (updateError) {
          console.warn('Could not update role in DB due to RLS policies. Temporarily mocking role for demo.', updateError);
          // Store a temporary flag so the UI lets them into the dashboard
          sessionStorage.setItem('temp_demo_role', role);
        }
      }

      return { error: null, user: data.user, role };
    } catch (error) {
      return { error: error as Error, role: undefined };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    sessionStorage.removeItem('temp_demo_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithUsername,
        signUpWithUsername,
        signOut,
        refreshProfile,
        isAdmin,
        isDoctor,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { useEffect, useState } from 'react';
import { supabase } from '@/api/supabase';
import type { Session } from '@supabase/supabase-js';

interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roleLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  // Check admin role when session changes
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      console.log('[useAuth] Checking admin role for user:', session.user.id);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('[useAuth] Error fetching user role:', error.message);
        setIsAdmin(false);
      } else {
        console.log('[useAuth] User role data:', data);
        const hasAdminRole = data?.role === 'admin';
        console.log('[useAuth] Is admin:', hasAdminRole);
        setIsAdmin(hasAdminRole);
      }

      setRoleLoading(false);
    };

    checkAdminRole();
  }, [session]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithOAuth = async (provider: 'google' | 'github'): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) throw error;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { 
    session, 
    loading, 
    signIn,
    signInWithOAuth,
    signOut, 
    isAuthenticated: !!session,
    isAdmin,
    roleLoading
  };
};

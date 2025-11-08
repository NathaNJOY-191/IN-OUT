import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { Profile, SessionUser } from '../lib/types';

interface AuthContextType {
  user: SessionUser | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.auth
      .me()
      .then((res: any) => {
        setUser(res.user || null);
        if (res.user) fetchProfile(res.user.id);
      })
      .catch(() => setLoading(false));

    // no live subscription - token persists until signout
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await api.auth.me();
      setProfile(res.profile || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const res: any = await api.auth.signup(email, password, fullName);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setProfile(res.profile || null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const res: any = await api.auth.signin(email, password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      setProfile(res.profile || null);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    await api.auth.signout();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
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

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAnonymousUserId } from '@/lib/cookies';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  isAnonymous: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // For now, we'll just use anonymous users
    const anonymousId = getAnonymousUserId();
    setUser({
      id: anonymousId,
      isAnonymous: true,
    });
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // This is a placeholder for future implementation
    throw new Error('Sign in not implemented yet');
  };

  const signOut = async () => {
    // Clear the anonymous user cookie
    document.cookie = 'anonymous_user_id=; path=/; max-age=0';
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
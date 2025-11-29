import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';
import { User, UserRole } from '@/types/database';

interface AuthContextType {
  session: string | null; // JWT token
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    role: UserRole;
    name: string;
    phone: string;
    city: string;
    gender?: string;
    cni?: string;
  }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null); // Stores JWT token
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwt_token');
        if (storedToken) {
          setSession(storedToken);
          await fetchUser(storedToken);
        }
      } catch (error) {
        console.error('Error loading session from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: {
      role: UserRole;
      name: string;
      phone: string;
      city: string;
      gender?: string;
      cni?: string;
    }
  ) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        ...userData,
      });

      const { token, user: newUser } = response.data;
      await AsyncStorage.setItem('jwt_token', token);
      setSession(token);
      setUser(newUser);
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      return { error: new Error(error.response?.data?.error || 'Signup failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user: loggedInUser } = response.data;
      await AsyncStorage.setItem('jwt_token', token);
      setSession(token);
      setUser(loggedInUser);
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error.response?.data || error.message);
      return { error: new Error(error.response?.data?.error || 'Login failed') };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    if (session) {
      await fetchUser(session);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        refreshUser,
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

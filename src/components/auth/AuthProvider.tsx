import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  community?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, community?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('wasteManager_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would call your API
      const users = JSON.parse(localStorage.getItem('wasteManager_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userProfile = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          community: foundUser.community
        };
        setUser(userProfile);
        localStorage.setItem('wasteManager_user', JSON.stringify(userProfile));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, community?: string): Promise<boolean> => {
    try {
      // Mock registration - in real app, this would call your API
      const users = JSON.parse(localStorage.getItem('wasteManager_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        community: community || 'EcoVille'
      };

      users.push(newUser);
      localStorage.setItem('wasteManager_users', JSON.stringify(users));

      const userProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        community: newUser.community
      };
      
      setUser(userProfile);
      localStorage.setItem('wasteManager_user', JSON.stringify(userProfile));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wasteManager_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
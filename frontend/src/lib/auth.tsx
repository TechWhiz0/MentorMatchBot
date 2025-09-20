import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "./api";

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: "mentor" | "mentee";
  industries: string[];
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const { user: currentUser, profile: currentProfile } =
        await api.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile || null);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      api.logout();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, profile: userProfile } = await api.login(
      email,
      password
    );
    setUser(loggedInUser);
    setProfile(userProfile || null);
  };

  const register = async (email: string, password: string) => {
    const { user: registeredUser } = await api.register(email, password);
    setUser(registeredUser);
    setProfile(null);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

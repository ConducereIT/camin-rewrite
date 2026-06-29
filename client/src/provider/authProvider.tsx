import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// Pulling all entity types and option contracts directly from the library
import type { Session, User } from "better-auth";
import { authClient } from "../lib/auth";

// Explicit typed structures for client interactions as specified by the registry
interface EmailSignInOptions {
  email: string;
  password?: string;
  callbackURL?: string;
  rememberMe?: boolean;
}

interface EmailSignUpOptions {
  name: string;
  email: string;
  password: string;
  image?: string;
  callbackURL?: string;
}

interface SocialSignInOptions {
  provider:
    | "google"
    | "github"
    | "discord"
    | "facebook"
    | "apple"
    | "microsoftpx"
    | string;
  callbackURL?: string;
  errorCallbackURL?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  loginWithEmail: (options: EmailSignInOptions) => Promise<void>;
  loginWithSocial: (options: SocialSignInOptions) => Promise<void>;
  signUpWithEmail: (option: EmailSignUpOptions) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.getSession();
      console.log(data);
      if (error || !data) {
        setUser(null);
        setSession(null);
      } else {
        setUser(data.user as User);
        setSession(data.session as Session);
      }
    } catch (err) {
      console.error("Error fetching BetterAuth session:", err);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const loginWithEmail = async (options: EmailSignInOptions) => {
    setIsLoading(true);
    try {
      // Passes typed params directly to matching client endpoints
      const { error } = await authClient.signIn.email(options);
      if (error) {
        throw error;
      }
      await refreshSession();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const signUpWithEmail = async (options: EmailSignUpOptions) => {
    setIsLoading(true);
    try {
      // Passes typed params directly to matching client endpoints
      const { error } = await authClient.signUp.email(options);
      if (error) {
        throw error;
      }
      await refreshSession();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const loginWithSocial = async (options: SocialSignInOptions) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.social(options);
      if (error) {
        throw error;
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    refreshSession,
    loginWithEmail,
    signUpWithEmail,
    loginWithSocial,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

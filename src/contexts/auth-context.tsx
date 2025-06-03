
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  fetchUsers, 
  authenticateUser, 
  createUser, 
  updateUserWallets as baserowUpdateUserWallets,
  updateUserTier as baserowUpdateUserTier,
  User,
  UserWallet
} from "@/utils/baserow-api";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserWallets: (userId: string, wallets: UserWallet[]) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
  updateUserTier: (userId: string, tier: number) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin account details
const ADMIN_CREDENTIALS = {
  email: 'admin@admin.com',
  password: 'admin'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("secure_trade_forge_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("secure_trade_forge_user");
      }
    }
    setIsLoading(false);

    // Ensure admin account exists
    ensureAdminAccount();
  }, []);

  // Ensure admin account exists in Baserow
  const ensureAdminAccount = async () => {
    try {
      const users = await fetchUsers();
      const adminExists = users.some(user => user.email === ADMIN_CREDENTIALS.email);
      
      if (!adminExists) {
        console.log("Creating admin account in Baserow");
        await createUser({
          username: 'Admin',
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
          role: 'Admin',
          tier: '12'
        });
      }
    } catch (error) {
      console.error("Failed to check/create admin account:", error);
    }
  };

  const getUsers = async () => {
    try {
      return await fetchUsers();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };

  const updateUserWallets = async (userId: string, wallets: UserWallet[]): Promise<boolean> => {
    try {
      const success = await baserowUpdateUserWallets(userId, wallets);
      
      // If the current user's wallets are being updated, update the local state too
      if (success && user && user.id === userId) {
        const updatedUser = { ...user, wallets };
        setUser(updatedUser);
        localStorage.setItem("secure_trade_forge_user", JSON.stringify(updatedUser));
        toast.success("Wallet updated successfully");
      }
      
      return success;
    } catch (error) {
      console.error("Failed to update user wallets:", error);
      toast.error("Failed to update wallet");
      return false;
    }
  };

  const updateUserTier = async (userId: string, tier: number): Promise<boolean> => {
    try {
      const success = await baserowUpdateUserTier(userId, tier);
      
      // If the current user's tier is being updated, update the local state too
      if (success && user && user.id === userId) {
        const updatedUser = { ...user, tier };
        setUser(updatedUser);
        localStorage.setItem("secure_trade_forge_user", JSON.stringify(updatedUser));
        toast.success("User tier updated successfully");
      }
      
      return success;
    } catch (error) {
      console.error("Failed to update user tier:", error);
      toast.error("Failed to update user tier");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authenticateUser(email, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem("secure_trade_forge_user", JSON.stringify(authenticatedUser));
        
        toast.success(`Welcome back, ${authenticatedUser.username}!`);
        
        // Determine where to redirect based on user type
        if (authenticatedUser.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const users = await fetchUsers();
      if (users.find((u: User) => u.email === email)) {
        toast.error("User already exists!");
        return false;
      }

      // Create new user with welcome bonus
      const newUser = await createUser({
        email,
        username,
        password,
        role: email.includes('admin') ? 'Admin' : 'User',
        tier: '1'
      });

      // Show welcome message with bonus notification
      toast.success(`Welcome ${username}! You have received a welcome bonus of $100. Kindly top up your account to start earning.`);
      
      setUser(newUser);
      localStorage.setItem("secure_trade_forge_user", JSON.stringify(newUser));
      
      if (newUser.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("secure_trade_forge_user");
    toast.success("You've been logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateUserWallets,
      updateUserTier,
      getUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { UserWallet };

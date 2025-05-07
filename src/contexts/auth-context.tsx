
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { JSONBIN_CONFIG, fetchFromJsonBin, updateJsonBin } from "@/utils/jsonbin-api";

// Define user type
type User = {
  user_id: string;
  email: string;
  username?: string;
  auth_provider: string;
  account_status: string;
  wallets?: UserWallet[];
  isAdmin?: boolean;
  role?: string;
};

export type UserWallet = {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserWallets: (userId: string, wallets: UserWallet[]) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample wallet data for new users with $100 bonus in USDC
const DEFAULT_WALLETS = [
  { id: "1", name: 'Bitcoin', symbol: 'BTC', balance: 0, value: 0, change: 1.8 },
  { id: "2", name: 'Ethereum', symbol: 'ETH', balance: 0, value: 0, change: -0.5 },
  { id: "3", name: 'USD Coin', symbol: 'USDC', balance: 100, value: 100, change: 0 },
];

// Admin account details
const ADMIN_ACCOUNT = {
  user_id: 'admin_001',
  email: 'admin@admin.com',
  username: 'Admin',
  auth_provider: 'local',
  password: 'admin',
  account_status: 'active',
  role: 'admin',
  isAdmin: true,
  wallets: [
    { id: "1", name: 'Bitcoin', symbol: 'BTC', balance: 10.0, value: 608000, change: 1.8 },
    { id: "2", name: 'Ethereum', symbol: 'ETH', balance: 100.0, value: 206000, change: -0.5 },
    { id: "3", name: 'USD Coin', symbol: 'USDC', balance: 500000, value: 500000, change: 0 },
  ]
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("universal_trade_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("universal_trade_user");
      }
    }
    setIsLoading(false);

    // Check if admin account exists, if not create it
    ensureAdminAccount();
  }, []);

  // Ensure admin account exists
  const ensureAdminAccount = async () => {
    try {
      const users = await getUsers();
      const adminExists = users.some(user => user.email === ADMIN_ACCOUNT.email);
      
      if (!adminExists) {
        console.log("Creating admin account");
        users.push(ADMIN_ACCOUNT);
        await updateUsers(users);
      }
    } catch (error) {
      console.error("Failed to check/create admin account:", error);
    }
  };

  async function getUsers() {
    try {
      const res = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.USERS);
      return res.record || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  }

  async function updateUsers(users: User[]) {
    try {
      await updateJsonBin(JSONBIN_CONFIG.BINS.USERS, users);
      return true;
    } catch (error) {
      console.error("Failed to update users:", error);
      return false;
    }
  }

  // Create a welcome notification for a new user
  const createWelcomeNotification = async (userId: string, username: string) => {
    try {
      const notifRes = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.NOTIFICATIONS);
      const notifications = Array.isArray(notifRes.record) ? notifRes.record : [];
      
      // Create welcome notification
      const welcomeNotification = {
        id: `welcome_${userId}_${Date.now()}`,
        title: "Welcome to Secure Trade!",
        message: `Welcome ${username}! You have just received a welcome bonus of $100. Kindly top up your account to start earning.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "personal",
        recipientId: userId
      };
      
      // Add notification to the list
      notifications.push(welcomeNotification);
      await updateJsonBin(JSONBIN_CONFIG.BINS.NOTIFICATIONS, notifications);
      
      console.log("Welcome notification created for user:", userId);
    } catch (error) {
      console.error("Failed to create welcome notification:", error);
    }
  };

  const updateUserWallets = async (userId: string, wallets: UserWallet[]): Promise<boolean> => {
    try {
      const users = await getUsers();
      const userIndex = users.findIndex(u => u.user_id === userId);
      
      if (userIndex === -1) {
        toast.error("User not found");
        return false;
      }
      
      users[userIndex].wallets = wallets;
      const success = await updateUsers(users);
      
      // If the current user's wallets are being updated, update the local state too
      if (success && user && user.user_id === userId) {
        const updatedUser = { ...user, wallets };
        setUser(updatedUser);
        localStorage.setItem("universal_trade_user", JSON.stringify(updatedUser));
        toast.success("Wallet updated successfully");
      }
      
      return success;
    } catch (error) {
      console.error("Failed to update user wallets:", error);
      toast.error("Failed to update wallet");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const users = await getUsers();
      const user = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );

      if (user) {
        // Determine if user is admin
        const isAdmin = user.role === 'admin' || user.isAdmin || email === ADMIN_ACCOUNT.email;
        
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = user;
        
        // Make sure the user has wallets
        const userWithWallets = {
          ...userWithoutPassword,
          wallets: user.wallets || DEFAULT_WALLETS,
          isAdmin
        } as User;
        
        setUser(userWithWallets);
        localStorage.setItem("universal_trade_user", JSON.stringify(userWithWallets));
        
        toast.success(`Welcome back, ${user.username || user.email}!`);
        
        // Determine where to redirect based on user type
        if (isAdmin) {
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
      const users = await getUsers();

      if (users.find((u: User) => u.email === email)) {
        toast.error("User already exists!");
        return false;
      }

      // Create new user with default wallets (including $100 bonus in USDC)
      const userId = 'user_' + Math.floor(Math.random() * 999999);
      const newUser = {
        user_id: userId,
        email,
        username,
        auth_provider: 'local',
        password,
        account_status: 'active',
        role: email.includes('admin') ? 'admin' : 'user',
        wallets: DEFAULT_WALLETS,
        isAdmin: email.includes('admin')
      };

      users.push(newUser);
      const success = await updateUsers(users);

      if (success) {
        // Create welcome notification
        await createWelcomeNotification(userId, username);
        
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = newUser;
        toast.success("Registration successful! Logging you in...");
        setUser(userWithoutPassword as User);
        localStorage.setItem("universal_trade_user", JSON.stringify(userWithoutPassword));
        
        // Show welcome message with bonus info
        toast.success(`Welcome ${username}! You've received a $100 bonus.`);
        
        if (userWithoutPassword.isAdmin || userWithoutPassword.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        return true;
      } else {
        toast.error("Registration failed. Please try again.");
        return false;
      }
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
    localStorage.removeItem("universal_trade_user");
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

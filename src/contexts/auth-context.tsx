
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user type
type User = {
  user_id: string;
  email: string;
  username?: string;
  auth_provider: string;
  account_status: string;
  wallets?: UserWallet[];
  isAdmin?: boolean;
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

// JSONBin constants
const BIN_ID = '681568f78a456b79669672dc';
const MASTER_KEY = '$2a$10$a93Wz14f/5DUCwACUbuF6eLnVRO4UhHPzsOg38B1qo9ikgHYFHRtG';

// Sample wallet data for new users
const DEFAULT_WALLETS = [
  { id: "1", name: 'Bitcoin', symbol: 'BTC', balance: 0.25, value: 15230.50, change: 1.8 },
  { id: "2", name: 'Ethereum', symbol: 'ETH', balance: 2.0, value: 4120.75, change: -0.5 },
  { id: "3", name: 'USD Coin', symbol: 'USDC', balance: 1000, value: 1000, change: 0 },
];

// Admin account details
const ADMIN_ACCOUNT = {
  user_id: 'admin_001',
  email: 'admin@admin.com',
  username: 'Admin',
  auth_provider: 'local',
  password: 'admin',
  account_status: 'active',
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
    const storedUser = localStorage.getItem("blockbridge_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("blockbridge_user");
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
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': MASTER_KEY
        }
      });
      const data = await res.json();
      return data.record.users || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  }

  async function updateUsers(users: User[]) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY,
          'X-Bin-Private': 'true'
        },
        body: JSON.stringify({ users })
      });
      return true;
    } catch (error) {
      console.error("Failed to update users:", error);
      return false;
    }
  }

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
        localStorage.setItem("blockbridge_user", JSON.stringify(updatedUser));
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
        const isAdmin = user.isAdmin || email === ADMIN_ACCOUNT.email;
        
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = user;
        
        // Make sure the user has wallets
        const userWithWallets = {
          ...userWithoutPassword,
          wallets: user.wallets || DEFAULT_WALLETS,
          isAdmin
        } as User;
        
        setUser(userWithWallets);
        localStorage.setItem("blockbridge_user", JSON.stringify(userWithWallets));
        
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

      // Create new user with default wallets
      const newUser = {
        user_id: 'local_' + Math.floor(Math.random() * 999999),
        email,
        username,
        auth_provider: 'local',
        password,
        account_status: 'active',
        wallets: DEFAULT_WALLETS,
        isAdmin: email.includes('admin')
      };

      users.push(newUser);
      const success = await updateUsers(users);

      if (success) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = newUser;
        toast.success("Registration successful! Logging you in...");
        setUser(userWithoutPassword as User);
        localStorage.setItem("blockbridge_user", JSON.stringify(userWithoutPassword));
        
        if (userWithoutPassword.isAdmin) {
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
    localStorage.removeItem("blockbridge_user");
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

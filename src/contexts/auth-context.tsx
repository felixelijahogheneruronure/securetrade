
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
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JSONBin constants
const BIN_ID = '681568f78a456b79669672dc';
const MASTER_KEY = '$2a$10$a93Wz14f/5DUCwACUbuF6eLnVRO4UhHPzsOg38B1qo9ikgHYFHRtG';

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
  }, []);

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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const users = await getUsers();
      const user = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );

      if (user) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword as User);
        localStorage.setItem("blockbridge_user", JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${user.username || user.email}!`);
        
        // Determine where to redirect based on user type
        if (email.includes('admin')) {
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

      const newUser = {
        user_id: 'local_' + Math.floor(Math.random() * 999999),
        email,
        username,
        auth_provider: 'local',
        password,
        account_status: 'active'
      };

      users.push(newUser);
      const success = await updateUsers(users);

      if (success) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = newUser;
        toast.success("Registration successful! Logging you in...");
        setUser(userWithoutPassword as User);
        localStorage.setItem("blockbridge_user", JSON.stringify(userWithoutPassword));
        navigate("/dashboard");
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

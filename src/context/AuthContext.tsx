
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types
export type UserRole = "owner" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  coffeeshopName: string;
  coffeeshopId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    coffeeshopName: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock demo users
const demoUsers = [
  {
    id: "1",
    name: "Александр Владелец",
    email: "owner@example.com",
    password: "password123",
    role: "owner" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=11",
    coffeeshopName: "Кофейня 'Аромат'",
    coffeeshopId: "coffee-1",
  },
  {
    id: "2",
    name: "Мария Сотрудник",
    email: "employee@example.com",
    password: "password123",
    role: "employee" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=5",
    coffeeshopName: "Кофейня 'Аромат'",
    coffeeshopId: "coffee-1",
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("coffeeAppUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = demoUsers.find(
        u => u.email === email && u.password === password
      );

      if (!matchedUser) {
        throw new Error("Неверный email или пароль");
      }

      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem("coffeeAppUser", JSON.stringify(userWithoutPassword));
      
      // Navigate to appropriate dashboard
      if (userWithoutPassword.role === "owner") {
        navigate("/dashboard");
      } else {
        navigate("/employee-dashboard");
      }
      
      toast.success("Добро пожаловать!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка входа");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    coffeeshopName: string
  ) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const existingUser = demoUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует");
      }

      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
        coffeeshopName,
        coffeeshopId: `coffee-${Date.now()}`,
      };
      
      setUser(newUser);
      localStorage.setItem("coffeeAppUser", JSON.stringify(newUser));
      
      // Navigate to appropriate dashboard
      if (role === "owner") {
        navigate("/dashboard");
      } else {
        navigate("/employee-dashboard");
      }
      
      toast.success("Регистрация успешна!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка регистрации");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("coffeeAppUser");
    navigate("/login");
    toast.success("Вы вышли из системы");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

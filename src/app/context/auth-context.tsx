"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../lib/api-url";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    
    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const login = async (usernameInput: string, password: string): Promise<boolean> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usernameInput, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      const returnedUsername = data.username || usernameInput;
      localStorage.setItem("username", returnedUsername);
      setUsername(returnedUsername);
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (usernameInput: string, email: string, password: string): Promise<boolean> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username: usernameInput, 
          email,
          password 
        })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Store token in localStorage if returned immediately
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", usernameInput);
        setUsername(usernameInput);
        setIsAuthenticated(true);
        return true;
      }
      
      // Otherwise, automatically log in with the created credentials
      return await login(usernameInput, password);
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      login,
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
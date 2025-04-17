"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import DepocheckLogo from '@/app/ui/depocheck-logo';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const success = await login(username, password);
        
        if (success) {
          router.push("/dashboard");
        } else {
          setError("Invalid username or password");
        }
      } else {
        // Handle signup
        const success = await signup(username, email, password);
        
        if (success) {
          router.push("/dashboard");
        } else {
          setError("Failed to create account. Username or email may already be in use.");
        }
      }
    } catch (err) {
      setError("An error occurred during " + (isLogin ? "login" : "signup"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-full rounded-lg bg-blue-500 p-4 flex items-end">
            <DepocheckLogo />
          </div>
        </div>
        
        <div className="rounded-lg bg-gray-800 text-white p-8 shadow-md">
          <div className="flex mb-6 border-b">
            <button
              type="button"
              className={`py-2 px-4 w-1/2 text-center ${
                isLogin ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-100'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`py-2 px-4 w-1/2 text-center ${
                !isLogin ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-100'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          <h1 className="mb-6 text-2xl font-bold text-gray-100">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h1>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-gray-700 focus:bg-gray-600"
                placeholder="Enter your username"
              />
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-gray-700 focus:bg-gray-600"
                  placeholder="Enter your email"
                />
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-gray-700 focus:bg-gray-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 
                (isLogin ? "Signing in..." : "Creating account...") : 
                (isLogin ? "Sign in" : "Sign up")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
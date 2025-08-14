"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <form 
        onSubmit={handleSubmit}
        className="bg-[var(--foreground)] p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-[var(--title)]">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-[var(--text-body)]">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--background)] border rounded text-[var(--text-body)]"
            required
          />
        </div>
        
        <button
          type="submit"
          className="action-button cursor-pointer hover:text-[var(--text-title)] w-full py-2 px-4 rounded text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}
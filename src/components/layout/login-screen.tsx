"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { mockUsers } from "@/lib/mock-data";
import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await login(email, password);
      toast.success("Welcome back to StartupOS!");
    } catch (err) {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    if (isLoading) return;
    setEmail(demoEmail);
    setPassword("password123");
    try {
      await login(demoEmail, "password123");
      toast.success("Welcome back to StartupOS!");
    } catch (err) {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)] overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-[420px] p-6 mx-4 relative">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-4 animate-float">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">StartupOS</h1>
          <p className="text-[13.5px] text-[var(--foreground-muted)] mt-1 text-center">
            Sign in to access your unified CRM & workspaces
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-6 relative backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[var(--foreground-muted)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-subtle)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--primary)] focus:outline-none transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-[var(--foreground-muted)]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-subtle)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--primary)] focus:outline-none transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-strong)] disabled:opacity-75 text-white font-medium text-[14px] rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-[var(--card)] px-3 text-[var(--foreground-subtle)] font-medium">
                Quick Access Demo Accounts
              </span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="grid grid-cols-1 gap-2">
            {mockUsers.slice(0, 3).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.email)}
                disabled={isLoading}
                className="flex items-center justify-between p-2.5 bg-[var(--background-subtle)] hover:bg-[var(--background-muted)] border border-[var(--border)] rounded-xl text-left transition-all group disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {user.displayName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-[var(--foreground)] truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] text-[var(--foreground-subtle)] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[var(--primary)] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Sign in
                  <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

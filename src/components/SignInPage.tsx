import { useState } from "react";
import { Lock, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { getSupabaseClient } from "../utils/supabase/client";
import { CompanyLogo } from "./CompanyLogo";

interface SignInPageProps {
  onSignInSuccess: (email: string) => void;
}

export function SignInPage({ onSignInSuccess }: SignInPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const supabase = getSupabaseClient();

  // Validate password requirements
  const validatePassword = (pass: string): boolean => {
    const hasMinLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Sign-in error response:", data);
        
        // Check if user needs to sign up
        if (data.needsSignup) {
          setError("No account found with this email. Please create an account by clicking 'Create Account' below.");
          setIsLoading(false);
          return;
        }
        
        // Provide more helpful error messages
        if (response.status === 401 || data.error?.includes("Invalid")) {
          throw new Error(data.error || "Invalid email or password. Please check your credentials and try again.");
        }
        throw new Error(data.error || "Failed to sign in");
      }

      console.log("Sign-in response:", data);

      // Set the Supabase session using the access token and refresh token
      if (data.access_token && data.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) {
          console.error("Error setting Supabase session:", sessionError);
          throw new Error("Failed to establish session");
        }

        console.log("✓ Supabase session established successfully");
      } else {
        console.warn("No tokens received from server");
      }

      // Also store in localStorage as backup
      localStorage.setItem("access_token", data.access_token);
      setSuccess("Successfully signed in! Redirecting...");
      
      setTimeout(() => {
        onSignInSuccess(email);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPasswordError("");
    setIsLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      setIsLoading(false);
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setSuccess("Account created successfully! You can now sign in.");
      setIsSignUp(false);
      setFirstName("");
      setLastName("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAnonymously = () => {
    // Set a flag in localStorage to indicate anonymous access
    localStorage.setItem("anonymous_user", "true");
    onSignInSuccess("");
  };

  return (
    <div className="min-h-screen bg-[#d4e8c1] flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#799952]/10" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#e0af41]/10" />
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <CompanyLogo size="large" />
        </div>

        {/* Card */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[#45280b] mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-[#45280b]/70">
              {isSignUp 
                ? "Sign up to start your financial journey" 
                : "Sign in to continue your financial journey"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-start gap-3">
              <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {/* Name Fields (Sign Up Only) */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-[#45280b] mb-2 text-sm">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      placeholder="Enter your first name"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="size-5 rounded-full bg-[#799952]/20 flex items-center justify-center">
                        <span className="text-[#578027] text-xs">👤</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-[#45280b] mb-2 text-sm">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      placeholder="Enter your last name"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="size-5 rounded-full bg-[#799952]/20 flex items-center justify-center">
                        <span className="text-[#578027] text-xs">👤</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#45280b] mb-2 text-sm">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#578027]/50" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#45280b] mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#578027]/50" />
              </div>
              {isSignUp && passwordError && (
                <p className="text-xs text-red-600 mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#799952] hover:bg-[#578027] text-[#fff5d6] py-3 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Log In"}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-[#45280b]/70 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              {" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setSuccess("");
                  setPasswordError("");
                }}
                className="text-[#578027] hover:underline"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>

          {/* Continue Anonymously */}
          <div className="mt-6 pt-6 border-t-2 border-[#799952]/20">
            <button
              onClick={handleContinueAnonymously}
              className="w-full bg-[#e0af41] hover:bg-[#c99933] text-[#45280b] py-3 rounded-lg transition-colors shadow-md"
            >
              Continue Anonymously
            </button>
            <p className="text-xs text-[#45280b]/60 text-center mt-2">
              Explore the app without saving your progress
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-[#45280b]/60 text-xs max-w-sm mx-auto">
            By signing in, you agree to our Terms of Service and Privacy Policy. 
            This is an educational platform for financial planning guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
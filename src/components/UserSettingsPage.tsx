import { Header } from "./Header";
import { User, LogOut, Mail, Shield } from "lucide-react";
import { getSupabaseClient } from "../utils/supabase/client";
import { useState } from "react";

interface UserSettingsPageProps {
  onMenuClick: () => void;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function UserSettingsPage({ onMenuClick, onLogoClick, onProfileClick, onSignOut, userEmail }: UserSettingsPageProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      onSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      <Header 
        onMenuClick={onMenuClick} 
        onLogoClick={onLogoClick} 
        isAuthenticated={true}
        onProfileClick={onProfileClick}
        userEmail={userEmail}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-[#fff5d6] rounded-2xl shadow-lg border-4 border-[#e0af41] p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#e0af41] text-[#fff5d6] p-4 rounded-full">
              <User className="size-8" />
            </div>
            <div>
              <h1 className="text-[#45280b] mb-1">Account Settings</h1>
              <p className="text-[#578027]">Manage your profile and preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email Section */}
            <div className="bg-white rounded-lg p-6 border-2 border-[#e0af41]">
              <div className="flex items-start gap-4">
                <div className="bg-[#d4e8c1] p-3 rounded-lg">
                  <Mail className="size-6 text-[#578027]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#45280b] mb-2">Email Address</h3>
                  <p className="text-[#578027]">{userEmail || 'Not available'}</p>
                </div>
              </div>
            </div>

            {/* Account Type Section */}
            <div className="bg-white rounded-lg p-6 border-2 border-[#e0af41]">
              <div className="flex items-start gap-4">
                <div className="bg-[#d4e8c1] p-3 rounded-lg">
                  <Shield className="size-6 text-[#578027]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#45280b] mb-2">Account Type</h3>
                  <p className="text-[#578027]">Free Account</p>
                </div>
              </div>
            </div>

            {/* Sign Out Section */}
            <div className="bg-white rounded-lg p-6 border-2 border-[#e0af41]">
              <div className="flex items-start gap-4">
                <div className="bg-[#d4e8c1] p-3 rounded-lg">
                  <LogOut className="size-6 text-[#578027]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#45280b] mb-2">Sign Out</h3>
                  <p className="text-[#578027] mb-4">Sign out of your account on this device</p>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="bg-[#799952] hover:bg-[#578027] disabled:opacity-50 disabled:cursor-not-allowed text-[#fff5d6] px-6 py-3 rounded-lg transition-colors shadow-md flex items-center gap-2"
                  >
                    <LogOut className="size-5" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
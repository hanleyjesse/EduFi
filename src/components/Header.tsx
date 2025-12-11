import { CompanyLogo } from "./CompanyLogo";
import { User } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  onLogoClick?: () => void;
  isAuthenticated?: boolean;
  onProfileClick?: () => void;
  userEmail?: string;
}

export function Header({ onMenuClick, onLogoClick, isAuthenticated = false, onProfileClick, userEmail }: HeaderProps) {
  return (
    <header className="w-full bg-[#fff5d6] border-b-4 border-[#e0af41] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <CompanyLogo size="medium" onClick={onLogoClick} />
          <div className="flex items-center gap-3">
            <button
              onClick={onProfileClick}
              className={`${
                isAuthenticated 
                  ? 'bg-[#e0af41] hover:bg-[#d4a137]' 
                  : 'bg-[#799952] hover:bg-[#578027]'
              } text-[#fff5d6] p-3 rounded-full transition-colors shadow-md flex items-center justify-center`}
              aria-label={isAuthenticated ? "Profile Settings" : "Sign In"}
            >
              {isAuthenticated && userEmail && userEmail.length > 0 ? (
                <span className="size-6 flex items-center justify-center font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="size-6" />
              )}
            </button>
            <button
              onClick={onMenuClick}
              className="bg-[#799952] hover:bg-[#578027] text-[#fff5d6] p-3 rounded-full transition-colors shadow-md"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
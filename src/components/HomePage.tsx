import { Map, Calculator, BookOpen, TrendingUp, Shield, ArrowRight, Target } from "lucide-react";
import { Header } from "./Header";

interface HomePageProps {
  onNavigateToRoadmap: () => void;
  onNavigateToCalculator: () => void;
  onNavigateToLearnAndApply: () => void;
  onMenuClick: () => void;
  onNavigateToNetWorthTracker: () => void;
  onNavigateToDebtPayoff: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function HomePage({ onNavigateToRoadmap, onNavigateToCalculator, onNavigateToLearnAndApply, onMenuClick, onNavigateToNetWorthTracker, onNavigateToDebtPayoff, onProfileClick, isAuthenticated, userEmail }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {/* Header */}
      <Header onMenuClick={onMenuClick} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 bg-gradient-to-br from-[#fff5d6] to-white p-8 md:p-12 rounded-2xl border-t-4 border-[#799952] shadow-lg max-w-4xl mx-auto">
          <h2 className="text-[#45280b] mb-4 [text-shadow:rgba(0,0,0,0.1)_0px_2px_4px]">Welcome to Your Financial Journey</h2>
          <p className="text-[#45280b]/80 text-lg">
            Take control of your financial future with our comprehensive guide.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Roadmap Card */}
          <button
            onClick={onNavigateToRoadmap}
            className="bg-[#fff5d6] p-8 rounded-2xl border-4 border-[#e0af41] shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#799952] p-4 rounded-full group-hover:scale-110 transition-transform">
                <Map className="size-8 text-[#fff5d6]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#45280b] mb-2">The Financial Sequence</h3>
                <p className="text-[#45280b]/70">
                  Follow our proven 9-step roadmap to build wealth systematically. From emergency funds to retirement planning, 
                  we'll guide you through each milestone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#578027] group-hover:gap-3 transition-all">
              <span>Start Your Journey</span>
              <ArrowRight className="size-5" />
            </div>
          </button>

          {/* Calculator Card */}
          <button
            onClick={onNavigateToCalculator}
            className="bg-[#fff5d6] p-8 rounded-2xl border-4 border-[#e0af41] shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#799952] p-4 rounded-full group-hover:scale-110 transition-transform">
                <Calculator className="size-8 text-[#fff5d6]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#45280b] mb-2">Investment Calculator</h3>
                <p className="text-[#45280b]/70">
                  Project your investment growth over time. See how compound interest can work for you with our 
                  easy-to-use calculator.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#578027] group-hover:gap-3 transition-all">
              <span>Calculate Returns</span>
              <ArrowRight className="size-5" />
            </div>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-3 gap-6">
          <button
            onClick={onNavigateToDebtPayoff}
            className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30 text-center hover:border-[#799952] hover:shadow-lg transition-all group"
          >
            <div className="bg-[#799952]/20 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-[#799952]/30 transition-colors">
              <Target className="size-8 text-[#578027]" />
            </div>
            <h4 className="text-[#45280b] mb-2">Debt Payoff Strategy</h4>
            <p className="text-[#45280b]/70 text-sm">
              Calculate the fastest way to become debt-free using proven snowball or avalanche methods.
            </p>
          </button>

          <div 
            onClick={onNavigateToNetWorthTracker}
            className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30 text-center cursor-pointer hover:border-[#799952] transition-all hover:shadow-lg group"
          >
            <div className="bg-[#799952]/20 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-[#799952]/30 transition-colors">
              <TrendingUp className="size-8 text-[#578027]" />
            </div>
            <h4 className="text-[#45280b] mb-2">Net Worth Tracker</h4>
            <p className="text-[#45280b]/70 text-sm">
              Track your assets and liabilities to calculate and monitor your net worth over time.
            </p>
          </div>

          <button
            onClick={onNavigateToLearnAndApply}
            className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30 text-center hover:border-[#799952] hover:shadow-lg transition-all group"
          >
            <div className="bg-[#799952]/20 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-[#799952]/30 transition-colors">
              <BookOpen className="size-8 text-[#578027]" />
            </div>
            <h4 className="text-[#45280b] mb-2">Learn & Apply</h4>
            <p className="text-[#45280b]/70 text-sm">
              Access educational content for each financial concept with actionable tips you can implement today.
            </p>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fff5d6] border-t-4 border-[#e0af41] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-[#45280b] mb-3">About This Guide</h4>
              <p className="text-[#45280b]/70 text-sm">
                This interactive educational app helps you understand and implement proven financial planning strategies 
                to achieve your goals.
              </p>
            </div>
            <div>
              <h4 className="text-[#45280b] mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={onNavigateToRoadmap}
                    className="text-[#45280b]/70 hover:text-[#578027] text-sm transition-colors"
                  >
                    Financial Sequence Roadmap
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onNavigateToCalculator}
                    className="text-[#45280b]/70 hover:text-[#578027] text-sm transition-colors"
                  >
                    Investment Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onNavigateToLearnAndApply}
                    className="text-[#45280b]/70 hover:text-[#578027] text-sm transition-colors"
                  >
                    Learn & Apply
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#45280b] mb-3">Disclaimer</h4>
              <p className="text-[#45280b]/70 text-sm">
                This tool provides educational information only. Information does not constitute investment, financial, tax or legal advice. All investments involve a degree of risk, including the risk of loss. Always consult with a qualified financial advisor for personalized advice.
              </p>
            </div>
          </div>
          <div className="border-t border-[#e0af41] pt-6">
            <p className="text-center text-[#45280b]/60 text-sm">
              © 2025 Financial Planning Guide. Built for educational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
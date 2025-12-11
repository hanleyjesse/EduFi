import { useState, useEffect } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { InvestmentCalculator } from "./components/InvestmentCalculator";
import { LearnAndApplyPage } from "./components/LearnAndApplyPageNew";
import { SignInPage } from "./components/SignInPage";
import { MenuDrawer } from "./components/MenuDrawer";
import { NetWorthTracker } from "./components/NetWorthTracker";
import { UserSettingsPage } from "./components/UserSettingsPage";
import { DebtPayoffCalculator } from "./components/DebtPayoffCalculator";
import { WealthMultiplier } from "./components/WealthMultiplier";
import { CarBuyingGuide } from "./components/CarBuyingGuide";
import { HomeBuyingGuide } from "./components/HomeBuyingGuide";
import { RetirementCalculator } from "./components/RetirementCalculator";
import PersonalFinanceRoadmap from "./imports/PersonalFinanceRoadmap";
import { StepModal } from "./components/StepModal";

export interface FinancialStep {
  id: number;
  title: string;
  description: string;
  details: string[];
  tips: string[];
}

const financialSteps: FinancialStep[] = [
  {
    id: 1,
    title: "Deductibles Covered",
    description: "Ensure you have enough savings to cover your highest insurance deductible in case of an emergency.",
    details: [
      "Calculate all your insurance deductibles (health, auto, home)",
      "Save the amount matching your highest deductible and place in a readily accessible savings account",
      "This protects you from going into debt for unexpected emergencies"
    ],
    tips: [
      "Review your insurance policies to know exact deductible amounts",
      "Keep this money separate from your regular checking account",
      "Update this amount annually as your insurance changes"
    ]
  },
  {
    id: 2,
    title: "Employer Match",
    description: "Take full advantage of employer 401(k) matching - it's free money for your retirement!",
    details: [
      "Contribute at least enough to get the full employer match",
      "This is an immediate 50%-100% return on your investment",
      "Typical matches are 3-6% of your salary"
    ],
    tips: [
      "Check your HR portal for match details",
      "Set up automatic contributions from your paycheck",
      "This comes before paying off most debt because of the guaranteed return"
    ]
  },
  {
    id: 3,
    title: "High-Interest Debt",
    description: "Pay off all debt with interest rates above 7%, such as credit cards and personal loans.",
    details: [
      "You cannot out-invest high interest debt, so these must be paid off before moving to the next step",
      "Use the avalanche method (highest rate first) or snowball method (smallest balance first)",
      "High-interest debt uses compound interest against you"
    ],
    tips: [
      "List all debts with their interest rates",
      "Consider balance transfer cards for temporary relief",
      "Avoid taking on new high-interest debt during payoff"
    ]
  },
  {
    id: 4,
    title: "Emergency Reserves",
    description: "Build 3-6 months of essential living expenses in a liquid, accessible savings account.",
    details: [
      "Calculate your monthly essential expenses (housing, food, utilities, insurance)",
      "Multiply by 3-6 months depending on job stability",
      "Keep in a high-yield savings account with easy access"
    ],
    tips: [
      "Start with a goal of $1,000, then build to one month, then three",
      "Automate monthly transfers to your emergency fund",
      "Only use for true emergencies - job loss, medical, major repairs"
    ]
  },
  {
    id: 5,
    title: "Roth IRA and HSA",
    description: "Maximize tax-advantaged accounts: Roth IRA for retirement and HSA for medical expenses.",
    details: [
      "Roth IRA: $7,500/year contribution limit (2026), tax-free growth",
      "HSA: Triple tax advantage - deductible contributions, tax-free growth, tax-free withdrawals for medical",
      "Both offer significant long-term tax benefits"
    ],
    tips: [
      "Roth IRA is great for young earners expecting higher future income",
      "HSA requires a high-deductible health plan",
      "Consider utilizing a Back-Door Roth IRA strategy if you are above income limits to contribute directly to a Roth IRA"
    ]
  },
  {
    id: 6,
    title: "Max-out Retirement",
    description: "Contribute the maximum allowed to your 401(k), 403(b), or other retirement accounts.",
    details: [
      "2026 limit: $24,500 for 401(k)/403(b) ($32,500 if 50+)",
      "Go beyond the employer match to reach the IRS limit",
      "Compound growth over decades creates substantial wealth"
    ],
    tips: [
      "Increase contributions with every raise",
      "Choose appropriate investments based on age and risk tolerance",
      "You can change investments in these accounts without penalty"
    ]
  },
  {
    id: 7,
    title: "Hyper-Accumulation",
    description: "Invest aggressively in taxable brokerage accounts to build wealth beyond retirement accounts.",
    details: [
      "Open a taxable investment account for unlimited contributions",
      "Build a substantial position in a diversified ETF that tracks the S&P 500 before choosing any single stocks.",
      "Focus on tax-efficient investments (index funds, ETFs)"
    ],
    tips: [
      "Consider tax-loss harvesting to offset gains",
      "Hold investments for over 1 year to get long-term capital gains rates",
      "Diversify across multiple asset classes"
    ]
  },
  {
    id: 8,
    title: "Prepaid Future Expenses",
    description: "Save for known future expenses like children's education, weddings, or major purchases.",
    details: [
      "529 plans for education expenses (tax-free growth for qualified expenses)",
      "Dedicated savings for planned major purchases",
      "Reduce future debt by saving in advance"
    ],
    tips: [
      "Research 529 plan benefits in your state",
      "Set specific goals with timelines for each expense",
      "Adjust savings rate based on how soon you'll need the money"
    ]
  },
  {
    id: 9,
    title: "Low-Interest Debt",
    description: "Consider paying off low-interest debt like mortgages, though investing may yield better returns.",
    details: [
      "Debt with rates below 4-5% (like mortgages) can be paid slowly",
      "The stock market historically returns 7-10% annually",
      "Weigh the psychological benefit of being debt-free vs. mathematical optimization"
    ],
    tips: [
      "Make regular payments but don't rush to pay off",
      "Consider prepaying if you're close to retirement or risk-averse",
      "The peace of mind from no debt has real value too"
    ]
  }
];

export default function App() {
  const [selectedStep, setSelectedStep] = useState<FinancialStep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "roadmap" | "calculator" | "learn-and-apply" | "sign-in" | "net-worth-tracker" | "user-settings" | "debt-payoff" | "wealth-multiplier" | "car-buying-guide" | "home-buying-guide" | "retirement-calculator">("sign-in");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Remove automatic session restoration - user must explicitly choose to sign in or continue anonymously

  const handleStepClick = (stepId: number) => {
    const step = financialSteps.find(s => s.id === stepId);
    if (step) {
      setSelectedStep(step);
      setIsModalOpen(true);
    }
  };

  const handleLogoClick = () => {
    // Navigate to home page
    setCurrentPage("home");
  };

  const handleNavigateToCalculator = () => {
    setCurrentPage("calculator");
    setIsMenuOpen(false);
  };

  const handleNavigateToRoadmap = () => {
    setCurrentPage("roadmap");
    setIsMenuOpen(false);
  };

  const handleNavigateToHome = () => {
    setCurrentPage("home");
    setIsMenuOpen(false);
  };

  const handleNavigateToLearnAndApply = () => {
    setCurrentPage("learn-and-apply");
    setIsMenuOpen(false);
  };

  const handleNavigateToNetWorthTracker = () => {
    setCurrentPage("net-worth-tracker");
    setIsMenuOpen(false);
  };

  const handleNavigateToDebtPayoff = () => {
    setCurrentPage("debt-payoff");
    setIsMenuOpen(false);
  };

  const handleNavigateToWealthMultiplier = () => {
    setCurrentPage("wealth-multiplier");
    setIsMenuOpen(false);
  };

  const handleNavigateToCarBuyingGuide = () => {
    setCurrentPage("car-buying-guide");
    setIsMenuOpen(false);
  };

  const handleNavigateToHomeBuyingGuide = () => {
    setCurrentPage("home-buying-guide");
    setIsMenuOpen(false);
  };

  const handleNavigateToRetirementCalculator = () => {
    setCurrentPage("retirement-calculator");
    setIsMenuOpen(false);
  };

  const handleBackToRoadmap = () => {
    setCurrentPage("roadmap");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleSignInSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setCurrentPage("home");
  };

  const handleNavigateToSignIn = () => {
    setCurrentPage("sign-in");
  };

  const handleNavigateToUserSettings = () => {
    setCurrentPage("user-settings");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("access_token");
    localStorage.removeItem("anonymous_user");
    setCurrentPage("sign-in");
  };

  const handleProfileClick = () => {
    // Only navigate to user settings if user has a real account (not anonymous)
    if (isAuthenticated && userEmail && userEmail.length > 0) {
      handleNavigateToUserSettings();
    } else {
      handleNavigateToSignIn();
    }
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (!isAuthenticated) {
    return <SignInPage onSignInSuccess={handleSignInSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {currentPage === "sign-in" && (
        <SignInPage onSignInSuccess={handleSignInSuccess} />
      )}
      {currentPage === "home" && (
        <HomePage
          onNavigateToRoadmap={handleNavigateToRoadmap}
          onNavigateToCalculator={handleNavigateToCalculator}
          onNavigateToLearnAndApply={handleNavigateToLearnAndApply}
          onNavigateToNetWorthTracker={handleNavigateToNetWorthTracker}
          onNavigateToDebtPayoff={handleNavigateToDebtPayoff}
          onMenuClick={() => setIsMenuOpen(true)}
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "roadmap" && (
        <>
          <PersonalFinanceRoadmap 
            onStepClick={handleStepClick}
            onMenuClick={() => setIsMenuOpen(true)}
            onLogoClick={handleLogoClick}
            onProfileClick={handleProfileClick}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
          />
          <StepModal
            step={selectedStep}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
      {currentPage === "calculator" && (
        <InvestmentCalculator 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "learn-and-apply" && (
        <LearnAndApplyPage 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "net-worth-tracker" && (
        <NetWorthTracker 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "user-settings" && (
        <UserSettingsPage 
          onMenuClick={() => setIsMenuOpen(true)} 
          onLogoClick={handleLogoClick}
          onProfileClick={handleProfileClick}
          onSignOut={handleSignOut}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
          firstName={firstName}
          lastName={lastName}
        />
      )}
      {currentPage === "debt-payoff" && (
        <DebtPayoffCalculator 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "wealth-multiplier" && (
        <WealthMultiplier 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "car-buying-guide" && (
        <CarBuyingGuide 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "home-buying-guide" && (
        <HomeBuyingGuide 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      {currentPage === "retirement-calculator" && (
        <RetirementCalculator 
          onBack={handleNavigateToHome} 
          onMenuClick={() => setIsMenuOpen(true)} 
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
      )}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateToCalculator={handleNavigateToCalculator}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToLearnAndApply={handleNavigateToLearnAndApply}
        onNavigateToNetWorthTracker={handleNavigateToNetWorthTracker}
        onNavigateToRoadmap={handleNavigateToRoadmap}
        onNavigateToUserSettings={handleNavigateToUserSettings}
        onNavigateToDebtPayoff={handleNavigateToDebtPayoff}
        onNavigateToWealthMultiplier={handleNavigateToWealthMultiplier}
        onNavigateToCarBuyingGuide={handleNavigateToCarBuyingGuide}
        onNavigateToHomeBuyingGuide={handleNavigateToHomeBuyingGuide}
        onNavigateToRetirementCalculator={handleNavigateToRetirementCalculator}
      />
    </div>
  );
}
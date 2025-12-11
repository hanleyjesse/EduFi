import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Home, BookOpen, Info, Mail, Calculator, TrendingUp, Map, Settings, Target, ChevronDown, DollarSign, Car, House, Sparkles, Link as LinkIcon } from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCalculator?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToLearnAndApply?: () => void;
  onNavigateToNetWorthTracker?: () => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToUserSettings?: () => void;
  onNavigateToDebtPayoff?: () => void;
  onNavigateToWealthMultiplier?: () => void;
  onNavigateToCarBuyingGuide?: () => void;
  onNavigateToHomeBuyingGuide?: () => void;
  onNavigateToRetirementCalculator?: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  description: string;
  link: string;
  onClick?: () => void;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  icon: any;
  label: string;
  description: string;
  onClick?: () => void;
  comingSoon?: boolean;
}

export function MenuDrawer({ isOpen, onClose, onNavigateToCalculator, onNavigateToHome, onNavigateToLearnAndApply, onNavigateToNetWorthTracker, onNavigateToRoadmap, onNavigateToUserSettings, onNavigateToDebtPayoff, onNavigateToWealthMultiplier, onNavigateToCarBuyingGuide, onNavigateToHomeBuyingGuide, onNavigateToRetirementCalculator }: MenuDrawerProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { 
      icon: Home, 
      label: "Home", 
      description: "Return to homepage", 
      link: "#", 
      onClick: onNavigateToHome 
    },
    { 
      icon: Map, 
      label: "The Financial Sequence", 
      description: "Interactive financial planning roadmap", 
      link: "#", 
      onClick: onNavigateToRoadmap 
    },
    { 
      icon: Calculator, 
      label: "Calculators & Tools", 
      description: "Financial calculators and tracking tools", 
      link: "#",
      subItems: [
        { 
          icon: TrendingUp, 
          label: "Investment Calculator", 
          description: "Project investment growth over time",
          onClick: onNavigateToCalculator 
        },
        { 
          icon: DollarSign, 
          label: "Retirement Calculator", 
          description: "Plan for your retirement needs",
          onClick: onNavigateToRetirementCalculator
        },
        { 
          icon: TrendingUp, 
          label: "Net Worth Tracker", 
          description: "Track assets and liabilities",
          onClick: onNavigateToNetWorthTracker 
        },
        { 
          icon: Target, 
          label: "Debt Payoff Calculator", 
          description: "Create debt elimination strategy",
          onClick: onNavigateToDebtPayoff 
        },
      ]
    },
    { 
      icon: BookOpen, 
      label: "Guides & Learning", 
      description: "Educational resources and guides", 
      link: "#",
      subItems: [
        { 
          icon: BookOpen, 
          label: "Learn & Apply", 
          description: "Financial concepts and tips",
          onClick: onNavigateToLearnAndApply 
        },
        { 
          icon: Car, 
          label: "Car Buying Guide", 
          description: "Smart strategies for purchasing vehicles",
          onClick: onNavigateToCarBuyingGuide 
        },
        { 
          icon: House, 
          label: "Home Buying Guide", 
          description: "Navigate the home buying process",
          onClick: onNavigateToHomeBuyingGuide 
        },
        { 
          icon: Sparkles, 
          label: "Wealth Multiplier", 
          description: "Advanced wealth building strategies",
          onClick: onNavigateToWealthMultiplier 
        },
      ]
    },
    { 
      icon: LinkIcon, 
      label: "Useful Links", 
      description: "Curated financial tools and resources", 
      link: "#",
      comingSoon: true
    },
    { 
      icon: Info, 
      label: "About", 
      description: "Learn more about this guide", 
      link: "#"
    },
    { 
      icon: Mail, 
      label: "Contact", 
      description: "Get in touch", 
      link: "#"
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] md:w-[540px] bg-[#fff5d6] overflow-y-auto">
        <SheetHeader className="bg-gradient-to-br from-[#799952]/20 to-[#d4e8c1]/40 pb-4 border-b-2 border-[#799952]/30">
          <SheetTitle className="text-[#578027]">Menu</SheetTitle>
          <SheetDescription className="text-[#45280b]">
            Navigate to different sections of the app
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {/* Main Menu Item */}
              <button
                className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-[#799952]/10 transition-colors border border-[#e0af41]/30 hover:border-[#e0af41] group text-left"
                onClick={() => {
                  if (item.subItems) {
                    toggleDropdown(item.label);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                <div className="bg-[#799952] p-3 rounded-full group-hover:scale-110 transition-transform">
                  <item.icon className="size-5 text-[#fff5d6]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[#45280b] mb-1">{item.label}</h3>
                    {item.comingSoon && (
                      <span className="text-xs bg-[#e0af41] text-[#45280b] px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[#45280b]/70 text-sm">{item.description}</p>
                </div>
                {item.subItems && (
                  <ChevronDown 
                    className={`size-5 text-[#799952] transition-transform ${
                      openDropdowns.includes(item.label) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Dropdown Sub-items */}
              {item.subItems && openDropdowns.includes(item.label) && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-[#799952]/65 pl-4">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#d4e8c1]/75 transition-colors border border-[#799952]/60 hover:border-[#799952]/70 group text-left disabled:opacity-80 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (subItem.onClick && !subItem.comingSoon) {
                          subItem.onClick();
                        }
                      }}
                      disabled={subItem.comingSoon}
                    >
                      <div className="bg-[#799952]/85 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <subItem.icon className="size-4 text-[#fff5d6]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[#45280b] text-sm mb-0.5">{subItem.label}</h4>
                          {subItem.comingSoon && (
                            <span className="text-xs bg-[#e0af41]/80 text-[#45280b] px-2 py-0.5 rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-[#45280b]/80 text-xs">{subItem.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
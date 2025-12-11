import { useState } from "react";
import { TrendingUp, Calculator, CheckCircle, AlertTriangle, DollarSign, PiggyBank, Calendar, Target, Award, Book, Percent, Shield, ArrowRight, Plus, X } from "lucide-react";
import { Header } from "./Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RetirementCalculatorProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

interface ContributionRange {
  id: string;
  startAge: number;
  stopAge: number;
  monthlyAmount: number;
  annualIncreasePercent: number;
}

interface RetirementIncomeSource {
  id: string;
  name: string;
  monthlyAmount: number;
  startAge: number;
  colaPercent: number; // Cost of living adjustment
  enabled: boolean;
}

export function RetirementCalculator({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: RetirementCalculatorProps) {
  // Basic inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(3);
  const [firstAnnualROI, setFirstAnnualROI] = useState<number>(7); // Pre-retirement
  const [secondAnnualROI, setSecondAnnualROI] = useState<number>(5); // Post-retirement
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(60000);
  const [desiredEstate, setDesiredEstate] = useState<number>(0);

  // Optional reduced income in later retirement
  const [useReducedIncome, setUseReducedIncome] = useState<boolean>(false);
  const [reducedIncomeYears, setReducedIncomeYears] = useState<number>(10);
  const [reducedIncomePercent, setReducedIncomePercent] = useState<number>(20);

  // Contribution ranges
  const [contributionRanges, setContributionRanges] = useState<ContributionRange[]>([
    {
      id: '1',
      startAge: 30,
      stopAge: 65,
      monthlyAmount: 500,
      annualIncreasePercent: 0,
    }
  ]);

  // Retirement income sources
  const [retirementIncomeSources, setRetirementIncomeSources] = useState<RetirementIncomeSource[]>([
    {
      id: '1',
      name: 'Social Security',
      monthlyAmount: 2000,
      startAge: 67,
      colaPercent: 0,
      enabled: true,
    }
  ]);

  const [calculationDone, setCalculationDone] = useState<boolean>(false);
  const [results, setResults] = useState({
    totalContributions: 0,
    balanceAtRetirement: 0,
    inflationAdjustedIncomeGoal: 0,
    totalPostRetirementIncome: 0,
    requiredWithdrawalFirstYear: 0,
    ageFundsDepleted: 0,
    finalEstateAmount: 0,
    success: false,
    yearByYearData: [] as any[],
  });

  // Add contribution range
  const addContributionRange = () => {
    const newRange: ContributionRange = {
      id: Date.now().toString(),
      startAge: currentAge,
      stopAge: retirementAge,
      monthlyAmount: 500,
      annualIncreasePercent: 0,
    };
    setContributionRanges([...contributionRanges, newRange]);
  };

  // Remove contribution range
  const removeContributionRange = (id: string) => {
    setContributionRanges(contributionRanges.filter(r => r.id !== id));
  };

  // Update contribution range
  const updateContributionRange = (id: string, field: keyof ContributionRange, value: number) => {
    setContributionRanges(contributionRanges.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  // Add retirement income source
  const addRetirementIncomeSource = () => {
    const newSource: RetirementIncomeSource = {
      id: Date.now().toString(),
      name: 'Pension',
      monthlyAmount: 1000,
      startAge: 65,
      colaPercent: 0,
      enabled: true,
    };
    setRetirementIncomeSources([...retirementIncomeSources, newSource]);
  };

  // Remove retirement income source
  const removeRetirementIncomeSource = (id: string) => {
    setRetirementIncomeSources(retirementIncomeSources.filter(s => s.id !== id));
  };

  // Update retirement income source
  const updateRetirementIncomeSource = (id: string, field: keyof RetirementIncomeSource, value: any) => {
    setRetirementIncomeSources(retirementIncomeSources.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateRetirement = () => {
    if (retirementAge <= currentAge || lifeExpectancy <= retirementAge) {
      alert("Please check your age inputs. Retirement age must be after current age, and life expectancy must be after retirement age.");
      return;
    }

    // SECTION 1: Pre-Retirement Savings Growth
    let balance = currentSavings;
    let totalContributions = 0;
    const yearByYearData = [];

    // Add first year showing only current savings (no contributions or growth)
    yearByYearData.push({
      age: currentAge,
      phase: 'accumulation',
      contributions: 0,
      growth: 0,
      balance: currentSavings,
    });

    // Create a copy of contribution ranges with current monthly amounts
    const activeRanges = contributionRanges.map(range => ({
      ...range,
      currentMonthlyAmount: range.monthlyAmount,
    }));

    // Simulate each year from current age + 1 to retirement
    for (let year = currentAge + 1; year < retirementAge; year++) {
      const yearData: any = { age: year, phase: 'accumulation' };

      // Calculate contributions for this year
      let yearlyContribution = 0;
      activeRanges.forEach(range => {
        if (year >= range.startAge && year <= range.stopAge) {
          yearlyContribution += range.currentMonthlyAmount * 12;
        }
      });

      totalContributions += yearlyContribution;
      
      // Apply growth to existing balance FIRST
      const growth = balance * (firstAnnualROI / 100);
      
      // Then add growth and contributions
      balance = balance + growth + yearlyContribution;

      yearData.contributions = yearlyContribution;
      yearData.growth = growth;
      yearData.balance = balance;
      yearByYearData.push(yearData);

      // Apply annual increases to contribution ranges for next year
      activeRanges.forEach(range => {
        if (year >= range.startAge && year <= range.stopAge) {
          range.currentMonthlyAmount *= (1 + range.annualIncreasePercent / 100);
        }
      });
    }

    const balanceAtRetirement = balance;

    // SECTION 2: Desired Retirement Income Needs
    const inflationMultiplier = Math.pow(1 + annualInflationRate / 100, retirementAge - currentAge);
    const inflationAdjustedIncomeGoal = desiredAnnualIncome * inflationMultiplier;

    // SECTION 3 & 4: Post-Retirement Drawdown Simulation
    let ageFundsDepleted = 0;
    let finalEstateAmount = 0;
    let success = true;
    let requiredWithdrawalFirstYear = 0;
    let currentInflationAdjustedIncome = inflationAdjustedIncomeGoal;

    for (let year = retirementAge; year <= lifeExpectancy; year++) {
      const yearData: any = { age: year, phase: 'withdrawal' };
      const yearsIntoRetirement = year - retirementAge;

      // Calculate income requirement for this year (with optional reduction)
      let incomeRequired = currentInflationAdjustedIncome;
      if (useReducedIncome && yearsIntoRetirement >= reducedIncomeYears) {
        incomeRequired = currentInflationAdjustedIncome * (1 - reducedIncomePercent / 100);
      }

      // Calculate post-retirement income sources
      let totalPostRetirementIncome = 0;
      retirementIncomeSources.forEach(source => {
        if (source.enabled && year >= source.startAge) {
          const yearsActive = year - source.startAge;
          const adjustedAmount = source.monthlyAmount * 12 * Math.pow(1 + source.colaPercent / 100, yearsActive);
          totalPostRetirementIncome += adjustedAmount;
        }
      });

      // Calculate required withdrawal
      const netWithdrawal = Math.max(0, incomeRequired - totalPostRetirementIncome);
      
      if (year === retirementAge) {
        requiredWithdrawalFirstYear = netWithdrawal;
      }

      // Apply growth
      const growth = balance * (secondAnnualROI / 100);
      const afterGrowthBalance = balance + growth;

      // Apply withdrawal
      const endOfYearBalance = afterGrowthBalance - netWithdrawal;

      yearData.incomeRequired = incomeRequired;
      yearData.postRetirementIncome = totalPostRetirementIncome;
      yearData.withdrawal = netWithdrawal;
      yearData.growth = growth;
      yearData.balance = endOfYearBalance;

      // Check if funds depleted (balance goes negative or zero)
      if (endOfYearBalance <= 0 && ageFundsDepleted === 0) {
        ageFundsDepleted = year;
        success = false;
      }

      balance = endOfYearBalance;
      yearByYearData.push(yearData);

      // Stop if balance is negative or zero
      if (balance <= 0) {
        balance = 0;
        break;
      }

      // Apply inflation to income requirement for next year
      currentInflationAdjustedIncome *= (1 + annualInflationRate / 100);
    }

    finalEstateAmount = balance;

    // Determine success: funds must last to life expectancy
    // If desired estate is specified, must also meet that goal
    if (ageFundsDepleted === 0) {
      // Money lasted to life expectancy
      if (desiredEstate > 0) {
        // User specified an estate goal - check if we met it
        success = balance >= desiredEstate;
      } else {
        // No estate goal specified - just need to make it to life expectancy
        success = true;
      }
    } else {
      // Money ran out before life expectancy - always a failure
      success = false;
    }

    // Calculate total post-retirement income at retirement age for display
    let totalPostRetirementIncomeAtRetirement = 0;
    retirementIncomeSources.forEach(source => {
      if (source.enabled && retirementAge >= source.startAge) {
        totalPostRetirementIncomeAtRetirement += source.monthlyAmount * 12;
      }
    });

    setResults({
      totalContributions,
      balanceAtRetirement,
      inflationAdjustedIncomeGoal,
      totalPostRetirementIncome: totalPostRetirementIncomeAtRetirement,
      requiredWithdrawalFirstYear,
      ageFundsDepleted,
      finalEstateAmount,
      success,
      yearByYearData,
    });

    setCalculationDone(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {/* Header */}
      <Header 
        onMenuClick={onMenuClick} 
        onLogoClick={onBack}
        onProfileClick={onProfileClick}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-[#799952] p-3 rounded-full">
              <PiggyBank className="size-8 text-[#fff5d6]" />
            </div>
            <h1 className="text-[#45280b]">Retirement Calculator</h1>
          </div>
          <p className="text-[#45280b]/70 max-w-2xl mx-auto">
            Year-by-year simulation to accurately project your retirement readiness
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <Calculator className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Comprehensive Retirement Calculator</h2>
          </div>

          <p className="text-[#45280b]/70 mb-6">
            Enter your financial information for an accurate year-by-year retirement projection.
          </p>

          {/* Basic Inputs */}
          <div className="mb-8">
            <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-[#799952]" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Age */}
              <div>
                <label className="block text-[#45280b] mb-2">Current Age</label>
                <input
                  type="number"
                  value={currentAge || ""}
                  onChange={(e) => setCurrentAge(parseFloat(e.target.value) || 0)}
                  placeholder="30"
                  className="w-full px-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>

              {/* Retirement Age */}
              <div>
                <label className="block text-[#45280b] mb-2">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge || ""}
                  onChange={(e) => setRetirementAge(parseFloat(e.target.value) || 0)}
                  placeholder="65"
                  className="w-full px-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>

              {/* Life Expectancy */}
              <div>
                <label className="block text-[#45280b] mb-2">Life Expectancy</label>
                <input
                  type="number"
                  value={lifeExpectancy || ""}
                  onChange={(e) => setLifeExpectancy(parseFloat(e.target.value) || 0)}
                  placeholder="90"
                  className="w-full px-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>

              {/* Current Savings */}
              <div>
                <label className="block text-[#45280b] mb-2">Current Total Savings</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                  <input
                    type="number"
                    value={currentSavings || ""}
                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                    placeholder="50000"
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                </div>
              </div>

              {/* Desired Annual Income */}
              <div>
                <label className="block text-[#45280b] mb-2">Desired Annual Retirement Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                  <input
                    type="number"
                    value={desiredAnnualIncome || ""}
                    onChange={(e) => setDesiredAnnualIncome(parseFloat(e.target.value) || 0)}
                    placeholder="60000"
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                </div>
              </div>

              {/* Desired Estate */}
              <div>
                <label className="block text-[#45280b] mb-2">Desired Estate at Death</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                  <input
                    type="number"
                    value={desiredEstate || ""}
                    onChange={(e) => setDesiredEstate(parseFloat(e.target.value) || 0)}
                    placeholder="100000"
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                </div>
              </div>

              {/* Inflation Rate */}
              <div>
                <label className="block text-[#45280b] mb-2">Annual Inflation Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualInflationRate || ""}
                    onChange={(e) => setAnnualInflationRate(parseFloat(e.target.value) || 0)}
                    placeholder="3"
                    step="0.1"
                    className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
                </div>
              </div>

              {/* Pre-retirement ROI */}
              <div>
                <label className="block text-[#45280b] mb-2">Pre-Retirement Annual ROI</label>
                <div className="relative">
                  <input
                    type="number"
                    value={firstAnnualROI || ""}
                    onChange={(e) => setFirstAnnualROI(parseFloat(e.target.value) || 0)}
                    placeholder="7"
                    step="0.1"
                    className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
                </div>
                <p className="text-xs text-[#45280b]/60 mt-1">Age {currentAge} to {retirementAge}</p>
              </div>

              {/* Post-retirement ROI */}
              <div>
                <label className="block text-[#45280b] mb-2">Post-Retirement Annual ROI</label>
                <div className="relative">
                  <input
                    type="number"
                    value={secondAnnualROI || ""}
                    onChange={(e) => setSecondAnnualROI(parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    step="0.1"
                    className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
                </div>
                <p className="text-xs text-[#45280b]/60 mt-1">Age {retirementAge} to {lifeExpectancy}</p>
              </div>
            </div>
          </div>

          {/* Reduced Income Option */}
          <div className="mb-8 p-6 bg-white/50 rounded-lg border-2 border-[#799952]/30">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setUseReducedIncome(!useReducedIncome)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  useReducedIncome 
                    ? "bg-[#799952] text-[#fff5d6]" 
                    : "bg-[#799952]/20 text-[#45280b]"
                }`}
              >
                {useReducedIncome ? "Enabled" : "Disabled"}
              </button>
              <h3 className="text-[#45280b]">Reduced Income in Later Retirement (Optional)</h3>
            </div>
            {useReducedIncome && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#45280b] text-sm mb-2">
                    Years into retirement when income reduces
                  </label>
                  <input
                    type="number"
                    value={reducedIncomeYears || ""}
                    onChange={(e) => setReducedIncomeYears(parseFloat(e.target.value) || 0)}
                    placeholder="10"
                    className="w-full px-4 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                </div>
                <div>
                  <label className="block text-[#45280b] text-sm mb-2">
                    Percentage reduction
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={reducedIncomePercent || ""}
                      onChange={(e) => setReducedIncomePercent(parseFloat(e.target.value) || 0)}
                      placeholder="20"
                      className="w-full pr-8 pl-4 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contribution Ranges */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#45280b] flex items-center gap-2">
                <PiggyBank className="size-5 text-[#799952]" />
                Contribution Ranges
              </h3>
              <button
                onClick={addContributionRange}
                className="flex items-center gap-2 px-4 py-2 bg-[#799952] text-[#fff5d6] rounded-lg hover:bg-[#578027] transition-colors"
              >
                <Plus className="size-4" />
                Add Range
              </button>
            </div>

            <div className="space-y-4">
              {contributionRanges.map((range, index) => (
                <div key={range.id} className="p-4 bg-white/50 rounded-lg border-2 border-[#799952]/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[#45280b]">Range {index + 1}</h4>
                    {contributionRanges.length > 1 && (
                      <button
                        onClick={() => removeContributionRange(range.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="size-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Start Age</label>
                      <input
                        type="number"
                        value={range.startAge || ""}
                        onChange={(e) => updateContributionRange(range.id, 'startAge', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Stop Age</label>
                      <input
                        type="number"
                        value={range.stopAge || ""}
                        onChange={(e) => updateContributionRange(range.id, 'stopAge', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Monthly $</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                        <input
                          type="number"
                          value={range.monthlyAmount || ""}
                          onChange={(e) => updateContributionRange(range.id, 'monthlyAmount', parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Annual Raise %</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={range.annualIncreasePercent || ""}
                          onChange={(e) => updateContributionRange(range.id, 'annualIncreasePercent', parseFloat(e.target.value) || 0)}
                          step="0.5"
                          placeholder="2"
                          className="w-full pr-7 pl-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retirement Income Sources */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#45280b] flex items-center gap-2">
                <Shield className="size-5 text-[#799952]" />
                Post-Retirement Income Sources
              </h3>
              <button
                onClick={addRetirementIncomeSource}
                className="flex items-center gap-2 px-4 py-2 bg-[#799952] text-[#fff5d6] rounded-lg hover:bg-[#578027] transition-colors"
              >
                <Plus className="size-4" />
                Add Source
              </button>
            </div>

            <div className="space-y-4">
              {retirementIncomeSources.map((source, index) => (
                <div key={source.id} className="p-4 bg-white/50 rounded-lg border-2 border-[#799952]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateRetirementIncomeSource(source.id, 'enabled', !source.enabled)}
                        className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                          source.enabled 
                            ? "bg-[#799952] text-[#fff5d6]" 
                            : "bg-[#799952]/20 text-[#45280b]"
                        }`}
                      >
                        {source.enabled ? "Enabled" : "Disabled"}
                      </button>
                      <input
                        type="text"
                        value={source.name}
                        onChange={(e) => updateRetirementIncomeSource(source.id, 'name', e.target.value)}
                        placeholder="Income Source Name"
                        className="px-3 py-1 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      />
                    </div>
                    {retirementIncomeSources.length > 1 && (
                      <button
                        onClick={() => removeRetirementIncomeSource(source.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="size-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Monthly Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                        <input
                          type="number"
                          value={source.monthlyAmount || ""}
                          onChange={(e) => updateRetirementIncomeSource(source.id, 'monthlyAmount', parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Start Age</label>
                      <input
                        type="number"
                        value={source.startAge || ""}
                        onChange={(e) => updateRetirementIncomeSource(source.id, 'startAge', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#45280b] text-sm mb-2">Annual Increase % (COLA)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={source.colaPercent || ""}
                          onChange={(e) => updateRetirementIncomeSource(source.id, 'colaPercent', parseFloat(e.target.value) || 0)}
                          step="0.5"
                          placeholder="2"
                          className="w-full pr-7 pl-3 py-2 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateRetirement}
            className="w-full bg-[#799952] hover:bg-[#578027] text-[#fff5d6] py-4 rounded-lg transition-colors mb-6"
          >
            Calculate Retirement Plan
          </button>

          {/* Results */}
          {calculationDone && (
            <>
              {/* Status Banner */}
              <div className={`rounded-xl p-6 mb-6 border-2 ${
                results.success
                  ? "bg-green-50 border-green-400"
                  : "bg-red-50 border-red-400"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {results.success ? (
                    <>
                      <CheckCircle className="size-8 text-green-600" />
                      <div>
                        <h3 className="text-green-800">Success! Your Plan Works 🎉</h3>
                        <p className="text-green-700 text-sm">
                          Your retirement savings will last through age {lifeExpectancy} with your desired estate intact
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="size-8 text-red-600" />
                      <div>
                        <h3 className="text-red-800">Warning: Funds May Run Out</h3>
                        <p className="text-red-700 text-sm">
                          {results.ageFundsDepleted > 0 
                            ? `Your funds may be depleted around age ${results.ageFundsDepleted}` 
                            : "Your final estate may be below your desired amount"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Key Results */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/50 rounded-lg p-4 border-2 border-[#799952]/30">
                  <p className="text-[#45280b]/70 text-sm mb-1">Total Contributions</p>
                  <p className="text-2xl text-[#578027]">
                    {formatCurrency(results.totalContributions)}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-2 border-[#799952]/30">
                  <p className="text-[#45280b]/70 text-sm mb-1">Balance at Retirement</p>
                  <p className="text-2xl text-[#578027]">
                    {formatCurrency(results.balanceAtRetirement)}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-2 border-[#799952]/30">
                  <p className="text-[#45280b]/70 text-sm mb-1">Income Goal (Inflation-Adj)</p>
                  <p className="text-2xl text-[#578027]">
                    {formatCurrency(results.inflationAdjustedIncomeGoal)}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-2 border-[#799952]/30">
                  <p className="text-[#45280b]/70 text-sm mb-1">Final Estate</p>
                  <p className="text-2xl text-[#578027]">
                    {formatCurrency(results.finalEstateAmount)}
                  </p>
                </div>
              </div>

              {/* Withdrawal Analysis */}
              <div className="bg-white/50 rounded-lg p-6 mb-6 border-2 border-[#799952]/30">
                <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
                  <DollarSign className="size-5 text-[#799952]" />
                  First Year Withdrawal Analysis
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[#45280b]/70 text-sm mb-1">Income Needed</p>
                    <p className="text-xl text-[#45280b]">
                      {formatCurrency(results.inflationAdjustedIncomeGoal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#45280b]/70 text-sm mb-1">Other Income</p>
                    <p className="text-xl text-[#45280b]">
                      {formatCurrency(results.totalPostRetirementIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#45280b]/70 text-sm mb-1">Required Withdrawal</p>
                    <p className="text-xl text-[#578027]">
                      {formatCurrency(results.requiredWithdrawalFirstYear)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Year by Year Summary */}
              <div className="bg-white/50 rounded-lg p-6 border-2 border-[#799952]/30">
                <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-[#799952]" />
                  Assets
                </h3>
                
                {/* Area Chart */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={results.yearByYearData.map(year => ({
                        year: year.age,
                        balance: year.balance,
                      }))}
                      margin={{ top: 10, right: 30, left: 60, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#799952" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#799952" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#799952" opacity={0.2} />
                      <XAxis 
                        dataKey="year" 
                        stroke="#45280b"
                        tick={{ fill: '#45280b' }}
                        label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: '#45280b' }}
                        interval="preserveStartEnd"
                        minTickGap={30}
                      />
                      <YAxis 
                        stroke="#45280b"
                        tick={{ fill: '#45280b' }}
                        label={{ value: 'Balance', angle: -90, position: 'insideLeft', fill: '#45280b' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff5d6',
                          border: '2px solid #799952',
                          borderRadius: '8px',
                          color: '#45280b',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Balance']}
                        labelFormatter={(label) => `Age ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="rect"
                        formatter={() => 'Year End Savings Balance'}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#578027"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#balanceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Table */}
                <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-[#799952]" />
                  Year-by-Year Summary
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-[#799952] text-[#fff5d6]">
                      <tr>
                        <th className="p-2 text-left">Age</th>
                        <th className="p-2 text-left">Phase</th>
                        <th className="p-2 text-right">Contribution</th>
                        <th className="p-2 text-right">Withdrawal</th>
                        <th className="p-2 text-right">Growth</th>
                        <th className="p-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearByYearData.map((year, index) => (
                        <tr key={index} className="border-b border-[#799952]/20 hover:bg-[#799952]/5">
                          <td className="p-2 text-[#45280b]">{year.age}</td>
                          <td className="p-2 text-[#45280b]">{year.phase}</td>
                          <td className="p-2 text-right text-[#45280b]">
                            {year.contributions ? formatCurrency(year.contributions) : '-'}
                          </td>
                          <td className="p-2 text-right text-[#45280b]">
                            {year.withdrawal ? formatCurrency(year.withdrawal) : '-'}
                          </td>
                          <td className="p-2 text-right text-green-700">
                            {formatCurrency(year.growth)}
                          </td>
                          <td className="p-2 text-right text-[#578027]">
                            {formatCurrency(year.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!calculationDone && (
            <div className="text-center py-8 bg-[#799952]/5 rounded-lg border-2 border-dashed border-[#799952]/30">
              <PiggyBank className="size-12 text-[#799952]/50 mx-auto mb-3" />
              <p className="text-[#45280b]/60">
                Configure your inputs and click Calculate to see your year-by-year projection
              </p>
            </div>
          )}
        </div>

        {/* Retirement Readiness Checklist */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <CheckCircle className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Retirement Readiness Checklist</h2>
          </div>

          <p className="text-[#45280b]/70 mb-6">
            Make sure you can check off these important retirement planning milestones:
          </p>

          <div className="space-y-4">
            {[
              { question: "Are you saving at least 15–25% for retirement?", icon: Percent },
              { question: "Do you have tax-diversified accounts (Traditional, Roth, and Taxable)?", icon: DollarSign },
              { question: "Is your investment strategy appropriate for your age and goals?", icon: Target },
              { question: "Do you have a fully funded emergency fund?", icon: Shield },
              { question: "Are you taking full advantage of employer match?", icon: Award },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-[#799952]/20">
                <item.icon className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                <p className="text-[#45280b]/80">{item.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retirement Education */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <Book className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Retirement Education</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* How Much to Save by Decade */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <Calendar className="size-5 text-[#799952]" />
                How Much Should You Save Per Decade?
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>20s:</strong> Save at least 15% of gross income. Start early for compound growth!</p>
                <p><strong>30s:</strong> Aim for 15-20%. You should have 1x salary saved by age 30.</p>
                <p><strong>40s:</strong> Save 20-25%. Target 3x salary saved by age 40.</p>
                <p><strong>50s:</strong> Save 25%+. Aim for 6x salary saved by age 50.</p>
                <p><strong>60s:</strong> Save aggressively, 30%+. Goal: 8-10x salary by retirement.</p>
              </div>
            </div>

            {/* Roth vs Traditional */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <DollarSign className="size-5 text-[#799952]" />
                Roth vs. Traditional
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>Traditional:</strong> Pre-tax contributions, taxed in retirement. Good if you expect lower tax rate later.</p>
                <p><strong>Roth:</strong> After-tax contributions, tax-free withdrawals. Ideal if you expect higher tax rate later or want tax flexibility.</p>
                <p><strong>Best Strategy:</strong> Have both! Tax diversification gives you control over your tax liability in retirement.</p>
              </div>
            </div>

            {/* Asset Allocation by Age */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <Target className="size-5 text-[#799952]" />
                Asset Allocation by Age
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>Rule of 110:</strong> Subtract your age from 110 to get stock percentage. Rest in bonds.</p>
                <p><strong>Age 30:</strong> 80% stocks, 20% bonds</p>
                <p><strong>Age 50:</strong> 60% stocks, 40% bonds</p>
                <p><strong>Age 65:</strong> 45% stocks, 55% bonds</p>
                <p><strong>Note:</strong> Adjust based on risk tolerance and financial situation.</p>
              </div>
            </div>

            {/* Withdrawal Strategies */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <TrendingUp className="size-5 text-[#799952]" />
                Withdrawal Strategies
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>4% Rule:</strong> Withdraw 4% of portfolio annually. Historical 95% success rate over 30 years.</p>
                <p><strong>Dynamic Withdrawals:</strong> Adjust based on portfolio performance. Spend more in good years, less in bad.</p>
                <p><strong>Bucket Strategy:</strong> Divide portfolio into time buckets (1-3 years cash, 3-10 years bonds, 10+ years stocks).</p>
              </div>
            </div>

            {/* Required Minimum Distributions */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <AlertTriangle className="size-5 text-[#799952]" />
                Required Minimum Distributions (RMDs)
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>What:</strong> Mandatory withdrawals from Traditional IRAs and 401(k)s starting at age 73.</p>
                <p><strong>Why:</strong> IRS wants to collect taxes on tax-deferred accounts.</p>
                <p><strong>Penalty:</strong> 50% tax on amount not withdrawn!</p>
                <p><strong>Roth Advantage:</strong> Roth IRAs have no RMDs during owner's lifetime.</p>
              </div>
            </div>

            {/* Tax-Efficient Planning */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <Percent className="size-5 text-[#799952]" />
                Tax-Efficient Retirement Planning
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>Withdrawal Order:</strong> 1) Taxable accounts, 2) Tax-deferred (Traditional), 3) Tax-free (Roth)</p>
                <p><strong>Tax Bracket Management:</strong> Withdraw enough to stay in lower brackets.</p>
                <p><strong>Roth Conversions:</strong> Convert Traditional to Roth in low-income years.</p>
                <p><strong>Qualified Charitable Distributions:</strong> Donate RMDs directly to charity tax-free.</p>
              </div>
            </div>

            {/* Social Security Basics */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <Shield className="size-5 text-[#799952]" />
                Social Security Basics
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p><strong>Full Retirement Age:</strong> 67 for those born 1960+</p>
                <p><strong>Early Claiming (62):</strong> Reduced benefits (up to 30% less)</p>
                <p><strong>Delayed Claiming (70):</strong> Increased benefits (8% per year after FRA)</p>
                <p><strong>Strategy:</strong> Delay if healthy and have other income. Longevity matters!</p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <AlertTriangle className="size-5 text-[#799952]" />
                Common Retirement Mistakes
              </h3>
              <div className="space-y-2 text-sm text-[#45280b]/80">
                <p>❌ Starting too late — compound interest needs time!</p>
                <p>❌ Not maximizing employer match — free money left on table</p>
                <p>❌ Being too conservative — inflation erodes purchasing power</p>
                <p>❌ Underestimating healthcare costs — plan $300k+ for couple</p>
                <p>❌ Claiming Social Security too early — costs thousands in lifetime benefits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
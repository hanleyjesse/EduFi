import { useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Header } from "./Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface InvestmentCalculatorProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function InvestmentCalculator({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: InvestmentCalculatorProps) {
  const [initialInvestment, setInitialInvestment] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [annualReturn, setAnnualReturn] = useState<string>("7");
  const [years, setYears] = useState<string>("30");
  const [result, setResult] = useState<{
    finalAmount: number;
    totalContributions: number;
    totalEarnings: number;
  } | null>(null);

  const calculateInvestment = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 / 12; // Monthly rate
    const periods = parseFloat(years) * 12; // Total months

    // Future value of initial investment
    const futureValueInitial = initial * Math.pow(1 + rate, periods);

    // Future value of monthly contributions (annuity)
    const futureValueMonthly = monthly * ((Math.pow(1 + rate, periods) - 1) / rate);

    const finalAmount = futureValueInitial + futureValueMonthly;
    const totalContributions = initial + (monthly * periods);
    const totalEarnings = finalAmount - totalContributions;

    setResult({
      finalAmount,
      totalContributions,
      totalEarnings,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateScenario = (additionalMonthly: number) => {
    const initial = parseFloat(initialInvestment) || 0;
    const monthly = (parseFloat(monthlyContribution) || 0) + additionalMonthly;
    const rate = parseFloat(annualReturn) / 100 / 12;
    const periods = parseFloat(years) * 12;

    const futureValueInitial = initial * Math.pow(1 + rate, periods);
    const futureValueMonthly = monthly * ((Math.pow(1 + rate, periods) - 1) / rate);
    
    return futureValueInitial + futureValueMonthly;
  };

  const calculateMonthlyForTarget = (targetIncrease: number) => {
    if (!result) return 0;
    
    const initial = parseFloat(initialInvestment) || 0;
    const currentMonthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 / 12;
    const periods = parseFloat(years) * 12;
    const targetFinal = result.finalAmount + targetIncrease;

    // Calculate future value of initial investment
    const futureValueInitial = initial * Math.pow(1 + rate, periods);
    
    // Solve for monthly contribution needed
    // targetFinal = futureValueInitial + monthly * ((1 + rate)^periods - 1) / rate
    // Solve for monthly
    const remainingNeeded = targetFinal - futureValueInitial;
    const annuityFactor = ((Math.pow(1 + rate, periods) - 1) / rate);
    const requiredMonthly = remainingNeeded / annuityFactor;
    
    return Math.max(0, requiredMonthly - currentMonthly);
  };

  const calculateYearByYearData = () => {
    if (!result) return [];
    
    const initial = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 / 12; // Monthly rate
    const totalYears = parseFloat(years);
    
    const yearlyData = [];
    const yearInterval = 1; // Show every year
    
    for (let year = yearInterval; year <= totalYears; year += yearInterval) {
      const periods = year * 12;
      
      // Calculate values at this year
      const futureValueInitial = initial * Math.pow(1 + rate, periods);
      const futureValueMonthly = monthly > 0 
        ? monthly * ((Math.pow(1 + rate, periods) - 1) / rate)
        : 0;
      
      const totalAtYear = futureValueInitial + futureValueMonthly;
      const contributionsAtYear = monthly * periods;
      const earningsAtYear = totalAtYear - initial - contributionsAtYear;
      
      yearlyData.push({
        year: `Year ${year}`,
        "Starting Amount": initial,
        "Contributions": contributionsAtYear,
        "Earnings": earningsAtYear
      });
    }
    
    return yearlyData;
  };

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {/* Header */}
      <Header onMenuClick={onMenuClick} onLogoClick={onBack} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="max-w-4xl mx-auto px-4">
        {/* Title Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#fff5d6] to-white p-8 md:p-12 rounded-2xl border-t-4 border-[#799952] shadow-lg text-center">
            <h1 className="text-[#578027] [text-shadow:rgba(0,0,0,0.1)_0px_2px_4px] mb-4">Investment Calculator</h1>
            <p className="text-[#45280b]/80 text-lg">
              Calculate the potential growth of your investments over time with compound interest.
            </p>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-[#fff5d6] rounded-lg p-6 border-2 border-[#e0af41] shadow-lg mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="initial" className="block text-[#45280b] mb-2">
                Initial Investment ($)
              </label>
              <input
                id="initial"
                type="number"
                min="0"
                step="100"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#799952] focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b]"
                placeholder="10000"
              />
            </div>

            <div>
              <label htmlFor="monthly" className="block text-[#45280b] mb-2">
                Monthly Contribution ($)
              </label>
              <input
                id="monthly"
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#799952] focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b]"
                placeholder="500"
              />
            </div>

            <div>
              <label htmlFor="return" className="block text-[#45280b] mb-2">
                Expected Annual Return (%)
              </label>
              <input
                id="return"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#799952] focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b]"
                placeholder="7"
              />
              <p className="text-xs text-[#45280b]/60 mt-1">
                Historical stock market average: ~7-10%
              </p>
            </div>

            <div>
              <label htmlFor="years" className="block text-[#45280b] mb-2">
                Investment Period (Years)
              </label>
              <input
                id="years"
                type="number"
                min="1"
                max="100"
                step="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#799952] focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b]"
                placeholder="30"
              />
            </div>
          </div>

          <button
            onClick={calculateInvestment}
            className="mt-6 w-full bg-[#799952] hover:bg-[#578027] text-[#fff5d6] py-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-[#fff5d6] rounded-lg p-6 border-2 border-[#e0af41] shadow-lg">
            <h2 className="text-[#45280b] mb-6">Your Investment Results</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#799952]/30 to-[#799952]/20 p-8 rounded-lg border-2 border-[#799952] shadow-lg ring-2 ring-[#799952]/30">
                <p className="text-[#45280b]/70 mb-3">Final Amount</p>
                <p className="text-[#45280b] text-3xl">{formatCurrency(result.finalAmount)}</p>
              </div>

              <div className="bg-[#e0af41]/10 p-6 rounded-lg border border-[#e0af41]">
                <p className="text-[#45280b]/70 text-sm mb-2">Total Contributions</p>
                <p className="text-[#45280b]">{formatCurrency(result.totalContributions)}</p>
              </div>

              <div className="bg-[#578027]/10 p-6 rounded-lg border border-[#578027]">
                <p className="text-[#45280b]/70 text-sm mb-2">Total Earnings</p>
                <p className="text-[#45280b]">{formatCurrency(result.totalEarnings)}</p>
              </div>
            </div>

            {/* Year-by-Year Breakdown */}
            <div className="mt-8">
              <h3 className="text-[#45280b] mb-4">Year-by-Year Breakdown</h3>
              <div className="bg-white p-6 rounded-lg border-2 border-[#799952]/30">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={calculateYearByYearData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#799952" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: "#45280b" }}
                      axisLine={{ stroke: "#799952" }}
                    />
                    <YAxis 
                      tick={{ fill: "#45280b" }}
                      axisLine={{ stroke: "#799952" }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff5d6",
                        border: "2px solid #e0af41",
                        borderRadius: "8px"
                      }}
                      labelStyle={{ color: "#45280b" }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="square"
                      verticalAlign="bottom"
                      height={50}
                    />
                    <Bar dataKey="Starting Amount" stackId="a" fill="#5b9bd5" />
                    <Bar dataKey="Contributions" stackId="a" fill="#799952" />
                    <Bar dataKey="Earnings" stackId="a" fill="#e0af41" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#799952]/20 rounded-lg border border-[#e0af41]">
              <p className="text-[#45280b] text-sm">
                <strong>Note:</strong> This calculator provides estimates based on compound interest. 
                Actual investment returns vary and past performance doesn't guarantee future results. 
                Consider consulting a financial advisor for personalized advice.
              </p>
            </div>

            {/* What If Scenarios */}
            <div className="mt-6">
              <h3 className="text-[#45280b] mb-4">What If You Invested More?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {/* +$100/month */}
                <div className="bg-white p-5 rounded-lg border-2 border-[#799952]/40 hover:border-[#799952] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#799952]/20 px-3 py-1 rounded-full">
                      <p className="text-[#799952] text-sm">+$100/month</p>
                    </div>
                  </div>
                  <p className="text-[#45280b]/70 text-sm mb-2">Your final amount would be</p>
                  <p className="text-[#45280b] text-xl mb-2">{formatCurrency(calculateScenario(100))}</p>
                  <p className="text-[#799952] text-sm">
                    +{formatCurrency(calculateScenario(100) - result.finalAmount)} more
                  </p>
                </div>

                {/* +$200/month */}
                <div className="bg-white p-5 rounded-lg border-2 border-[#e0af41]/40 hover:border-[#e0af41] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#e0af41]/20 px-3 py-1 rounded-full">
                      <p className="text-[#e0af41] text-sm">+$200/month</p>
                    </div>
                  </div>
                  <p className="text-[#45280b]/70 text-sm mb-2">Your final amount would be</p>
                  <p className="text-[#45280b] text-xl mb-2">{formatCurrency(calculateScenario(200))}</p>
                  <p className="text-[#e0af41] text-sm">
                    +{formatCurrency(calculateScenario(200) - result.finalAmount)} more
                  </p>
                </div>

                {/* Path to +$1M */}
                <div className="bg-gradient-to-br from-[#799952]/20 to-[#578027]/10 p-5 rounded-lg border-2 border-[#578027] shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#578027] px-3 py-1 rounded-full">
                      <p className="text-white text-sm">+$1,000,000 Goal</p>
                    </div>
                  </div>
                  <p className="text-[#45280b]/70 text-sm mb-2">You would need to add</p>
                  <p className="text-[#45280b] text-xl mb-2">{formatCurrency(calculateMonthlyForTarget(1000000))}/month</p>
                  <p className="text-[#578027] text-sm">
                    to reach {formatCurrency(result.finalAmount + 1000000)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
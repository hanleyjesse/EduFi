import { useState } from "react";
import { ArrowLeft, Car, DollarSign, TrendingDown, CheckCircle, AlertTriangle } from "lucide-react";
import { Header } from "./Header";

interface CarBuyingGuideProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function CarBuyingGuide({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: CarBuyingGuideProps) {
  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5.0);
  const [currentMonthlyCarPayments, setCurrentMonthlyCarPayments] = useState<number>(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);

  // Calculate maximum affordable car price based on 20/3/8 rule
  const calculateAffordability = () => {
    if (grossAnnualIncome === 0) {
      return {
        maxCarPrice: 0,
        downPaymentAmount: 0,
        loanAmount: 0,
        monthlyPayment: 0,
        totalMonthlyCarPayments: 0,
        maxAllowedMonthlyPayment: 0,
        meetsRule: false,
      };
    }

    // 8% rule: Total car payments should not exceed 8% of gross income
    const maxAllowedMonthlyPayment = (grossAnnualIncome * 0.08) / 12;
    
    // Available monthly payment for new car (after accounting for current payments)
    const availableMonthlyPayment = maxAllowedMonthlyPayment - currentMonthlyCarPayments;

    if (availableMonthlyPayment <= 0) {
      return {
        maxCarPrice: 0,
        downPaymentAmount: 0,
        loanAmount: 0,
        monthlyPayment: 0,
        totalMonthlyCarPayments: currentMonthlyCarPayments,
        maxAllowedMonthlyPayment,
        meetsRule: false,
      };
    }

    // 3-year rule: Finance for 3 years or less (36 months)
    const loanTermMonths = 36;
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate maximum loan amount based on available monthly payment
    // Using loan payment formula: P = (r * PV) / (1 - (1 + r)^-n)
    // Solving for PV (loan amount): PV = P * (1 - (1 + r)^-n) / r
    let maxLoanAmount = 0;
    if (monthlyInterestRate > 0) {
      maxLoanAmount = availableMonthlyPayment * (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate;
    } else {
      // If interest rate is 0, simple calculation
      maxLoanAmount = availableMonthlyPayment * loanTermMonths;
    }

    // 20% rule: At least 20% down payment
    // If down payment is X%, then loan is (100-X)% of car price
    // maxLoanAmount = maxCarPrice * (1 - downPaymentPercent/100)
    // maxCarPrice = maxLoanAmount / (1 - downPaymentPercent/100)
    const maxCarPrice = maxLoanAmount / (1 - downPaymentPercent / 100);
    const downPaymentAmount = maxCarPrice * (downPaymentPercent / 100);

    // Calculate actual monthly payment for this car
    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyPayment = (monthlyInterestRate * maxLoanAmount) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
    } else {
      monthlyPayment = maxLoanAmount / loanTermMonths;
    }

    const totalMonthlyCarPayments = monthlyPayment + currentMonthlyCarPayments;
    const meetsRule = totalMonthlyCarPayments <= maxAllowedMonthlyPayment && downPaymentPercent >= 20;

    return {
      maxCarPrice,
      downPaymentAmount,
      loanAmount: maxLoanAmount,
      monthlyPayment,
      totalMonthlyCarPayments,
      maxAllowedMonthlyPayment,
      meetsRule,
    };
  };

  const results = calculateAffordability();

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
              <Car className="size-8 text-[#fff5d6]" />
            </div>
            <h1 className="text-[#45280b]">Car Buying Guide</h1>
          </div>
          <p className="text-[#45280b]/70 max-w-2xl mx-auto">
            Make smart car buying decisions using the 20/3/8 rule and our comprehensive checklist
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <DollarSign className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Car Affordability Calculator</h2>
          </div>

          <p className="text-[#45280b]/70 mb-6">
            This calculator helps you determine how much car you can comfortably afford based on the <strong>20/3/8 rule</strong>: 
            20% down payment, 3-year loan or shorter, and car payments ≤ 8% of gross income.
          </p>

          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Gross Annual Income */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Gross Annual Income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                <input
                  type="number"
                  value={grossAnnualIncome || ""}
                  onChange={(e) => setGrossAnnualIncome(parseFloat(e.target.value) || 0)}
                  placeholder="75000"
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>
            </div>

            {/* Expected Interest Rate */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Expected Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate || ""}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  placeholder="5.0"
                  step="0.1"
                  className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
              </div>
            </div>

            {/* Current Monthly Car Payments */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Current Monthly Car Payments
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                <input
                  type="number"
                  value={currentMonthlyCarPayments || ""}
                  onChange={(e) => setCurrentMonthlyCarPayments(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>
              <p className="text-xs text-[#45280b]/60 mt-1">
                Total monthly payments on all current car loans
              </p>
            </div>

            {/* Down Payment Percentage Slider */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Down Payment: {downPaymentPercent}%
              </label>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-[#799952]/30 rounded-lg appearance-none cursor-pointer accent-[#799952]"
              />
              <div className="flex justify-between text-xs text-[#45280b]/60 mt-1">
                <span>20% (Minimum)</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          {grossAnnualIncome > 0 && (
            <>
              <div className={`rounded-xl p-6 mb-6 border-2 ${
                results.meetsRule && results.maxCarPrice > 0
                  ? "bg-[#799952]/10 border-[#799952]"
                  : "bg-red-50 border-red-400"
              }`}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Maximum Affordable Car Price */}
                  <div className="text-center">
                    <p className="text-[#45280b]/70 text-sm mb-2">Maximum Affordable Car Price</p>
                    <p className="text-4xl text-[#578027]">
                      {formatCurrency(results.maxCarPrice)}
                    </p>
                  </div>

                  {/* Required Down Payment */}
                  <div className="text-center">
                    <p className="text-[#45280b]/70 text-sm mb-2">Required Down Payment ({downPaymentPercent}%)</p>
                    <p className="text-4xl text-[#578027]">
                      {formatCurrency(results.downPaymentAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white/50 rounded-lg p-6 space-y-3">
                <h3 className="text-[#45280b] mb-4">Payment Breakdown</h3>
                
                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Loan Amount</span>
                  <span className="text-[#45280b]">{formatCurrency(results.loanAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Monthly Payment (3-year loan)</span>
                  <span className="text-[#45280b]">{formatCurrency(results.monthlyPayment)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Current Monthly Car Payments</span>
                  <span className="text-[#45280b]">{formatCurrency(currentMonthlyCarPayments)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Total Monthly Car Payments</span>
                  <span className="text-[#45280b]">{formatCurrency(results.totalMonthlyCarPayments)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b-2 border-[#799952]/40">
                  <span className="text-[#45280b]/70">Max Allowed (8% of gross income)</span>
                  <span className="text-[#45280b]">{formatCurrency(results.maxAllowedMonthlyPayment)}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-[#45280b]">Percentage of Gross Income</span>
                  <span className={`text-lg ${
                    results.totalMonthlyCarPayments <= results.maxAllowedMonthlyPayment 
                      ? "text-[#578027]" 
                      : "text-red-600"
                  }`}>
                    {grossAnnualIncome > 0 
                      ? ((results.totalMonthlyCarPayments / (grossAnnualIncome / 12)) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>

                {/* Rule Compliance Check */}
                {results.maxCarPrice === 0 ? (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800">
                        <strong>Cannot afford a new car</strong>
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        Your current car payments already exceed or equal the 8% rule. Consider paying off existing car loans before purchasing another vehicle.
                      </p>
                    </div>
                  </div>
                ) : results.meetsRule ? (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">
                      <strong>✓ Meets 20/3/8 Rule</strong> — This purchase keeps you within healthy financial boundaries.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800">
                      <strong>⚠ Warning:</strong> This purchase may strain your finances. Consider adjusting your down payment or income expectations.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {grossAnnualIncome === 0 && (
            <div className="text-center py-8 bg-[#799952]/5 rounded-lg border-2 border-dashed border-[#799952]/30">
              <Car className="size-12 text-[#799952]/50 mx-auto mb-3" />
              <p className="text-[#45280b]/60">
                Enter your gross annual income to see how much car you can afford
              </p>
            </div>
          )}
        </div>

        {/* Car-Buying Checklist */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <h2 className="text-[#45280b] mb-4">Car-Buying Checklist</h2>
          <p className="text-[#45280b]/70 mb-6">
            Buying a car is a big financial decision — and because cars lose value quickly, making a smart purchase can save you thousands. 
            While paying cash is ideal, not everyone is in a position to do so. Before you visit a dealership, work through these guidelines to protect your financial life.
          </p>

          <div className="space-y-6">
            {/* 1. Decide Whether You Can Pay Cash */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">1</span>
                Decide Whether You Can Pay Cash
              </h3>
              <p className="text-[#45280b]/80">
                If you have enough liquid savings to buy a reliable car outright, paying cash is typically the best option. 
                Just make sure your purchase leaves you with a dependable vehicle that will last your household for years — 
                not something cheap that becomes more expensive due to constant repairs.
              </p>
            </div>

            {/* 2. Know What You Want Before Going to the Dealership */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">2</span>
                Know What You Want Before Going to the Dealership
              </h3>
              <p className="text-[#45280b]/80 mb-3">
                Dealerships are intentionally designed to upsell. Show up with a plan:
              </p>
              <ul className="space-y-2 ml-10">
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  The exact car you want
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  The trim and features you need
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  What you're willing to pay
                </li>
              </ul>
              <p className="text-[#45280b]/80 mt-3">
                This prevents you from being steered toward a more expensive model you don't actually need.
              </p>
            </div>

            {/* 3. Follow the 20/3/8 Rule */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">3</span>
                Follow the 20/3/8 Rule
              </h3>
              <p className="text-[#45280b]/80 mb-4">
                Cars depreciate fast, so you need financial margin from day one. Follow these guidelines when financing a car:
              </p>

              <div className="space-y-4">
                <div className="bg-[#799952]/10 rounded-lg p-4">
                  <h4 className="text-[#45280b] mb-2">Put at least 20% down</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Helps maintain equity and reduces how fast you become "upside down" on the loan.
                  </p>
                </div>

                <div className="bg-[#799952]/10 rounded-lg p-4">
                  <h4 className="text-[#45280b] mb-2">Finance for 3 years or less</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Shorter terms protect you from long, drawn-out loans on a rapidly depreciating asset.
                  </p>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="text-[#45280b] mb-2">Luxury cars depreciate even faster</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Pay cash or limit financing to 1 year or less.
                  </p>
                </div>

                <div className="bg-[#799952]/10 rounded-lg p-4">
                  <h4 className="text-[#45280b] mb-2">Keep total car payments ≤ 8% of your gross income</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    This ensures you still have plenty of room for retirement investing, housing costs, and everyday spending.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Always Invest More Than You Spend on Cars */}
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">4</span>
                Always Invest More Than You Spend on Cars
              </h3>
              <p className="text-[#45280b]/80">
                Even if you haven't reached the goal of investing 25% of your income yet, make sure your retirement investing 
                always exceeds your car spending. Cars go down in value — your investments should grow.
              </p>
            </div>
          </div>
        </div>

        {/* Depreciation Information */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="size-6 text-red-600" />
            <h2 className="text-[#45280b]">Depreciation of New Cars</h2>
          </div>
          <p className="text-[#45280b]/80 mb-6">
            New cars lose value quickly in the first few years. This is why buying slightly used vehicles often gives you far better value — 
            and why the 20/3/8 rule is designed to protect you from the rapid depreciation.
          </p>

          {/* Depreciation Chart Visual */}
          <div className="bg-white/50 rounded-lg p-6">
            <h3 className="text-[#45280b] mb-4">Typical New Car Depreciation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-24 text-[#45280b] text-sm">Year 1</div>
                <div className="flex-1 bg-red-100 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '20%' }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[#45280b]">
                    -20% value
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 text-[#45280b] text-sm">Year 2</div>
                <div className="flex-1 bg-red-100 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '15%' }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[#45280b]">
                    -15% value
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 text-[#45280b] text-sm">Year 3</div>
                <div className="flex-1 bg-red-100 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '12%' }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[#45280b]">
                    -12% value
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 text-[#45280b] text-sm">Year 4</div>
                <div className="flex-1 bg-orange-100 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '10%' }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[#45280b]">
                    -10% value
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 text-[#45280b] text-sm">Year 5</div>
                <div className="flex-1 bg-yellow-100 rounded-full h-8 relative overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: '8%' }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[#45280b]">
                    -8% value
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#799952]/10 rounded-lg border-2 border-[#799952]/30">
              <p className="text-[#45280b] text-sm">
                <strong>💡 Key Insight:</strong> A new $30,000 car loses approximately $6,000 in value during the first year alone. 
                By year 3, it's lost over $13,500 in value. Buying a 2-3 year old certified pre-owned vehicle can save you thousands 
                while still getting a reliable car with warranty coverage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
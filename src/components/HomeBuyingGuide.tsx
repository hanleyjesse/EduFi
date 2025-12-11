import { useState } from "react";
import { House, DollarSign, CheckCircle, AlertTriangle, Calculator, TrendingUp, Users, Wrench, Key, XCircle } from "lucide-react";
import { Header } from "./Header";

interface HomeBuyingGuideProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function HomeBuyingGuide({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: HomeBuyingGuideProps) {
  const [annualGrossIncome, setAnnualGrossIncome] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [propertyTaxPercent, setPropertyTaxPercent] = useState<number>(0.2);
  const [homeInsurancePercent, setHomeInsurancePercent] = useState<number>(0.25);
  const [hoaDuesPerMonth, setHoaDuesPerMonth] = useState<number>(0);
  const [mortgageInsuranceEnabled, setMortgageInsuranceEnabled] = useState<boolean>(false);
  const [mortgageInsurancePercent, setMortgageInsurancePercent] = useState<number>(1.0);
  const [calculationDone, setCalculationDone] = useState<boolean>(false);
  const [results, setResults] = useState({
    maxHomePrice: 0,
    downPaymentPercent: 0,
    totalMonthlyPITI: 0,
    principalAndInterest: 0,
    propertyTax: 0,
    homeInsurance: 0,
    hoaDues: 0,
    mortgageInsurance: 0,
    loanAmount: 0,
    percentOfIncome: 0,
  });

  const calculateAffordability = () => {
    if (annualGrossIncome === 0) {
      setCalculationDone(false);
      return;
    }

    // Maximum monthly PITI payment should not exceed 25% of gross income
    const maxMonthlyPITI = (annualGrossIncome * 0.25) / 12;

    // We need to work backwards from max PITI to find max home price
    // PITI = P&I + Property Tax + Home Insurance + HOA + Mortgage Insurance
    // This requires iterative calculation since taxes and insurance depend on home price

    // Start with an estimate and iterate
    let maxHomePrice = 0;
    let iteration = 0;
    const maxIterations = 100;
    
    // Binary search for the maximum affordable home price
    let low = downPayment;
    let high = downPayment + (maxMonthlyPITI * loanTermYears * 12 * 2); // Upper bound estimate
    
    while (iteration < maxIterations && high - low > 100) {
      const testHomePrice = (low + high) / 2;
      const testLoanAmount = testHomePrice - downPayment;
      
      if (testLoanAmount <= 0) {
        break;
      }
      
      // Calculate components
      const monthlyPropertyTax = (testHomePrice * (propertyTaxPercent / 100)) / 12;
      const monthlyHomeInsurance = (testHomePrice * (homeInsurancePercent / 100)) / 12;
      const monthlyMortgageInsurance = mortgageInsuranceEnabled 
        ? (testLoanAmount * (mortgageInsurancePercent / 100)) / 12 
        : 0;
      
      // Calculate P&I
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      
      let monthlyPI = 0;
      if (monthlyInterestRate > 0) {
        monthlyPI = (testLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      } else {
        monthlyPI = testLoanAmount / numberOfPayments;
      }
      
      const totalMonthlyPITI = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + hoaDuesPerMonth + monthlyMortgageInsurance;
      
      if (totalMonthlyPITI <= maxMonthlyPITI) {
        low = testHomePrice;
        maxHomePrice = testHomePrice;
      } else {
        high = testHomePrice;
      }
      
      iteration++;
    }

    // Calculate final values with the maximum home price
    const finalLoanAmount = maxHomePrice - downPayment;
    const finalPropertyTax = (maxHomePrice * (propertyTaxPercent / 100)) / 12;
    const finalHomeInsurance = (maxHomePrice * (homeInsurancePercent / 100)) / 12;
    const finalMortgageInsurance = mortgageInsuranceEnabled 
      ? (finalLoanAmount * (mortgageInsurancePercent / 100)) / 12 
      : 0;
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    let finalPI = 0;
    if (monthlyInterestRate > 0) {
      finalPI = (finalLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      finalPI = finalLoanAmount / numberOfPayments;
    }
    
    const finalTotalPITI = finalPI + finalPropertyTax + finalHomeInsurance + hoaDuesPerMonth + finalMortgageInsurance;
    const downPaymentPercent = maxHomePrice > 0 ? (downPayment / maxHomePrice) * 100 : 0;
    const percentOfIncome = annualGrossIncome > 0 ? (finalTotalPITI / (annualGrossIncome / 12)) * 100 : 0;

    setResults({
      maxHomePrice,
      downPaymentPercent,
      totalMonthlyPITI: finalTotalPITI,
      principalAndInterest: finalPI,
      propertyTax: finalPropertyTax,
      homeInsurance: finalHomeInsurance,
      hoaDues: hoaDuesPerMonth,
      mortgageInsurance: finalMortgageInsurance,
      loanAmount: finalLoanAmount,
      percentOfIncome,
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
              <House className="size-8 text-[#fff5d6]" />
            </div>
            <h1 className="text-[#45280b]">Home Buying Guide</h1>
          </div>
          <p className="text-[#45280b]/70 max-w-2xl mx-auto">
            Make smart home buying decisions using the 3/5/25 rule and our comprehensive checklist
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <Calculator className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">How Much Home Can You Afford?</h2>
          </div>

          <p className="text-[#45280b]/70 mb-6">
            This calculator helps you determine your maximum affordable home price based on the <strong>3/5/25 rule</strong>: 
            3% minimum down payment (first-time buyers), 5+ year residency plan, and total PITI ≤ 25% of gross income.
          </p>

          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Annual Gross Income */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Annual Gross Income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                <input
                  type="number"
                  value={annualGrossIncome || ""}
                  onChange={(e) => setAnnualGrossIncome(parseFloat(e.target.value) || 0)}
                  placeholder="75000"
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Down Payment
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                <input
                  type="number"
                  value={downPayment || ""}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                  placeholder="20000"
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate || ""}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  placeholder="6.5"
                  step="0.1"
                  className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Loan Term (Years)
              </label>
              <input
                type="number"
                value={loanTermYears || ""}
                onChange={(e) => setLoanTermYears(parseFloat(e.target.value) || 0)}
                placeholder="30"
                className="w-full px-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
              />
            </div>

            {/* Property Tax Percentage */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Property Tax Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={propertyTaxPercent || ""}
                  onChange={(e) => setPropertyTaxPercent(parseFloat(e.target.value) || 0)}
                  placeholder="0.2"
                  step="0.1"
                  className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
              </div>
              <p className="text-xs text-[#45280b]/60 mt-1">Annual property tax as % of home value</p>
            </div>

            {/* Home Insurance Percentage */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Home Insurance Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={homeInsurancePercent || ""}
                  onChange={(e) => setHomeInsurancePercent(parseFloat(e.target.value) || 0)}
                  placeholder="0.25"
                  step="0.05"
                  className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
              </div>
              <p className="text-xs text-[#45280b]/60 mt-1">Annual insurance as % of home value</p>
            </div>

            {/* HOA Dues */}
            <div>
              <label className="block text-[#45280b] mb-2">
                HOA Dues per Month
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">$</span>
                <input
                  type="number"
                  value={hoaDuesPerMonth || ""}
                  onChange={(e) => setHoaDuesPerMonth(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
              </div>
            </div>

            {/* Mortgage Insurance */}
            <div>
              <label className="block text-[#45280b] mb-2">
                Mortgage Insurance (PMI)
              </label>
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setMortgageInsuranceEnabled(!mortgageInsuranceEnabled)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mortgageInsuranceEnabled 
                      ? "bg-[#799952] text-[#fff5d6]" 
                      : "bg-[#799952]/20 text-[#45280b]"
                  }`}
                >
                  {mortgageInsuranceEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
              {mortgageInsuranceEnabled && (
                <div className="relative">
                  <input
                    type="number"
                    value={mortgageInsurancePercent || ""}
                    onChange={(e) => setMortgageInsurancePercent(parseFloat(e.target.value) || 0)}
                    placeholder="1.0"
                    step="0.1"
                    className="w-full pr-8 pl-4 py-3 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45280b]/50">%</span>
                </div>
              )}
              <p className="text-xs text-[#45280b]/60 mt-1">
                Annual PMI as % of loan amount (typically required if down payment &lt; 20%)
              </p>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateAffordability}
            className="w-full bg-[#799952] hover:bg-[#578027] text-[#fff5d6] py-4 rounded-lg transition-colors mb-6"
          >
            Calculate Affordability
          </button>

          {/* Results */}
          {calculationDone && (
            <>
              <div className={`rounded-xl p-6 mb-6 border-2 ${
                results.maxHomePrice > 0 && results.percentOfIncome <= 25
                  ? "bg-[#799952]/10 border-[#799952]"
                  : "bg-red-50 border-red-400"
              }`}>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Maximum Home Price */}
                  <div className="text-center">
                    <p className="text-[#45280b]/70 text-sm mb-2">Maximum Home Price</p>
                    <p className="text-4xl text-[#578027]">
                      {formatCurrency(results.maxHomePrice)}
                    </p>
                  </div>

                  {/* Down Payment Percentage */}
                  <div className="text-center">
                    <p className="text-[#45280b]/70 text-sm mb-2">Down Payment %</p>
                    <p className="text-4xl text-[#578027]">
                      {results.downPaymentPercent.toFixed(1)}%
                    </p>
                  </div>

                  {/* Total Monthly PITI */}
                  <div className="text-center">
                    <p className="text-[#45280b]/70 text-sm mb-2">Total Monthly PITI</p>
                    <p className="text-4xl text-[#578027]">
                      {formatCurrency(results.totalMonthlyPITI)}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[#45280b]/70 text-sm">
                    This payment is <strong>{results.percentOfIncome.toFixed(1)}%</strong> of your gross monthly income
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white/50 rounded-lg p-6 space-y-3">
                <h3 className="text-[#45280b] mb-4">Payment Breakdown (PITI)</h3>
                
                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Principal & Interest</span>
                  <span className="text-[#45280b]">{formatCurrency(results.principalAndInterest)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Property Tax</span>
                  <span className="text-[#45280b]">{formatCurrency(results.propertyTax)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                  <span className="text-[#45280b]/70">Home Insurance</span>
                  <span className="text-[#45280b]">{formatCurrency(results.homeInsurance)}</span>
                </div>

                {results.hoaDues > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                    <span className="text-[#45280b]/70">HOA Dues</span>
                    <span className="text-[#45280b]">{formatCurrency(results.hoaDues)}</span>
                  </div>
                )}

                {mortgageInsuranceEnabled && results.mortgageInsurance > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-[#799952]/20">
                    <span className="text-[#45280b]/70">Mortgage Insurance (PMI)</span>
                    <span className="text-[#45280b]">{formatCurrency(results.mortgageInsurance)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-t-2 border-[#799952]/40 pt-4">
                  <span className="text-[#45280b]">Total Monthly Payment</span>
                  <span className="text-xl text-[#578027]">{formatCurrency(results.totalMonthlyPITI)}</span>
                </div>

                <div className="mt-4 p-4 bg-[#799952]/10 rounded-lg border-2 border-[#799952]/30">
                  <p className="text-[#45280b] text-sm">
                    <strong>Loan Amount:</strong> {formatCurrency(results.loanAmount)}
                  </p>
                </div>

                {/* Rule Compliance Check */}
                {results.maxHomePrice === 0 || results.loanAmount < 0 ? (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800">
                        <strong>Insufficient down payment</strong>
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        Your down payment exceeds what you can afford based on the 25% rule. Consider saving more income first or adjusting your parameters.
                      </p>
                    </div>
                  </div>
                ) : results.percentOfIncome <= 25 ? (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">
                      <strong>✓ Meets 25% Rule</strong> — This purchase keeps your housing costs within healthy financial boundaries.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800">
                      <strong>⚠ Warning:</strong> This exceeds the 25% guideline. Consider increasing your down payment or adjusting other parameters.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {!calculationDone && (
            <div className="text-center py-8 bg-[#799952]/5 rounded-lg border-2 border-dashed border-[#799952]/30">
              <House className="size-12 text-[#799952]/50 mx-auto mb-3" />
              <p className="text-[#45280b]/60">
                Enter your financial details and click Calculate to see results
              </p>
            </div>
          )}
        </div>

        {/* Home Buying Checklist */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <CheckCircle className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Home Buying Checklist</h2>
          </div>

          <p className="text-[#45280b]/70 mb-6">
            Before buying a home, make sure you can answer "yes" to these important questions:
          </p>

          <div className="space-y-4">
            {[
              { question: "Do you plan to live in your home at least 5 years?", icon: Key },
              { question: "What is your credit score?", icon: TrendingUp },
              { question: "Do you have a fully funded 3–6 month emergency fund?", icon: DollarSign },
              { question: "Do you have the required down payment? (Minimum 3% for first-time buyers, minimum 20% for repeat buyers)", icon: DollarSign },
              { question: "Do you have a stable job?", icon: CheckCircle },
              { question: "How is the location? (schools, safety, commute, etc.)", icon: House },
              { question: "Will this home work for your family plans?", icon: Users },
              { question: "Do you have stable cash flow to keep total PITI below 25% of gross income?", icon: Calculator },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-[#799952]/20">
                <item.icon className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                <p className="text-[#45280b]/80">{item.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Home Buying Tips */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#799952] p-2 rounded-full">
              <Wrench className="size-6 text-[#fff5d6]" />
            </div>
            <h2 className="text-[#45280b]">Home Buying Tips</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">1</span>
                Always Get an Inspection
              </h3>
              <p className="text-[#45280b]/80">
                A professional home inspection can reveal hidden issues that could cost you thousands in repairs. 
                Never skip this step, even if the home looks perfect. Budget $300-$500 for a thorough inspection, 
                and use the findings to negotiate repairs or price reductions.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">2</span>
                Plan for Property Taxes and Insurance
              </h3>
              <p className="text-[#45280b]/80">
                Many first-time buyers forget about these ongoing costs. Property taxes vary widely by location 
                (typically 0.2%-2% of home value annually), and insurance depends on your area's risk factors. 
                These are included in your PITI payment if you escrow, but you're still responsible for paying them.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3 flex items-center gap-2">
                <span className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center text-sm">3</span>
                Budget for Ongoing Maintenance and Repairs
              </h3>
              <p className="text-[#45280b]/80">
                Plan to spend 1-2% of your home's value annually on maintenance and repairs. For a $300,000 home, 
                that's $3,000-$6,000 per year. This covers everything from HVAC servicing to roof repairs to 
                appliance replacements. Don't let your emergency fund handle these — save separately for home maintenance.
              </p>
            </div>
          </div>
        </div>

        {/* Should You Buy or Rent? */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <h2 className="text-[#45280b] mb-4">Should You Buy or Rent?</h2>
          <p className="text-[#45280b]/70 mb-6">
            The decision to buy versus rent depends on your personal situation, local market conditions, and financial goals. 
            Here are key factors to consider:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Reasons to Buy */}
            <div className="bg-white/50 rounded-lg p-6">
              <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                Consider Buying If...
              </h3>
              <ul className="space-y-3">
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You plan to stay in the area for 5+ years</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You have a stable income and emergency fund</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You can afford 20% down to avoid PMI</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Local home prices are reasonable relative to rent</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You want the freedom to customize your space</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You're ready for homeownership responsibilities</span>
                </li>
              </ul>
            </div>

            {/* Reasons to Rent */}
            <div className="bg-white/50 rounded-lg p-6">
              <h3 className="text-[#45280b] mb-4 flex items-center gap-2">
                <XCircle className="size-5 text-[#799952]" />
                Consider Renting If...
              </h3>
              <ul className="space-y-3">
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>You might relocate within 5 years</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>You're still building your emergency fund</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>You don't have a down payment saved</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>Home prices are very high compared to rent in your area</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>You value flexibility and minimal maintenance responsibility</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <span className="text-[#799952] mt-1">•</span>
                  <span>You're focused on paying off high-interest debt first</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#799952]/10 rounded-lg border-2 border-[#799952]/30">
            <p className="text-[#45280b] text-sm">
              <strong>💡 Key Insight:</strong> There's no universal right answer. Calculate your local "price-to-rent ratio" 
              by dividing median home prices by annual rent. If it's above 20, renting may make more financial sense. 
              Below 15, buying often wins. Between 15-20, it depends on your personal situation.
            </p>
          </div>
        </div>

        {/* When Should You Refinance? */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8 mb-8">
          <h2 className="text-[#45280b] mb-4">When Should You Refinance?</h2>
          <p className="text-[#45280b]/70 mb-6">
            Refinancing can save you thousands over the life of your loan, but it's not always the right move. 
            Consider refinancing when:
          </p>

          <div className="space-y-4">
            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3">Interest Rates Drop Significantly</h3>
              <p className="text-[#45280b]/80">
                As a general rule, refinancing makes sense if you can reduce your rate by at least 0.75-1%. 
                For example, refinancing from 6.5% to 5.5% on a $300,000 loan could save you over $100/month.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3">Your Credit Score Improves</h3>
              <p className="text-[#45280b]/80">
                If your credit score has increased significantly since you bought your home, you may qualify for 
                better rates. A jump from 680 to 760+ could mean substantial savings.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3">You Want to Eliminate PMI</h3>
              <p className="text-[#45280b]/80">
                If your home value has increased and you now have 20%+ equity, refinancing can eliminate PMI 
                (typically 0.5-1% of the loan amount annually). This can save hundreds per month.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-6 border-l-4 border-[#799952]">
              <h3 className="text-[#45280b] mb-3">You Want to Switch Loan Terms</h3>
              <p className="text-[#45280b]/80">
                Consider refinancing from a 30-year to a 15-year mortgage if you can afford higher payments. 
                You'll pay much less interest over time and build equity faster. Or switch from 15-year to 30-year 
                to lower monthly payments if needed.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            <p className="text-[#45280b] text-sm">
              <strong>⚠️ Important:</strong> Calculate your break-even point before refinancing. 
              If closing costs are $5,000 and you save $150/month, it takes 33 months to break even. 
              Only refinance if you'll stay in the home longer than the break-even period.
            </p>
          </div>
        </div>

        {/* House Hacking */}
        <div className="bg-[#fff5d6] rounded-2xl border-4 border-[#e0af41] shadow-2xl p-8">
          <h2 className="text-[#45280b] mb-4">House Hacking</h2>
          <p className="text-[#45280b]/70 mb-6">
            House hacking is a strategy where you live in a property while renting out part of it to generate income. 
            This can dramatically reduce or even eliminate your housing costs.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-[#45280b] mb-3">Common House Hacking Strategies</h3>
              <div className="space-y-4">
                <div className="bg-white/50 rounded-lg p-4 border-l-4 border-[#799952]">
                  <h4 className="text-[#45280b] mb-2">Rent Out Extra Bedrooms</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Buy a 3-4 bedroom home and rent individual rooms to roommates. This works great for single buyers 
                    or couples without kids who don't mind sharing common spaces.
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-l-4 border-[#799952]">
                  <h4 className="text-[#45280b] mb-2">Duplex, Triplex, or Fourplex</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Live in one unit and rent out the others. You can often qualify for owner-occupied financing 
                    (lower down payment, better rates) even though it's a multi-unit property.
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-l-4 border-[#799952]">
                  <h4 className="text-[#45280b] mb-2">Accessory Dwelling Unit (ADU)</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Convert a basement, garage, or build a backyard cottage to rent out. Many cities now allow ADUs, 
                    and they can generate $1,000-$2,500+ per month depending on your market.
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4 border-l-4 border-[#799952]">
                  <h4 className="text-[#45280b] mb-2">Short-Term Rentals</h4>
                  <p className="text-[#45280b]/70 text-sm">
                    Rent a spare room or separate space on Airbnb/VRBO. This can generate higher income than long-term 
                    rentals, but requires more management and may have local regulations to consider.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#799952]/10 rounded-lg p-6 border-2 border-[#799952]/30">
              <h3 className="text-[#45280b] mb-3">Benefits of House Hacking</h3>
              <ul className="space-y-2">
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  <span>Dramatically reduce or eliminate your housing costs</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  <span>Build equity while others pay your mortgage</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  <span>Learn landlord skills without full investment property risk</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  <span>Free up cash flow for investments, debt payoff, or savings</span>
                </li>
                <li className="text-[#45280b]/80 flex items-start gap-2">
                  <CheckCircle className="size-5 text-[#799952] flex-shrink-0 mt-0.5" />
                  <span>Qualify for owner-occupied financing with lower down payments</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <p className="text-[#45280b] text-sm">
                <strong>⚠️ Considerations:</strong> House hacking requires giving up some privacy and taking on landlord 
                responsibilities. Make sure you're comfortable with tenant screening, lease agreements, maintenance requests, 
                and having others in your living space. Also verify local zoning laws and HOA restrictions before purchasing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
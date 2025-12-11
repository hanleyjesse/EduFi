import { useState } from "react";
import { ArrowLeft, Plus, Trash2, TrendingDown, Target } from "lucide-react";
import { Header } from "./Header";

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
}

interface DebtPayoffCalculatorProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

interface PayoffSchedule {
  month: number;
  debtName: string;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

interface DebtForm {
  id: string;
  name: string;
  balance: string;
  minimumPayment: string;
  interestRate: string;
}

export function DebtPayoffCalculator({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: DebtPayoffCalculatorProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [method, setMethod] = useState<"snowball" | "avalanche">("avalanche");
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  // Form state for adding new debts - now supports multiple forms
  const [debtForms, setDebtForms] = useState<DebtForm[]>([{
    id: Date.now().toString(),
    name: "",
    balance: "",
    minimumPayment: "",
    interestRate: ""
  }]);

  const updateDebtForm = (id: string, field: keyof DebtForm, value: string) => {
    setDebtForms(debtForms.map(form => 
      form.id === id ? { ...form, [field]: value } : form
    ));
  };

  const addDebt = (formId: string) => {
    const form = debtForms.find(f => f.id === formId);
    if (form && form.name && form.balance && form.minimumPayment && form.interestRate) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: form.name,
        balance: parseFloat(form.balance),
        minimumPayment: parseFloat(form.minimumPayment),
        interestRate: parseFloat(form.interestRate)
      };
      setDebts([...debts, debt]);
      
      // Just clear the single form - don't create new ones
      setDebtForms([{
        id: Date.now().toString(),
        name: "",
        balance: "",
        minimumPayment: "",
        interestRate: ""
      }]);
    }
  };

  const removeDebtForm = (formId: string) => {
    if (debtForms.length > 1) {
      setDebtForms(debtForms.filter(f => f.id !== formId));
    }
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const calculatePayoff = () => {
    if (debts.length === 0) return null;

    let debtsCopy = debts.map(d => ({ ...d, remainingBalance: d.balance }));
    const monthlySchedule: PayoffSchedule[] = [];
    let month = 0;
    let totalInterestPaid = 0;

    // Calculate total minimum payment - this stays constant
    const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
    const totalAvailable = totalMinimum + extraPayment;

    while (debtsCopy.some(d => d.remainingBalance > 0) && month < 600) {
      month++;

      // Re-sort based on method for each iteration
      if (method === "snowball") {
        debtsCopy.sort((a, b) => {
          if (a.remainingBalance === 0) return 1;
          if (b.remainingBalance === 0) return -1;
          return a.remainingBalance - b.remainingBalance;
        });
      } else {
        debtsCopy.sort((a, b) => {
          if (a.remainingBalance === 0) return 1;
          if (b.remainingBalance === 0) return -1;
          return b.interestRate - a.interestRate;
        });
      }

      // Step 1: Add interest to all active debts
      const debtsWithInterest: Array<{debt: typeof debtsCopy[0], interestCharge: number, balanceWithInterest: number}> = [];
      for (const debt of debtsCopy) {
        if (debt.remainingBalance > 0) {
          const monthlyRate = debt.interestRate / 100 / 12;
          const interestCharge = debt.remainingBalance * monthlyRate;
          const balanceWithInterest = debt.remainingBalance + interestCharge;
          debtsWithInterest.push({ debt, interestCharge, balanceWithInterest });
          totalInterestPaid += interestCharge;
        }
      }

      // Step 2: Pay minimums on all debts first
      let remainingPayment = totalAvailable;
      const payments: Array<{debt: typeof debtsCopy[0], payment: number, interestCharge: number}> = [];

      for (const item of debtsWithInterest) {
        const originalDebt = debts.find(d => d.id === item.debt.id);
        const minimumPayment = originalDebt?.minimumPayment || 0;
        
        // Pay minimum or balance (whichever is less), but only if we have money left
        const paymentAmount = Math.min(minimumPayment, item.balanceWithInterest, remainingPayment);
        
        payments.push({
          debt: item.debt,
          payment: paymentAmount,
          interestCharge: item.interestCharge
        });
        
        remainingPayment -= paymentAmount;
      }

      // Step 3: Apply any remaining payment to debts in priority order
      for (let i = 0; i < debtsWithInterest.length && remainingPayment > 0.01; i++) {
        const item = debtsWithInterest[i];
        const currentPayment = payments[i].payment;
        const balanceAfterMinimum = item.balanceWithInterest - currentPayment;
        
        if (balanceAfterMinimum > 0) {
          // This debt can take more payment
          const additionalPayment = Math.min(remainingPayment, balanceAfterMinimum);
          payments[i].payment += additionalPayment;
          remainingPayment -= additionalPayment;
        }
      }

      // Step 4: Apply payments and record
      for (let i = 0; i < debtsWithInterest.length; i++) {
        const { debt, interestCharge } = payments[i];
        const payment = payments[i].payment;
        const principalPayment = Math.max(0, payment - interestCharge);
        
        debt.remainingBalance = debtsWithInterest[i].balanceWithInterest - payment;
        if (debt.remainingBalance < 0.01) debt.remainingBalance = 0;

        if (payment > 0) {
          monthlySchedule.push({
            month,
            debtName: debt.name,
            payment,
            interest: interestCharge,
            principal: principalPayment,
            remainingBalance: debt.remainingBalance
          });
        }
      }
    }

    return {
      totalMonths: month,
      totalInterestPaid,
      schedule: monthlySchedule,
      payoffDate: new Date(new Date().setMonth(new Date().getMonth() + month))
    };
  };

  const results = showResults ? calculatePayoff() : null;

  // Calculate comparison with no extra payment
  const calculateComparison = () => {
    if (extraPayment === 0 || debts.length === 0) return null;

    const withExtra = calculatePayoff();
    
    const tempResults = (() => {
      let debtsCopy = debts.map(d => ({ ...d, remainingBalance: d.balance }));
      let month = 0;
      let totalInterestPaid = 0;

      const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

      while (debtsCopy.some(d => d.remainingBalance > 0) && month < 600) {
        month++;

        // Re-sort based on method for each iteration
        if (method === "snowball") {
          debtsCopy.sort((a, b) => {
            if (a.remainingBalance === 0) return 1;
            if (b.remainingBalance === 0) return -1;
            return a.remainingBalance - b.remainingBalance;
          });
        } else {
          debtsCopy.sort((a, b) => {
            if (a.remainingBalance === 0) return 1;
            if (b.remainingBalance === 0) return -1;
            return b.interestRate - a.interestRate;
          });
        }

        // Step 1: Add interest to all active debts
        const debtsWithInterest: Array<{debt: typeof debtsCopy[0], interestCharge: number, balanceWithInterest: number}> = [];
        for (const debt of debtsCopy) {
          if (debt.remainingBalance > 0) {
            const monthlyRate = debt.interestRate / 100 / 12;
            const interestCharge = debt.remainingBalance * monthlyRate;
            const balanceWithInterest = debt.remainingBalance + interestCharge;
            debtsWithInterest.push({ debt, interestCharge, balanceWithInterest });
            totalInterestPaid += interestCharge;
          }
        }

        // Step 2: Pay minimums on all debts first
        let remainingPayment = totalMinimum;
        const payments: Array<{debt: typeof debtsCopy[0], payment: number}> = [];

        for (const item of debtsWithInterest) {
          const originalDebt = debts.find(d => d.id === item.debt.id);
          const minimumPayment = originalDebt?.minimumPayment || 0;
          
          const paymentAmount = Math.min(minimumPayment, item.balanceWithInterest, remainingPayment);
          
          payments.push({
            debt: item.debt,
            payment: paymentAmount
          });
          
          remainingPayment -= paymentAmount;
        }

        // Step 3: Apply any remaining payment to debts in priority order
        for (let i = 0; i < debtsWithInterest.length && remainingPayment > 0.01; i++) {
          const item = debtsWithInterest[i];
          const currentPayment = payments[i].payment;
          const balanceAfterMinimum = item.balanceWithInterest - currentPayment;
          
          if (balanceAfterMinimum > 0) {
            const additionalPayment = Math.min(remainingPayment, balanceAfterMinimum);
            payments[i].payment += additionalPayment;
            remainingPayment -= additionalPayment;
          }
        }

        // Step 4: Apply payments
        for (let i = 0; i < debtsWithInterest.length; i++) {
          const debt = payments[i].debt;
          const payment = payments[i].payment;
          
          debt.remainingBalance = debtsWithInterest[i].balanceWithInterest - payment;
          if (debt.remainingBalance < 0.01) debt.remainingBalance = 0;
        }
      }

      return { totalMonths: month, totalInterestPaid };
    })();

    if (!withExtra) return null;

    return {
      monthsSaved: tempResults.totalMonths - withExtra.totalMonths,
      interestSaved: tempResults.totalInterestPaid - withExtra.totalInterestPaid
    };
  };

  const comparison = showResults && extraPayment > 0 ? calculateComparison() : null;

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      <Header onMenuClick={onMenuClick} onLogoClick={onBack} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#578027] hover:text-[#45280b] mb-6 transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#fff5d6] to-white p-8 rounded-2xl border-t-4 border-[#799952] shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#799952] p-4 rounded-full">
              <Target className="size-8 text-[#fff5d6]" />
            </div>
            <div>
              <h1 className="text-[#45280b]">Debt Payoff Strategy Calculator</h1>
              <p className="text-[#45280b]/70">Create your personalized debt elimination plan</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Add Debt Form */}
            <div className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30">
              <h3 className="text-[#45280b] mb-4">Add Your Debts</h3>
              
              <div className="space-y-3">
                {debtForms.map(form => (
                  <div key={form.id} className="flex flex-col md:flex-row gap-3 md:items-end">
                    <div className="flex-[2]">
                      <label className="block text-xs text-[#45280b]/70 mb-2">Debt Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Credit Card"
                        value={form.name}
                        onChange={(e) => updateDebtForm(form.id, "name", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-sm"
                      />
                    </div>

                    <div className="flex-[1.5]">
                      <label className="block text-xs text-[#45280b]/70 mb-2">Balance ($)</label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={form.balance}
                        onChange={(e) => updateDebtForm(form.id, "balance", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <div className="flex-[1.2]">
                      <label className="block text-xs text-[#45280b]/70 mb-2">Min. Payment</label>
                      <input
                        type="number"
                        placeholder="150"
                        value={form.minimumPayment}
                        onChange={(e) => updateDebtForm(form.id, "minimumPayment", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs text-[#45280b]/70 mb-2">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="18.5"
                        value={form.interestRate}
                        onChange={(e) => updateDebtForm(form.id, "interestRate", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <div className="md:flex-none">
                      <button
                        onClick={() => addDebt(form.id)}
                        className="w-full md:w-auto px-4 md:px-6 bg-[#799952] text-[#fff5d6] py-2 rounded-lg hover:bg-[#578027] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="size-4" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debt List */}
            {debts.length > 0 && (
              <div className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30">
                <h3 className="text-[#45280b] mb-4">Your Debts</h3>
                <div className="space-y-3">
                  {debts.map((debt) => (
                    <div key={debt.id} className="bg-white p-4 rounded-lg border border-[#799952]/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#45280b]">{debt.name}</h4>
                        <button
                          onClick={() => removeDebt(debt.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-[#45280b]/60">Balance:</span>
                          <p className="text-[#45280b]">${debt.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-[#45280b]/60">Min. Payment:</span>
                          <p className="text-[#45280b]">${debt.minimumPayment}</p>
                        </div>
                        <div>
                          <span className="text-[#45280b]/60">Rate:</span>
                          <p className="text-[#45280b]">{debt.interestRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#799952]/20">
                  <div className="flex justify-between text-[#45280b]">
                    <span>Total Debt:</span>
                    <span>${totalDebt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#45280b] mt-1">
                    <span>Total Min. Payment:</span>
                    <span>${totalMinimum.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
            )}

            {/* Strategy Selection */}
            {debts.length > 0 && (
              <div className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30">
                <h3 className="text-[#45280b] mb-4">Payoff Strategy</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setMethod("avalanche")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        method === "avalanche"
                          ? "border-[#799952] bg-[#799952]/10"
                          : "border-[#799952]/30 bg-white"
                      }`}
                    >
                      <h4 className="text-[#45280b] mb-1">Avalanche</h4>
                      <p className="text-sm text-[#45280b]/70">Highest interest first</p>
                      <p className="text-xs text-[#45280b]/60 mt-2">Saves most money</p>
                    </button>

                    <button
                      onClick={() => setMethod("snowball")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        method === "snowball"
                          ? "border-[#799952] bg-[#799952]/10"
                          : "border-[#799952]/30 bg-white"
                      }`}
                    >
                      <h4 className="text-[#45280b] mb-1">Snowball</h4>
                      <p className="text-sm text-[#45280b]/70">Smallest balance first</p>
                      <p className="text-xs text-[#45280b]/60 mt-2">Quick wins motivate</p>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-[#45280b]/70 mb-1">
                      Extra Monthly Payment ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={extraPayment || ""}
                      onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-[#45280b]/60 mt-1">
                      Total monthly payment: ${(totalMinimum + extraPayment).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowResults(true)}
                    className="w-full bg-[#799952] text-[#fff5d6] py-3 rounded-lg hover:bg-[#578027] transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingDown className="size-5" />
                    Calculate Payoff Plan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {showResults && results && (
              <>
                {/* Summary */}
                <div className="bg-gradient-to-br from-[#799952] to-[#578027] p-6 rounded-xl shadow-lg text-[#fff5d6]">
                  <h3 className="mb-4">Your Payoff Summary</h3>
                  <div className="space-y-3">
                    <div className="bg-white/10 p-4 rounded-lg">
                      <p className="text-sm text-[#fff5d6]/80">Debt-Free Date</p>
                      <p className="text-2xl">{results.payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-sm text-[#fff5d6]/80">Time to Payoff</p>
                        <p className="text-xl">{results.totalMonths} months</p>
                        <p className="text-xs text-[#fff5d6]/70">{(results.totalMonths / 12).toFixed(1)} years</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-sm text-[#fff5d6]/80">Total Interest</p>
                        <p className="text-xl">${results.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                {comparison && (
                  <div className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#e0af41]">
                    <h3 className="text-[#45280b] mb-4">Impact of Extra ${extraPayment}/month</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">Time Saved</p>
                        <p className="text-2xl text-green-900">{comparison.monthsSaved} months</p>
                        <p className="text-xs text-green-700">{(comparison.monthsSaved / 12).toFixed(1)} years earlier</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">Interest Saved</p>
                        <p className="text-2xl text-green-900">${comparison.interestSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payoff Order */}
                <div className="bg-[#fff5d6] p-6 rounded-xl border-2 border-[#799952]/30">
                  <h3 className="text-[#45280b] mb-4">Payoff Order ({method === "avalanche" ? "Avalanche" : "Snowball"})</h3>
                  <div className="space-y-2">
                    {(() => {
                      const sortedDebts = [...debts];
                      if (method === "snowball") {
                        sortedDebts.sort((a, b) => a.balance - b.balance);
                      } else {
                        sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
                      }
                      
                      // Calculate payoff month for each debt
                      const payoffMonths = sortedDebts.map(debt => {
                        const lastPayment = results.schedule
                          .filter(s => s.debtName === debt.name)
                          .sort((a, b) => b.month - a.month)[0];
                        return lastPayment?.month || 0;
                      });

                      return sortedDebts.map((debt, index) => (
                        <div key={debt.id} className="bg-white p-3 rounded-lg border border-[#799952]/20 flex items-center gap-3">
                          <div className="bg-[#799952] text-[#fff5d6] size-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-[#45280b]">{debt.name}</p>
                            <p className="text-sm text-[#45280b]/60">
                              ${debt.balance.toLocaleString()} at {debt.interestRate}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#45280b]/70">Paid off in</p>
                            <p className="text-[#45280b]">{payoffMonths[index]} months</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </>
            )}

            {debts.length === 0 && (
              <div className="bg-[#fff5d6] p-12 rounded-xl border-2 border-[#799952]/30 text-center">
                <TrendingDown className="size-16 text-[#799952]/40 mx-auto mb-4" />
                <h3 className="text-[#45280b] mb-2">No Debts Added Yet</h3>
                <p className="text-[#45280b]/70">
                  Add your debts on the left to see your personalized payoff strategy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
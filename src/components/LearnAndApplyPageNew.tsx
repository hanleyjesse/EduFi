import { useState } from "react";
import { ArrowLeft, BookOpen, Search, DollarSign, TrendingUp, Shield, PiggyBank, CreditCard, Target, BarChart3, Wallet, AlertCircle, X, ChevronDown } from "lucide-react";
import { Header } from "./Header";

interface LearnAndApplyPageProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

type TabType = "learn" | "glossary";

interface LearnModule {
  id: number;
  title: string;
  icon: React.ReactNode;
  explanation: string;
  relatedTerms: string[];
}

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  whyItMatters: string;
  example?: string;
}

export function LearnAndApplyPage({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: LearnAndApplyPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("learn");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);

  const learnModules: LearnModule[] = [
    {
      id: 1,
      title: "Budgeting Basics",
      icon: <Wallet className="size-8 text-[#578027]" />,
      explanation: "A budget is your spending plan that helps you track where your money goes each month. It ensures you're living within your means and allocating funds toward your goals. Start by listing all income sources, then categorize your expenses into needs, wants, and savings.",
      relatedTerms: ["Budget", "Cash Flow", "Savings Rate"]
    },
    {
      id: 2,
      title: "How Saving Works",
      icon: <PiggyBank className="size-8 text-[#578027]" />,
      explanation: "Saving means setting aside money for future needs or emergencies. The key is consistency—even small amounts add up over time. Automate your savings by transferring a portion of each paycheck directly into a savings account. Aim to build an emergency fund covering 3-6 months of expenses.",
      relatedTerms: ["Emergency Fund", "Savings Rate", "Liquidity"]
    },
    {
      id: 3,
      title: "Understanding Cash Flow",
      icon: <TrendingUp className="size-8 text-[#578027]" />,
      explanation: "Cash flow is the movement of money in and out of your accounts. Positive cash flow means you earn more than you spend, while negative cash flow means you're spending more than you earn. Managing cash flow well helps you avoid debt and build wealth over time.",
      relatedTerms: ["Cash Flow", "Budget", "Net Worth"]
    },
    {
      id: 4,
      title: "Debt Types & Interest",
      icon: <CreditCard className="size-8 text-[#578027]" />,
      explanation: "Not all debt is equal. High-interest debt like credit cards can quickly spiral out of control, while low-interest debt like mortgages can be managed strategically. Understanding APR (Annual Percentage Rate) helps you compare costs and prioritize which debts to pay off first.",
      relatedTerms: ["APR", "Debt-to-Income Ratio", "Principal", "Interest"]
    },
    {
      id: 5,
      title: "Credit Scores Explained",
      icon: <BarChart3 className="size-8 text-[#578027]" />,
      explanation: "Your credit score is a three-digit number (300-850) that reflects your creditworthiness. It's based on payment history, credit utilization, length of credit history, and types of credit. A higher score helps you qualify for better interest rates on loans and credit cards.",
      relatedTerms: ["Credit Score", "APR", "Debt-to-Income Ratio"]
    },
    {
      id: 6,
      title: "Basic Investment Concepts",
      icon: <BarChart3 className="size-8 text-[#578027]" />,
      explanation: "Investing means putting your money to work to grow over time. Common investments include stocks, bonds, and index funds. Diversification spreads your money across different assets to reduce risk. The power of compound interest means your earnings generate their own earnings over time.",
      relatedTerms: ["Compound Interest", "Diversification", "Index Fund", "Risk Tolerance"]
    },
    {
      id: 7,
      title: "Financial Goal Setting",
      icon: <Target className="size-8 text-[#578027]" />,
      explanation: "Setting clear financial goals gives you direction and motivation. Goals can be short-term (vacation fund), medium-term (down payment), or long-term (retirement). Make goals specific, measurable, and time-bound to track progress effectively.",
      relatedTerms: ["Budget", "Savings Rate", "Net Worth"]
    },
    {
      id: 8,
      title: "Risk vs. Reward",
      icon: <Shield className="size-8 text-[#578027]" />,
      explanation: "In finance, higher potential returns usually come with higher risk. Understanding your risk tolerance—how much uncertainty you can handle—helps you choose appropriate investments. Younger investors can typically take more risk, while those near retirement often prefer safer options.",
      relatedTerms: ["Risk Tolerance", "Diversification", "Liquidity"]
    }
  ];

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "Amortization",
      category: "Debt",
      definition: "The process of gradually paying off a loan through regular payments that cover both principal and interest over time.",
      whyItMatters: "Understanding amortization helps you see how much of each payment goes toward principal vs. interest, especially early in a loan's life.",
      example: "On a 30-year mortgage, early payments are mostly interest, but later payments are mostly principal."
    },
    {
      term: "Appraisal",
      category: "Basics",
      definition: "A professional assessment of a property's market value, typically required for mortgage approval.",
      whyItMatters: "Appraisals protect lenders and buyers by ensuring you don't overpay for property or borrow more than it's worth.",
      example: "Before approving your $300,000 mortgage, the bank requires an appraisal to confirm the home's value."
    },
    {
      term: "Appreciation",
      category: "Investing",
      definition: "The increase in an asset's value over time.",
      whyItMatters: "Appreciation builds wealth passively—your investments grow in value without additional contributions.",
      example: "A home purchased for $250,000 that's now worth $350,000 has appreciated $100,000."
    },
    {
      term: "APR",
      category: "Debt",
      definition: "Annual Percentage Rate - the yearly cost of borrowing money, expressed as a percentage.",
      whyItMatters: "APR determines how much you'll pay in interest on loans and credit cards. Lower APR means less money spent on interest.",
      example: "A credit card with 18% APR means you pay $180 in interest per year on a $1,000 balance."
    },
    {
      term: "Asset Allocation",
      category: "Investing",
      definition: "The strategy of dividing your investment portfolio among different asset categories like stocks, bonds, and cash.",
      whyItMatters: "Proper asset allocation balances risk and reward based on your age, goals, and risk tolerance.",
      example: "A 30-year-old might allocate 80% stocks and 20% bonds, while a 60-year-old might choose 50/50."
    },
    {
      term: "Asset Location",
      category: "Investing",
      definition: "The strategy of placing investments in specific account types (taxable, tax-deferred, or tax-free) to minimize taxes.",
      whyItMatters: "Strategic asset location can significantly increase your after-tax returns over time.",
      example: "Keep high-growth stocks in a Roth IRA and bonds in a traditional IRA for tax efficiency."
    },
    {
      term: "Assets",
      category: "Basics",
      definition: "Items of value that you own, such as cash, investments, real estate, or vehicles.",
      whyItMatters: "Assets contribute to your net worth and financial security. Building assets is key to wealth creation.",
      example: "Your home, retirement accounts, and savings are all assets."
    },
    {
      term: "Automation",
      category: "Basics",
      definition: "Setting up automatic transfers or payments to manage your finances without manual effort.",
      whyItMatters: "Automation ensures consistency in saving and investing, removes decision fatigue, and prevents missed payments.",
      example: "Automatically transfer 15% of each paycheck to your savings account on payday."
    },
    {
      term: "Backdoor Roth IRA",
      category: "Investing",
      definition: "A strategy for high earners to contribute to a Roth IRA by first contributing to a traditional IRA, then converting it.",
      whyItMatters: "This allows wealthy individuals who exceed Roth income limits to still benefit from tax-free retirement growth.",
      example: "If you earn $200,000, you can't contribute directly to a Roth IRA, but you can use the backdoor method."
    },
    {
      term: "Beneficiary",
      category: "Basics",
      definition: "A person or entity designated to receive assets from your accounts, insurance policies, or estate after your death.",
      whyItMatters: "Naming beneficiaries ensures your assets go to the right people and can avoid probate delays.",
      example: "You list your spouse as the primary beneficiary on your 401(k) and life insurance policy."
    },
    {
      term: "Bond",
      category: "Investing",
      definition: "A loan you make to a government or corporation in exchange for regular interest payments and return of principal at maturity.",
      whyItMatters: "Bonds provide steady income and are generally less risky than stocks, making them useful for diversification.",
      example: "A 10-year Treasury bond pays you 4% interest annually until it matures and returns your principal."
    },
    {
      term: "Budget",
      category: "Basics",
      definition: "A plan for how you'll spend and save your money over a specific period, usually monthly.",
      whyItMatters: "A budget helps you control spending, avoid debt, and allocate money toward your goals.",
      example: "Allocating 50% to needs, 30% to wants, and 20% to savings is a common budgeting framework."
    },
    {
      term: "Capital Gains",
      category: "Investing",
      definition: "The profit you make when selling an investment for more than you paid for it.",
      whyItMatters: "Capital gains are taxed differently than regular income—understanding this helps you minimize tax liability.",
      example: "Buying stock for $1,000 and selling it for $1,500 creates a $500 capital gain."
    },
    {
      term: "Cash Flow",
      category: "Basics",
      definition: "The total amount of money moving in and out of your accounts over a period of time.",
      whyItMatters: "Positive cash flow means you're earning more than you spend, which is essential for saving and investing.",
      example: "If you earn $4,000/month and spend $3,500, you have a positive cash flow of $500."
    },
    {
      term: "Cash-on-Cash Return",
      category: "Investing",
      definition: "A measure of annual pre-tax cash flow relative to the amount of cash invested, often used in real estate.",
      whyItMatters: "This metric helps you evaluate the actual cash returns on your investment, not just appreciation.",
      example: "Investing $50,000 in a rental that generates $4,000 annual cash flow yields an 8% cash-on-cash return."
    },
    {
      term: "Certificate of Deposit (CD)",
      category: "Saving",
      definition: "A savings product that holds a fixed amount of money for a fixed period at a fixed interest rate.",
      whyItMatters: "CDs offer higher interest than regular savings accounts in exchange for locking up your money.",
      example: "A 1-year CD paying 5% APY requires you to leave your $10,000 untouched for a year."
    },
    {
      term: "Collateral",
      category: "Debt",
      definition: "An asset pledged as security for a loan, which the lender can seize if you default.",
      whyItMatters: "Collateral allows you to access loans with lower interest rates but puts your assets at risk if you can't repay.",
      example: "Your home serves as collateral for your mortgage—defaulting could result in foreclosure."
    },
    {
      term: "Compound Interest",
      category: "Investing",
      definition: "Interest calculated on both the initial principal and the accumulated interest from previous periods.",
      whyItMatters: "Compound interest accelerates wealth growth over time—Einstein called it the 'eighth wonder of the world.'",
      example: "Investing $1,000 at 7% annual return grows to $1,967 in 10 years thanks to compounding."
    },
    {
      term: "Credit Score",
      category: "Credit",
      definition: "A numerical rating (300-850) that represents your creditworthiness based on your credit history.",
      whyItMatters: "Your credit score affects loan approval, interest rates, and even rental applications. Higher scores save you money.",
      example: "A score above 740 typically qualifies you for the best interest rates on mortgages and auto loans."
    },
    {
      term: "Credit Utilization",
      category: "Credit",
      definition: "The percentage of your available credit that you're currently using.",
      whyItMatters: "Keeping utilization below 30% (ideally under 10%) is crucial for maintaining a strong credit score.",
      example: "If you have a $10,000 credit limit and carry a $2,000 balance, your utilization is 20%."
    },
    {
      term: "Debt Avalanche",
      category: "Debt",
      definition: "A debt payoff strategy where you prioritize debts with the highest interest rates first.",
      whyItMatters: "This method minimizes total interest paid and gets you out of debt faster mathematically.",
      example: "Pay minimums on all debts, but throw extra money at your 24% APR credit card before tackling your 6% car loan."
    },
    {
      term: "Debt Snowball",
      category: "Debt",
      definition: "A debt payoff strategy where you prioritize the smallest balances first, regardless of interest rate.",
      whyItMatters: "Quick wins from paying off small debts create psychological momentum that keeps you motivated.",
      example: "Pay off your $500 medical bill first, then your $1,200 credit card, even if your car loan has higher interest."
    },
    {
      term: "Debt-to-Income Ratio",
      category: "Debt",
      definition: "The percentage of your monthly income that goes toward debt payments.",
      whyItMatters: "Lenders use this ratio to determine if you can afford additional debt. Lower ratios indicate better financial health.",
      example: "If you earn $5,000/month and have $1,500 in debt payments, your ratio is 30%."
    },
    {
      term: "Deduction",
      category: "Tax",
      definition: "Expenses that can be subtracted from your taxable income, reducing how much tax you owe.",
      whyItMatters: "Maximizing deductions legally lowers your tax bill and keeps more money in your pocket.",
      example: "Mortgage interest, charitable donations, and student loan interest are common tax deductions."
    },
    {
      term: "Depreciation",
      category: "Investing",
      definition: "The decline in an asset's value over time, often due to wear, age, or obsolescence.",
      whyItMatters: "Understanding depreciation helps with tax planning (rental properties) and setting realistic expectations for assets like cars.",
      example: "A new car loses 20-30% of its value in the first year due to depreciation."
    },
    {
      term: "Discretionary Spending",
      category: "Basics",
      definition: "Money spent on wants rather than needs—non-essential purchases you could eliminate if necessary.",
      whyItMatters: "Tracking discretionary spending reveals opportunities to save more without sacrificing necessities.",
      example: "Dining out, streaming subscriptions, and hobby supplies are discretionary expenses."
    },
    {
      term: "Diversification",
      category: "Investing",
      definition: "Spreading investments across different asset types to reduce risk.",
      whyItMatters: "Diversification protects your portfolio from major losses if one investment performs poorly.",
      example: "Instead of buying only tech stocks, you invest in stocks, bonds, and real estate."
    },
    {
      term: "Dividend",
      category: "Investing",
      definition: "A portion of a company's profits paid out to shareholders, typically on a quarterly basis.",
      whyItMatters: "Dividends provide passive income and can be reinvested to accelerate wealth building.",
      example: "Owning 100 shares of a stock that pays $2 annual dividends generates $200 yearly income."
    },
    {
      term: "Dollar-Cost Averaging",
      category: "Investing",
      definition: "Investing a fixed amount of money at regular intervals, regardless of market conditions.",
      whyItMatters: "DCA reduces the impact of market volatility and removes the temptation to time the market.",
      example: "Investing $500 every month into an index fund, whether the market is up or down."
    },
    {
      term: "Earned Income",
      category: "Basics",
      definition: "Money received from work, including wages, salaries, tips, and self-employment income.",
      whyItMatters: "Earned income is taxed differently than investment income and is required to contribute to retirement accounts like IRAs.",
      example: "Your $60,000 salary and $5,000 freelance income are both earned income."
    },
    {
      term: "Emergency Fund",
      category: "Saving",
      definition: "Money set aside specifically to cover unexpected expenses or income loss.",
      whyItMatters: "An emergency fund prevents you from going into debt when life throws curveballs like medical bills or job loss.",
      example: "Save 3-6 months of living expenses in a high-yield savings account for emergencies."
    },
    {
      term: "Employer Match",
      category: "Investing",
      definition: "Contributions your employer makes to your retirement account based on your own contributions.",
      whyItMatters: "Employer matches are free money—not taking full advantage is like turning down a raise.",
      example: "If your employer matches 50% up to 6% of salary, contribute at least 6% to get the full match."
    },
    {
      term: "Equity",
      category: "Basics",
      definition: "The portion of an asset you actually own after subtracting any debt owed on it.",
      whyItMatters: "Building equity increases your net worth and provides financial security.",
      example: "If your home is worth $300,000 and you owe $200,000, you have $100,000 in equity."
    },
    {
      term: "Estate Planning",
      category: "Advanced",
      definition: "The process of arranging how your assets will be distributed after your death and who will manage them.",
      whyItMatters: "Proper estate planning ensures your wishes are honored, minimizes taxes, and protects your loved ones.",
      example: "Creating a will, naming beneficiaries, and establishing trusts are all part of estate planning."
    },
    {
      term: "ETF",
      category: "Investing",
      definition: "Exchange-Traded Fund - an investment fund that holds multiple assets and trades on stock exchanges like individual stocks.",
      whyItMatters: "ETFs offer low-cost diversification and flexibility, combining benefits of mutual funds and stocks.",
      example: "The SPY ETF tracks the S&P 500, giving you exposure to 500 companies in a single purchase."
    },
    {
      term: "Financial Independence",
      category: "Advanced",
      definition: "Having enough passive income or wealth to cover your living expenses without needing to work.",
      whyItMatters: "Financial independence gives you freedom to choose how you spend your time, whether working or not.",
      example: "If your annual expenses are $40,000 and you have $1 million invested yielding 4%, you're financially independent."
    },
    {
      term: "Fixed Expenses",
      category: "Basics",
      definition: "Costs that stay the same each month, like rent, insurance, and loan payments.",
      whyItMatters: "Knowing your fixed expenses helps you budget accurately and ensures you can cover essential obligations.",
      example: "Your $1,500 rent, $300 car payment, and $100 insurance premium are fixed expenses."
    },
    {
      term: "Forced Scarcity",
      category: "Basics",
      definition: "Deliberately limiting access to your money to prevent impulse spending and encourage saving.",
      whyItMatters: "Forced scarcity automates good financial behavior by making it harder to spend than to save.",
      example: "Automatically transferring money to a savings account with no debit card creates forced scarcity."
    },
    {
      term: "Full-Time Equivalent",
      category: "Basics",
      definition: "A measurement that converts part-time work hours into the equivalent of full-time positions.",
      whyItMatters: "Understanding FTE helps you evaluate job opportunities and benefits eligibility.",
      example: "Two employees working 20 hours/week each equal 1.0 FTE (40 hours combined)."
    },
    {
      term: "Fundamental Analysis",
      category: "Investing",
      definition: "Evaluating a company's financial health and intrinsic value by analyzing financial statements, industry conditions, and management.",
      whyItMatters: "Fundamental analysis helps identify undervalued investments and avoid overpriced assets.",
      example: "Analyzing a company's revenue growth, profit margins, and debt levels before buying its stock."
    },
    {
      term: "Gross Income",
      category: "Basics",
      definition: "Your total earnings before any taxes or deductions are taken out.",
      whyItMatters: "Gross income is the starting point for calculating taxes and understanding your true earning power.",
      example: "A $60,000 salary is your gross income, even though you only take home about $45,000 after taxes."
    },
    {
      term: "Growth Stock",
      category: "Investing",
      definition: "Stock in a company expected to grow faster than the overall market, typically reinvesting profits rather than paying dividends.",
      whyItMatters: "Growth stocks offer high return potential but come with higher risk and volatility.",
      example: "Tech companies like Amazon and Tesla are considered growth stocks due to rapid expansion."
    },
    {
      term: "High-Yield Savings Account",
      category: "Saving",
      definition: "A savings account that offers significantly higher interest rates than traditional savings accounts.",
      whyItMatters: "High-yield accounts help your emergency fund and short-term savings grow faster while maintaining liquidity.",
      example: "A high-yield account paying 4.5% APY earns $450 annually on a $10,000 balance vs. $25 in a traditional account."
    },
    {
      term: "HSA",
      category: "Investing",
      definition: "Health Savings Account - a tax-advantaged account for medical expenses available with high-deductible health plans.",
      whyItMatters: "HSAs offer triple tax benefits: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.",
      example: "Contribute $4,000 to your HSA, invest it, and use it tax-free for healthcare in retirement."
    },
    {
      term: "Income Tax",
      category: "Tax",
      definition: "Tax levied by the government on your earned income, investment income, and other sources of money.",
      whyItMatters: "Understanding income tax helps you plan deductions, withholdings, and estimate your actual take-home pay.",
      example: "Federal income tax rates range from 10% to 37% depending on your income bracket."
    },
    {
      term: "Index Fund",
      category: "Investing",
      definition: "An investment fund that tracks a market index like the S&P 500, providing broad market exposure.",
      whyItMatters: "Index funds offer low-cost diversification and historically strong long-term returns.",
      example: "An S&P 500 index fund invests in the 500 largest U.S. companies automatically."
    },
    {
      term: "Inflation",
      category: "Basics",
      definition: "The rate at which the general level of prices for goods and services rises over time.",
      whyItMatters: "Inflation erodes purchasing power, meaning your money buys less over time. Investments should outpace inflation.",
      example: "With 3% inflation, an item that costs $100 today will cost $103 next year."
    },
    {
      term: "Interest",
      category: "Debt",
      definition: "The cost of borrowing money, or the earnings from saving/investing money.",
      whyItMatters: "You pay interest on debts but earn interest on savings and investments. Understanding this helps you minimize costs and maximize returns.",
      example: "A $10,000 loan at 5% interest costs $500 per year in interest charges."
    },
    {
      term: "IRA",
      category: "Investing",
      definition: "Individual Retirement Account - a tax-advantaged account for retirement savings with annual contribution limits.",
      whyItMatters: "IRAs offer tax benefits that accelerate retirement savings growth beyond regular investment accounts.",
      example: "Contribute up to $7,000 annually to a Traditional or Roth IRA (2024 limits)."
    },
    {
      term: "Itemized Deduction",
      category: "Tax",
      definition: "Specific expenses you can deduct from taxable income instead of taking the standard deduction.",
      whyItMatters: "Itemizing makes sense when your deductible expenses exceed the standard deduction, lowering your tax bill.",
      example: "Deducting $15,000 in mortgage interest, state taxes, and charity instead of the $14,600 standard deduction."
    },
    {
      term: "Know Your Number",
      category: "Advanced",
      definition: "Understanding the exact amount of money you need to achieve financial independence or retirement.",
      whyItMatters: "Knowing your number creates a clear target to work toward and helps you track progress.",
      example: "If you need $50,000/year and use the 4% rule, your number is $1.25 million."
    },
    {
      term: "Liabilities",
      category: "Basics",
      definition: "Financial obligations or debts you owe, such as loans, credit card balances, or mortgages.",
      whyItMatters: "Reducing liabilities improves your net worth and reduces financial stress.",
      example: "Student loans, car payments, and credit card debt are all liabilities."
    },
    {
      term: "Lifestyle Creep",
      category: "Basics",
      definition: "The tendency to increase spending as income rises, preventing wealth accumulation despite earning more.",
      whyItMatters: "Avoiding lifestyle creep allows you to save raises and bonuses instead of spending them.",
      example: "Getting a $10,000 raise but upgrading your car and apartment, leaving no extra savings."
    },
    {
      term: "Liquid Assets",
      category: "Basics",
      definition: "Assets that can be quickly converted to cash without significant loss of value.",
      whyItMatters: "Liquid assets provide financial flexibility for emergencies and opportunities.",
      example: "Cash, savings accounts, and stocks are liquid; real estate and collectibles are not."
    },
    {
      term: "Liquidity",
      category: "Basics",
      definition: "How quickly and easily an asset can be converted to cash without losing value.",
      whyItMatters: "High liquidity means you can access money fast in emergencies. Balance liquid and long-term assets.",
      example: "Savings accounts are highly liquid; real estate is not."
    },
    {
      term: "Marginal Tax Rate",
      category: "Tax",
      definition: "The tax rate applied to your last dollar of income—the highest bracket you fall into.",
      whyItMatters: "Understanding your marginal rate helps you make smart decisions about deductions, Roth conversions, and bonuses.",
      example: "If you're in the 24% bracket, each additional $1,000 earned costs $240 in federal tax."
    },
    {
      term: "Market Timing",
      category: "Investing",
      definition: "Attempting to predict market movements to buy low and sell high.",
      whyItMatters: "Market timing rarely works even for professionals—time IN the market beats timing the market.",
      example: "Selling stocks when the market drops, hoping to buy back cheaper, often backfires."
    },
    {
      term: "Money Market",
      category: "Saving",
      definition: "A low-risk investment vehicle that holds short-term, high-quality debt securities.",
      whyItMatters: "Money market accounts offer higher returns than savings accounts with similar safety and liquidity.",
      example: "Park your emergency fund in a money market account earning 4-5% APY."
    },
    {
      term: "Mortgage",
      category: "Debt",
      definition: "A loan used to purchase real estate, secured by the property itself.",
      whyItMatters: "Mortgages enable homeownership by spreading the cost over 15-30 years, but interest adds significant cost.",
      example: "A $300,000 mortgage at 6% over 30 years costs about $347,000 in interest alone."
    },
    {
      term: "Mutual Fund",
      category: "Investing",
      definition: "An investment vehicle that pools money from many investors to buy a diversified portfolio of stocks, bonds, or other securities.",
      whyItMatters: "Mutual funds offer professional management and diversification, though often with higher fees than ETFs.",
      example: "A mutual fund might hold 100+ stocks across various industries, managed by professionals."
    },
    {
      term: "Net Income",
      category: "Basics",
      definition: "Your take-home pay after all taxes, deductions, and withholdings are removed from gross income.",
      whyItMatters: "Net income is the actual money available for budgeting, spending, and saving.",
      example: "A $60,000 gross salary might result in $45,000 net income after taxes and 401(k) contributions."
    },
    {
      term: "Net Worth",
      category: "Basics",
      definition: "The total value of your assets minus your liabilities.",
      whyItMatters: "Net worth is the clearest measure of your overall financial health and progress over time.",
      example: "If you have $150,000 in assets and $80,000 in debt, your net worth is $70,000."
    },
    {
      term: "Opportunity Cost",
      category: "Basics",
      definition: "The value of what you give up when choosing one option over another.",
      whyItMatters: "Understanding opportunity cost helps you make better financial decisions by considering alternatives.",
      example: "Spending $50,000 on a luxury car has an opportunity cost of potential investment growth over 30 years."
    },
    {
      term: "PITI",
      category: "Debt",
      definition: "Principal, Interest, Taxes, and Insurance - the four components of a typical monthly mortgage payment.",
      whyItMatters: "Understanding PITI helps you budget accurately for homeownership beyond just the loan payment.",
      example: "A $1,800 PITI payment might include $1,200 principal/interest, $400 taxes, and $200 insurance."
    },
    {
      term: "PMI",
      category: "Debt",
      definition: "Private Mortgage Insurance - insurance that protects lenders when borrowers put down less than 20% on a home.",
      whyItMatters: "PMI adds to your monthly payment without building equity—aim to avoid it or remove it quickly.",
      example: "PMI might cost $100-200/month on a $300,000 home until you reach 20% equity."
    },
    {
      term: "Portfolio",
      category: "Investing",
      definition: "The collection of all your investments, including stocks, bonds, real estate, and other assets.",
      whyItMatters: "Managing your portfolio as a whole helps you maintain proper diversification and risk balance.",
      example: "A balanced portfolio might include 60% stocks, 30% bonds, and 10% real estate."
    },
    {
      term: "Principal",
      category: "Debt",
      definition: "The original amount of money borrowed or invested, not including interest.",
      whyItMatters: "Paying down principal reduces the total amount you owe and lowers future interest charges.",
      example: "On a $200,000 mortgage, the principal is $200,000. Interest is charged on this amount."
    },
    {
      term: "Profit Margin",
      category: "Investing",
      definition: "The percentage of revenue that becomes profit after all expenses are paid.",
      whyItMatters: "Higher profit margins indicate more efficient, profitable companies that may be better investments.",
      example: "A company with $1 million revenue and $200,000 profit has a 20% profit margin."
    },
    {
      term: "Real Rate of Return",
      category: "Investing",
      definition: "Your investment return after accounting for inflation—the actual increase in purchasing power.",
      whyItMatters: "Real returns show whether you're truly building wealth or just keeping pace with inflation.",
      example: "A 7% investment return with 3% inflation yields a 4% real rate of return."
    },
    {
      term: "Rebalancing",
      category: "Investing",
      definition: "Adjusting your portfolio back to your target asset allocation by buying and selling investments.",
      whyItMatters: "Rebalancing maintains your desired risk level and forces you to buy low and sell high.",
      example: "If stocks surge to 75% of your portfolio when you want 60%, sell some stocks and buy bonds."
    },
    {
      term: "Refinancing",
      category: "Debt",
      definition: "Replacing an existing loan with a new one, typically to get better terms or lower interest rates.",
      whyItMatters: "Refinancing can save thousands in interest over the life of a loan or lower monthly payments.",
      example: "Refinancing a mortgage from 6% to 4% on $300,000 saves about $400/month."
    },
    {
      term: "Return on Investment",
      category: "Investing",
      definition: "A measure of profitability calculated as (gain - cost) / cost, expressed as a percentage.",
      whyItMatters: "ROI helps you compare investment performance and make data-driven decisions.",
      example: "Buying stock for $1,000 that grows to $1,200 produces a 20% ROI."
    },
    {
      term: "Risk Tolerance",
      category: "Investing",
      definition: "Your ability and willingness to endure losses in your investments.",
      whyItMatters: "Understanding your risk tolerance helps you choose investments that match your comfort level and timeline.",
      example: "Younger investors often have higher risk tolerance because they have time to recover from losses."
    },
    {
      term: "Roth Conversion",
      category: "Investing",
      definition: "Converting traditional retirement account funds to a Roth account by paying taxes now for tax-free growth later.",
      whyItMatters: "Strategic Roth conversions can reduce lifetime taxes, especially in low-income years.",
      example: "Converting $20,000 from a traditional IRA to Roth IRA in a year you're between jobs."
    },
    {
      term: "Salary",
      category: "Basics",
      definition: "Fixed compensation paid regularly by an employer, typically expressed as an annual amount.",
      whyItMatters: "Understanding your salary helps you budget, negotiate raises, and evaluate job opportunities.",
      example: "A $60,000 salary typically means $5,000 gross pay per month before taxes."
    },
    {
      term: "Savings Rate",
      category: "Saving",
      definition: "The percentage of your income that you save rather than spend.",
      whyItMatters: "A higher savings rate accelerates wealth building and financial independence.",
      example: "If you earn $4,000/month and save $800, your savings rate is 20%."
    },
    {
      term: "Scarcity Mindset",
      category: "Basics",
      definition: "The belief that resources are limited and there's never enough, leading to fear-based financial decisions.",
      whyItMatters: "A scarcity mindset can prevent you from taking smart risks and investing in growth.",
      example: "Hoarding cash and avoiding all investments due to fear, missing out on long-term wealth building."
    },
    {
      term: "SEP IRA",
      category: "Investing",
      definition: "Simplified Employee Pension IRA - a retirement plan for self-employed individuals and small business owners.",
      whyItMatters: "SEP IRAs allow much higher contribution limits than traditional IRAs, perfect for entrepreneurs.",
      example: "Self-employed individuals can contribute up to 25% of net earnings or $66,000 (2024), whichever is less."
    },
    {
      term: "Side Hustle",
      category: "Basics",
      definition: "Additional income-generating work outside your primary job.",
      whyItMatters: "Side hustles accelerate debt payoff, boost savings, and can even become full-time businesses.",
      example: "Freelance writing, rideshare driving, or selling crafts online are common side hustles."
    },
    {
      term: "Standard Deduction",
      category: "Tax",
      definition: "A fixed dollar amount that reduces your taxable income, available to all taxpayers who don't itemize.",
      whyItMatters: "The standard deduction simplifies tax filing and reduces taxes for most Americans.",
      example: "The 2024 standard deduction is $14,600 for single filers and $29,200 for married couples."
    },
    {
      term: "Step-Up in Basis",
      category: "Tax",
      definition: "Resetting an inherited asset's cost basis to its market value at the time of the original owner's death.",
      whyItMatters: "Step-up basis can eliminate capital gains taxes on appreciated assets passed to heirs.",
      example: "Inheriting stock bought for $10,000 now worth $100,000 resets the basis to $100,000, avoiding $90,000 in capital gains."
    },
    {
      term: "Target-Date Fund",
      category: "Investing",
      definition: "A mutual fund that automatically adjusts its asset allocation based on a target retirement date.",
      whyItMatters: "Target-date funds simplify retirement investing by automating diversification and risk reduction over time.",
      example: "A 2050 target-date fund starts aggressive (90% stocks) and gradually shifts conservative as 2050 approaches."
    },
    {
      term: "Tax-Loss Harvesting",
      category: "Tax",
      definition: "Selling investments at a loss to offset capital gains and reduce taxable income.",
      whyItMatters: "Tax-loss harvesting can save thousands in taxes while maintaining your desired portfolio allocation.",
      example: "Selling a losing stock for a $5,000 loss to offset a $5,000 gain from another investment."
    },
    {
      term: "Term Life Insurance",
      category: "Insurance",
      definition: "Life insurance that provides coverage for a specific period (term) at a fixed premium.",
      whyItMatters: "Term life offers affordable protection for dependents during your working years without cash value complications.",
      example: "A 20-year, $500,000 term policy might cost $30/month for a healthy 30-year-old."
    },
    {
      term: "Time in the Market",
      category: "Investing",
      definition: "The principle that staying invested long-term is more important than trying to time market highs and lows.",
      whyItMatters: "Historical data shows that time in the market beats market timing—missing the best days devastates returns.",
      example: "Staying invested through 2008-2009 crash led to full recovery and gains, while sellers locked in losses."
    },
    {
      term: "Traditional IRA",
      category: "Investing",
      definition: "A tax-deferred retirement account where contributions may be tax-deductible now, but withdrawals are taxed in retirement.",
      whyItMatters: "Traditional IRAs reduce current taxes and grow tax-deferred, ideal if you expect lower taxes in retirement.",
      example: "Contributing $7,000 to a traditional IRA might save you $1,680 in taxes today if you're in the 24% bracket."
    },
    {
      term: "Umbrella Insurance",
      category: "Insurance",
      definition: "Liability insurance that provides coverage beyond the limits of your home, auto, or other policies.",
      whyItMatters: "Umbrella insurance protects your assets from major lawsuits at a relatively low cost.",
      example: "A $1 million umbrella policy might cost $200/year and cover liability beyond your $300,000 auto policy limit."
    },
    {
      term: "Unrealized Gains",
      category: "Investing",
      definition: "Profits on investments you still own but haven't sold yet—also called 'paper gains.'",
      whyItMatters: "Unrealized gains aren't taxed until you sell, allowing for continued tax-deferred growth.",
      example: "Stock you bought for $1,000 now worth $1,500 has a $500 unrealized gain until you sell."
    },
    {
      term: "Valuation",
      category: "Investing",
      definition: "The process of determining the current worth of an asset or company.",
      whyItMatters: "Understanding valuation helps you identify overpriced or undervalued investments.",
      example: "A company's valuation might be determined by price-to-earnings ratio, revenue multiples, or discounted cash flow."
    },
    {
      term: "Variable Expenses",
      category: "Basics",
      definition: "Costs that fluctuate month to month, like groceries, utilities, or entertainment.",
      whyItMatters: "Variable expenses offer the most flexibility for cutting spending when needed.",
      example: "Your $400 grocery bill, $150 utility bill, and $200 entertainment spending are variable expenses."
    },
    {
      term: "Vesting",
      category: "Investing",
      definition: "The process of earning full ownership of employer contributions to your retirement account over time.",
      whyItMatters: "Understanding vesting schedules affects job-change decisions and retirement planning.",
      example: "A 4-year vesting schedule means you own 25% more of employer contributions each year you stay."
    },
    {
      term: "Volatility",
      category: "Investing",
      definition: "The degree of variation in an investment's price over time—how much and how quickly it fluctuates.",
      whyItMatters: "Higher volatility means higher risk but potentially higher returns; understanding this helps you choose appropriate investments.",
      example: "Individual stocks are more volatile than bond funds, with larger daily price swings."
    },
    {
      term: "Whole Life Insurance",
      category: "Insurance",
      definition: "Permanent life insurance with a cash value component that grows over time, combined with a death benefit.",
      whyItMatters: "Whole life costs significantly more than term insurance and often underperforms alternative investments.",
      example: "A $500,000 whole life policy might cost $400/month vs. $30/month for equivalent term coverage."
    },
    {
      term: "Withholding",
      category: "Tax",
      definition: "Money your employer takes from your paycheck and sends to the government for taxes before you receive your pay.",
      whyItMatters: "Proper withholding prevents owing large tax bills or giving the government an interest-free loan.",
      example: "Your W-4 form determines how much federal and state tax is withheld from each paycheck."
    },
    {
      term: "Yield",
      category: "Investing",
      definition: "The income return on an investment, expressed as a percentage of the investment's cost or current market value.",
      whyItMatters: "Yield helps you compare income-producing investments and plan for cash flow needs.",
      example: "A bond paying $40 annual interest on a $1,000 investment has a 4% yield."
    }
  ];

  // Filter terms based on search query
  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get search suggestions
  const suggestions = searchQuery.length > 0 ? glossaryTerms
    .filter(term => 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5) : [];

  // Group terms by first letter
  const groupedTerms = glossaryTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  // Sort each group alphabetically
  Object.keys(groupedTerms).forEach(letter => {
    groupedTerms[letter].sort((a, b) => a.term.localeCompare(b.term));
  });

  const letters = Object.keys(groupedTerms).sort();

  const scrollToGlossaryTerm = (termName: string) => {
    setActiveTab("glossary");
    setSearchQuery(termName);
    setTimeout(() => setExpandedTerm(termName), 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Basics":
        return <BookOpen className="size-4 text-[#578027]" />;
      case "Saving":
        return <PiggyBank className="size-4 text-[#578027]" />;
      case "Credit":
      case "Debt":
        return <CreditCard className="size-4 text-[#578027]" />;
      case "Investing":
      case "Advanced":
        return <TrendingUp className="size-4 text-[#578027]" />;
      case "Tax":
      case "Insurance":
        return <Shield className="size-4 text-[#578027]" />;
      default:
        return <DollarSign className="size-4 text-[#578027]" />;
    }
  };

  const toggleLetter = (letter: string) => {
    const newExpanded = new Set(expandedLetters);
    if (newExpanded.has(letter)) {
      newExpanded.delete(letter);
    } else {
      newExpanded.add(letter);
    }
    setExpandedLetters(newExpanded);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setExpandedLetters(new Set());
    setExpandedTerm(null);
  };

  const selectSuggestion = (term: string) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    setExpandedTerm(term);
  };

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {/* Header */}
      <Header onMenuClick={onMenuClick} onLogoClick={onBack} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#45280b] hover:text-[#578027] transition-colors mb-6"
          >
            <ArrowLeft className="size-5" />
            <span>Back to Home</span>
          </button>

          <div className="bg-[#fff5d6] rounded-2xl p-8 border-4 border-[#e0af41] shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#799952] p-4 rounded-full">
                <BookOpen className="size-10 text-[#fff5d6]" />
              </div>
              <div>
                <h1 className="text-[#45280b]">Learn & Apply</h1>
                <p className="text-[#45280b]/70">
                  Financial knowledge made simple. Learn key concepts and how to use them in real life.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("learn")}
            className={`flex-1 py-3 px-6 rounded-xl transition-all ${
              activeTab === "learn"
                ? "bg-[#799952] text-[#fff5d6] shadow-lg"
                : "bg-[#fff5d6] text-[#45280b] border-2 border-[#799952]/30 hover:border-[#799952]"
            }`}
          >
            Learn
          </button>
          <button
            onClick={() => setActiveTab("glossary")}
            className={`flex-1 py-3 px-6 rounded-xl transition-all ${
              activeTab === "glossary"
                ? "bg-[#799952] text-[#fff5d6] shadow-lg"
                : "bg-[#fff5d6] text-[#45280b] border-2 border-[#799952]/30 hover:border-[#799952]"
            }`}
          >
            Glossary
          </button>
        </div>

        {/* LEARN TAB */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            {learnModules.map((module) => (
              <div
                key={module.id}
                className="bg-[#fff5d6] rounded-xl border-2 border-[#799952]/30 shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#799952]/20 p-4 rounded-full flex-shrink-0">
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#45280b] mb-3">{module.title}</h3>
                    <p className="text-[#45280b]/80 mb-4 leading-relaxed">
                      {module.explanation}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[#578027] text-sm">Related terms:</span>
                      {module.relatedTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToGlossaryTerm(term)}
                          className="bg-[#799952]/20 hover:bg-[#799952]/30 text-[#578027] px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}</div>
        )}

        {/* GLOSSARY TAB */}
        {activeTab === "glossary" && (
          <div className="space-y-6">
            {/* Search Bar with Clear Button */}
            <div className="bg-[#fff5d6] rounded-xl border-2 border-[#799952]/30 shadow-lg p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search financial terms..."
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white border-2 border-[#799952]/30 rounded-lg focus:outline-none focus:border-[#799952] transition-colors text-[#45280b]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#578027]/50" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#578027]/50 hover:text-[#578027] transition-colors"
                  >
                    <X />
                  </button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#799952]/30 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion.term)}
                        className="w-full px-4 py-3 text-left hover:bg-[#799952]/10 transition-colors border-b border-[#799952]/10 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#799952]/20 p-2 rounded-full flex-shrink-0">
                            {getCategoryIcon(suggestion.category)}
                          </div>
                          <div>
                            <p className="text-[#45280b]">
                              {suggestion.term.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                                part.toLowerCase() === searchQuery.toLowerCase() ? (
                                  <span key={i} className="bg-yellow-200">{part}</span>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                            <p className="text-xs text-[#578027]">{suggestion.category}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* A-Z Collapsible Sections */}
            {searchQuery === "" ? (
              <div className="space-y-3">
                {letters.map(letter => (
                  <div key={letter} className="bg-[#fff5d6] rounded-xl border-2 border-[#799952]/30 shadow-lg overflow-hidden">
                    {/* Letter Header */}
                    <button
                      onClick={() => toggleLetter(letter)}
                      className="w-full p-4 flex items-center justify-between hover:bg-[#799952]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#799952] text-[#fff5d6] size-10 rounded-full flex items-center justify-center">
                          <span>{letter}</span>
                        </div>
                      </div>
                      <ChevronDown className={`size-5 text-[#578027] transition-transform ${expandedLetters.has(letter) ? "rotate-180" : ""}`} />
                    </button>

                    {/* Letter Content */}
                    {expandedLetters.has(letter) && (
                      <div className="border-t-2 border-[#799952]/10">
                        {groupedTerms[letter].map((term, index) => (
                          <div
                            key={index}
                            className="border-b border-[#799952]/10 last:border-b-0"
                          >
                            <button
                              onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#799952]/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-[#799952]/20 p-2 rounded-full">
                                  {getCategoryIcon(term.category)}
                                </div>
                                <div>
                                  <h4 className="text-[#45280b]">{term.term}</h4>
                                  <span className="text-xs text-[#578027] bg-[#799952]/10 px-2 py-0.5 rounded-full">
                                    {term.category}
                                  </span>
                                </div>
                              </div>
                              <div className={`transition-transform ${expandedTerm === term.term ? "rotate-180" : ""}`}>
                                <svg className="size-5 text-[#578027]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {expandedTerm === term.term && (
                              <div className="px-4 pb-4 pt-2 bg-[#799952]/5 space-y-3">
                                <div>
                                  <p className="text-sm text-[#578027] mb-1">Definition:</p>
                                  <p className="text-[#45280b]/80">{term.definition}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-[#578027] mb-1">Why this matters:</p>
                                  <p className="text-[#45280b]/80">{term.whyItMatters}</p>
                                </div>
                                {term.example && (
                                  <div className="bg-[#799952]/10 p-3 rounded-lg">
                                    <p className="text-sm text-[#578027] mb-1">Example:</p>
                                    <p className="text-[#45280b]/80 text-sm italic">{term.example}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Filtered Search Results */
              <div className="space-y-3">
                {filteredTerms.length === 0 ? (
                  <div className="bg-[#fff5d6] rounded-xl border-2 border-[#799952]/30 p-8 text-center">
                    <AlertCircle className="size-12 text-[#799952]/50 mx-auto mb-3" />
                    <p className="text-[#45280b]/70">No terms found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredTerms.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#fff5d6] rounded-xl border-2 border-[#799952]/30 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <button
                        onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#799952]/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#799952]/20 p-2 rounded-full">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <h4 className="text-[#45280b]">{item.term}</h4>
                            <span className="text-xs text-[#578027] bg-[#799952]/10 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className={`transition-transform ${expandedTerm === item.term ? "rotate-180" : ""}`}>
                          <svg className="size-5 text-[#578027]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {expandedTerm === item.term && (
                        <div className="px-4 pb-4 pt-2 border-t-2 border-[#799952]/10 space-y-3">
                          <div>
                            <p className="text-sm text-[#578027] mb-1">Definition:</p>
                            <p className="text-[#45280b]/80">{item.definition}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[#578027] mb-1">Why this matters:</p>
                            <p className="text-[#45280b]/80">{item.whyItMatters}</p>
                          </div>
                          {item.example && (
                            <div className="bg-[#799952]/10 p-3 rounded-lg">
                              <p className="text-sm text-[#578027] mb-1">Example:</p>
                              <p className="text-[#45280b]/80 text-sm italic">{item.example}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { Header } from "./Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useState, useEffect } from "react";

interface WealthMultiplierProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function WealthMultiplier({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: WealthMultiplierProps) {
  // Track if screen is mobile-sized for responsive label rotation
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Exact wealth multiplier data provided
  const wealthData = [
    { age: 0, multiplier: 647.47, monthly1M: 13, monthly2M: 26 },
    { age: 1, multiplier: 586.09, monthly1M: 14, monthly2M: 28 },
    { age: 2, multiplier: 530.54, monthly1M: 16, monthly2M: 31 },
    { age: 3, multiplier: 480.25, monthly1M: 17, monthly2M: 35 },
    { age: 4, multiplier: 434.73, monthly1M: 19, monthly2M: 38 },
    { age: 5, multiplier: 393.52, monthly1M: 21, monthly2M: 42 },
    { age: 6, multiplier: 356.22, monthly1M: 23, monthly2M: 47 },
    { age: 7, multiplier: 322.46, monthly1M: 26, monthly2M: 52 },
    { age: 8, multiplier: 291.89, monthly1M: 29, monthly2M: 57 },
    { age: 9, multiplier: 264.22, monthly1M: 32, monthly2M: 63 },
    { age: 10, multiplier: 239.18, monthly1M: 35, monthly2M: 70 },
    { age: 11, multiplier: 216.51, monthly1M: 39, monthly2M: 77 },
    { age: 12, multiplier: 195.99, monthly1M: 43, monthly2M: 85 },
    { age: 13, multiplier: 177.41, monthly1M: 47, monthly2M: 94 },
    { age: 14, multiplier: 160.59, monthly1M: 52, monthly2M: 104 },
    { age: 15, multiplier: 145.37, monthly1M: 58, monthly2M: 115 },
    { age: 16, multiplier: 131.59, monthly1M: 64, monthly2M: 128 },
    { age: 17, multiplier: 119.12, monthly1M: 71, monthly2M: 141 },
    { age: 18, multiplier: 107.83, monthly1M: 78, monthly2M: 156 },
    { age: 19, multiplier: 97.61, monthly1M: 86, monthly2M: 173 },
    { age: 20, multiplier: 88.35, monthly1M: 95, monthly2M: 191 },
    { age: 21, multiplier: 76.56, monthly1M: 109, monthly2M: 218 },
    { age: 22, multiplier: 66.48, monthly1M: 125, monthly2M: 249 },
    { age: 23, multiplier: 57.84, monthly1M: 142, monthly2M: 284 },
    { age: 24, multiplier: 50.42, monthly1M: 162, monthly2M: 324 },
    { age: 25, multiplier: 44.04, monthly1M: 184, monthly2M: 368 },
    { age: 26, multiplier: 38.54, monthly1M: 209, monthly2M: 417 },
    { age: 27, multiplier: 33.80, monthly1M: 236, monthly2M: 473 },
    { age: 28, multiplier: 29.70, monthly1M: 267, monthly2M: 534 },
    { age: 29, multiplier: 26.14, monthly1M: 302, monthly2M: 603 },
    { age: 30, multiplier: 23.06, monthly1M: 340, monthly2M: 680 },
    { age: 31, multiplier: 20.39, monthly1M: 383, monthly2M: 765 },
    { age: 32, multiplier: 18.05, monthly1M: 430, monthly2M: 860 },
    { age: 33, multiplier: 16.02, monthly1M: 483, monthly2M: 965 },
    { age: 34, multiplier: 14.25, monthly1M: 541, monthly2M: 1082 },
    { age: 35, multiplier: 12.69, monthly1M: 606, monthly2M: 1212 },
    { age: 36, multiplier: 11.33, monthly1M: 678, monthly2M: 1356 },
    { age: 37, multiplier: 10.14, monthly1M: 757, monthly2M: 1514 },
    { age: 38, multiplier: 9.08, monthly1M: 845, monthly2M: 1690 },
    { age: 39, multiplier: 8.16, monthly1M: 943, monthly2M: 1886 },
    { age: 40, multiplier: 7.34, monthly1M: 1052, monthly2M: 2104 },
    { age: 41, multiplier: 6.62, monthly1M: 1172, monthly2M: 2344 },
    { age: 42, multiplier: 5.98, monthly1M: 1306, monthly2M: 2612 },
    { age: 43, multiplier: 5.41, monthly1M: 1454, monthly2M: 2908 },
    { age: 44, multiplier: 4.91, monthly1M: 1620, monthly2M: 3240 },
    { age: 45, multiplier: 4.46, monthly1M: 1806, monthly2M: 3612 },
    { age: 46, multiplier: 4.06, monthly1M: 2014, monthly2M: 4028 },
    { age: 47, multiplier: 3.71, monthly1M: 2248, monthly2M: 4496 },
    { age: 48, multiplier: 3.39, monthly1M: 2512, monthly2M: 5024 },
    { age: 49, multiplier: 3.10, monthly1M: 2812, monthly2M: 5624 },
    { age: 50, multiplier: 2.85, monthly1M: 3155, monthly2M: 6310 },
    { age: 51, multiplier: 2.62, monthly1M: 3549, monthly2M: 7098 },
    { age: 52, multiplier: 2.41, monthly1M: 4006, monthly2M: 8012 },
    { age: 53, multiplier: 2.23, monthly1M: 4541, monthly2M: 9082 },
    { age: 54, multiplier: 2.06, monthly1M: 5176, monthly2M: 10352 },
    { age: 55, multiplier: 1.91, monthly1M: 5938, monthly2M: 11876 },
    { age: 56, multiplier: 1.78, monthly1M: 6871, monthly2M: 13742 },
    { age: 57, multiplier: 1.65, monthly1M: 8038, monthly2M: 16076 },
    { age: 58, multiplier: 1.54, monthly1M: 9538, monthly2M: 19076 },
    { age: 59, multiplier: 1.44, monthly1M: 11537, monthly2M: 23074 },
    { age: 60, multiplier: 1.35, monthly1M: 14333, monthly2M: 28666 },
    { age: 61, multiplier: 1.27, monthly1M: 18523, monthly2M: 37046 },
    { age: 62, multiplier: 1.19, monthly1M: 25498, monthly2M: 50996 },
    { age: 63, multiplier: 1.12, monthly1M: 39436, monthly2M: 78872 },
    { age: 64, multiplier: 1.06, monthly1M: 81216, monthly2M: 162432 },
    { age: 65, multiplier: 1.00, monthly1M: 1000000, monthly2M: 2000000 },
  ];

  // Generate table data with highlighting
  const generateTableData = () => {
    return wealthData.map(row => ({
      ...row,
      isHighlight: row.age % 5 === 0
    }));
  };

  // Generate chart data (specific ages: 20, 25, 30, 35, 40, 45, 50, 55, 60)
  const generateChartData = () => {
    const targetAges = [20, 25, 30, 35, 40, 45, 50, 55, 60];
    return wealthData
      .filter(row => targetAges.includes(row.age))
      .map(row => ({
        age: row.age,
        multiplier: Math.round(row.multiplier * 100) / 100
      }));
  };

  const tableData = generateTableData();
  const chartData = generateChartData();

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
      <Header onMenuClick={onMenuClick} onLogoClick={onBack} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#fff5d6] to-white p-8 md:p-12 rounded-2xl border-t-4 border-[#799952] shadow-lg text-center">
            <h1 className="text-[#578027] [text-shadow:rgba(0,0,0,0.1)_0px_2px_4px] mb-4">Wealth Multiplier</h1>
            <p className="text-[#45280b]/80 text-lg">
              Discover the power of time and compound interest. See how much every dollar can grow by retirement.
            </p>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mb-8 bg-gradient-to-br from-[#799952]/30 to-[#799952]/20 p-6 rounded-lg border-2 border-[#799952] shadow-lg">
          <h2 className="text-[#45280b] mb-3">The Power of Starting Early</h2>
          <p className="text-[#45280b]/90 mb-4">
            Every dollar you invest today has the potential to multiply significantly by retirement age (65). 
            The earlier you start, the more powerful compound interest becomes.
          </p>
        </div>

        {/* Chart */}
        <div className="mb-8 bg-[#fff5d6] rounded-lg p-6 border-2 border-[#e0af41] shadow-lg">
          <h2 className="text-[#45280b] mb-4">Wealth Multiplier by Age</h2>
          <div className="bg-[#f5f9f0] p-4 rounded-lg border-2 border-[#799952]/30">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 40, right: 10, left: 70, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#799952" opacity={0.2} />
                <XAxis 
                  dataKey="age" 
                  tick={{ fill: "#45280b" }}
                  axisLine={{ stroke: "#799952" }}
                  label={{ value: 'Age', position: 'insideBottom', offset: -10, fill: '#45280b' }}
                />
                <YAxis 
                  tick={{ fill: "#45280b" }}
                  axisLine={{ stroke: "#799952" }}
                  tickFormatter={(value) => `$${value}`}
                  label={{ value: 'Wealth Multiplier Value', angle: -90, position: 'insideCenter', fill: '#45280b', dx: -35 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff5d6",
                    border: "2px solid #e0af41",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "#45280b" }}
                  formatter={(value: number) => [`$${value}`, 'Multiplier']}
                />
                <Bar 
                  dataKey="multiplier" 
                  fill="#799952"
                  name="Wealth Multiplier"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList 
                    dataKey="multiplier" 
                    position="top" 
                    formatter={(value: number) => `$${value}`}
                    angle={isMobile ? -45 : 0}
                    style={{ fill: '#45280b', fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[#45280b]/70 text-sm mt-4">
            This chart shows how much $1 invested at each age could grow to by retirement (age 65).
          </p>
        </div>

        {/* Table */}
        <div className="bg-[#fff5d6] rounded-lg p-6 border-2 border-[#e0af41] shadow-lg">
          <h2 className="text-[#45280b] mb-4">Complete Age-by-Age Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#799952] text-[#fff5d6]">
                  <th className="p-3 border border-[#799952]">Age</th>
                  <th className="p-3 border border-[#799952]">Wealth Multiplier</th>
                  <th className="p-3 border border-[#799952]">Monthly to Reach $1M</th>
                  <th className="p-3 border border-[#799952]">Monthly to Reach $2M</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr 
                    key={row.age} 
                    className={row.isHighlight ? "bg-[#e0af41]/20 font-semibold" : "bg-white hover:bg-[#d4e8c1]/30"}
                  >
                    <td className="p-3 border border-[#799952]/30 text-[#45280b]">{row.age}</td>
                    <td className="p-3 border border-[#799952]/30 text-[#578027]">
                      {row.multiplier.toLocaleString()}
                    </td>
                    <td className="p-3 border border-[#799952]/30 text-[#45280b]">
                      {row.age >= 65 ? 'N/A' : formatCurrency(row.monthly1M)}
                    </td>
                    <td className="p-3 border border-[#799952]/30 text-[#45280b]">
                      {row.age >= 65 ? 'N/A' : formatCurrency(row.monthly2M)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-[#799952]/20 rounded-lg border border-[#e0af41]">
            <p className="text-[#45280b] text-sm">
              <strong>Assumptions:</strong> Expected annual returns are 10% for ages 0-20, 
              decreasing by 0.1% per year after age 20. All values rounded to nearest whole dollar. 
              These are estimates for educational purposes only. Actual investment returns vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
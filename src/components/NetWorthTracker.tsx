import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Save, RotateCcw } from "lucide-react";
import { Header } from "./Header";
import { getSupabaseClient } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

interface NetWorthTrackerProps {
  onBack: () => void;
  onMenuClick: () => void;
  onProfileClick: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

interface CustomItem {
  id: string;
  label: string;
  value: number;
}

interface PresetValues {
  [key: string]: number;
}

interface NetWorthData {
  presetAssets: PresetValues;
  presetLiabilities: PresetValues;
  customAssets: CustomItem[];
  customLiabilities: CustomItem[];
  lastNetWorth?: number;
}

const PRESET_ASSETS = [
  "Cash",
  "CDs",
  "Brokerage Account",
  "Retirement Accounts (401k, Roth IRA, Traditional IRA)",
  "Crypto",
  "Property",
  "Vehicles",
];

const PRESET_LIABILITIES = [
  "Mortgage Debt",
  "Credit Cards",
  "Personal Loans",
  "Vehicle Loans",
  "Student Loans",
];

export function NetWorthTracker({ onBack, onMenuClick, onProfileClick, isAuthenticated, userEmail }: NetWorthTrackerProps) {
  const [presetAssets, setPresetAssets] = useState<PresetValues>({});
  const [presetLiabilities, setPresetLiabilities] = useState<PresetValues>({});
  const [customAssets, setCustomAssets] = useState<CustomItem[]>([]);
  const [customLiabilities, setCustomLiabilities] = useState<CustomItem[]>([]);
  const [lastNetWorth, setLastNetWorth] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [netWorthHistory, setNetWorthHistory] = useState<{ id: string, month: number, year: number, netWorth: number }[]>([]);
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const supabase = getSupabaseClient();

  // Initialize preset values
  useEffect(() => {
    const initialAssets: PresetValues = {};
    PRESET_ASSETS.forEach(asset => {
      initialAssets[asset] = 0;
    });
    setPresetAssets(initialAssets);

    const initialLiabilities: PresetValues = {};
    PRESET_LIABILITIES.forEach(liability => {
      initialLiabilities[liability] = 0;
    });
    setPresetLiabilities(initialLiabilities);
  }, []);

  // Check authentication and load data
  useEffect(() => {
    checkAuthAndLoadData();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", !!session);
      if (session?.access_token) {
        setUserId(session.user.id);
        setAccessToken(session.access_token);
        await loadNetWorthData(session.access_token);
        await loadNetWorthHistory(session.access_token);
      } else {
        setUserId(null);
        setAccessToken(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuthAndLoadData = async () => {
    console.log("=== checkAuthAndLoadData called ===");
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("getSession error:", error);
      console.log("Session exists:", !!session);
      console.log("Session details:", session ? {
        userId: session.user?.id,
        email: session.user?.email,
        hasAccessToken: !!session.access_token
      } : "No session");
      
      if (session?.user) {
        console.log("✓ User is authenticated");
        console.log("Setting userId:", session.user.id);
        console.log("Setting accessToken:", session.access_token ? "YES" : "NO");
        setUserId(session.user.id);
        setAccessToken(session.access_token);
        
        // Load both data sources in parallel instead of sequentially
        // This significantly improves loading time
        Promise.all([
          loadNetWorthData(session.access_token),
          loadNetWorthHistory(session.access_token)
        ]).catch(error => {
          console.error("Error loading data:", error);
        });
      } else {
        console.log("✗ User is NOT authenticated");
        setUserId(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      // Set loading to false immediately after auth check
      // Don't wait for data loading to complete
      setIsLoading(false);
      console.log("=== checkAuthAndLoadData complete ===");
    }
  };

  const loadNetWorthData = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.presetAssets) setPresetAssets(data.presetAssets);
        if (data.presetLiabilities) setPresetLiabilities(data.presetLiabilities);
        if (data.customAssets) setCustomAssets(data.customAssets);
        if (data.customLiabilities) setCustomLiabilities(data.customLiabilities);
        if (data.lastNetWorth !== undefined) setLastNetWorth(data.lastNetWorth);
      }
    } catch (error) {
      console.error("Error loading net worth data:", error);
    }
  };

  const loadNetWorthHistory = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth-history`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNetWorthHistory(data);
      }
    } catch (error) {
      console.error("Error loading net worth history:", error);
    } finally {
      setIsLoadingSnapshots(false);
    }
  };

  const saveNetWorthData = async () => {
    if (!accessToken) return;

    try {
      const currentNetWorth = totalAssets - totalLiabilities;

      const netWorthData: NetWorthData = {
        presetAssets,
        presetLiabilities,
        customAssets,
        customLiabilities,
        lastNetWorth: currentNetWorth,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(netWorthData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save net worth data - Status:", response.status);
        console.error("Error details:", errorData);
      } else {
        console.log("✓ Net worth data saved successfully");
      }
    } catch (error) {
      console.error("Error saving net worth data:", error);
    }
  };

  const saveNetWorthSnapshot = async () => {
    console.log("=== Save Snapshot Clicked ===");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("userEmail:", userEmail);
    console.log("accessToken exists:", !!accessToken);
    
    if (!accessToken) {
      console.error("No access token available");
      alert("Your session has expired. Please refresh the page or sign out and sign back in.");
      return;
    }

    try {
      const currentNetWorth = totalAssets - totalLiabilities;
      console.log("Current Net Worth to save:", currentNetWorth);

      const snapshotData = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        netWorth: currentNetWorth,
      };

      console.log("Snapshot data:", snapshotData);
      console.log("Sending POST to:", `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth-history`);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth-history`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(snapshotData),
        }
      );

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Saved snapshot:", data);
        setNetWorthHistory([...netWorthHistory, data]);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
        console.log("✓ Snapshot saved successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to save net worth snapshot. Status:", response.status, "Error:", errorText);
        alert(`Failed to save snapshot: ${errorText}`);
      }
    } catch (error) {
      console.error("Error saving net worth snapshot:", error);
      alert(`Error saving snapshot: ${error}`);
    }
  };

  const deleteSnapshot = async (id: string) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth-history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNetWorthHistory(netWorthHistory.filter(snapshot => snapshot.id !== id));
      } else {
        console.error("Failed to delete net worth snapshot");
      }
    } catch (error) {
      console.error("Error deleting net worth snapshot:", error);
    }
  };

  const clearAllHistory = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth-history`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNetWorthHistory([]);
        setShowClearConfirm(false);
      } else {
        console.error("Failed to clear net worth history");
      }
    } catch (error) {
      console.error("Error clearing net worth history:", error);
    }
  };

  // Auto-save when data changes (only for authenticated users)
  useEffect(() => {
    if (accessToken && !isLoading) {
      const timeoutId = setTimeout(() => {
        saveNetWorthData();
      }, 500); // Debounce saves by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [presetAssets, presetLiabilities, customAssets, customLiabilities, accessToken]);

  const updatePresetAsset = (key: string, value: number) => {
    setPresetAssets({ ...presetAssets, [key]: value });
  };

  const updatePresetLiability = (key: string, value: number) => {
    setPresetLiabilities({ ...presetLiabilities, [key]: value });
  };

  const addCustomAsset = () => {
    const newAsset: CustomItem = {
      id: Date.now().toString(),
      label: "",
      value: 0,
    };
    setCustomAssets([...customAssets, newAsset]);
  };

  const addCustomLiability = () => {
    const newLiability: CustomItem = {
      id: Date.now().toString(),
      label: "",
      value: 0,
    };
    setCustomLiabilities([...customLiabilities, newLiability]);
  };

  const updateCustomAsset = (id: string, field: "label" | "value", newValue: string | number) => {
    setCustomAssets(customAssets.map(asset => 
      asset.id === id ? { ...asset, [field]: newValue } : asset
    ));
  };

  const updateCustomLiability = (id: string, field: "label" | "value", newValue: string | number) => {
    setCustomLiabilities(customLiabilities.map(liability => 
      liability.id === id ? { ...liability, [field]: newValue } : liability
    ));
  };

  const removeCustomAsset = (id: string) => {
    setCustomAssets(customAssets.filter(asset => asset.id !== id));
  };

  const removeCustomLiability = (id: string) => {
    setCustomLiabilities(customLiabilities.filter(liability => liability.id !== id));
  };

  const handleReset = async () => {
    const previousNetWorth = totalAssets - totalLiabilities;
    
    const resetAssets: PresetValues = {};
    PRESET_ASSETS.forEach(asset => {
      resetAssets[asset] = 0;
    });
    setPresetAssets(resetAssets);

    const resetLiabilities: PresetValues = {};
    PRESET_LIABILITIES.forEach(liability => {
      resetLiabilities[liability] = 0;
    });
    setPresetLiabilities(resetLiabilities);

    setCustomAssets([]);
    setCustomLiabilities([]);
    setLastNetWorth(previousNetWorth);
    setShowResetConfirm(false);

    if (accessToken) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e7c89057/net-worth`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error resetting net worth data:", error);
      }
    }
  };

  const totalAssets = 
    Object.values(presetAssets).reduce((sum, val) => sum + (val || 0), 0) +
    customAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);

  const totalLiabilities = 
    Object.values(presetLiabilities).reduce((sum, val) => sum + (val || 0), 0) +
    customLiabilities.reduce((sum, liability) => sum + (liability.value || 0), 0);

  const netWorth = totalAssets - totalLiabilities;
  
  const netWorthChange = lastNetWorth !== null ? netWorth - lastNetWorth : 0;
  const netWorthChangePercent = lastNetWorth !== null && lastNetWorth !== 0 
    ? ((netWorthChange / Math.abs(lastNetWorth)) * 100) 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (month: number, year: number) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[month - 1]} ${year}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#d4e8c1] flex flex-col items-center justify-center gap-4">
        <div className="text-[#45280b] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d4e8c1]">
      {/* Header */}
      <Header onMenuClick={onMenuClick} onLogoClick={onBack} onProfileClick={onProfileClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section - Current Net Worth Summary */}
        <div className="mb-8">
          <div className={`rounded-2xl p-8 border-4 shadow-2xl ${
            netWorth >= 0 
              ? "bg-gradient-to-br from-[#799952]/20 to-[#578027]/10 border-[#799952]" 
              : "bg-gradient-to-br from-red-50 to-red-100 border-red-400"
          }`}>
            <div className="text-center">
              <p className="text-[#45280b]/70 mb-2">Current Net Worth</p>
              <div className="flex items-center justify-center gap-3">
                <h1 className={`text-5xl ${netWorth >= 0 ? "text-[#578027]" : "text-red-600"}`}>
                  {formatCurrency(netWorth)}
                </h1>
                {lastNetWorth !== null && netWorthChange !== 0 && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                    netWorthChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {netWorthChange >= 0 ? (
                      <TrendingUp className="size-5" />
                    ) : (
                      <TrendingDown className="size-5" />
                    )}
                    <span className="text-sm">
                      {Math.abs(netWorthChangePercent).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-8 mt-6">
                <div>
                  <p className="text-[#45280b]/60 text-sm">Total Assets</p>
                  <p className="text-[#45280b] text-xl">{formatCurrency(totalAssets)}</p>
                </div>
                <div className="h-12 w-px bg-[#45280b]/20" />
                <div>
                  <p className="text-[#45280b]/60 text-sm">Total Liabilities</p>
                  <p className="text-[#45280b] text-xl">{formatCurrency(totalLiabilities)}</p>
                </div>
              </div>
            </div>
            
            {/* Reset Button - Moved here for better visibility */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors px-6 py-3 rounded-lg bg-white/50 hover:bg-white border-2 border-red-300 hover:border-red-400 shadow-md"
              >
                <RotateCcw className="size-5" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="bg-[#fff5d6] rounded-xl p-6 border-2 border-[#e0af41] shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#45280b] flex items-center gap-2">
              <div className="bg-[#799952] p-2 rounded-full">
                <TrendingUp className="size-5 text-[#fff5d6]" />
              </div>
              Assets
            </h2>
            <p className="text-[#578027]">{formatCurrency(totalAssets)}</p>
          </div>
          
          <div className="space-y-3">
            {PRESET_ASSETS.map((assetName) => (
              <div key={assetName} className="flex gap-3 items-center">
                <label className="flex-1 text-[#45280b] text-sm">
                  {assetName}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={presetAssets[assetName] || ""}
                    onChange={(e) => updatePresetAsset(assetName, parseFloat(e.target.value) || 0)}
                    className="w-40 pl-7 pr-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-[#45280b] text-sm"
                  />
                </div>
              </div>
            ))}

            {/* Custom Assets */}
            {customAssets.map((asset) => (
              <div key={asset.id} className="flex gap-3 items-center border-t pt-3">
                <input
                  type="text"
                  placeholder="Custom asset name"
                  value={asset.label}
                  onChange={(e) => updateCustomAsset(asset.id, "label", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-[#45280b] text-sm"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={asset.value || ""}
                    onChange={(e) => updateCustomAsset(asset.id, "value", parseFloat(e.target.value) || 0)}
                    className="w-40 pl-7 pr-3 py-2 rounded-lg border-2 border-[#799952]/30 focus:border-[#799952] focus:outline-none bg-white text-[#45280b] text-sm"
                  />
                </div>
                <button
                  onClick={() => removeCustomAsset(asset.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            {/* Add Custom Asset Button */}
            <button
              onClick={addCustomAsset}
              className="w-full mt-4 flex items-center justify-center gap-2 text-[#578027] hover:text-[#45280b] py-3 border-2 border-dashed border-[#799952]/30 hover:border-[#799952] rounded-lg transition-colors"
            >
              <Plus className="size-5" />
              Add Custom Asset
            </button>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-[#fff5d6] rounded-xl p-6 border-2 border-[#e0af41] shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#45280b] flex items-center gap-2">
              <div className="bg-[#e0af41] p-2 rounded-full">
                <TrendingDown className="size-5 text-[#45280b]" />
              </div>
              Liabilities
            </h2>
            <p className="text-[#e0af41]">{formatCurrency(totalLiabilities)}</p>
          </div>
          
          <div className="space-y-3">
            {PRESET_LIABILITIES.map((liabilityName) => (
              <div key={liabilityName} className="flex gap-3 items-center">
                <label className="flex-1 text-[#45280b] text-sm">
                  {liabilityName}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={presetLiabilities[liabilityName] || ""}
                    onChange={(e) => updatePresetLiability(liabilityName, parseFloat(e.target.value) || 0)}
                    className="w-40 pl-7 pr-3 py-2 rounded-lg border-2 border-[#e0af41]/30 focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b] text-sm"
                  />
                </div>
              </div>
            ))}

            {/* Custom Liabilities */}
            {customLiabilities.map((liability) => (
              <div key={liability.id} className="flex gap-3 items-center border-t pt-3">
                <input
                  type="text"
                  placeholder="Custom liability name"
                  value={liability.label}
                  onChange={(e) => updateCustomLiability(liability.id, "label", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-[#e0af41]/30 focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b] text-sm"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45280b]/50 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={liability.value || ""}
                    onChange={(e) => updateCustomLiability(liability.id, "value", parseFloat(e.target.value) || 0)}
                    className="w-40 pl-7 pr-3 py-2 rounded-lg border-2 border-[#e0af41]/30 focus:border-[#e0af41] focus:outline-none bg-white text-[#45280b] text-sm"
                  />
                </div>
                <button
                  onClick={() => removeCustomLiability(liability.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            {/* Add Custom Liability Button */}
            <button
              onClick={addCustomLiability}
              className="w-full mt-4 flex items-center justify-center gap-2 text-[#578027] hover:text-[#45280b] py-3 border-2 border-dashed border-[#e0af41]/30 hover:border-[#e0af41] rounded-lg transition-colors"
            >
              <Plus className="size-5" />
              Add Custom Liability
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#799952]/20 rounded-lg p-4 border border-[#e0af41] mb-6">
          <p className="text-[#45280b] text-sm">
            <strong>💡 Tip:</strong> Update your net worth regularly to track your financial progress. 
            All preset fields are always visible - simply enter values for the ones that apply to you.
            {!isAuthenticated && " Sign in to automatically save your data."}
          </p>
        </div>

        {/* Net Worth Snapshot History */}
        <div className="bg-[#fff5d6] rounded-lg p-6 border-2 border-[#e0af41] shadow-lg mb-6">
          <h2 className="text-[#45280b] mb-4 flex items-center gap-2">
            <TrendingUp className="size-6 text-[#799952]" />
            Net Worth Snapshot History
          </h2>

          {/* Anonymous User - Disabled State with Sign-In Prompt */}
          {(!userEmail || userEmail.length === 0) && (
            <div className="mb-6 p-6 bg-gradient-to-br from-[#799952]/10 to-[#799952]/5 rounded-lg border-2 border-[#799952]/30">
              <div className="text-center">
                <div className="mb-3">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-[#45280b] mb-2">Sign In to Track Your Progress</h3>
                <p className="text-[#45280b]/70 text-sm mb-4">
                  Save snapshots of your net worth over time and track your financial journey. 
                  This feature is available when you sign in to your account.
                </p>
                <button
                  onClick={onProfileClick}
                  className="bg-[#799952] hover:bg-[#578027] text-[#fff5d6] px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                  Sign In to Unlock
                </button>
              </div>
            </div>
          )}

          {/* Authenticated User - Full Functionality */}
          {userEmail && userEmail.length > 0 && (
            <>
              <p className="text-[#45280b]/70 text-sm mb-4">
                Save snapshots of your calculated net worth to track your progress over time.
              </p>

              {/* Save Snapshot Button */}
              <div className="bg-white p-4 rounded-lg border-2 border-[#799952]/30 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-[#45280b]/70 text-sm mb-1">Current Net Worth to Save</p>
                    <p className="text-[#578027] text-2xl">{formatCurrency(netWorth)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveNetWorthSnapshot}
                      disabled={netWorth === 0}
                      className="flex items-center gap-2 bg-[#799952] hover:bg-[#578027] text-[#fff5d6] px-6 py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                    >
                      <Save className="size-4" />
                      Save Snapshot
                    </button>
                    {netWorthHistory.length > 0 && (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
                      >
                        <RotateCcw className="size-4" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Success Message */}
                {showSaveSuccess && (
                  <div className="p-3 bg-green-100 rounded-lg border-2 border-green-400 mb-4">
                    <p className="text-green-800 text-sm">
                      <strong>✓ Saved!</strong> Your snapshot has been added below.
                    </p>
                  </div>
                )}

                {/* Saved Snapshots Display - RIGHT HERE in the same box */}
                {isLoadingSnapshots ? (
                  <div className="text-center py-4 border-t-2 border-[#799952]/20 mt-4">
                    <p className="text-[#45280b]/70 text-sm">Loading saved snapshots...</p>
                  </div>
                ) : netWorthHistory.length === 0 ? (
                  <div className="text-center py-4 border-t-2 border-dashed border-[#799952]/20 mt-4">
                    <p className="text-[#45280b]/60 text-sm">
                      No saved snapshots yet. Click 'Save Snapshot' above to start tracking.
                    </p>
                  </div>
                ) : (
                  <div className="border-t-2 border-[#799952]/20 mt-4 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[#45280b]">
                        Saved Snapshots ({netWorthHistory.length})
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {netWorthHistory.map((snapshot) => (
                        <div
                          key={snapshot.id}
                          className="bg-[#799952]/5 p-3 rounded-lg border border-[#799952]/30 hover:border-[#799952]/50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-[#45280b] text-sm mb-1">
                              {formatDate(snapshot.month, snapshot.year)}
                            </p>
                            <p className={`text-lg ${snapshot.netWorth >= 0 ? 'text-[#578027]' : 'text-red-600'}`}>
                              {formatCurrency(snapshot.netWorth)}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteSnapshot(snapshot.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            title="Delete this snapshot"
                          >
                            <Trash2 className="size-4" />
                            <span className="text-xs">Delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Confirmation */}
              {showClearConfirm && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-300">
                  <p className="text-[#45280b] mb-3">
                    <strong>⚠️ Warning:</strong> Are you sure you want to clear your entire net worth snapshot history? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={clearAllHistory}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Yes, Clear All History
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#45280b] px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Removed duplicate snapshots list from here */}
            </>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#fff5d6] rounded-xl p-6 max-w-md w-full border-4 border-[#e0af41] shadow-2xl">
            <h3 className="text-[#45280b] mb-4">Confirm Reset</h3>
            <p className="text-[#45280b]/70 mb-6">
              Are you sure you want to reset all data? This will clear all assets and liabilities. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-[#799952] hover:bg-[#578027] text-[#fff5d6] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
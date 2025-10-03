import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, User, HelpCircle, BarChart2, History, FileText, ArrowLeftRight, Repeat, Package, Users, LogOut, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BalanceOverview } from "@/components/dashboard/BalanceOverview";
import { InvestmentPlans } from "@/components/dashboard/InvestmentPlans";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { DepositWithdrawal } from "@/components/dashboard/DepositWithdrawal";
import { SupportChat } from "@/components/dashboard/SupportChat";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

interface UserProfile {
  balance: number;
  profit: number;
  bonus: number;
  ref_bonus: number;
  full_name: string | null;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(profileData);
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch live Bitcoin price from CoinGecko
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();
        setCurrentPrice(data.bitcoin.usd);
        setPriceChange(data.bitcoin.usd_24h_change);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);

    // Load TradingView widget
    if (chartContainerRef.current && !chartContainerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).TradingView) {
          new (window as any).TradingView.widget({
            container_id: 'tradingview_chart',
            autosize: true,
            symbol: 'COINBASE:BTCUSD',
            interval: '60',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#1a1f2e',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: ['BB@tv-basicstudies'],
            backgroundColor: '#1a1f2e',
            gridColor: '#2d3748',
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
          });
        }
      };
      document.head.appendChild(script);
    }

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Account", icon: User, url: "/dashboard/account" },
    { title: "Support", icon: HelpCircle, url: "/dashboard/support" },
    { title: "P/L Record", icon: BarChart2, url: "/dashboard/pl-record" },
    { title: "Trading History", icon: History, url: "/dashboard/trading-history" },
    { title: "Transactions", icon: FileText, url: "/dashboard/transactions" },
    { title: "Deposit/Withdraw", icon: ArrowLeftRight, url: "/dashboard/deposit-withdrawal" },
    { title: "Subscription Trade", icon: Repeat, url: "/dashboard/subscription" },
    { title: "Packages", icon: Package, url: "/dashboard/packages" },
    { title: "Refer Users", icon: Users, url: "/dashboard/refer" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar className="border-r border-gold/20">
          <div className="p-4 border-b border-gold/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-navy" />
              </div>
              <div>
                <span className="text-lg font-bold">TradeFlow Pro</span>
                <p className="text-xs text-muted-foreground">{profile?.full_name || "User"}</p>
              </div>
            </div>
          </div>
          
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Balance Overview */}
            {profile && (
              <BalanceOverview
                balance={profile.balance}
                profit={profile.profit}
                bonus={profile.bonus}
                refBonus={profile.ref_bonus}
              />
            )}

            {/* Trading Chart */}
            <Card className="border-gold/20">
              <div className="p-4 border-b border-gold/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold">Bitcoin / U.S. Dollar • 1H • Coinbase</h3>
                    {currentPrice > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className={`text-sm px-2 py-1 rounded ${priceChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="tradingview_chart" ref={chartContainerRef} className="w-full h-[500px]" />
            </Card>

            {/* Investment Plans */}
            <InvestmentPlans />

            {/* Two Column Layout */}
            <div className="grid gap-6 md:grid-cols-2">
              <TransactionHistory />
              <DepositWithdrawal />
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 md:grid-cols-2">
              <SupportChat />
              <NotificationCenter />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

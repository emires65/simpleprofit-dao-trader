import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, User, HelpCircle, BarChart2, History, FileText, ArrowLeftRight, Repeat, Package, Users, ChevronDown, ArrowDownCircle, Gift, RefreshCw, Mail, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AccountStats {
  deposited: number;
  profit: number;
  bonus: number;
  refBonus: number;
  packages: string;
  ipAddress: string;
}

const Dashboard = () => {
  const location = useLocation();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  
  const [accountStats] = useState<AccountStats>({
    deposited: 0.00,
    profit: 0.00,
    bonus: 20.00,
    refBonus: 0.00,
    packages: "Nil",
    ipAddress: "---"
  });

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
            toolbar_bg: '#1e293b',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: ['BB@tv-basicstudies'],
            backgroundColor: '#1e293b',
            gridColor: '#334155',
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

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Account", icon: User, url: "/dashboard/account", hasDropdown: true },
    { title: "Support", icon: HelpCircle, url: "/dashboard/support" },
    { title: "P/L record", icon: BarChart2, url: "/dashboard/pl-record" },
    { title: "Trading History", icon: History, url: "/dashboard/trading-history" },
    { title: "Transactions history", icon: FileText, url: "/dashboard/transactions" },
    { title: "Deposit/Withdrawal", icon: ArrowLeftRight, url: "/dashboard/deposit-withdrawal", hasDropdown: true },
    { title: "Subscription Trade", icon: Repeat, url: "/dashboard/subscription" },
    { title: "Packages", icon: Package, url: "/dashboard/packages", hasDropdown: true },
    { title: "Refer Users", icon: Users, url: "/dashboard/refer" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar className="border-r border-border/40">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <span className="text-lg font-bold text-white">SP</span>
              </div>
              <span className="text-lg font-bold text-foreground">SimpleProfit</span>
            </div>
          </div>
          
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.title}</span>
                          </div>
                          {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Account Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Deposited</p>
                    <p className="text-lg font-bold">${accountStats.deposited.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-lg font-bold">${accountStats.profit.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Bonus</p>
                    <p className="text-lg font-bold">${accountStats.bonus.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Ref. Bonus</p>
                    <p className="text-lg font-bold">${accountStats.refBonus.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Packages</p>
                    <p className="text-lg font-bold">{accountStats.packages}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/40 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Ip Address</p>
                    <p className="text-sm font-mono">{accountStats.ipAddress}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Trading Chart */}
            <Card className="bg-card/50 border-border/40">
              <div className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold">Bitcoin / U.S. Dollar • 1 • Coinbase</h3>
                    {currentPrice > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className={`text-sm ${priceChange >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="tradingview_chart" ref={chartContainerRef} className="w-full h-[500px]" />
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

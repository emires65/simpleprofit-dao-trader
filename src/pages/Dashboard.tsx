import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Wallet, ArrowUpCircle, ArrowDownCircle, History, Settings, MessageSquare, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const Dashboard = () => {
  const location = useLocation();
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [balance] = useState(15420.50);
  const [profit] = useState(2340.25);
  const [profitPercent] = useState(17.9);

  useEffect(() => {
    // Fetch live prices from CoinGecko
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano,solana&order=market_cap_desc'
        );
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Deposit", icon: ArrowDownCircle, url: "/dashboard/deposit" },
    { title: "Withdraw", icon: ArrowUpCircle, url: "/dashboard/withdraw" },
    { title: "DAO Chat", icon: MessageSquare, url: "/dashboard/dao-chat" },
    { title: "History", icon: History, url: "/dashboard/history" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <Sidebar className="border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-gold bg-clip-text text-transparent">SimpleProfit</span>
            </div>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between p-4">
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <Badge className="bg-secondary/20 text-secondary">Professional Plan</Badge>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                    JD
                  </div>
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-secondary">${profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <Badge className="bg-secondary/20 text-secondary">+{profitPercent}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-sm text-muted-foreground mt-1">$12,500 invested</p>
                </CardContent>
              </Card>
            </div>

            {/* Live Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Live Market Prices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prices.map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">{crypto.symbol.toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${crypto.price_change_percentage_24h > 0 ? 'text-secondary' : 'text-destructive'}`}>
                          {crypto.price_change_percentage_24h > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Deposit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Add funds to start trading</p>
                  <Link to="/dashboard/deposit">
                    <Button className="w-full gradient-gold">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Deposit Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">DAO Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Get live trading signals</p>
                  <Link to="/dashboard/dao-chat">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open DAO Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'deposit', amount: 5000, date: '2 hours ago', status: 'completed' },
                    { type: 'trade', amount: 1250, date: '5 hours ago', status: 'completed' },
                    { type: 'withdraw', amount: 800, date: '1 day ago', status: 'pending' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'deposit' ? 'bg-secondary/20' : 
                          activity.type === 'withdraw' ? 'bg-destructive/20' : 'bg-primary/20'
                        }`}>
                          {activity.type === 'deposit' && <ArrowDownCircle className="w-5 h-5 text-secondary" />}
                          {activity.type === 'withdraw' && <ArrowUpCircle className="w-5 h-5 text-destructive" />}
                          {activity.type === 'trade' && <TrendingUp className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <div className="font-semibold capitalize">{activity.type}</div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${activity.amount}</div>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

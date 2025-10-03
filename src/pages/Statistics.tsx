import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeInvestments: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
  });
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch active investments
        const { count: investmentsCount } = await supabase
          .from("user_investments")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Fetch total deposits
        const { data: deposits } = await supabase
          .from("transactions")
          .select("amount")
          .eq("type", "deposit")
          .eq("status", "completed");

        // Fetch total withdrawals
        const { data: withdrawals } = await supabase
          .from("transactions")
          .select("amount")
          .eq("type", "withdrawal")
          .eq("status", "completed");

        const totalDeposits = deposits?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        const totalWithdrawals = withdrawals?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          activeInvestments: investmentsCount || 0,
          totalDeposits,
          totalWithdrawals,
        });

        // Fetch crypto price data for chart
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
        );
        const data = await response.json();
        const chartData = data.prices.slice(0, 30).map((price: any, index: number) => ({
          time: `Day ${index + 1}`,
          price: Math.round(price[1]),
        }));
        setCryptoData(chartData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
    { title: "Active Investments", value: stats.activeInvestments.toLocaleString(), icon: TrendingUp, color: "text-accent" },
    { title: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString()}`, icon: ArrowDownRight, color: "text-green-500" },
    { title: "Total Withdrawals", value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: ArrowUpRight, color: "text-blue-500" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-gold bg-clip-text text-transparent">SimpleProfit</span>
          </Link>
          <Link to="/auth">
            <Button className="gradient-gold">Get Started</Button>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-gold bg-clip-text text-transparent">Live Statistics</h1>
          <p className="text-muted-foreground">Real-time platform performance and growth metrics</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bitcoin Price Trend (Last 7 Days)</CardTitle>
                <CardDescription>Live crypto market performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cryptoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-500" />
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate:</span>
                    <span className="font-semibold text-green-500">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Daily Return:</span>
                    <span className="font-semibold text-green-500">5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Traders:</span>
                    <span className="font-semibold">{Math.round(stats.totalUsers * 0.75)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    Referral Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Referrals:</span>
                    <span className="font-semibold">{Math.round(stats.totalUsers * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Commission Paid:</span>
                    <span className="font-semibold text-blue-500">${(stats.totalDeposits * 0.05).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Partners:</span>
                    <span className="font-semibold">{Math.round(stats.totalUsers * 0.15)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="text-center bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Join {stats.totalUsers.toLocaleString()}+ Successful Traders</h3>
                <p className="text-muted-foreground mb-4">Start your journey to financial freedom today</p>
                <Link to="/auth">
                  <Button size="lg" className="gradient-gold">Get Started Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;

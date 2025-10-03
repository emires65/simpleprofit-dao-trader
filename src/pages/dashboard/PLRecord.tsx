import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export const PLRecord = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalPL, setTotalPL] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPLData();
  }, []);

  const fetchPLData = async () => {
    try {
      // Fetch historical price data from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
      );
      const data = await response.json();
      
      // Transform data for chart
      const formattedData = data.prices.slice(-30).map((price: any, index: number) => ({
        date: new Date(price[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: ((price[1] - data.prices[0][1]) / data.prices[0][1] * 1000).toFixed(2), // Simulated profit
      }));

      setChartData(formattedData);
      setTotalPL(parseFloat(formattedData[formattedData.length - 1].profit));
    } catch (error) {
      console.error('Error fetching P/L data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profit & Loss Record</h1>
        <p className="text-muted-foreground">Track your trading performance over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              ${Math.abs(totalPL).toFixed(2)}
              {totalPL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className={`text-sm ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPL >= 0 ? '+' : ''}{((totalPL / 1000) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">30-Day Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+12.5%</div>
            <p className="text-sm text-muted-foreground">Above market average</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-sm text-muted-foreground">Based on closed positions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>30-Day Profit/Loss Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#d4af37"
                strokeWidth={2}
                dot={{ fill: '#d4af37' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

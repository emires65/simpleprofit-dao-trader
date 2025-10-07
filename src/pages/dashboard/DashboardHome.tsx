import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BalanceOverview } from "@/components/dashboard/BalanceOverview";
import { InvestmentPlans } from "@/components/dashboard/InvestmentPlans";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { DepositWithdrawal } from "@/components/dashboard/DepositWithdrawal";
import { SupportChat } from "@/components/dashboard/SupportChat";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { ROIChart } from "@/components/dashboard/ROIChart";
import { useInvestmentProfits } from "@/hooks/useInvestmentProfits";

interface DashboardHomeProps {
  profile: {
    balance: number;
    profit: number;
    bonus: number;
    ref_bonus: number;
  };
}

export const DashboardHome = ({ profile }: DashboardHomeProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const { stats, loading } = useInvestmentProfits();

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      <BalanceOverview
        balance={profile.balance}
        profit={profile.profit}
        bonus={profile.bonus}
        refBonus={profile.ref_bonus}
        activeInvestments={stats.activeInvestments}
        totalROI={stats.totalROI}
      />

      {!loading && stats.dailyProfitData.length > 0 && (
        <ROIChart data={stats.dailyProfitData} />
      )}

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

      <InvestmentPlans />

      <div className="grid gap-6 md:grid-cols-2">
        <TransactionHistory />
        <DepositWithdrawal />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SupportChat />
        <NotificationCenter />
      </div>
    </div>
  );
};

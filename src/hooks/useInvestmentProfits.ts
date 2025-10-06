import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Investment {
  id: string;
  amount: number;
  plan_id: string;
  start_date: string;
  status: string;
  total_return: number;
  investment_plans: {
    daily_return: number;
    duration_days: number;
    name: string;
  };
}

interface InvestmentStats {
  activeInvestments: number;
  totalInvested: number;
  currentProfit: number;
  totalROI: number;
  dailyProfitData: { date: string; profit: number }[];
}

export const useInvestmentProfits = () => {
  const [stats, setStats] = useState<InvestmentStats>({
    activeInvestments: 0,
    totalInvested: 0,
    currentProfit: 0,
    totalROI: 0,
    dailyProfitData: [],
  });
  const [loading, setLoading] = useState(true);

  const calculateRealTimeProfit = (investment: Investment): number => {
    const startDate = new Date(investment.start_date);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate profit based on days elapsed
    const dailyReturn = investment.investment_plans.daily_return;
    const profit = (investment.amount * dailyReturn * daysElapsed) / 100;
    
    return profit;
  };

  const fetchInvestments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: investments, error } = await supabase
        .from("user_investments")
        .select(`
          *,
          investment_plans (
            name,
            daily_return,
            duration_days
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "active");

      if (error) throw error;

      if (investments) {
        const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
        const currentProfit = investments.reduce((sum, inv) => sum + calculateRealTimeProfit(inv as Investment), 0);
        const totalROI = totalInvested > 0 ? (currentProfit / totalInvested) * 100 : 0;

        // Generate daily profit data for the last 30 days
        const dailyData: { date: string; profit: number }[] = [];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (let i = 0; i < 30; i++) {
          const date = new Date(thirtyDaysAgo);
          date.setDate(date.getDate() + i);
          
          const profitForDay = investments.reduce((sum, inv) => {
            const invStartDate = new Date(inv.start_date);
            if (date >= invStartDate) {
              const daysFromStart = Math.floor((date.getTime() - invStartDate.getTime()) / (1000 * 60 * 60 * 24));
              const dailyReturn = (inv as Investment).investment_plans.daily_return;
              return sum + (Number(inv.amount) * dailyReturn * daysFromStart) / 100;
            }
            return sum;
          }, 0);

          dailyData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            profit: profitForDay,
          });
        }

        setStats({
          activeInvestments: investments.length,
          totalInvested,
          currentProfit,
          totalROI,
          dailyProfitData: dailyData,
        });

        // Update profile profit in database
        await supabase
          .from("profiles")
          .update({ profit: currentProfit })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();

    // Update every minute for real-time calculation
    const interval = setInterval(fetchInvestments, 60000);

    return () => clearInterval(interval);
  }, []);

  return { stats, loading, refetch: fetchInvestments };
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Gift, Users, Target, Percent } from "lucide-react";

interface BalanceOverviewProps {
  balance: number;
  profit: number;
  bonus: number;
  refBonus: number;
  activeInvestments?: number;
  totalROI?: number;
}

export const BalanceOverview = ({ 
  balance, 
  profit, 
  bonus, 
  refBonus, 
  activeInvestments = 0,
  totalROI = 0 
}: BalanceOverviewProps) => {
  const stats = [
    {
      title: "Total Balance",
      value: `$${balance.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      title: "Active Investments",
      value: activeInvestments.toString(),
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Profit Earned",
      value: `$${profit.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total ROI",
      value: `${totalROI.toFixed(2)}%`,
      icon: Percent,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Bonus",
      value: `$${bonus.toFixed(2)}`,
      icon: Gift,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Referral Bonus",
      value: `$${refBonus.toFixed(2)}`,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-gold/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

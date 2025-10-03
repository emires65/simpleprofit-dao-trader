import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Clock, Award } from "lucide-react";

interface InvestmentPlan {
  id: string;
  name: string;
  min_deposit: number;
  max_deposit: number;
  daily_return: number;
  duration_days: number;
  bonus_percentage: number;
  description: string;
}

export const InvestmentPlans = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .order("min_deposit", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load investment plans",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (plan: InvestmentPlan) => {
    toast({
      title: "Investment Plan Selected",
      description: `Please contact support to activate ${plan.name}`,
    });
  };

  if (loading) {
    return <div>Loading investment plans...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Investment Plans</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-gold/20 hover:border-gold/40 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.bonus_percentage > 0 && (
                  <Badge className="bg-gold text-navy">+{plan.bonus_percentage}% Bonus</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deposit Range</span>
                  <span className="font-semibold">
                    ${plan.min_deposit.toLocaleString()} - ${plan.max_deposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Daily Return
                  </span>
                  <span className="font-semibold text-green-500">{plan.daily_return}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Duration
                  </span>
                  <span className="font-semibold">{plan.duration_days} days</span>
                </div>
              </div>
              <Button
                onClick={() => handleInvest(plan)}
                className="w-full bg-gold text-navy hover:bg-gold/90"
              >
                Invest Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

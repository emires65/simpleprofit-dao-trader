import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { TrendingUp, Clock, Award, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const { toast } = useToast();
  const { profile, refetch } = useUserProfile();
  const navigate = useNavigate();

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
    setSelectedPlan(plan);
    setInvestAmount(plan.min_deposit.toString());
  };

  const confirmInvestment = async () => {
    if (!selectedPlan || !profile) return;

    const amount = Number(investAmount);
    if (amount < selectedPlan.min_deposit || amount > selectedPlan.max_deposit) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: `Please enter an amount between $${selectedPlan.min_deposit} and $${selectedPlan.max_deposit}`,
      });
      return;
    }

    if (profile.balance < amount) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need $${amount.toFixed(2)} but only have $${profile.balance.toFixed(2)} in your account.`,
      });
      setSelectedPlan(null);
      setTimeout(() => navigate("/dashboard/deposit-withdraw"), 2000);
      return;
    }

    setIsInvesting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Deduct from balance
      const newBalance = Number(profile.balance) - amount;
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (balanceError) throw balanceError;

      // Create investment record
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

      const { error: investError } = await supabase
        .from("user_investments")
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          amount: amount,
          end_date: endDate.toISOString(),
          status: "active",
        });

      if (investError) throw investError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "investment",
        amount: amount,
        status: "completed",
        description: `Investment in ${selectedPlan.name}`,
      });

      toast({
        title: "Investment Successful!",
        description: `You've invested $${amount.toFixed(2)} in ${selectedPlan.name}. Your investment is now active.`,
      });

      refetch();
      setSelectedPlan(null);
      setInvestAmount("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Investment Failed",
        description: error.message || "Failed to process investment",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) {
    return <div>Loading investment plans...</div>;
  }

  return (
    <>
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

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              {selectedPlan && `Invest in ${selectedPlan.name} to start earning daily returns`}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min={selectedPlan.min_deposit}
                    max={selectedPlan.max_deposit}
                    className="pl-9"
                    placeholder={`Min: ${selectedPlan.min_deposit}, Max: ${selectedPlan.max_deposit}`}
                  />
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className="font-semibold">${profile?.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="font-semibold">${Number(investAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Return:</span>
                  <span className="font-semibold text-green-500">{selectedPlan.daily_return}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{selectedPlan.duration_days} days</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="text-muted-foreground">Balance After:</span>
                  <span className="font-semibold">
                    ${(Number(profile?.balance || 0) - Number(investAmount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)} disabled={isInvesting}>
              Cancel
            </Button>
            <Button
              onClick={confirmInvestment}
              disabled={isInvesting || !investAmount}
              className="bg-gold text-navy hover:bg-gold/90"
            >
              {isInvesting ? "Processing..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

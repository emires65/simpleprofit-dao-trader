import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Zap, TrendingUp, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

interface Strategy {
  name: string;
  description: string;
  features: string[];
  price: number;
  popular: boolean;
  type: string;
}

const strategies: Strategy[] = [
  {
    name: "Conservative Strategy",
    description: "Low-risk automated trading with steady returns",
    features: [
      "3-5% monthly returns",
      "Risk level: Low",
      "Automated rebalancing",
      "Stop-loss protection"
    ],
    price: 99,
    popular: false,
    type: "conservative",
  },
  {
    name: "Balanced Strategy",
    description: "Optimal risk-reward ratio for consistent growth",
    features: [
      "8-12% monthly returns",
      "Risk level: Medium",
      "AI-powered signals",
      "24/7 monitoring"
    ],
    price: 199,
    popular: true,
    type: "balanced",
  },
  {
    name: "Aggressive Strategy",
    description: "High-reward trading for experienced investors",
    features: [
      "15-20% monthly returns",
      "Risk level: High",
      "Advanced algorithms",
      "Priority support"
    ],
    price: 299,
    popular: false,
    type: "aggressive",
  },
];

export const Subscription = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  const { profile, refetch } = useUserProfile();
  const navigate = useNavigate();

  const handleSubscribe = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const confirmSubscription = async () => {
    if (!selectedStrategy || !profile) return;

    const amount = selectedStrategy.price;

    if (profile.balance < amount) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need $${amount.toFixed(2)} but only have $${profile.balance.toFixed(2)} in your account.`,
      });
      setSelectedStrategy(null);
      setTimeout(() => navigate("/dashboard/deposit-withdraw"), 2000);
      return;
    }

    setIsSubscribing(true);
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

      // Create subscription record
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 30 days subscription

      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          strategy_name: selectedStrategy.name,
          strategy_type: selectedStrategy.type,
          price: amount,
          status: "active",
          end_date: endDate.toISOString(),
        });

      if (subError) throw subError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "subscription",
        amount: amount,
        status: "completed",
        description: `Subscription: ${selectedStrategy.name}`,
      });

      toast({
        title: "Subscription Activated!",
        description: `${selectedStrategy.name} is now active. Automated trading will begin shortly.`,
      });

      refetch();
      setSelectedStrategy(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: error.message || "Failed to activate subscription",
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Trading</h1>
        <p className="text-muted-foreground">Subscribe to automated trading strategies</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gold/20">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-gold mb-2" />
            <h3 className="font-semibold mb-1">Automated</h3>
            <p className="text-sm text-muted-foreground">Set it and forget it</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-gold mb-2" />
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">Advanced algorithms</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-gold mb-2" />
            <h3 className="font-semibold mb-1">Protected</h3>
            <p className="text-sm text-muted-foreground">Risk management</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="pt-6">
            <CheckCircle2 className="h-8 w-8 text-gold mb-2" />
            <h3 className="font-semibold mb-1">Proven</h3>
            <p className="text-sm text-muted-foreground">Track record</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {strategies.map((strategy) => (
          <Card key={strategy.name} className={`border-gold/20 ${strategy.popular ? 'ring-2 ring-gold' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </div>
                {strategy.popular && (
                  <Badge className="bg-gold text-navy">Popular</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold">${strategy.price}</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>

              <ul className="space-y-2">
                {strategy.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-gold" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleSubscribe(strategy)}
                className="w-full bg-gold text-navy hover:bg-gold/90"
              >
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
          ))}
      </div>

      <Dialog open={!!selectedStrategy} onOpenChange={() => setSelectedStrategy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              {selectedStrategy && `Activate ${selectedStrategy.name} for automated trading`}
            </DialogDescription>
          </DialogHeader>
          {selectedStrategy && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{selectedStrategy.name}</span>
                  {selectedStrategy.popular && (
                    <Badge className="bg-gold text-navy">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedStrategy.description}</p>
                <ul className="space-y-1 mt-3">
                  {selectedStrategy.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className="font-semibold">${profile?.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription Price:</span>
                  <span className="font-semibold">${selectedStrategy.price}/month</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="text-muted-foreground">Balance After:</span>
                  <span className="font-semibold">
                    ${(Number(profile?.balance || 0) - selectedStrategy.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStrategy(null)} disabled={isSubscribing}>
              Cancel
            </Button>
            <Button
              onClick={confirmSubscription}
              disabled={isSubscribing}
              className="bg-gold text-navy hover:bg-gold/90"
            >
              {isSubscribing ? "Processing..." : "Activate Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

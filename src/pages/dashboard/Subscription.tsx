import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, TrendingUp, Shield } from "lucide-react";

const strategies = [
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
  },
];

export const Subscription = () => {
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

              <Button className="w-full bg-gold text-navy hover:bg-gold/90">
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

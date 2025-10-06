import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

const plans = [
  { name: "Starter Plan", dailyReturn: 2.5, duration: 30, bonus: 5 },
  { name: "Bronze Plan", dailyReturn: 3.5, duration: 45, bonus: 10 },
  { name: "Silver Plan", dailyReturn: 5.0, duration: 60, bonus: 15 },
  { name: "Gold Plan", dailyReturn: 7.5, duration: 90, bonus: 20 },
  { name: "VIP Plan", dailyReturn: 10.0, duration: 120, bonus: 25 },
];

const Calculator = () => {
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("0");
  
  const plan = plans[parseInt(selectedPlan)];
  const investmentAmount = parseFloat(amount) || 0;
  
  // Real-time profit calculation
  const roiPercentage = plan.dailyReturn;
  const expectedProfit = (investmentAmount * roiPercentage) / 100;
  const dailyProfit = expectedProfit;
  const totalReturn = dailyProfit * plan.duration;
  const bonusAmount = (investmentAmount * plan.bonus) / 100;
  const totalProfit = totalReturn + bonusAmount;
  const finalAmount = investmentAmount + totalProfit;

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
          <h1 className="text-4xl font-bold mb-4 gradient-gold bg-clip-text text-transparent">ROI Calculator</h1>
          <p className="text-muted-foreground">Calculate your potential profits with our investment packages</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Enter your investment amount and select a package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Investment Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Package</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {p.name} - {p.dailyReturn}% daily
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI Percentage:</span>
                  <span className="font-semibold text-primary">{plan.dailyReturn}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Profit:</span>
                  <span className="font-semibold text-accent">${expectedProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{plan.duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Signup Bonus:</span>
                  <span className="font-semibold">{plan.bonus}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle>Projected Returns</CardTitle>
              <CardDescription>Your potential earnings breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm text-muted-foreground">Daily Profit:</span>
                  <span className="font-bold text-primary">${dailyProfit.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Return ({plan.duration} days):</span>
                  <span className="font-bold text-primary">${totalReturn.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm text-muted-foreground">Signup Bonus ({plan.bonus}%):</span>
                  <span className="font-bold text-accent">${bonusAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gradient-to-r from-primary to-accent rounded-lg text-primary-foreground">
                  <span className="font-semibold">Total Profit:</span>
                  <span className="font-bold text-xl">${totalProfit.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-card rounded-lg border-2 border-primary">
                  <span className="font-semibold">Final Amount:</span>
                  <span className="font-bold text-xl gradient-gold bg-clip-text text-transparent">${finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/auth" className="block mt-6">
                <Button className="w-full gradient-gold">Start Investing Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

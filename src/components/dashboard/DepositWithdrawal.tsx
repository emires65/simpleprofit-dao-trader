import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const DepositWithdrawal = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("transactions").insert({
        user_id: session.user.id,
        type: "deposit",
        amount: parseFloat(amount),
        status: "pending",
        description: "Deposit request",
      });

      if (error) throw error;

      toast({
        title: "Deposit Requested",
        description: "Your deposit request has been submitted. Please wait for confirmation.",
      });
      setAmount("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process deposit",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("transactions").insert({
        user_id: session.user.id,
        type: "withdrawal",
        amount: parseFloat(amount),
        status: "pending",
        description: "Withdrawal request",
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted. Processing may take 24-48 hours.",
      });
      setAmount("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process withdrawal",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle>Deposit & Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (USD)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <Button
              onClick={handleDeposit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Request Deposit"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Minimum deposit: $100. Contact support for payment instructions.
            </p>
          </TabsContent>

          <TabsContent value="withdrawal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawal-amount">Amount (USD)</Label>
              <Input
                id="withdrawal-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <Button
              onClick={handleWithdrawal}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Request Withdrawal"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Minimum withdrawal: $50. Processing time: 24-48 hours.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const walletAddresses = {
  BTC: "bc1q7qu4npp07q8fzjta8h0gnzlqmymz7g58wce32v",
  ETH: "0xdC1cF7f02FA9a78dbe207C7F27ceE7d4c2f0EA9C",
  SOL: "3Ttoeo75t6oKK6kJnV5PCvv93YsWCR3Q6QudxaB99Jya",
  USDT: "0xdC1cF7f02FA9a78dbe207C7F27ceE7d4c2f0EA9C",
  XRP: "rLr7JWCH54j2xQJ2Ljx5bXNUZFiaMdCUAb",
};

export const DepositWithdraw = () => {
  const [depositCoin, setDepositCoin] = useState<keyof typeof walletAddresses>("BTC");
  const [withdrawCoin, setWithdrawCoin] = useState("BTC");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
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
        amount: parseFloat(withdrawAmount),
        description: `${withdrawCoin} withdrawal`,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for admin approval",
      });
      setWithdrawAmount("");
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit & Withdraw</h1>
        <p className="text-muted-foreground">Manage your funds</p>
      </div>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4" />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4" />
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle>Make a Deposit</CardTitle>
              <CardDescription>Send cryptocurrency to your wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Cryptocurrency</Label>
                <Select value={depositCoin} onValueChange={(value) => setDepositCoin(value as keyof typeof walletAddresses)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(walletAddresses).map((coin) => (
                      <SelectItem key={coin} value={coin}>
                        {coin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-gold/10 rounded-lg space-y-2">
                <p className="text-sm font-semibold">Wallet Address:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-background rounded text-sm break-all">
                    {walletAddresses[depositCoin]}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(walletAddresses[depositCoin])}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  ⓘ Send only {depositCoin} to this address. Deposits are credited after network confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Submit a withdrawal request for admin approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cryptocurrency</Label>
                <Select value={withdrawCoin} onValueChange={setWithdrawCoin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(walletAddresses).map((coin) => (
                      <SelectItem key={coin} value={coin}>
                        {coin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full bg-green-600 text-white hover:bg-green-700 font-bold border-2 border-green-500"
              >
                {loading ? "Processing..." : "Submit Withdrawal Request"}
              </Button>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-400">
                  ⓘ Withdrawals require admin approval and will be processed within 24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminWallets() {
  const [wallets, setWallets] = useState({
    btc: "",
    eth: "",
    sol: "",
    usdt: "",
    xrp: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('key', 'deposit_wallets').single();
    if (data?.value) {
      setWallets(data.value as any);
    }
  };

  const handleSave = async () => {
    const { error } = await supabase.from('site_settings').upsert({
      key: 'deposit_wallets',
      value: wallets
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Wallet addresses updated" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet Management</h1>
        <p className="text-muted-foreground">Manage deposit wallet addresses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deposit Wallets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Bitcoin (BTC)</Label>
            <Input
              value={wallets.btc}
              onChange={(e) => setWallets({...wallets, btc: e.target.value})}
              placeholder="Enter BTC wallet address"
            />
          </div>
          <div>
            <Label>Ethereum (ETH)</Label>
            <Input
              value={wallets.eth}
              onChange={(e) => setWallets({...wallets, eth: e.target.value})}
              placeholder="Enter ETH wallet address"
            />
          </div>
          <div>
            <Label>Solana (SOL)</Label>
            <Input
              value={wallets.sol}
              onChange={(e) => setWallets({...wallets, sol: e.target.value})}
              placeholder="Enter SOL wallet address"
            />
          </div>
          <div>
            <Label>USDT (ERC20)</Label>
            <Input
              value={wallets.usdt}
              onChange={(e) => setWallets({...wallets, usdt: e.target.value})}
              placeholder="Enter USDT wallet address"
            />
          </div>
          <div>
            <Label>Ripple (XRP)</Label>
            <Input
              value={wallets.xrp}
              onChange={(e) => setWallets({...wallets, xrp: e.target.value})}
              placeholder="Enter XRP wallet address"
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save Wallet Addresses</Button>
        </CardContent>
      </Card>
    </div>
  );
}

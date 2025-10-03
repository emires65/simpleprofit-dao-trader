import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Trade {
  id: string;
  date: string;
  asset: string;
  amount: number;
  type: string;
  result: number;
  status: string;
}

export const TradingHistory = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform transactions to trades format
      const formattedTrades = data?.map((tx) => ({
        id: tx.id,
        date: new Date(tx.created_at).toLocaleDateString(),
        asset: "BTC/USD",
        amount: tx.amount,
        type: tx.type,
        result: tx.type === "deposit" ? tx.amount * 0.05 : -tx.amount * 0.02, // Simulated result
        status: tx.status,
      })) || [];

      setTrades(formattedTrades);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trading history",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trading History</h1>
        <p className="text-muted-foreground">Detailed logs of all your completed trades</p>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No trades yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.date}</TableCell>
                      <TableCell className="font-medium">{trade.asset}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === "deposit" ? "default" : "secondary"}>
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>${trade.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`flex items-center gap-1 ${trade.result >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.result >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          ${Math.abs(trade.result).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          trade.status === "completed" ? "default" :
                          trade.status === "pending" ? "secondary" : "destructive"
                        }>
                          {trade.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

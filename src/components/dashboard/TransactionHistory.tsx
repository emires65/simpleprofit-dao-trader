import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Gift, Users } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string | null;
  created_at: string;
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();

    // Set up realtime subscription for instant updates
    const channel = supabase
      .channel('user-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "profit":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "bonus":
        return <Gift className="h-4 w-4 text-purple-500" />;
      case "referral":
        return <Users className="h-4 w-4 text-gold" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded-lg">
                    {getIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description || format(new Date(transaction.created_at), "PPp")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {transaction.type === "withdrawal" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(transaction.status)} variant="secondary">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

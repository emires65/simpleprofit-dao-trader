import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("pending");
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();

    // Set up realtime subscription
    const channel = supabase
      .channel('transactions-changes')
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
    const { data } = await supabase
      .from('transactions')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  };

  const handleApprove = async (transaction: any) => {
    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transaction.id);

    if (txError) {
      toast({ title: "Error", description: txError.message, variant: "destructive" });
      return;
    }

    // Update user balance based on transaction type
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', transaction.user_id)
      .single();
    
    if (profile) {
      const currentBalance = Number(profile.balance);
      const amount = Number(transaction.amount);
      
      let newBalance = currentBalance;
      if (transaction.type === 'deposit') {
        newBalance = currentBalance + amount;
      } else if (transaction.type === 'withdrawal') {
        newBalance = currentBalance - amount;
      }
      
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', transaction.user_id);
    }

    // Log action
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_logs').insert({
      admin_id: user?.id,
      action: 'approve_transaction',
      details: { transaction_id: transaction.id, type: transaction.type, amount: transaction.amount }
    });

    toast({ 
      title: "Success", 
      description: `${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} approved and user balance updated` 
    });
  };

  const handleReject = async (transaction: any) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'failed' })
      .eq('id', transaction.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Log action
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_logs').insert({
      admin_id: user?.id,
      action: 'reject_transaction',
      details: { transaction_id: transaction.id, type: transaction.type, amount: transaction.amount }
    });

    toast({ 
      title: "Success", 
      description: `${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} rejected` 
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      completed: "default",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
  const completedCount = transactions.filter(tx => tx.status === 'completed').length;
  const failedCount = transactions.filter(tx => tx.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-muted-foreground">Review and approve deposits & withdrawals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary">{pendingCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount} transactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Badge variant="default">{completedCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount} transactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Badge variant="destructive">{failedCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedCount} transactions</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No {filter !== "all" ? filter : ""} transactions found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">
                          {(tx.profiles as any)?.full_name || 'Unknown User'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.type === 'deposit' ? (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            )}
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${Number(tx.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {tx.description || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {tx.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleApprove(tx)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleReject(tx)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {tx.status !== 'pending' && (
                            <span className="text-sm text-muted-foreground">No actions</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

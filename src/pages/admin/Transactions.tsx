import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
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

    // Update user balance
    if (transaction.type === 'deposit') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', transaction.user_id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ balance: Number(profile.balance) + Number(transaction.amount) })
          .eq('id', transaction.user_id);
      }
    }

    // Log action
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_logs').insert({
      admin_id: user?.id,
      action: 'approve_transaction',
      details: { transaction_id: transaction.id, type: transaction.type }
    });

    toast({ title: "Success", description: "Transaction approved" });
    fetchTransactions();
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
      details: { transaction_id: transaction.id, type: transaction.type }
    });

    toast({ title: "Success", description: "Transaction rejected" });
    fetchTransactions();
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      completed: "default",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-muted-foreground">Review and approve transactions</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{(tx.profiles as any)?.full_name || 'Unknown'}</TableCell>
                  <TableCell className="uppercase">{tx.type}</TableCell>
                  <TableCell>${Number(tx.amount).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {tx.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(tx)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(tx)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

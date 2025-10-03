import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

export const Transactions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">All deposits, withdrawals, and transfers</p>
      </div>
      <TransactionHistory />
    </div>
  );
};

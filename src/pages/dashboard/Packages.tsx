import { InvestmentPlans } from "@/components/dashboard/InvestmentPlans";

export const Packages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Investment Packages</h1>
        <p className="text-muted-foreground">Choose the perfect investment plan for your goals</p>
      </div>
      <InvestmentPlans />
    </div>
  );
};

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const Statistics = () => {
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
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4 text-center">Platform Statistics</h1>
        <p className="text-muted-foreground text-center">Coming soon...</p>
      </div>
    </div>
  );
};

export default Statistics;

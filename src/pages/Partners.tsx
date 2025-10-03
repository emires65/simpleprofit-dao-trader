import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Users, DollarSign, Award, Gift } from "lucide-react";

const Partners = () => {
  const benefits = [
    { icon: DollarSign, title: "High Commission", description: "Earn up to 10% commission on every referral's deposit" },
    { icon: Users, title: "Unlimited Referrals", description: "No limit on how many people you can refer" },
    { icon: Gift, title: "Bonus Rewards", description: "Get bonus rewards for top performers monthly" },
    { icon: Award, title: "VIP Support", description: "Priority support for all partner inquiries" },
  ];

  const commissionLevels = [
    { level: "Level 1", referrals: "1-10", commission: "5%", bonus: "$50" },
    { level: "Level 2", referrals: "11-50", commission: "7%", bonus: "$200" },
    { level: "Level 3", referrals: "51-100", commission: "8%", bonus: "$500" },
    { level: "Level 4", referrals: "100+", commission: "10%", bonus: "$1,000+" },
  ];

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
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-gold bg-clip-text text-transparent">Partner Program</h1>
          <p className="text-muted-foreground text-lg">Join our affiliate program and earn generous commissions</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Partner Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                      <benefit.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
                <CardDescription>Your earnings grow as your network expands</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Referrals</TableHead>
                      <TableHead>Commission Rate</TableHead>
                      <TableHead>Monthly Bonus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionLevels.map((level) => (
                      <TableRow key={level.level}>
                        <TableCell className="font-medium">{level.level}</TableCell>
                        <TableCell>{level.referrals}</TableCell>
                        <TableCell className="text-primary font-semibold">{level.commission}</TableCell>
                        <TableCell className="text-accent font-semibold">{level.bonus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section className="text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Become a Partner?</CardTitle>
                <CardDescription className="text-base">
                  Sign up today and start earning commissions from your referrals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button size="lg" className="gradient-gold">Join Partner Program</Button>
                  </Link>
                  <Link to="/dashboard/refer">
                    <Button size="lg" variant="outline">View Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Sign Up</h3>
                    <p className="text-sm text-muted-foreground">Create your account and get your unique referral link</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Share Your Link</h3>
                    <p className="text-sm text-muted-foreground">Share your referral link with friends, family, and on social media</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Earn Commissions</h3>
                    <p className="text-sm text-muted-foreground">Receive commissions whenever your referrals make deposits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Partners;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, TrendingUp, Users, Wallet, CheckCircle2, Star, Trophy, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const Landing = () => {
  const [stats, setStats] = useState({ users: 0, days: 0, invested: 0, paidOut: 0 });

  useEffect(() => {
    // Animate counters
    const targets = { users: 125430, days: 1847, invested: 45800000, paidOut: 38600000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        users: Math.floor(targets.users * progress),
        days: Math.floor(targets.days * progress),
        invested: Math.floor(targets.invested * progress),
        paidOut: Math.floor(targets.paidOut * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const plans = [
    {
      name: "Starter",
      deposit: "$500 - $4,999",
      returns: "12% Monthly",
      bonus: "$100 FREE",
      features: ["Basic trading tools", "Email support", "Market analysis", "Mobile app access"],
      popular: false,
    },
    {
      name: "Professional",
      deposit: "$5,000 - $19,999",
      returns: "18% Monthly",
      bonus: "$500 FREE",
      features: ["Advanced trading tools", "Priority support", "Personal account manager", "Copy trading access", "Advanced analytics"],
      popular: true,
    },
    {
      name: "VIP",
      deposit: "$20,000+",
      returns: "25% Monthly",
      bonus: "$2,000 FREE",
      features: ["Premium trading suite", "24/7 VIP support", "Dedicated account manager", "Exclusive signals", "API access", "Custom strategies"],
      popular: false,
    },
  ];

  const steps = [
    { icon: Users, title: "Register", desc: "Create your account in under 2 minutes" },
    { icon: Shield, title: "Verify", desc: "Complete quick KYC verification" },
    { icon: Wallet, title: "Deposit", desc: "Fund your account securely" },
    { icon: TrendingUp, title: "Earn", desc: "Start trading and earning profits" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-gold bg-clip-text text-transparent">SimpleProfit</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Main</Link>
            <Link to="/marketing" className="text-foreground hover:text-primary transition-colors">Marketing</Link>
            <Link to="/calculator" className="text-foreground hover:text-primary transition-colors">Calculator</Link>
            <Link to="/partners" className="text-foreground hover:text-primary transition-colors">Partners</Link>
            <Link to="/statistics" className="text-foreground hover:text-primary transition-colors">Statistics</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-gold">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              🎉 Get FREE $100 on $500 deposit
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Trade Smarter,
              <span className="gradient-gold bg-clip-text text-transparent"> Earn Faster</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access over 15,000 products across 7 asset classes. Crypto, Forex, Stocks, and more. Start with as little as $500 and watch your profits grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-gold text-lg px-8 animate-pulse-glow">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Active Users", value: stats.users.toLocaleString(), icon: Users },
              { label: "Days in Work", value: stats.days.toLocaleString(), icon: Clock },
              { label: "Total Invested", value: `$${(stats.invested / 1000000).toFixed(1)}M`, icon: Wallet },
              { label: "Paid Out", value: `$${(stats.paidOut / 1000000).toFixed(1)}M`, icon: TrendingUp },
            ].map((stat, i) => (
              <Card key={i} className="text-center bg-card/50 border-border/50 backdrop-blur-sm animate-counter">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold gradient-gold bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Investment Plans</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that fits your goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.popular ? 'border-primary shadow-lg animate-glow' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">{plan.deposit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold gradient-success bg-clip-text text-transparent mb-2">
                      {plan.returns}
                    </div>
                    <Badge className="bg-secondary/20 text-secondary">{plan.bonus}</Badge>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <Button className={`w-full ${plan.popular ? 'gradient-gold' : ''}`}>
                      Choose Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Four Easy Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Four Easy Steps to Success</h2>
            <p className="text-muted-foreground text-lg">Start earning in minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground text-lg">Your security is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {[
              { icon: Shield, title: "Bank-Level Security", desc: "256-bit SSL encryption" },
              { icon: Trophy, title: "Licensed & Regulated", desc: "Fully compliant broker" },
              { icon: Star, title: "Award Winning", desc: "Best crypto broker 2024" },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Sarah M.", role: "Professional Trader", text: "Best returns I've seen in years. The platform is intuitive and support is excellent.", rating: 5 },
              { name: "Michael R.", role: "Investor", text: "Started with the Starter plan, now on VIP. My portfolio has grown 300% in 6 months!", rating: 5 },
              { name: "Emma L.", role: "Crypto Enthusiast", text: "Copy trading feature is a game-changer. I'm learning while earning.", rating: 5 },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary via-accent to-secondary p-12 text-center">
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">Ready to Start Trading?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of successful traders. Get your FREE $100 bonus today!
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8">
                Create Free Account <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">SimpleProfit</span>
              </div>
              <p className="text-sm text-muted-foreground">Professional trading platform for crypto, forex, and more.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/market" className="hover:text-primary transition-colors">Market</Link></li>
                <li><Link to="/education" className="hover:text-primary transition-colors">Education</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/risk" className="hover:text-primary transition-colors">Risk Disclosure</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 SimpleProfit. All rights reserved. Trading involves risk and may not be suitable for all investors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

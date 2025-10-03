import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, TrendingUp, Users, Wallet, CheckCircle2, Star, Trophy, Clock, Copy, DollarSign, BarChart3, Lock, Headphones, Monitor, CreditCard, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import cryptoTradingHero from "@/assets/crypto-trading-hero.png";

const Landing = () => {
  const [stats, setStats] = useState({ users: 0, days: 0, invested: 0, paidOut: 0 });
  const [cryptoPrices, setCryptoPrices] = useState<any[]>([]);

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

  useEffect(() => {
    // Fetch live crypto prices from CoinGecko
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h'
        );
        const data = await response.json();
        setCryptoPrices(data);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
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
            <span className="text-2xl font-bold gradient-gold bg-clip-text text-transparent">TradeFlow Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button className="bg-gold text-navy hover:bg-gold/90">
                Login / Sign Up
              </Button>
            </Link>
          </div>
          
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

      {/* Live Price Ticker */}
      <div className="bg-card border-y border-border py-4 overflow-hidden">
        <div className="flex animate-scroll gap-8">
          {cryptoPrices.concat(cryptoPrices).map((crypto, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap px-4">
              <span className="font-semibold">{crypto.symbol?.toUpperCase()}/USD</span>
              <span className="text-lg font-bold">{crypto.current_price?.toLocaleString()}</span>
              <span className={crypto.price_change_percentage_24h >= 0 ? 'text-secondary' : 'text-destructive'}>
                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                {crypto.price_change_24h?.toFixed(2)} ({crypto.price_change_percentage_24h?.toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Crypto, Forex and Trading
              </h1>
              <div className="bg-card/80 backdrop-blur-sm p-8 rounded-lg border border-border">
                <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                  $3 GET FREE
                </Badge>
                <h2 className="text-2xl font-bold mb-4">AI TRADING BOT AND CHATGPT</h2>
                <p className="text-muted-foreground mb-6">
                  ChatGPT was used to build an AI trading bot that helps each trader to trade formidable profit. They can 
                  do an even better job of trading than humans. They can also process and interpret data faster than any 
                  human could, saving users a lot of time and preventing them from costly mistakes. Our AI-powered 
                  trading bots guarantee profits.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="gradient-gold">
                    Sign Up And Invest
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={cryptoTradingHero} 
                alt="Cryptocurrency trading with AI technology" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1 Account 200+ Products */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">1 Account 200+ Products</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Diversify your portfolio with access to over 15,000 products across 7 asset classes. Trade CFDs on Forex, Futures, Indices, Metals, Energies and Shares.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: DollarSign, 
                title: "Crypto", 
                desc: "Trade and Mine Bitcoin and Other Leading Crypto Currencies with Decentralized Finance"
              },
              { 
                icon: Copy, 
                title: "Copy", 
                desc: "Copy trading allows you to directly copy the positions taken by another trader. You simply copy everything"
              },
              { 
                icon: TrendingUp, 
                title: "Forex", 
                desc: "Trade currency pairs and be able to implement your own trading strategies with minimum slippage"
              },
              { 
                icon: BarChart3, 
                title: "Stocks", 
                desc: "Stock trading is really easy. Navigate through your stocks and earnings"
              },
            ].map((item, i) => (
              <Card key={i} className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all">
                <CardContent className="pt-8 text-center">
                  <item.icon className="w-16 h-16 mx-auto mb-4 text-primary-foreground" />
                  <h3 className="text-2xl font-bold mb-3 text-primary-foreground">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/80">{item.desc}</p>
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Benefits of Joining and Investing with Us</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
            {[
              { 
                icon: Headphones, 
                title: "24/7 Customer Support", 
                desc: "With trained and experienced support staff, all your queries are just one click away from getting answered. Our support team provides 24/7 support and assistance to customers."
              },
              { 
                icon: Monitor, 
                title: "Seamless Experience", 
                desc: "Earning has never been this easy. Whether you are making payments or making payouts or you are simply checking up on your investments, navigating the platform is seamless and easy."
              },
              { 
                icon: Lock, 
                title: "100% Secure Platform", 
                desc: "Using state-of-the art servers, we have guarded our servers with high-end SSL technology and the latest DDoS Guard to protect against attacks."
              },
              { 
                icon: CreditCard, 
                title: "Multiple Payment Methods", 
                desc: "With an array of payment methods provided by the platform, you get multiple options to make payments and receive payouts."
              },
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <item.icon className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regulated Broker Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">Online trading with regulated Forex & CFD Broker</h2>
              <p className="text-muted-foreground mb-4">
                SimpleProfit offers forex and CFD contracts with honor winning exchanges, tight spreads, quality 
                executions, and 24-hour live support. SimpleProfit is one of the most reliable investment broker and 
                one of the leaders in the Forex showcase that joins dealers everywhere throughout the world.
              </p>
              <p className="text-muted-foreground mb-4">
                SimpleProfit gives its customers an excellent administration and security, which is significant nowadays, 
                especially when you are working with an online CFD broker. We offer multi-utilitarian Metatrader platform, 
                instruction and a tremendous assortment of trading assets.
              </p>
              <p className="text-muted-foreground mb-6">
                After you open an account in our organization, you can download the exchanging terminal, check the 
                statements and open your trades. We offer stages of exchange for both for PC and cell phones. It will 
                make your Forex trading as helpful as it can be.
              </p>
            </div>
            <div>
              <Card className="bg-card/50 border-2">
                <CardContent className="pt-8 text-center">
                  <Badge className="mb-4">FILE COPY</Badge>
                  <Shield className="w-32 h-32 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">CERTIFICATE OF INCORPORATION</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Certificate of Incorporation of a Private Limited Company
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    The Registrar of Companies for England and Wales, hereby certifies that SimpleProfit is this day 
                    incorporated under the Companies Act 2006 as a private company, that the company is limited by 
                    shared, and the situation on its registered office is in England and Wales.
                  </p>
                  <Button className="gradient-gold">View Certificate</Button>
                </CardContent>
              </Card>
            </div>
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

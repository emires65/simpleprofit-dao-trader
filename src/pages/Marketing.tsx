import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp, Copy, Download, Share2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import tradersProfit from "@/assets/traders-profit.jpg";
import referralConversation from "@/assets/referral-conversation.jpg";
import withdrawalProof from "@/assets/withdrawal-proof.jpg";

const Marketing = () => {
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const fetchReferralLink = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const link = `${window.location.origin}/auth?ref=${user.id}`;
        setReferralLink(link);
      }
    };
    fetchReferralLink();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const banners = [
    { title: "Traders in Profit", image: tradersProfit },
    { title: "Referral Success", image: referralConversation },
    { title: "Withdrawal Proof", image: withdrawalProof },
  ];

  const promoTexts = [
    "🚀 Join SimpleProfit and start earning passive income with crypto trading! Get 20% signup bonus!",
    "💰 Turn your investments into profits! Join thousands of successful traders on SimpleProfit.",
    "📈 Professional crypto trading platform with proven results. Sign up today and get instant bonus!",
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
          <h1 className="text-4xl font-bold mb-4 gradient-gold bg-clip-text text-transparent">Marketing Center</h1>
          <p className="text-muted-foreground">Get all the tools you need to promote SimpleProfit and earn commissions</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>Share this link to invite others and earn commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly />
                <Button onClick={() => copyToClipboard(referralLink)} className="flex-shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-bold mb-6">Promotional Banners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {banners.map((banner, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{banner.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover rounded-lg" />
                    <Button variant="outline" className="w-full" onClick={() => {
                      const link = document.createElement('a');
                      link.href = banner.image;
                      link.download = `${banner.title}.jpg`;
                      link.click();
                      toast.success("Download started!");
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Promotional Texts
                </CardTitle>
                <CardDescription>Copy these pre-written messages to share on social media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {promoTexts.map((text, index) => (
                  <div key={index} className="flex gap-2 p-4 bg-muted rounded-lg">
                    <p className="flex-1 text-sm">{text}</p>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(text)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle>Marketing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">Share your referral link on social media platforms (Facebook, Twitter, Instagram)</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">Use the promotional banners in blog posts and articles</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">Include your referral link in your email signature</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">Create YouTube videos explaining the platform benefits</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">Join crypto and investment communities to share your success</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Marketing;

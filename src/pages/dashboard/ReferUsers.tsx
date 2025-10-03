import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, DollarSign, Gift } from "lucide-react";

export const ReferUsers = () => {
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralBonus, setReferralBonus] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Generate referral link
      const link = `${window.location.origin}?ref=${session.user.id}`;
      setReferralLink(link);

      // Fetch profile for referral bonus
      const { data: profile } = await supabase
        .from("profiles")
        .select("ref_bonus")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setReferralBonus(profile.ref_bonus || 0);
      }

      // TODO: Fetch actual referral count from a referrals table
      setReferralCount(0);
    } catch (error) {
      console.error("Error fetching referral data:", error);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Refer Users</h1>
        <p className="text-muted-foreground">Earn bonuses by inviting friends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gold/20">
          <CardHeader>
            <Users className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralCount}</div>
            <p className="text-sm text-muted-foreground">Active referrals</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <DollarSign className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Referral Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referralBonus.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <Gift className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10%</div>
            <p className="text-sm text-muted-foreground">Per referral deposit</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn referral bonuses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly />
            <Button onClick={copyReferralLink} className="bg-gold text-navy hover:bg-gold/90">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 bg-gold/10 rounded-lg space-y-2">
            <h3 className="font-semibold">How it works:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Share your unique referral link with friends</li>
              <li>✓ Earn 10% commission on their first deposit</li>
              <li>✓ Receive 5% on their subsequent deposits</li>
              <li>✓ No limit on the number of referrals</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>Referred Users</CardTitle>
        </CardHeader>
        <CardContent>
          {referralCount === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No referrals yet. Start sharing your link!
            </p>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Referral list coming soon
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

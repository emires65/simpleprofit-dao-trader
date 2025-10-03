import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Clock } from "lucide-react";

export const Support = () => {
  useEffect(() => {
    // Load JivoChat widget
    const script = document.createElement("script");
    script.src = "//code.jivosite.com/widget/qCyoGETLfD";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support & Help</h1>
        <p className="text-muted-foreground">Get assistance from our support team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gold/20">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Instant support available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the chat widget to connect with our support team in real-time.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <Mail className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>support@tradeflowpro.com</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Send us an email and we'll respond within 24 hours.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader>
            <Clock className="h-8 w-8 text-gold mb-2" />
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We aim to respond to all queries within one business day.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">How do I make a deposit?</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to Deposit/Withdraw page and select your preferred cryptocurrency. Send funds to the displayed wallet address.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How long do withdrawals take?</h3>
            <p className="text-sm text-muted-foreground">
              Withdrawal requests are processed within 24-48 hours after admin approval.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is KYC required?</h3>
            <p className="text-sm text-muted-foreground">
              No, we do not require KYC verification for trading on our platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

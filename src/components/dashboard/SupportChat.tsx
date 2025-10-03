import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

export const SupportChat = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Message",
        description: "Please enter a message",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("support_messages").insert({
        user_id: session.user.id,
        message: message.trim(),
        status: "open",
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Our support team will respond within 24 hours.",
      });
      setMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Support & Help
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How can we help you today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gold text-navy hover:bg-gold/90"
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>📧 Email: support@tradeflowpro.com</p>
          <p>🕐 Response time: Within 24 hours</p>
        </div>
      </CardContent>
    </Card>
  );
};

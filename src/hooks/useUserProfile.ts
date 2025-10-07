import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  balance: number;
  profit: number;
  bonus: number;
  ref_bonus: number;
  full_name: string | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let channel: any;
    const setup = async () => {
      await fetchProfile();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('profiles-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload: any) => {
            if (payload?.new) {
              setProfile(payload.new as any);
            } else if (payload?.eventType === 'DELETE') {
              setProfile(null);
            }
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { profile, loading, refetch: fetchProfile };
};

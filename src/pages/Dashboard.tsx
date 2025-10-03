import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, User, HelpCircle, BarChart2, History, FileText, ArrowLeftRight, Repeat, Package, Users, LogOut, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardHome } from "./dashboard/DashboardHome";
import { Account } from "./dashboard/Account";
import { Support } from "./dashboard/Support";
import { PLRecord } from "./dashboard/PLRecord";
import { TradingHistory } from "./dashboard/TradingHistory";
import { Transactions } from "./dashboard/Transactions";
import { DepositWithdraw } from "./dashboard/DepositWithdraw";
import { Subscription } from "./dashboard/Subscription";
import { Packages } from "./dashboard/Packages";
import { ReferUsers } from "./dashboard/ReferUsers";

interface UserProfile {
  balance: number;
  profit: number;
  bonus: number;
  ref_bonus: number;
  full_name: string | null;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!profile) return;

    // Set up real-time subscription for profile updates
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profile.balance !== undefined ? '' : ''}`, // Will be set after profile loads
        },
        (payload) => {
          setProfile(payload.new as UserProfile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.balance !== undefined]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(profileData);

      // Set up real-time subscription for profile updates
      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`,
          },
          (payload) => {
            setProfile(payload.new as UserProfile);
          }
        )
        .subscribe();

    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Account", icon: User, url: "/dashboard/account" },
    { title: "Support", icon: HelpCircle, url: "/dashboard/support" },
    { title: "P/L Record", icon: BarChart2, url: "/dashboard/pl-record" },
    { title: "Trading History", icon: History, url: "/dashboard/trading-history" },
    { title: "Transactions", icon: FileText, url: "/dashboard/transactions" },
    { title: "Deposit/Withdraw", icon: ArrowLeftRight, url: "/dashboard/deposit-withdraw" },
    { title: "Subscription Trade", icon: Repeat, url: "/dashboard/subscription" },
    { title: "Packages", icon: Package, url: "/dashboard/packages" },
    { title: "Refer Users", icon: Users, url: "/dashboard/refer" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar className="border-r border-gold/20">
          <div className="p-4 border-b border-gold/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-navy" />
              </div>
              <div>
                <span className="text-lg font-bold">TradeFlow Pro</span>
                <p className="text-xs text-muted-foreground">{profile?.full_name || "User"}</p>
              </div>
            </div>
          </div>
          
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route index element={profile && <DashboardHome profile={profile} />} />
              <Route path="account" element={<Account />} />
              <Route path="support" element={<Support />} />
              <Route path="pl-record" element={<PLRecord />} />
              <Route path="trading-history" element={<TradingHistory />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="deposit-withdraw" element={<DepositWithdraw />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="packages" element={<Packages />} />
              <Route path="refer" element={<ReferUsers />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, User, HelpCircle, BarChart2, History, FileText, ArrowLeftRight, Repeat, Package, Users, LogOut, TrendingUp, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const MenuContent = () => (
    <>
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
      
      <div className="px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.url
                  ? "bg-gold/10 text-gold"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <MenuContent />
              </SheetContent>
            </Sheet>
            <div className="ml-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-navy" />
              </div>
              <span className="font-bold">TradeFlow Pro</span>
            </div>
          </div>
        </header>

        <main className="p-4">
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
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar className="border-r border-gold/20">
          <MenuContent />
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

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [newProfit, setNewProfit] = useState("");
  const [newBonus, setNewBonus] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setFilteredUsers(data || []);
  };

  const handleUpdateUserFinancials = async () => {
    if (!selectedUser) return;

    const updates: any = {};
    if (newBalance !== "") updates.balance = Number(newBalance);
    if (newProfit !== "") updates.profit = Number(newProfit);
    if (newBonus !== "") updates.bonus = Number(newBonus);

    if (Object.keys(updates).length === 0) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', selectedUser.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Log action
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('admin_logs').insert({
      admin_id: user?.id,
      action: 'update_user_financials',
      details: { user_id: selectedUser.id, updates }
    });

    toast({ title: "Success", description: "User financials updated successfully" });
    setEditDialog(false);
    fetchUsers();
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all user accounts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'No name'}</TableCell>
                  <TableCell>${Number(user.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>${Number(user.profit || 0).toFixed(2)}</TableCell>
                  <TableCell>${Number(user.bonus || 0).toFixed(2)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => { 
                          setSelectedUser(user); 
                          setNewBalance(user.balance?.toString() || "");
                          setNewProfit(user.profit?.toString() || "");
                          setNewBonus(user.bonus?.toString() || "");
                          setEditDialog(true); 
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Financials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Balance</Label>
              <Input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="Enter balance"
              />
            </div>
            <div>
              <Label>Profit</Label>
              <Input
                type="number"
                value={newProfit}
                onChange={(e) => setNewProfit(e.target.value)}
                placeholder="Enter profit"
              />
            </div>
            <div>
              <Label>Bonus</Label>
              <Input
                type="number"
                value={newBonus}
                onChange={(e) => setNewBonus(e.target.value)}
                placeholder="Enter bonus"
              />
            </div>
            <Button onClick={handleUpdateUserFinancials} className="w-full">Update User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    min_deposit: "",
    max_deposit: "",
    daily_return: "",
    duration_days: "",
    bonus_percentage: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase.from('investment_plans').select('*').order('min_deposit');
    setPlans(data || []);
  };

  const handleSubmit = async () => {
    const planData = {
      name: formData.name,
      description: formData.description,
      min_deposit: Number(formData.min_deposit),
      max_deposit: Number(formData.max_deposit),
      daily_return: Number(formData.daily_return),
      duration_days: Number(formData.duration_days),
      bonus_percentage: Number(formData.bonus_percentage)
    };

    if (editingPlan) {
      const { error } = await supabase.from('investment_plans').update(planData).eq('id', editingPlan.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Plan updated successfully" });
    } else {
      const { error } = await supabase.from('investment_plans').insert(planData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Plan created successfully" });
    }

    setDialog(false);
    setEditingPlan(null);
    setFormData({
      name: "",
      description: "",
      min_deposit: "",
      max_deposit: "",
      daily_return: "",
      duration_days: "",
      bonus_percentage: ""
    });
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    const { error } = await supabase.from('investment_plans').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Plan deleted successfully" });
    fetchPlans();
  };

  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      min_deposit: plan.min_deposit.toString(),
      max_deposit: plan.max_deposit.toString(),
      daily_return: plan.daily_return.toString(),
      duration_days: plan.duration_days.toString(),
      bonus_percentage: plan.bonus_percentage.toString()
    });
    setDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Investment Plans</h1>
          <p className="text-muted-foreground">Manage investment packages</p>
        </div>
        <Button onClick={() => { setEditingPlan(null); setDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Min Deposit</TableHead>
                <TableHead>Max Deposit</TableHead>
                <TableHead>Daily Return</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>${plan.min_deposit}</TableCell>
                  <TableCell>${plan.max_deposit}</TableCell>
                  <TableCell>{plan.daily_return}%</TableCell>
                  <TableCell>{plan.duration_days} days</TableCell>
                  <TableCell>{plan.bonus_percentage}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Plan Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <Label>Min Deposit ($)</Label>
              <Input type="number" value={formData.min_deposit} onChange={(e) => setFormData({...formData, min_deposit: e.target.value})} />
            </div>
            <div>
              <Label>Max Deposit ($)</Label>
              <Input type="number" value={formData.max_deposit} onChange={(e) => setFormData({...formData, max_deposit: e.target.value})} />
            </div>
            <div>
              <Label>Daily Return (%)</Label>
              <Input type="number" step="0.01" value={formData.daily_return} onChange={(e) => setFormData({...formData, daily_return: e.target.value})} />
            </div>
            <div>
              <Label>Duration (days)</Label>
              <Input type="number" value={formData.duration_days} onChange={(e) => setFormData({...formData, duration_days: e.target.value})} />
            </div>
            <div>
              <Label>Bonus Percentage (%)</Label>
              <Input type="number" step="0.01" value={formData.bonus_percentage} onChange={(e) => setFormData({...formData, bonus_percentage: e.target.value})} />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

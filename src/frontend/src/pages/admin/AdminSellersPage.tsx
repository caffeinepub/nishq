import { useState } from 'react';
import { useGetAllSellers, useAddSeller, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Plus, Shield } from 'lucide-react';
import SellerForm from '../../components/admin/SellerForm';
import type { Seller } from '../../backend';
import { toast } from 'sonner';

export default function AdminSellersPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: sellers, isLoading: sellersLoading } = useGetAllSellers();
  const addSellerMutation = useAddSeller();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-1/2 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You must be an administrator to access this page.</p>
        </Card>
      </div>
    );
  }

  const handleAddSeller = async (seller: Seller) => {
    try {
      await addSellerMutation.mutateAsync(seller);
      toast.success('Seller added successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add seller');
      console.error(error);
    }
  };

  const filteredSellers = sellers?.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.sellerId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div 
      className="min-h-screen py-12"
      style={{ 
        backgroundImage: 'url(/assets/generated/admin-dashboard-bg.dim_1600x900.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Seller Management</h1>
            <p className="text-muted-foreground">Manage seller profiles and trust scores</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Seller
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Seller</DialogTitle>
              </DialogHeader>
              <SellerForm onSubmit={handleAddSeller} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-background/95 backdrop-blur">
          <CardContent className="pt-6">
            <Input
              placeholder="Search sellers by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {sellersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : filteredSellers.length === 0 ? (
          <Card className="p-12 text-center bg-background/95 backdrop-blur">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No sellers found</h2>
            <p className="text-muted-foreground">Add your first seller to get started.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map(seller => (
              <Card key={seller.sellerId} className="bg-background/95 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{seller.name}</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{Number(seller.trustScore)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller ID</span>
                    <span className="font-mono text-xs">{seller.sellerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Age</span>
                    <span>{Math.floor(Number(seller.accountAgeDays) / 365)}y {Number(seller.accountAgeDays) % 365}d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span>{Number(seller.totalOrders).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disputes (W/L)</span>
                    <span>{Number(seller.disputesWon)} / {Number(seller.disputesLost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Violations</span>
                    <span className={Number(seller.policyViolations) > 0 ? 'text-destructive font-semibold' : ''}>
                      {Number(seller.policyViolations)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Penalties</span>
                    <span className={Number(seller.penalties) > 0 ? 'text-destructive font-semibold' : ''}>
                      {Number(seller.penalties)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

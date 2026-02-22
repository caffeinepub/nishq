import { useState } from 'react';
import { useGetAllProducts, useGetAllSellers, useAddProduct, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Plus } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import type { Product } from '../../backend';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { data: sellers } = useGetAllSellers();
  const addProductMutation = useAddProduct();
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

  const handleAddProduct = async (product: Product) => {
    try {
      await addProductMutation.mutateAsync(product);
      toast.success('Product added successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  const sellersMap = new Map(sellers?.map(s => [s.sellerId, s.name]) || []);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage products and their trust indicators</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleAddProduct} sellers={sellers || []} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-background/95 backdrop-blur">
          <CardContent className="pt-6">
            <Input
              placeholder="Search products by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {productsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 text-center bg-background/95 backdrop-blur">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No products found</h2>
            <p className="text-muted-foreground">Add your first product to get started.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.productId} className="bg-background/95 backdrop-blur">
                {product.images.length > 0 && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID</span>
                    <span className="font-mono text-xs">{product.productId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">₹{Number(product.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller</span>
                    <span>{sellersMap.get(product.sellerId) || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Reasons</span>
                    <span>{product.returnReasons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trade-offs</span>
                    <span>{product.tradeOffs.length}</span>
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

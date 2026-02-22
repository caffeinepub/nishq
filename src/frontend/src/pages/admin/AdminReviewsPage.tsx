import { useState } from 'react';
import { useGetAllReviews, useGetAllProducts, useAddReview, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, CheckCircle, Clock } from 'lucide-react';
import ReviewForm from '../../components/admin/ReviewForm';
import type { Review } from '../../backend';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: reviews, isLoading: reviewsLoading } = useGetAllReviews();
  const { data: products } = useGetAllProducts();
  const addReviewMutation = useAddReview();
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

  const handleAddReview = async (review: Review) => {
    try {
      await addReviewMutation.mutateAsync(review);
      toast.success('Review added successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add review');
      console.error(error);
    }
  };

  const productsMap = new Map(products?.map(p => [p.productId, p.name]) || []);

  const filteredReviews = reviews?.filter(review =>
    review.reviewId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    productsMap.get(review.productId)?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Review Management</h1>
            <p className="text-muted-foreground">Manage verified reviews and verification status</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Review</DialogTitle>
              </DialogHeader>
              <ReviewForm onSubmit={handleAddReview} products={products || []} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-background/95 backdrop-blur">
          <CardContent className="pt-6">
            <Input
              placeholder="Search reviews by ID, user, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card className="p-12 text-center bg-background/95 backdrop-blur">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No reviews found</h2>
            <p className="text-muted-foreground">Add your first review to get started.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <Card key={review.reviewId} className="bg-background/95 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        {productsMap.get(review.productId) || 'Unknown Product'}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {review.verified && (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Number(review.usageDays)} days
                        </Badge>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < Number(review.rating) ? 'text-yellow-500' : 'text-muted'}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{review.content}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-border">
                    <div>
                      <span className="text-muted-foreground">Review ID:</span>
                      <span className="ml-2 font-mono text-xs">{review.reviewId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="ml-2 font-mono text-xs">{review.userId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Product ID:</span>
                      <span className="ml-2 font-mono text-xs">{review.productId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="ml-2 font-semibold">{Number(review.rating)}/5</span>
                    </div>
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

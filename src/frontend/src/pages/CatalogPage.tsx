import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts, useGetAllSellers } from '../hooks/useQueries';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Shield } from 'lucide-react';
import type { Product, Seller } from '../backend';

export default function CatalogPage() {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { data: sellers, isLoading: sellersLoading } = useGetAllSellers();

  const sellersMap = new Map<string, Seller>();
  sellers?.forEach(seller => sellersMap.set(seller.sellerId, seller));

  const getFakeReviewRisk = (product: Product): 'Low' | 'Medium' | 'High' => {
    const seller = sellersMap.get(product.sellerId);
    if (!seller) return 'Medium';
    
    const trustScore = Number(seller.trustScore);
    if (trustScore >= 80) return 'Low';
    if (trustScore >= 50) return 'Medium';
    return 'High';
  };

  const getReturnPercentage = (product: Product): number => {
    return product.returnReasons.length * 5;
  };

  if (productsLoading || sellersLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Trusted Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Trusted Products</h1>
        <p className="text-muted-foreground">Every product verified for transparency and trust</p>
      </div>

      {!products || products.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No products available</h2>
          <p className="text-muted-foreground">Check back soon or contact an administrator to add products.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const seller = sellersMap.get(product.sellerId);
            const fakeReviewRisk = getFakeReviewRisk(product);
            const returnPercentage = getReturnPercentage(product);

            return (
              <Card 
                key={product.productId} 
                className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate({ to: '/product/$productId', params: { productId: product.productId } })}
              >
                {product.images.length > 0 && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-foreground mb-4">₹{Number(product.price).toLocaleString()}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Seller Trust Score</span>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{seller ? Number(seller.trustScore) : 'N/A'}/100</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account Age</span>
                      <span className="font-semibold">
                        {seller ? `${Math.floor(Number(seller.accountAgeDays) / 365)}y ${Number(seller.accountAgeDays) % 365}d` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Return Rate</span>
                      <span className="font-semibold">{returnPercentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Review Risk</span>
                      <Badge variant={fakeReviewRisk === 'Low' ? 'default' : fakeReviewRisk === 'Medium' ? 'secondary' : 'destructive'}>
                        {fakeReviewRisk}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-xs text-muted-foreground italic">
                    Shown because of seller trust score and low return rate
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

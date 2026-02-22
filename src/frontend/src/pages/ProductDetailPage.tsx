import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetProduct, useGetSeller, useGetProductReviews } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield, AlertCircle, TrendingDown, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading: productLoading } = useGetProduct(productId);
  const { data: seller, isLoading: sellerLoading } = useGetSeller(product?.sellerId || '');
  const { data: reviews, isLoading: reviewsLoading } = useGetProductReviews(productId);

  if (productLoading || sellerLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Product not found</h2>
          <Link to="/catalog">
            <Button variant="outline" className="mt-4">Back to Catalog</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const trustScore = seller ? Number(seller.trustScore) : 0;
  const accountAgeDays = seller ? Number(seller.accountAgeDays) : 0;
  const returnPercentage = product.returnReasons.length * 5;
  const fakeReviewRisk = trustScore >= 80 ? 'Low' : trustScore >= 50 ? 'Medium' : 'High';

  const basePrice = Number(product.price);
  const taxAmount = Math.round(basePrice * 0.18);
  const deliveryFee = 50;
  const warrantyFee = 0;
  const totalPrice = basePrice + taxAmount + deliveryFee + warrantyFee;

  const verifiedReviews = reviews?.filter(r => r.verified) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          {product.images.length > 0 ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[0].getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Trust Information - Above Price */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trust Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Seller Trust Score</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <span className="font-semibold text-lg">{trustScore}/100</span>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Lifetime-based trust score calculated from delivery success, return behavior, review authenticity, and dispute outcomes. Cannot be reset.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Seller Account Age</span>
                <span className="font-semibold">
                  {Math.floor(accountAgeDays / 365)} years {accountAgeDays % 365} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Return Percentage</span>
                <span className="font-semibold">{returnPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fake Review Risk</span>
                <Badge variant={fakeReviewRisk === 'Low' ? 'default' : fakeReviewRisk === 'Medium' ? 'secondary' : 'destructive'}>
                  {fakeReviewRisk}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Price Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span className="font-semibold">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="font-semibold">₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">₹{deliveryFee}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Price</span>
                <span className="text-2xl font-bold text-foreground">₹{totalPrice.toLocaleString()}</span>
              </div>
              <Button 
                size="lg" 
                className="w-full mt-4"
                onClick={() => navigate({ to: '/checkout/$productId', params: { productId } })}
              >
                Proceed to Secure Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seller Transparency Panel */}
      {seller && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seller Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{Number(seller.totalOrders).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Disputes Won / Lost</p>
                <p className="text-2xl font-bold">{Number(seller.disputesWon)} / {Number(seller.disputesLost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Policy Violations (6 months)</p>
                <p className="text-2xl font-bold text-destructive">{Number(seller.policyViolations)}</p>
              </div>
            </div>

            {seller.penalties > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold text-destructive">Platform Penalties</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This seller has {Number(seller.penalties)} active penalties for policy violations.
                </p>
              </div>
            )}

            {seller.historyTimeline.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Seller History Timeline</h3>
                <div className="space-y-2">
                  {seller.historyTimeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <p className="text-muted-foreground">{event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Verified Reviews ({verifiedReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : verifiedReviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No verified reviews yet</p>
          ) : (
            <div className="space-y-6">
              {verifiedReviews.map(review => (
                <div key={review.reviewId} className="border-b border-border/40 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Used for {Number(review.usageDays)} days
                      </Badge>
                      <Badge variant="secondary">Verified Buyer</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Number(review.rating) ? 'text-yellow-500' : 'text-muted'}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600 dark:text-green-400">Who should buy this product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Buyers looking for {product.name.toLowerCase()} with verified quality and transparent seller history.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Who should avoid this product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Those seeking immediate delivery or lowest possible price without quality verification.
            </p>
          </CardContent>
        </Card>
      </div>

      {product.tradeOffs.length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Honest Trade-offs and Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {product.tradeOffs.map((tradeOff, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingDown className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{tradeOff}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {product.returnReasons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Public Return Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {product.returnReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

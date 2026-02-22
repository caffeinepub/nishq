import { useParams, Link } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
  const { productId } = useParams({ from: '/checkout/$productId' });
  const { data: product, isLoading } = useGetProduct(productId);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
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

  const basePrice = Number(product.price);
  const taxAmount = Math.round(basePrice * 0.18);
  const deliveryFee = 50;
  const totalPrice = basePrice + taxAmount + deliveryFee;

  const escrowReleaseDate = new Date();
  escrowReleaseDate.setDate(escrowReleaseDate.getDate() + 7);
  
  const refundAvailableDate = new Date();
  refundAvailableDate.setDate(refundAvailableDate.getDate() + 14);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <Card className="p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully</h2>
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed. Payment will be held in escrow until delivery is verified.
          </p>
          <div className="space-y-2 text-sm text-left bg-muted/30 p-4 rounded-lg mb-6">
            <p><strong>Payment held until:</strong> {escrowReleaseDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Refund available until:</strong> {refundAvailableDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <Link to="/catalog">
            <Button>Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <input type="radio" name="payment" id="upi" defaultChecked />
                  <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <input type="radio" name="payment" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <input type="radio" name="payment" id="netbanking" />
                  <Label htmlFor="netbanking" className="cursor-pointer">Net Banking</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Protection */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Platform Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Your payment is held securely in escrow until delivery is confirmed
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Full refund available if product doesn't match description
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Seller accountability enforced through transparent dispute resolution
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {product.images.length > 0 && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Qty: 1</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                <p><strong>Payment held until:</strong> {escrowReleaseDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p><strong>Refund available until:</strong> {refundAvailableDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <Button onClick={handlePlaceOrder} size="lg" className="w-full">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

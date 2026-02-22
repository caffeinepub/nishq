import { Link } from '@tanstack/react-router';
import { Shield, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative w-full py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Buy with certainty. Not guesswork.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Verified reviews, transparent sellers, and lifetime trust scores — so you always know what you're buying.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Trusted Products
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <a href="#how-we-prevent">How We Prevent Fake Reviews</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="w-full py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Reviews After Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Reviews allowed only after delivery and usage time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Visible Seller History</h3>
                <p className="text-sm text-muted-foreground">
                  Seller history visible to everyone
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">No Fake MRPs</h3>
                <p className="text-sm text-muted-foreground">
                  No fake MRPs or artificial discounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Permanent Trust Scores</h3>
                <p className="text-sm text-muted-foreground">
                  Trust scores cannot be reset
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why NISHQ Exists */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why NISHQ exists
            </h2>
            <p className="text-lg text-muted-foreground">
              Most marketplaces optimise for sales. NISHQ optimises for certainty.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Are Different */}
      <section className="w-full py-16 bg-muted/30" id="how-we-prevent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Why we are different
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Verified Reviews After Delivery</h3>
                  <p className="text-muted-foreground">
                    Reviews are verified after delivery and weighted by user history
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Lifetime-Based Trust Scores</h3>
                  <p className="text-muted-foreground">
                    Seller trust scores are lifetime-based and permanent
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Honest Pricing</h3>
                  <p className="text-muted-foreground">
                    Prices are shown without inflated MRPs or discount drama
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Public Return Patterns</h3>
                  <p className="text-muted-foreground">
                    Return patterns and seller violations are publicly visible
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Explainable Recommendations</h3>
                  <p className="text-muted-foreground">
                    Every product recommendation is explainable
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How Trust is Calculated */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              How trust is calculated
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Delivery Success</h3>
                <p className="text-sm text-muted-foreground">
                  Consistent on-time deliveries build trust
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Return Behaviour</h3>
                <p className="text-sm text-muted-foreground">
                  Low return rates indicate quality products
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Review Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  Verified reviews from real buyers
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Dispute Outcomes</h3>
                <p className="text-sm text-muted-foreground">
                  Public dispute outcomes ensure accountability
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Platform Is For */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Who this platform is for
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Careful Buyers</h3>
                  <p className="text-sm text-muted-foreground">
                    Those who value quality and certainty over impulse purchases
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Families</h3>
                  <p className="text-sm text-muted-foreground">
                    Long-term users who prioritize trust and safety
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Honest Sellers</h3>
                  <p className="text-sm text-muted-foreground">
                    Sellers who don't cut corners and value transparency
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'nishq-app';

  return (
    <footer className="w-full border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Transparency</h3>
            <ul className="space-y-2">
              <li>
                <a href="#transparency-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Transparency Policy
                </a>
              </li>
              <li>
                <a href="#grievance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Grievance & Dispute Resolution
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: support@nishq.com
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: +91 1800-XXX-XXXX
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">About NISHQ</h3>
            <p className="text-sm text-muted-foreground">
              Buy with certainty. Not guesswork.
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} NISHQ. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

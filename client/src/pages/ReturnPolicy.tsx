import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 glow-text">Return Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              <strong>Last updated:</strong> October 23, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">30-Day Return Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                At INF!NITE C107HING, we want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a 30-day return policy from the date of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Eligibility for Returns</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To be eligible for a return, items must meet the following conditions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Item must be unused and in the same condition that you received it</li>
                <li>Item must be in its original packaging with all tags attached</li>
                <li>Return must be initiated within 30 days of delivery</li>
                <li>Proof of purchase (order number or receipt) must be provided</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Non-Returnable Items</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Items marked as "Final Sale"</li>
                <li>Worn, washed, or damaged items</li>
                <li>Items without original tags or packaging</li>
                <li>Customized or personalized products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">How to Return an Item</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Step 1: Contact Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Email us at returns@infiniteclothingstore.co.uk with your order number and the item(s) you wish to return. We'll provide you with a return authorization and instructions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Step 2: Package Your Return</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Securely package the item(s) in their original packaging with all tags attached. Include a copy of your order confirmation or packing slip.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Step 3: Ship Your Return</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ship the package to the address provided in your return authorization. We recommend using a trackable shipping service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Return Shipping Costs</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>UK Returns:</strong> Free return shipping label provided</li>
                <li><strong>International Returns:</strong> Customer responsible for return shipping costs</li>
                <li><strong>Defective Items:</strong> We cover all return shipping costs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Once we receive and inspect your return, we will:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Send you an email confirmation that we've received your return</li>
                <li>Process your refund within 5-7 business days</li>
                <li>Issue the refund to your original payment method</li>
                <li>Note: It may take an additional 5-10 business days for the refund to appear in your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Exchanges</h2>
              <p className="text-muted-foreground leading-relaxed">
                We currently do not offer direct exchanges. If you need a different size or color, please return the original item for a refund and place a new order for the item you want.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Damaged or Defective Items</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you receive a damaged or defective item, please contact us immediately at support@infiniteclothingstore.co.uk with photos of the damage. We will arrange for a replacement or full refund at no cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Late or Missing Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you haven't received your refund after the expected timeframe:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Check your bank account again</li>
                <li>Contact your credit card company (it may take time for the refund to post)</li>
                <li>Contact your bank (processing times vary)</li>
                <li>If you've done all of this and still haven't received your refund, contact us at returns@infiniteclothingstore.co.uk</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our return policy, please contact us:
              </p>
              <p className="text-primary mt-3">
                Email: returns@infiniteclothingstore.co.uk<br />
                Phone: +44 (0) XXX XXX XXXX<br />
                Address: INF!NITE C107HING, United Kingdom
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


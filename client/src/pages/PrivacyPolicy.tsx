import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 glow-text">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              <strong>Last updated:</strong> October 23, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                INF!NITE C107HING ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website infiniteclothingstore.co.uk and make purchases from our online store.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
                <li><strong>Payment processors:</strong> Stripe for secure payment processing</li>
                <li><strong>Shipping providers:</strong> To deliver your orders</li>
                <li><strong>Email service providers:</strong> SendGrid for order confirmations</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. All payment transactions are processed through Stripe's secure payment gateway, and we do not store your complete credit card information on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Under GDPR and UK data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-primary mt-3">
                Email: infiniteclothings2024@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


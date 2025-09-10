import { Shell } from "@/components/shell";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  return (
    <Shell className="max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Introduction</h2>
            <p className="text-muted-foreground">
              At {siteConfig.name}, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website or make a purchase from us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Information We Collect</h2>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Personal Information</h3>
              <p className="text-muted-foreground">
                We may collect personal information such as your name, email
                address, phone number, shipping address, and billing information
                when you create an account or make a purchase.
              </p>

              <h3 className="font-medium text-lg">Usage Information</h3>
              <p className="text-muted-foreground">
                We automatically collect certain information about your device
                and how you interact with our website, including your IP
                address, browser type, pages visited, and time spent on our
                site.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account and orders</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share your information with:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Service providers who help us operate our business</li>
              <li>Payment processors to handle transactions</li>
              <li>Shipping companies to deliver your orders</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your browsing
              experience, analyze website traffic, and personalize content. You
              can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request information about how we use your data</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: privacy@{siteConfig.name.toLowerCase()}.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

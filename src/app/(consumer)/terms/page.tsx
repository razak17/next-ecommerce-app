import { Shell } from "@/components/shell";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <Shell className="max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using {siteConfig.name}, you accept and agree to
              be bound by the terms and provision of this agreement. If you do
              not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily download one copy of the
              materials on {siteConfig.name}
              for personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">User Account</h2>
            <p className="text-muted-foreground">
              To access certain features of our service, you may be required to
              create an account. You are responsible for:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>
                Maintaining the confidentiality of your account and password
              </li>
              <li>Restricting access to your computer and account</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Product Information</h2>
            <p className="text-muted-foreground">
              We strive to provide accurate product information, including
              descriptions, pricing, and availability. However, we do not
              warrant that product descriptions or other content is accurate,
              complete, or error-free. We reserve the right to correct any
              errors and update information at any time without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Orders and Payment</h2>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Order Acceptance</h3>
              <p className="text-muted-foreground">
                All orders are subject to acceptance and availability. We
                reserve the right to refuse or cancel any order at our
                discretion.
              </p>

              <h3 className="font-medium text-lg">Pricing</h3>
              <p className="text-muted-foreground">
                All prices are subject to change without notice. We reserve the
                right to modify prices at any time.
              </p>

              <h3 className="font-medium text-lg">Payment</h3>
              <p className="text-muted-foreground">
                Payment must be received in full before order fulfillment. We
                accept various payment methods as displayed during checkout.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Shipping and Delivery</h2>
            <p className="text-muted-foreground">
              Shipping costs and delivery times vary based on location and
              shipping method selected. We are not responsible for delays caused
              by shipping carriers or customs procedures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Returns and Refunds</h2>
            <p className="text-muted-foreground">
              We offer a 30-day return policy for most items. Items must be
              returned in original condition. Certain items may not be eligible
              for return. Refunds will be processed to the original payment
              method within 5-10 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You may not use our service:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>
                For any unlawful purpose or to solicit others to unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
              <li>
                To upload or transmit viruses or any other type of malicious
                code
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on {siteConfig.name} are provided on an 'as is'
              basis. {siteConfig.name} makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties
              including without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall {siteConfig.name} or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on {siteConfig.name},
              even if {siteConfig.name} or an authorized representative has been
              notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Accuracy of Materials</h2>
            <p className="text-muted-foreground">
              The materials appearing on {siteConfig.name} could include
              technical, typographical, or photographic errors.
              {siteConfig.name} does not warrant that any of the materials on
              its website are accurate, complete, or current.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Modifications</h2>
            <p className="text-muted-foreground">
              {siteConfig.name} may revise these terms of service at any time
              without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Governing Law</h2>
            <p className="text-muted-foreground">
              These terms and conditions are governed by and construed in
              accordance with the laws and you irrevocably submit to the
              exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-xl">Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: legal@{siteConfig.name.toLowerCase()}.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

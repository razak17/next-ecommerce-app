import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { redirects } from "@/lib/constants";

interface AccountVerificationEmailProps {
  email: string;
  verificationUrl: string;
  companyName: string;
}

const AccountVerificationEmail = ({
  email,
  verificationUrl,
  companyName,
}: AccountVerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Verify your account to get started</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-10 font-sans">
          <Container className="mx-auto max-w-xl rounded-lg bg-white p-10 shadow-sm">
            {/* Header */}
            <Section className="mb-8 text-center">
              <Heading className="m-0 mb-2 font-bold text-2xl text-gray-900">
                Welcome to {companyName}!
              </Heading>
              <Text className="m-0 text-base text-gray-600">
                We're excited to have you on board
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="m-0 mb-4 text-base text-gray-700">
                Hi there,
              </Text>
              <Text className="m-0 mb-4 text-base text-gray-700">
                Thanks for signing up with <strong>{companyName}</strong>! To
                complete your registration and secure your account, please
                verify your email address by clicking the button below.
              </Text>
              <Text className="m-0 mb-6 text-base text-gray-700">
                This verification link will expire in 24 hours for security
                purposes.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-8 text-center">
              <Button
                href={verificationUrl}
                className="box-border inline-block rounded-lg bg-blue-600 px-8 py-4 font-semibold text-base text-white no-underline"
              >
                Verify Your Account
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8">
              <Text className="m-0 mb-2 text-gray-600 text-sm">
                If the button above doesn't work, you can copy and paste this
                link into your browser:
              </Text>
              <Link
                href={verificationUrl}
                className="break-all text-blue-600 text-sm"
              >
                {verificationUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="mb-8 rounded-lg bg-gray-50 p-5">
              <Text className="m-0 mb-2 text-gray-700 text-sm">
                <strong>Security tip:</strong> We will never ask for your
                password via email. If you didn't create an account with us,
                please ignore this email.
              </Text>
              <Text className="m-0 text-gray-600 text-sm">
                Account registered for: <strong>{email}</strong>
              </Text>
            </Section>

            {/* Support */}
            <Section className="mb-8">
              <Text className="m-0 mb-4 text-base text-gray-700">
                Need help? Our support team is here to assist you at any time.
              </Text>
              <Text className="m-0 text-base text-gray-700">
                Best regards,
                <br />
                The {companyName} Team
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-gray-200 border-t pt-6">
              <Text className="m-0 mb-2 text-center text-gray-500 text-xs">
                {companyName}, Inc.
              </Text>
              <Text className="m-0 mb-2 text-center text-gray-500 text-xs">
                123 Business Street, Suite 100, City, ST 12345
              </Text>
              <Text className="m-0 text-center text-gray-500 text-xs">
                <Link
                  href={redirects.toPrivacy}
                  className="text-gray-500 no-underline"
                >
                  Privacy Policy
                </Link>
                {" | "}&copy; {new Date().getFullYear()} {companyName}. All
                rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountVerificationEmail;

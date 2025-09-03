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
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] font-bold text-[28px] text-gray-900">
                Welcome to {companyName}!
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                We're excited to have you on board
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Hi there,
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Thanks for signing up with <strong>{companyName}</strong>! To
                complete your registration and secure your account, please
                verify your email address by clicking the button below.
              </Text>
              <Text className="m-0 mb-[24px] text-[16px] text-gray-700">
                This verification link will expire in 24 hours for security
                purposes.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={verificationUrl}
                className="box-border inline-block rounded-[8px] bg-blue-600 px-[32px] py-[16px] font-semibold text-[16px] text-white no-underline"
              >
                Verify Your Account
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[8px] text-[14px] text-gray-600">
                If the button above doesn't work, you can copy and paste this
                link into your browser:
              </Text>
              <Link
                href={verificationUrl}
                className="break-all text-[14px] text-blue-600"
              >
                {verificationUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[20px]">
              <Text className="m-0 mb-[8px] text-[14px] text-gray-700">
                <strong>Security tip:</strong> We will never ask for your
                password via email. If you didn't create an account with us,
                please ignore this email.
              </Text>
              <Text className="m-0 text-[14px] text-gray-600">
                Account registered for: <strong>{email}</strong>
              </Text>
            </Section>

            {/* Support */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Need help? Our support team is here to assist you at any time.
              </Text>
              <Text className="m-0 text-[16px] text-gray-700">
                Best regards,
                <br />
                The {companyName} Team
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-gray-200 border-t pt-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
                {companyName}, Inc.
              </Text>
              <Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
                123 Business Street, Suite 100, City, ST 12345
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
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

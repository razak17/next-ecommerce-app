import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyEmail } from "@/features/auth/actions/auth";

interface EmailVerifyPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function EmailVerifyPage({
  searchParams,
}: EmailVerifyPageProps) {
  if (!searchParams.token) {
    redirect("/profile");
  }

  const result = await verifyEmail(searchParams.token);

  return (
    <Shell>
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-bold text-2xl">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {result.success ? (
              <div className="space-y-4">
                <div className="text-green-600">
                  ✅ Email verified successfully!
                </div>
                <p className="text-muted-foreground text-sm">
                  Your email has been verified. You can now access all features.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-red-600">❌ Verification failed</div>
                <p className="text-muted-foreground text-sm">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/features/auth/actions/auth";

interface EmailVerificationFormProps {
  userEmail: string;
}

export function EmailVerificationForm({
  userEmail,
}: EmailVerificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  const handleSendVerification = () => {
    startTransition(async () => {
      const result = await sendVerificationEmail(userEmail);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Verification email sent successfully.");
      setEmailSent(true);
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Your email address is not verified. Verify your email to access all
        features.
      </p>
      <Button
        onClick={handleSendVerification}
        disabled={isPending || emailSent}
        size="sm"
        variant="outline"
      >
        {isPending
          ? "Sending..."
          : emailSent
            ? "Email Sent"
            : "Send Verification Email"}
      </Button>
      {emailSent && (
        <p className="text-muted-foreground text-xs">
          Check your email for the verification link.
        </p>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";

import { redirects } from "@/lib/constants";

export default async function AuthPage() {
  return <>{redirect(redirects.toLogin)}</>;
}

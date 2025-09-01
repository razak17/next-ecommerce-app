import { redirect } from "next/navigation";

import { redirects } from "@/lib/constants";

export default async function LoginPage() {
  return <>{redirect(redirects.toLogin)}</>;
}

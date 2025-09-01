import { redirect } from "next/navigation";

import { redirects } from "@/lib/constants";

export default async function RegisterPage() {
  return <>{redirect(redirects.toRegister)}</>;
}

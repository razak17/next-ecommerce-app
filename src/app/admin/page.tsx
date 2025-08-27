import { redirect } from "next/navigation";

import { redirects } from "@/lib/constants";

export default async function AdminPage() {
  return <>{redirect(redirects.adminToDashboard)}</>;
}

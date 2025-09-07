import { redirect } from "next/navigation";

export default async function AuthPage() {
  return <>{redirect("/auth/login")}</>;
}

import { redirect } from "next/navigation";

export default async function LoginPage() {
  return <>{redirect("/auth/login")}</>;
}

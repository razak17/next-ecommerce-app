import { redirect } from "next/navigation";

export default async function RegisterPage() {
  return <>{redirect("/auth/register")}</>;
}

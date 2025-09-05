import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "@/features/users/components/user-form";

export default function NewUserPage() {
  return (
    <Shell>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              Create New User
            </CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

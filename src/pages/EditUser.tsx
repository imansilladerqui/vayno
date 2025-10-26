import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  userSchema,
  type UserFormData,
  useUserManagement,
} from "@/hooks/useUserManagement";
import { UserForm } from "@/components/user/UserForm";
import { useUserProfile } from "@/hooks/queries/useUserQueries";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateUser, isUpdating } = useUserManagement();
  const { data: user, isLoading, error } = useUserProfile(id);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    values: user
      ? {
          full_name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: (user.role || "customer") as UserFormData["role"],
        }
      : undefined,
  });

  const onSubmit = (data: UserFormData) => {
    if (id) {
      updateUser(id, data);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">Failed to load user</p>
            <Button
              variant="outline"
              onClick={() => navigate("/users")}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground mt-1">
              Update user information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isUpdating}
              mode="edit"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;

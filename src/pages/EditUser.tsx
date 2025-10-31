import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  userSchema,
  type UserFormData,
  useUserManagement,
} from "@/hooks/useUserManagement";
import { UserForm } from "@/components/user/UserForm";
import { useCurrentProfile } from "@/hooks/queries/useProfileQueries";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateUser } = useUserManagement();
  const { data: user, isLoading, error } = useCurrentProfile(id);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "user" as UserFormData["role"],
      business_id: null,
      is_active: true,
    },
  });

  useEffect(() => {
    if (user) {
      const values: UserFormData = {
        full_name: (user.full_name ?? "") as string,
        email: (user.email ?? "") as string,
        phone: (user.phone ?? "") as string,
        role: (user.role ?? "user") as UserFormData["role"],
        business_id: (user.business_id ?? null) as string | null,
        is_active: (user.is_active ?? true) as boolean,
      };
      form.reset(values);
    }
  }, [user, form]);

  const onSubmit = (data: UserFormData) => {
    if (!id) return;
    updateUser(id, data);
  };

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

  if (!user && !isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">User not found</p>
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
            className="hover:bg-primary hover:bg-opacity-10"
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
            <UserForm form={form} onSubmit={onSubmit} mode="edit" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;

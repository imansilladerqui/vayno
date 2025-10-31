import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { userSchema, type UserFormData } from "@/hooks/useUserManagement";
import { UserForm } from "@/components/user/UserForm";
import { useCreateUser } from "@/hooks/queries/useUserQueries";

const CreateUser = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "user",
      business_id: null,
      is_active: true,
    },
  });

  const onSubmit = (data: UserFormData) => {
    createUserMutation.mutate(
      {
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone,
        password: undefined,
        sendPasswordEmail: false,
      },
      {
        onSuccess: () => {
          navigate("/users");
        },
      }
    );
  };

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
            <h1 className="text-3xl font-bold">Create User</h1>
            <p className="text-muted-foreground mt-1">Add a new user</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm form={form} onSubmit={onSubmit} mode="create" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;

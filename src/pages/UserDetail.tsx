import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  UserCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentProfile } from "@/hooks/queries/useProfileQueries";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const getRoleIcon = (role: string) => {
  if (role === "superadmin") return Shield;
  if (role === "admin") return UserCheck;
  return UserCheck;
};

const getRoleColor = (role: string) => {
  if (role === "superadmin") return "text-red-600 bg-red-50 border-red-200";
  if (role === "admin") return "text-blue-600 bg-blue-50 border-blue-200";
  return "text-gray-600 bg-gray-50 border-gray-200";
};

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useCurrentProfile(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading user...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">User not found</p>
              <Button
                variant="outline"
                onClick={() => navigate("/users")}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const RoleIcon = getRoleIcon(user.role || "");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/users")}
            className="gap-2 text-primary hover:bg-primary hover:bg-opacity-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <Button
            onClick={() => navigate(`/users/${user.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary text-2xl font-semibold">
                  {getInitials(user.full_name || "N/A")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">
                  {user.full_name || "No name"}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={cn("text-sm border-2", getRoleColor(user.role || ""))}
                  >
                    <RoleIcon className="h-4 w-4 mr-1" />
                    {user.role || "user"}
                  </Badge>
                  <Badge
                    variant={user.is_active ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Business</p>
                    <p className="font-medium">
                      {user.businesses?.name || "No business assigned"}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {user.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {format(new Date(user.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                {user.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.date_of_birth), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                {user.updated_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.updated_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDetail;


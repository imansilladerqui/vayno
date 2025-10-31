import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Shield,
  UserCheck,
  Plus,
  Eye,
} from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useDialogs } from "@/contexts/DialogContext";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { Profile } from "@/types";

const Users = () => {
  const navigate = useNavigate();
  const { deleteUserDialog } = useDialogs();
  const { users, isLoading, error } = useUserManagement();

  const editUser = (userId: string) => {
    navigate(`/users/${userId}/edit`);
  };

  const deleteUser = (user: Profile) => {
    deleteUserDialog.setSelectedUser(user);
    deleteUserDialog.show();
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">Manage all users</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {users?.length} Total
            </Badge>
            <Button onClick={() => navigate("/users/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </div>

        {!isLoading && !error && users && users.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  No users found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  No users have been registered yet
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && users && users.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map((userItem) => {
              const RoleIcon = getRoleIcon(userItem.role || "");

              return (
                <Card
                  key={userItem.id}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                          <AvatarImage src={userItem.avatar_url || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
                            {getInitials(userItem.full_name || "N/A")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {userItem.full_name || "No name"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs border-2",
                                getRoleColor(userItem.role || "")
                              )}
                            >
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {userItem.role || "user"}
                            </Badge>
                            <Badge
                              variant={
                                userItem.is_active ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {userItem.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/users/${userItem.id}`)}
                          aria-label="View user"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => editUser(userItem.id)}
                          aria-label="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            deleteUser(userItem as unknown as Profile)
                          }
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{userItem.email}</span>
                      </div>
                      {userItem.phone && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{userItem.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>
                          {userItem.businesses?.name || "No business assigned"}
                        </span>
                      </div>
                      {userItem.created_at && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Joined{" "}
                            {format(
                              new Date(userItem.created_at),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;

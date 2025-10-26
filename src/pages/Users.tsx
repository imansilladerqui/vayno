import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";

const Users = () => {
  const { users, isLoading, error, editUser, deleteUser } = useUserManagement();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and delete users
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {error && (
              <div className="p-4 text-destructive">Error loading users</div>
            )}
            {users && users.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No users found
              </div>
            )}
            {users && users.length > 0 && (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all"
                  >
                    <div>
                      <p className="font-medium">
                        {user.full_name || "No name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground">
                          {user.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium capitalize">
                        {user.role}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;

import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";

export const UsersStatCard = () => {
  const { totalUsers, activeUsers } = useUserManagement();
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeUsers} active
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

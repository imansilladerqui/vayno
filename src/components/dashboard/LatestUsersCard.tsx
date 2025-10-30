import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface LatestUsersCardProps {
  users?: Array<{
    id: string;
    full_name?: string;
    email: string;
    is_active?: boolean;
  }>;
  onViewAll?: () => void;
  onUserClick?: (userId: string) => void;
  limit?: number;
}

export const LatestUsersCard = ({
  users,
  onViewAll,
  onUserClick,
  limit = 5,
}: LatestUsersCardProps) => {
  if (!users || users.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-white">Latest Users</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Users will appear here once they are registered.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedUsers = users.slice(0, limit);

  const handleUserClick = (userId: string) => {
    if (onUserClick) {
      onUserClick(userId);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Latest Users</CardTitle>
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-white hover:bg-white/10"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => handleUserClick(user.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {user.full_name || "No name"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.is_active ? (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

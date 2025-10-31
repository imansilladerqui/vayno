import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useNavigate } from "react-router-dom";

export const LatestUsersCard = () => {
  const { displayedUsers } = useUserManagement();
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Latest Users</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/users")}
            className="text-white hover:bg-white/10"
          >
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedUsers?.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/users/${user.id}/edit`)}
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Edit } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useBusiness } from "@/hooks/queries/useBusinessQueries";
import { useAuthContext } from "@/contexts/AuthContext";

export const TeamMembersCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const { data: business } = useBusiness(id || "");

  if (!business) return null;

  const canEdit = isAdmin || isSuperAdmin;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({business.users?.length || 0})
          </CardTitle>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/business/${id}/edit`)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {business.users && business.users.length > 0 ? (
          <div className="space-y-3">
            {business.users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{user.full_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {user.role && (
                  <Badge variant="secondary">{user.role}</Badge>
                )}
              </div>
            ))}
            {business.users.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                +{business.users.length - 5} more members
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No team members assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


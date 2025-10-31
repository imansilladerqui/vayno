import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Edit } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useBusiness } from "@/hooks/queries/useBusinessQueries";
import { useAuthContext } from "@/contexts/AuthContext";

export const BusinessInfoCard = () => {
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
            <Building2 className="h-5 w-5" />
            Business Information
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Contact Email</p>
            <p className="font-medium">{business.contact_email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Contact Phone</p>
            <p className="font-medium">{business.contact_phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">City</p>
            <p className="font-medium">{business.city || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">State</p>
            <p className="font-medium">{business.state || "N/A"}</p>
          </div>
          {business.country && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Country</p>
              <p className="font-medium">{business.country}</p>
            </div>
          )}
          {business.zip_code && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Zip Code</p>
              <p className="font-medium">{business.zip_code}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


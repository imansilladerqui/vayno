import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const Businesses = () => {
  const [businesses] = useState([
    { id: "1", name: "Downtown Plaza", spots: 50, active: true },
    { id: "2", name: "City Center", spots: 30, active: true },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Parking Businesses</h1>
          <p className="text-muted-foreground mt-1">
            Manage all parking businesses across the system
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Businesses</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Business
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{business.name}</CardTitle>
                      {business.active && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {business.spots} parking spots
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Businesses;

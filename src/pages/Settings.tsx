import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your parking lot configuration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your parking lot details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input id="name" placeholder="Enter business name" defaultValue="Downtown Parking" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter address" defaultValue="123 Main St, City" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parking Rates</CardTitle>
            <CardDescription>Configure hourly and daily rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hourly">Hourly Rate ($)</Label>
              <Input id="hourly" type="number" placeholder="0.00" defaultValue="5.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily">Daily Maximum ($)</Label>
              <Input id="daily" type="number" placeholder="0.00" defaultValue="30.00" />
            </div>
            <Button>Update Rates</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity</CardTitle>
            <CardDescription>Set total number of parking spots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Total Spots</Label>
              <Input id="capacity" type="number" placeholder="100" defaultValue="100" />
            </div>
            <Button>Update Capacity</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

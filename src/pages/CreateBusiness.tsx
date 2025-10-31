import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  businessSchema,
  type BusinessFormData,
} from "@/hooks/useBusinessManagement";
import { BusinessForm } from "@/components/business/BusinessForm";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";

const CreateBusiness = () => {
  const navigate = useNavigate();
  const { createBusiness } = useBusinessManagement();

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US",
      contact_email: "",
      contact_phone: "",
      business_type: "",
      tax_id: "",
      is_active: true,
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    createBusiness(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/businesses")}
            className="hover:bg-primary hover:bg-opacity-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Business</h1>
            <p className="text-muted-foreground mt-1">Add a new business</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessForm form={form} onSubmit={onSubmit} mode="create" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateBusiness;

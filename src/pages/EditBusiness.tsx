import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  businessSchema,
  type BusinessFormData,
  useBusinessManagement,
} from "@/hooks/useBusinessManagement";
import { BusinessForm } from "@/components/business/BusinessForm";
import { useBusiness } from "@/hooks/queries/useBusinessQueries";

const EditBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateBusiness } = useBusinessManagement();
  const { data: business, isLoading, error } = useBusiness(id!);

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

  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name ?? "",
        description: business.description ?? "",
        address: business.address ?? "",
        city: business.city ?? "",
        state: business.state ?? "",
        zip_code: business.zip_code ?? "",
        country: business.country ?? "US",
        contact_email: business.contact_email ?? "",
        contact_phone: business.contact_phone ?? "",
        business_type: business.business_type ?? "",
        tax_id: business.tax_id ?? "",
        is_active: business.is_active ?? true,
      });
    }
  }, [business, form]);

  const onSubmit = (data: BusinessFormData) => {
    if (!id) return;
    updateBusiness(id, data);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">Failed to load business</p>
            <Button
              variant="outline"
              onClick={() => navigate("/businesses")}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!business && !isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Business not found</p>
            <Button
              variant="outline"
              onClick={() => navigate("/businesses")}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-3xl font-bold">Edit Business</h1>
            <p className="text-muted-foreground mt-1">
              Update business information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessForm form={form} onSubmit={onSubmit} mode="edit" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditBusiness;

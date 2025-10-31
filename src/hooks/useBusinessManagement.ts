import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useAllBusinesses,
  useUpdateBusiness,
  useCreateBusiness,
  useDeleteBusiness,
  type Business,
} from "@/hooks/queries/useBusinessQueries";
import { useDialogs } from "@/contexts/DialogContext";

export const businessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().default("US"),
  contact_email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  contact_phone: z.string().optional(),
  business_type: z.string().optional(),
  tax_id: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

export const useBusinessManagement = () => {
  const navigate = useNavigate();
  const { deleteBusinessDialog } = useDialogs();

  const { data, isLoading, error } = useAllBusinesses();
  const updateBusinessMutation = useUpdateBusiness();
  const createBusinessMutation = useCreateBusiness();
  const deleteBusinessMutation = useDeleteBusiness();

  const editBusiness = (business: Business) => {
    navigate(`/business/${business.id}/edit`);
  };

  const handleDeleteBusiness = (business: Business) => {
    deleteBusinessDialog.setSelectedBusiness(business);
    deleteBusinessDialog.show();
  };

  const updateBusiness = (businessId: string, data: Partial<Business>) => {
    updateBusinessMutation.mutate(
      { businessId, data },
      {
        onSuccess: () => {
          toast.success("Business updated successfully");
          navigate("/businesses");
        },
        onError: (error: Error) => {
          toast.error(`Failed to update business: ${error.message}`);
        },
      }
    );
  };

  const createBusiness = (data: BusinessFormData) => {
    createBusinessMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Business created successfully");
        navigate("/businesses");
      },
      onError: (error: Error) => {
        toast.error(`Failed to create business: ${error.message}`);
      },
    });
  };

  const confirmDeleteBusiness = (businessId: string) => {
    deleteBusinessMutation.mutate(businessId, {
      onSuccess: () => {
        toast.success("Business deleted successfully");
        deleteBusinessDialog.setSelectedBusiness(null);
        deleteBusinessDialog.hide();
      },
      onError: (error: Error) => {
        toast.error(`Failed to delete business: ${error.message}`);
      },
    });
  };

  const totalBusinesses = data?.length;
  const activeBusinesses = data?.filter((b) => b.is_active).length;
  const displayedBusinesses = data?.slice(0, 5);

  return {
    businesses: data,
    isLoading,
    error,

    editBusiness,
    deleteBusiness: handleDeleteBusiness,
    updateBusiness,
    createBusiness,
    confirmDeleteBusiness,

    isUpdating: updateBusinessMutation.isPending,
    isDeleting: deleteBusinessMutation.isPending,
    totalBusinesses,
    activeBusinesses,
    displayedBusinesses,
  };
};

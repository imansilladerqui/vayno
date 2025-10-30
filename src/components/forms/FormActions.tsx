import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FormActionsProps {
  /**
   * Loading state for the submit button
   */
  isLoading?: boolean;
  /**
   * Form mode - determines button text
   */
  mode?: "create" | "edit";
  /**
   * Entity name for button text (e.g., "User", "Business")
   */
  entityName: string;
  /**
   * Custom cancel handler (optional)
   * If not provided, will navigate to default route based on entityName
   */
  onCancel?: () => void;
  /**
   * Custom submit button text (optional)
   */
  submitText?: string;
  /**
   * Whether the form can be submitted
   */
  disabled?: boolean;
}

/**
 * Shared form action buttons (Cancel and Submit)
 * Handles loading states, navigation, and consistent styling
 */
export const FormActions = ({
  isLoading = false,
  mode = "create",
  entityName,
  onCancel,
  submitText,
  disabled = false,
}: FormActionsProps) => {
  const navigate = useNavigate();

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      const routeMap: Record<string, string> = {
        user: "/users",
        users: "/users",
        business: "/businesses",
        businesses: "/businesses",
      };

      const route = routeMap[entityName.toLowerCase()] || "/";
      navigate(route);
    }
  }, [onCancel, entityName, navigate]);

  const defaultSubmitText =
    mode === "create" ? `Create ${entityName}` : "Save Changes";

  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={disabled || isLoading}>
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        <Save className="mr-2 h-4 w-4" />
        {submitText || defaultSubmitText}
      </Button>
    </div>
  );
};

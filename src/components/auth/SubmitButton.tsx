import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  icon: LucideIcon;
  loadingText: string;
  defaultText: string;
}

export const SubmitButton = ({
  isLoading,
  icon: Icon,
  loadingText,
  defaultText,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon className="mr-2 h-4 w-4" />
          {defaultText}
        </>
      )}
    </Button>
  );
};

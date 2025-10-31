import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  icon: LucideIcon;
  defaultText: string;
}

export const SubmitButton = ({
  icon: Icon,
  defaultText,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {
        <>
          <Icon className="mr-2 h-4 w-4" />
          {defaultText}
        </>
      }
    </Button>
  );
};
